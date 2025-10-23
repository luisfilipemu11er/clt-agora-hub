"""
CLT Agora Backend Application
Flask application factory
"""
from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app(config_class=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": config_class.CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialize AI services
    from app.services import ai_service, openai_service
    from app.services.clt_document_service import clt_service

    ai_service.init_ai_model()
    openai_service.init_openai_client()

    # Pre-load CLT documents in background
    import threading
    def load_clt_docs():
        print("[CLT] Loading official CLT documents in background...")
        clt_service.get_all_documents()
        print("[CLT] Documents loaded and cached successfully")

    thread = threading.Thread(target=load_clt_docs, daemon=True)
    thread.start()

    # Register blueprints
    from app.routes import news, chat, article
    app.register_blueprint(news.bp)
    app.register_blueprint(chat.bp)
    app.register_blueprint(article.bp)

    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200

    return app
