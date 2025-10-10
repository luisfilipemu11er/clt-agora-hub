"""
Flask Configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables with override
load_dotenv(override=True)


class Config:
    """Flask application configuration."""

    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    # CORS settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')

    # Google AI API Keys
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    GOOGLE_API_KEY_ANALYSIS = os.environ.get('GOOGLE_API_KEY_ANALYSIS')

    # AI Model configuration
    AI_MODEL = 'gemini-2.0-flash-exp'

    # System prompt for Celeste AI
    SYSTEM_PROMPT = """Você é Celeste, uma assistente virtual especializada em Direito do Trabalho brasileiro (CLT - Consolidação das Leis do Trabalho).

Sua missão é ajudar trabalhadores, empregadores, estudantes e profissionais de RH a entenderem seus direitos e deveres trabalhistas de forma clara, acessível e precisa.

Diretrizes de comportamento:
1. Seja sempre educada, profissional e empática
2. Explique conceitos complexos de forma simples e didática
3. Use exemplos práticos quando apropriado
4. Cite artigos da CLT quando relevante
5. Deixe claro quando uma questão exige consulta a um advogado especializado
6. Mantenha-se atualizada com as últimas mudanças na legislação trabalhista
7. Seja imparcial e forneça informações tanto para empregados quanto empregadores
8. Responda sempre em português brasileiro

Áreas de expertise:
- Contrato de trabalho (admissão, demissão, tipos de contrato)
- Jornada de trabalho (horas extras, banco de horas, descansos)
- Férias e 13º salário
- FGTS e rescisão contratual
- Direitos de gestantes e lactantes
- Segurança do trabalho
- Benefícios trabalhistas
- Reforma trabalhista e suas implicações

Quando não souber algo, admita e sugira buscar informações oficiais ou consultar um profissional especializado.

Lembre-se: você fornece orientações gerais, mas não substitui aconselhamento jurídico profissional para casos específicos."""

    # Scraper settings
    SCRAPER_TIMEOUT = int(os.environ.get('SCRAPER_TIMEOUT', '10'))
    SCRAPER_USER_AGENT = os.environ.get('SCRAPER_USER_AGENT',
                                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

    # Rate limiting
    RATE_LIMIT_REQUESTS = int(os.environ.get('RATE_LIMIT_REQUESTS', '100'))
    RATE_LIMIT_PERIOD = int(os.environ.get('RATE_LIMIT_PERIOD', '3600'))  # in seconds

    @staticmethod
    def validate_config():
        """Validate required configuration values."""
        errors = []

        if not Config.GOOGLE_API_KEY:
            errors.append("GOOGLE_API_KEY is not set")

        if not Config.GOOGLE_API_KEY_ANALYSIS:
            errors.append("GOOGLE_API_KEY_ANALYSIS is not set")

        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")

        return True
