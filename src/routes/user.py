
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash # Import necessary security functions
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # Import JWT functions
from src.models.user import User, db

user_bp = Blueprint("user", __name__)

# Rota de Registro (Substitui o antigo POST /users)
@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"message": "Username or email already exists"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password) # Hash the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201

# Rota de Login
@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json
    identifier = data.get("identifier") # Pode ser username ou email
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"message": "Missing identifier or password"}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id) # Cria o token JWT
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Rota protegida de exemplo para obter dados do usuário logado
@user_bp.route("/me", methods=["GET"])
@jwt_required() # Protege a rota, exige um token JWT válido
def get_current_user():
    current_user_id = get_jwt_identity() # Obtém o ID do usuário do token
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict())

# --- Rotas CRUD existentes (podem ser mantidas ou ajustadas conforme necessário) ---

@user_bp.route("/users", methods=["GET"])
@jwt_required() # Proteger listagem de usuários (opcional, depende do requisito)
def get_users():
    # Adicionar lógica de permissão se necessário (ex: apenas admin)
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required() # Proteger acesso a usuário específico
def get_user(user_id):
    # Adicionar lógica de permissão (ex: usuário só pode ver a si mesmo ou admin pode ver todos)
    current_user_id = get_jwt_identity()
    if current_user_id != user_id: # Exemplo simples de permissão
         # Aqui poderia verificar se o usuário é admin
         return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    # Adicionar lógica para atualizar senha se necessário
    # if 'password' in data:
    #     user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
         # Adicionar lógica de permissão (ex: admin)
         return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return "", 204

