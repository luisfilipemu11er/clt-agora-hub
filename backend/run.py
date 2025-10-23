"""
Flask application entry point
Run with: python run.py
"""
from app import create_app
from app.config import Config

# Validate configuration before starting
Config.validate_config()

# Create Flask application
app = create_app()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=Config.DEBUG
    )
