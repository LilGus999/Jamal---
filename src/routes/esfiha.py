from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.esfiha import Esfiha

esfiha_bp = Blueprint('esfiha', __name__)

@esfiha_bp.route('/', methods=['GET'])
def listar_esfihas():
    """Lista todas as esfihas disponíveis"""
    esfihas = Esfiha.query.all()
    return jsonify({
        'status': 'success',
        'data': [esfiha.to_dict() for esfiha in esfihas]
    }), 200

@esfiha_bp.route('/<int:id>', methods=['GET'])
def obter_esfiha(id):
    """Obtém uma esfiha específica pelo ID"""
    esfiha = Esfiha.query.get_or_404(id)
    return jsonify({
        'status': 'success',
        'data': esfiha.to_dict()
    }), 200

@esfiha_bp.route('/', methods=['POST'])
def criar_esfiha():
    """Cria uma nova esfiha"""
    dados = request.json
    
    # Validação básica
    if not dados.get('nome') or not dados.get('preco'):
        return jsonify({
            'status': 'error',
            'message': 'Nome e preço são obrigatórios'
        }), 400
    
    nova_esfiha = Esfiha(
        nome=dados.get('nome'),
        descricao=dados.get('descricao', ''),
        preco=float(dados.get('preco')),
        categoria=dados.get('categoria', ''),
        disponivel=dados.get('disponivel', True),
        imagem_url=dados.get('imagem_url', '')
    )
    
    db.session.add(nova_esfiha)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Esfiha criada com sucesso',
        'data': nova_esfiha.to_dict()
    }), 201

@esfiha_bp.route('/<int:id>', methods=['PUT'])
def atualizar_esfiha(id):
    """Atualiza uma esfiha existente"""
    esfiha = Esfiha.query.get_or_404(id)
    dados = request.json
    
    # Atualiza apenas os campos fornecidos
    if 'nome' in dados:
        esfiha.nome = dados['nome']
    if 'descricao' in dados:
        esfiha.descricao = dados['descricao']
    if 'preco' in dados:
        esfiha.preco = float(dados['preco'])
    if 'categoria' in dados:
        esfiha.categoria = dados['categoria']
    if 'disponivel' in dados:
        esfiha.disponivel = dados['disponivel']
    if 'imagem_url' in dados:
        esfiha.imagem_url = dados['imagem_url']
    
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Esfiha atualizada com sucesso',
        'data': esfiha.to_dict()
    }), 200

@esfiha_bp.route('/<int:id>', methods=['DELETE'])
def excluir_esfiha(id):
    """Exclui uma esfiha"""
    esfiha = Esfiha.query.get_or_404(id)
    
    db.session.delete(esfiha)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Esfiha excluída com sucesso'
    }), 200

@esfiha_bp.route('/categorias', methods=['GET'])
def listar_categorias():
    """Lista todas as categorias de esfihas disponíveis"""
    categorias = db.session.query(Esfiha.categoria).distinct().all()
    lista_categorias = [categoria[0] for categoria in categorias if categoria[0]]
    
    return jsonify({
        'status': 'success',
        'data': lista_categorias
    }), 200

@esfiha_bp.route('/atualizar-preco/<int:id>', methods=['PATCH'])
def atualizar_preco(id):
    """Endpoint específico para atualização rápida de preço"""
    esfiha = Esfiha.query.get_or_404(id)
    dados = request.json
    
    if 'preco' not in dados:
        return jsonify({
            'status': 'error',
            'message': 'Preço não fornecido'
        }), 400
    
    try:
        novo_preco = float(dados['preco'])
        if novo_preco < 0:
            raise ValueError("O preço não pode ser negativo")
        
        esfiha.preco = novo_preco
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Preço atualizado com sucesso',
            'data': {
                'id': esfiha.id,
                'nome': esfiha.nome,
                'preco': esfiha.preco
            }
        }), 200
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400
