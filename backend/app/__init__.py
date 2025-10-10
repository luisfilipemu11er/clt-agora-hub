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
    ai_service.init_ai_model()
    openai_service.init_openai_client()

    # Register blueprints
    from app.routes import news, chat, article
    app.register_blueprint(news.bp)
    app.register_blueprint(chat.bp)
    app.register_blueprint(article.bp)

    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200

    return app
