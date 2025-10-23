"""
OpenAI Service - Gemini analysis service for articles
Uses GOOGLE_API_KEY_ANALYSIS for article analysis
"""
import google.generativeai as genai
from app.config import Config

# Global model instance for analysis
analysis_model = None


def init_openai_client():
    """Initialize the Gemini model for article analysis."""
    global analysis_model
    try:
        genai.configure(api_key=Config.GOOGLE_API_KEY_ANALYSIS)
        analysis_model = genai.GenerativeModel(model_name=Config.AI_MODEL)
        print(f"Analysis model initialized: {Config.AI_MODEL}")
    except Exception as e:
        print(f"Error initializing analysis model: {e}")
        raise


def analyze_article(title: str, content: str, url: str = None) -> dict:
    """
    Analyze a labor law article using Gemini.

    Args:
        title: Article title
        content: Article content
        url: Optional article URL

    Returns:
        dict with analysis results
    """
    global analysis_model

    if not analysis_model:
        init_openai_client()

    try:
        # Create analysis prompt
        prompt = f"""Analise o seguinte artigo sobre direito do trabalho brasileiro e forneça:

1. Resumo executivo (2-3 parágrafos)
2. Principais pontos destacados (lista com 3-5 itens)
3. Impacto para trabalhadores (breve análise)
4. Impacto para empregadores (breve análise)
5. Referências à CLT mencionadas (se houver)

Título: {title}

Conteúdo:
{content}

URL: {url if url else 'Não disponível'}

Forneça uma análise clara, objetiva e em português brasileiro."""

        # Generate analysis
        response = analysis_model.generate_content(prompt)

        return {
            'success': True,
            'analysis': response.text,
            'title': title,
            'url': url
        }

    except Exception as e:
        print(f"Error analyzing article: {e}")
        return {
            'success': False,
            'error': str(e),
            'analysis': 'Não foi possível analisar o artigo. Por favor, tente novamente.'
        }


def summarize_text(text: str, max_length: int = 300) -> dict:
    """
    Summarize text using Gemini.

    Args:
        text: Text to summarize
        max_length: Maximum length of summary

    Returns:
        dict with summary
    """
    global analysis_model

    if not analysis_model:
        init_openai_client()

    try:
        prompt = f"""Resuma o seguinte texto em até {max_length} caracteres, mantendo as informações mais importantes:

{text}

Resumo:"""

        response = analysis_model.generate_content(prompt)

        return {
            'success': True,
            'summary': response.text
        }

    except Exception as e:
        print(f"Error summarizing text: {e}")
        return {
            'success': False,
            'error': str(e),
            'summary': text[:max_length] + '...'
        }


def extract_key_points(text: str) -> dict:
    """
    Extract key points from text.

    Args:
        text: Text to analyze

    Returns:
        dict with key points
    """
    global analysis_model

    if not analysis_model:
        init_openai_client()

    try:
        prompt = f"""Extraia os pontos-chave do seguinte texto sobre direito do trabalho.
Liste de 3 a 5 pontos principais em formato de lista:

{text}

Pontos-chave:"""

        response = analysis_model.generate_content(prompt)

        return {
            'success': True,
            'key_points': response.text
        }

    except Exception as e:
        print(f"Error extracting key points: {e}")
        return {
            'success': False,
            'error': str(e),
            'key_points': 'Não foi possível extrair os pontos-chave.'
        }


def generate_analysis_with_context(article: dict, context: str = None) -> dict:
    """
    Generate detailed analysis with additional context.

    Args:
        article: Article data (title, content, url)
        context: Additional context for analysis

    Returns:
        dict with comprehensive analysis
    """
    global analysis_model

    if not analysis_model:
        init_openai_client()

    try:
        title = article.get('title', '')
        content = article.get('content', '')
        url = article.get('url', '')

        prompt = f"""Como especialista em Direito do Trabalho brasileiro, analise profundamente este artigo:

Título: {title}
Conteúdo: {content}
URL: {url}
"""

        if context:
            prompt += f"\nContexto adicional: {context}"

        prompt += """

Forneça uma análise completa incluindo:
1. Resumo executivo
2. Análise jurídica detalhada
3. Implicações práticas
4. Recomendações
5. Artigos da CLT relacionados

Use linguagem clara e acessível."""

        response = analysis_model.generate_content(prompt)

        return {
            'success': True,
            'comprehensive_analysis': response.text,
            'article': article
        }

    except Exception as e:
        print(f"Error generating comprehensive analysis: {e}")
        return {
            'success': False,
            'error': str(e),
            'comprehensive_analysis': 'Erro ao gerar análise detalhada.'
        }
