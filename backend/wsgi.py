"""
WSGI entry point for production deployment
Run with Gunicorn: gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
"""
from app import create_app
from app.config import Config

# Validate configuration
Config.validate_config()

# Create application instance
app = create_app()

if __name__ == '__main__':
    app.run()
