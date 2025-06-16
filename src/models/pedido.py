
from src.models.user import db
from src.models.esfiha import Esfiha
from datetime import datetime

class StatusPedido:
    PAGAMENTO_PENDENTE = 'pagamento_pendente' # Novo status inicial
    PENDENTE = 'pendente' # Mantido para fluxo pós-pagamento
    APROVADO = 'aprovado'
    RECUSADO = 'recusado'
    EM_PREPARACAO = 'em_preparacao'
    A_CAMINHO = 'a_caminho'
    PRONTO_RETIRADA = 'pronto_retirada'
    ENTREGUE = 'entregue'
    CANCELADO = 'cancelado'
    FALHA_PAGAMENTO = 'falha_pagamento' # Novo status

class ItemPedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedido.id'), nullable=False)
    esfiha_id = db.Column(db.Integer, db.ForeignKey('esfiha.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False, default=1)
    preco_unitario = db.Column(db.Float, nullable=False)
    observacoes = db.Column(db.Text, nullable=True)

    esfiha = db.relationship('Esfiha', backref='itens_pedido')

    def __repr__(self):
        return f'<ItemPedido {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'pedido_id': self.pedido_id,
            'esfiha_id': self.esfiha_id,
            'esfiha': self.esfiha.nome if self.esfiha else None, # Handle potential missing esfiha
            'quantidade': self.quantidade,
            'preco_unitario': self.preco_unitario,
            'subtotal': self.quantidade * self.preco_unitario,
            'observacoes': self.observacoes
        }

class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Pode ser nulo para clientes não logados
    nome_cliente = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    endereco = db.Column(db.Text, nullable=True)
    forma_entrega = db.Column(db.String(20), nullable=False)  # retirada ou entrega
    status = db.Column(db.String(30), default=StatusPedido.PAGAMENTO_PENDENTE, nullable=False) # Status inicial alterado
    valor_total = db.Column(db.Float, nullable=False)
    observacoes = db.Column(db.Text, nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    stripe_payment_intent_id = db.Column(db.String(255), nullable=True, index=True) # ID do Payment Intent do Stripe

    cliente = db.relationship('User', backref='pedidos')
    itens = db.relationship('ItemPedido', backref='pedido', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Pedido {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'nome_cliente': self.nome_cliente,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'forma_entrega': self.forma_entrega,
            'status': self.status,
            'valor_total': self.valor_total,
            'observacoes': self.observacoes,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'stripe_payment_intent_id': self.stripe_payment_intent_id,
            'itens': [item.to_dict() for item in self.itens]
        }

    def pode_cancelar(self):
        """Verifica se o pedido ainda pode ser cancelado pelo cliente ou admin"""
        # Ajustar lógica de cancelamento conforme regras de negócio (ex: só antes de 'em_preparacao')
        return self.status in [StatusPedido.PAGAMENTO_PENDENTE, StatusPedido.PENDENTE, StatusPedido.APROVADO]

