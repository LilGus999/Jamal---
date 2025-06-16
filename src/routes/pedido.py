
import os
import stripe # Importar Stripe
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity # Importar JWT
from src.models.user import db, User # Importar User
from src.models.pedido import Pedido, ItemPedido, StatusPedido
from src.models.esfiha import Esfiha
from datetime import datetime

pedido_bp = Blueprint("pedido", __name__)

# Configurar a chave secreta do Stripe (idealmente via variáveis de ambiente)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_YOUR_SECRET_KEY") # Substituir pela chave real ou variável

# --- Rotas para Clientes (Protegidas) ---

@pedido_bp.route("/me", methods=["GET"])
@jwt_required()
def listar_meus_pedidos():
    """Lista os pedidos do usuário logado."""
    current_user_id = get_jwt_identity()
    pedidos = Pedido.query.filter_by(cliente_id=current_user_id).order_by(Pedido.data_criacao.desc()).all()
    return jsonify({
        "status": "success",
        "data": [pedido.to_dict() for pedido in pedidos]
    }), 200

@pedido_bp.route("/me/<int:id>", methods=["GET"])
@jwt_required()
def obter_meu_pedido(id):
    """Obtém um pedido específico do usuário logado."""
    current_user_id = get_jwt_identity()
    pedido = Pedido.query.filter_by(id=id, cliente_id=current_user_id).first_or_404()
    return jsonify({
        "status": "success",
        "data": pedido.to_dict()
    }), 200

@pedido_bp.route("/me/cancelar/<int:id>", methods=["PATCH"])
@jwt_required()
def cancelar_meu_pedido(id):
    """Cancela um pedido do usuário logado (se permitido)."""
    current_user_id = get_jwt_identity()
    pedido = Pedido.query.filter_by(id=id, cliente_id=current_user_id).first_or_404()

    if not pedido.pode_cancelar():
        return jsonify({
            "status": "error",
            "message": "Este pedido não pode mais ser cancelado"
        }), 400

    # TODO: Adicionar lógica para cancelar o Payment Intent no Stripe se aplicável
    # try:
    #     if pedido.stripe_payment_intent_id:
    #         stripe.PaymentIntent.cancel(pedido.stripe_payment_intent_id)
    # except stripe.error.StripeError as e:
    #     # Logar erro, mas continuar cancelando o pedido no sistema
    #     print(f"Erro ao cancelar Payment Intent {pedido.stripe_payment_intent_id}: {e}")

    pedido.status = StatusPedido.CANCELADO
    pedido.data_atualizacao = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Pedido cancelado com sucesso",
        "data": pedido.to_dict()
    }), 200

# --- Rota de Criação de Pedido e Pagamento ---

@pedido_bp.route("/criar-intent-pagamento", methods=["POST"])
@jwt_required(optional=True) # Permitir usuários não logados, mas capturar ID se logado
def criar_intent_pagamento():
    """Cria um Pedido no banco com status PAGAMENTO_PENDENTE e um Payment Intent no Stripe."""
    dados = request.json
    current_user_id = get_jwt_identity()

    # Validação básica dos dados do pedido
    if not dados.get("nome_cliente") or not dados.get("telefone") or not dados.get("itens") or not dados.get("forma_entrega"):
        return jsonify({"status": "error", "message": "Dados incompletos para criar o pedido."}), 400

    valor_total_calculado = 0
    itens_pedido_info = []
    item_ids_quantidades = {}

    # Validar itens e calcular total
    for item_data in dados.get("itens", []):
        esfiha_id = item_data.get("esfiha_id")
        quantidade = item_data.get("quantidade", 1)

        if not esfiha_id or not isinstance(quantidade, int) or quantidade <= 0:
            return jsonify({"status": "error", "message": f"Item inválido: {item_data}"}), 400

        esfiha = Esfiha.query.get(esfiha_id)
        if not esfiha or not esfiha.disponivel:
            return jsonify({"status": "error", "message": f"Esfiha ID {esfiha_id} indisponível ou não encontrada."}), 400

        subtotal = esfiha.preco * quantidade
        valor_total_calculado += subtotal
        itens_pedido_info.append({
            "esfiha_id": esfiha_id,
            "quantidade": quantidade,
            "preco_unitario": esfiha.preco,
            "observacoes": item_data.get("observacoes", "")
        })
        item_ids_quantidades[esfiha_id] = quantidade

    if not itens_pedido_info:
         return jsonify({"status": "error", "message": "O pedido deve conter pelo menos um item."}), 400

    # Criar o Pedido no banco de dados primeiro
    novo_pedido = Pedido(
        cliente_id=current_user_id,
        nome_cliente=dados.get("nome_cliente"),
        telefone=dados.get("telefone"),
        endereco=dados.get("endereco"),
        forma_entrega=dados.get("forma_entrega"),
        status=StatusPedido.PAGAMENTO_PENDENTE,
        valor_total=round(valor_total_calculado, 2),
        observacoes=dados.get("observacoes", "")
    )
    db.session.add(novo_pedido)
    db.session.flush() # Obter o ID do pedido

    # Adicionar itens ao pedido
    for item_info in itens_pedido_info:
        novo_item = ItemPedido(
            pedido_id=novo_pedido.id,
            esfiha_id=item_info["esfiha_id"],
            quantidade=item_info["quantidade"],
            preco_unitario=item_info["preco_unitario"],
            observacoes=item_info["observacoes"]
        )
        db.session.add(novo_item)

    try:
        # Criar Payment Intent no Stripe
        # O valor deve ser em centavos
        amount_cents = int(novo_pedido.valor_total * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="brl",
            metadata={
                "pedido_id": novo_pedido.id,
                "cliente_nome": novo_pedido.nome_cliente,
                "cliente_telefone": novo_pedido.telefone
            },
            # Habilitar métodos de pagamento desejados (ex: card, pix)
            automatic_payment_methods={"enabled": True},
        )

        # Salvar o ID do Payment Intent no pedido
        novo_pedido.stripe_payment_intent_id = intent.id
        db.session.commit()

        return jsonify({
            "status": "success",
            "client_secret": intent.client_secret, # Enviar para o frontend
            "pedido_id": novo_pedido.id,
            "valor_total": novo_pedido.valor_total
        }), 201

    except stripe.error.StripeError as e:
        db.session.rollback() # Desfazer criação do pedido se Stripe falhar
        return jsonify({"status": "error", "message": f"Erro no Stripe: {e}"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Erro interno: {e}"}), 500

# --- Rota de Webhook para Stripe (Processar eventos de pagamento) ---

@pedido_bp.route("/stripe-webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_YOUR_WEBHOOK_SECRET") # Substituir

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Payload inválido
        return jsonify({"status": "error", "message": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        # Assinatura inválida
        return jsonify({"status": "error", "message": "Invalid signature"}), 400

    # Lidar com o evento
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        pedido_id = payment_intent["metadata"].get("pedido_id")
        if pedido_id:
            pedido = Pedido.query.get(pedido_id)
            if pedido and pedido.status == StatusPedido.PAGAMENTO_PENDENTE:
                pedido.status = StatusPedido.PENDENTE # Ou APROVADO, dependendo do fluxo
                pedido.data_atualizacao = datetime.utcnow()
                db.session.commit()
                # TODO: Emitir evento via WebSocket para atualizar painel admin
                print(f"Pedido {pedido_id} pago com sucesso!")
            else:
                 print(f"Webhook: Pedido {pedido_id} não encontrado ou já processado.")
        else:
            print("Webhook: ID do pedido não encontrado nos metadados do Payment Intent.")

    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        pedido_id = payment_intent["metadata"].get("pedido_id")
        if pedido_id:
            pedido = Pedido.query.get(pedido_id)
            if pedido and pedido.status == StatusPedido.PAGAMENTO_PENDENTE:
                pedido.status = StatusPedido.FALHA_PAGAMENTO
                pedido.data_atualizacao = datetime.utcnow()
                db.session.commit()
                print(f"Pagamento falhou para o pedido {pedido_id}.")
            else:
                print(f"Webhook: Pedido {pedido_id} não encontrado ou já processado (falha).")
        else:
            print("Webhook: ID do pedido não encontrado nos metadados do Payment Intent (falha).")
    else:
        print(f"Evento Stripe não tratado: {event['type']}")

    return jsonify({"status": "success"}), 200

# --- Rotas para Admin (Manter ou ajustar conforme necessário) ---

@pedido_bp.route("/admin", methods=["GET"])
# @jwt_required() # Adicionar proteção e verificação de admin
def listar_todos_pedidos_admin():
    """Lista todos os pedidos para o admin."""
    # Adicionar filtros por status, data, etc. se necessário
    pedidos = Pedido.query.order_by(Pedido.data_criacao.desc()).all()
    return jsonify({
        "status": "success",
        "data": [pedido.to_dict() for pedido in pedidos]
    }), 200

@pedido_bp.route("/admin/<int:id>", methods=["GET"])
# @jwt_required()
def obter_pedido_admin(id):
    """Obtém um pedido específico pelo ID para o admin."""
    pedido = Pedido.query.get_or_404(id)
    return jsonify({
        "status": "success",
        "data": pedido.to_dict()
    }), 200

@pedido_bp.route("/admin/atualizar-status/<int:id>", methods=["PATCH"])
# @jwt_required()
def atualizar_status_admin(id):
    """Atualiza o status de um pedido (Admin)."""
    pedido = Pedido.query.get_or_404(id)
    dados = request.json

    if "status" not in dados:
        return jsonify({"status": "error", "message": "Status não fornecido"}), 400

    novo_status = dados["status"]
    status_validos = [
        StatusPedido.PENDENTE, StatusPedido.APROVADO, StatusPedido.RECUSADO,
        StatusPedido.EM_PREPARACAO, StatusPedido.A_CAMINHO, StatusPedido.PRONTO_RETIRADA,
        StatusPedido.ENTREGUE, StatusPedido.CANCELADO, StatusPedido.FALHA_PAGAMENTO
    ]

    if novo_status not in status_validos:
        return jsonify({"status": "error", "message": "Status inválido"}), 400

    # Impedir que admin altere status relacionados ao pagamento diretamente?
    if pedido.status in [StatusPedido.PAGAMENTO_PENDENTE, StatusPedido.FALHA_PAGAMENTO] and novo_status not in [StatusPedido.CANCELADO]:
         # Poderia permitir apenas cancelamento nesses casos
         pass # Ajustar lógica conforme necessário

    pedido.status = novo_status
    pedido.data_atualizacao = datetime.utcnow()
    db.session.commit()

    # TODO: Emitir evento via WebSocket para atualizar painel admin e cliente

    return jsonify({
        "status": "success",
        "message": "Status do pedido atualizado com sucesso",
        "data": pedido.to_dict()
    }), 200

# Manter rota antiga de criar pedido pode ser útil para testes ou cenários sem pagamento online
# @pedido_bp.route("/criar-sem-pagamento", methods=["POST"])
# def criar_pedido_sem_pagamento(): ... (código anterior adaptado)


