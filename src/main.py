
import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager  # Importar JWTManager
from src.models.user import db
from src.routes.user import user_bp
from src.routes.esfiha import esfiha_bp
from src.routes.pedido import pedido_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app)  # Habilitar CORS para todas as rotas

# Configurações
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT') # Usar variável de ambiente ou default
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-jwt-key') # Chave para JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///esfiharia.db'  # Usar SQLite para simplicidade
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensões
db.init_app(app)
jwt = JWTManager(app) # Inicializar JWTManager

# Registrar Blueprints
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(esfiha_bp, url_prefix='/api/esfihas')
app.register_blueprint(pedido_bp, url_prefix='/api/pedidos')

# Criar tabelas do banco de dados se não existirem
with app.app_context():
    db.create_all()

# Rota para servir o frontend React (build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return jsonify({"error": "Static folder not configured"}), 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        # Serve arquivos específicos (js, css, imagens, etc.)
        return send_from_directory(static_folder_path, path)
    else:
        # Serve o index.html para qualquer outra rota (SPA behavior)
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({"error": "index.html not found"}), 404

if __name__ == '__main__':
    # Usar Gunicorn ou outro WSGI server em produção
    app.run(host='0.0.0.0', port=5000, debug=True) # Debug True apenas para desenvolvimento

