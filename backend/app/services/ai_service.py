"""
AI Service - Gemini chat service for Celeste
Uses GOOGLE_API_KEY for chat interactions
"""
import google.generativeai as genai
from app.config import Config
from app.services.clt_document_service import clt_service

# Global model instance
model = None


def init_ai_model():
    """Initialize the Gemini AI model."""
    global model
    try:
        genai.configure(api_key=Config.GOOGLE_API_KEY)
        model = genai.GenerativeModel(
            model_name=Config.AI_MODEL
        )
        print(f"AI model initialized: {Config.AI_MODEL}")
    except Exception as e:
        print(f"Error initializing AI model: {e}")
        raise


def get_chat_response(message: str, chat_history: list = None) -> dict:
    """
    Get a response from Celeste AI.
    First consults CLT documents, then uses AI with that context.

    Args:
        message: User's message
        chat_history: Optional chat history for context

    Returns:
        dict with response and success status
    """
    global model

    if not model:
        init_ai_model()

    try:
        # Search in CLT documents first
        clt_results = clt_service.search_in_documents(message, max_results=3)

        # Build context from CLT documents
        context = ""
        if clt_results:
            context = "\n\n**DOCUMENTOS CLT CONSULTADOS:**\n\n"
            for idx, result in enumerate(clt_results, 1):
                context += f"**Fonte {idx}: {result['source']}**\n"
                context += f"{result['excerpt']}\n\n"
            context += "---\n\n"

        # Enhance the message with CLT context
        enhanced_message = message
        if context:
            enhanced_message = f"""{context}
**Pergunta do usuário:** {message}

**Instruções:**
1. Use PRIORITARIAMENTE as informações dos documentos CLT acima para responder
2. Cite os artigos e trechos relevantes encontrados
3. Se os documentos não contiverem informação suficiente, você pode complementar com seu conhecimento geral sobre CLT
4. Se precisar de informações adicionais que não estão nos documentos, indique claramente que está usando conhecimento geral
5. Seja sempre precisa e didática nas explicações"""

        # Start a chat session
        history = chat_history or []
        if not history:
            history.insert(0, {'role': 'user', 'parts': [Config.SYSTEM_PROMPT]})
            history.insert(1, {'role': 'model', 'parts': ["Entendido. Sou Celeste, sua assistente especialista em CLT. Pode perguntar."]})

        chat = model.start_chat(history=history)

        # Send enhanced message and get response
        response = chat.send_message(enhanced_message)

        # Convert history to JSON-serializable format
        history_json = []
        for msg in chat.history:
            history_json.append({
                'role': msg.role,
                'parts': [part.text for part in msg.parts]
            })

        return {
            'success': True,
            'response': response.text,
            'history': history_json,
            'clt_sources_used': len(clt_results) > 0
        }

    except Exception as e:
        import traceback
        print(f"Error getting chat response: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return {
            'success': False,
            'error': str(e),
            'response': 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
        }


def format_chat_history(messages: list) -> list:
    """
    Format chat history for Gemini API.

    Args:
        messages: List of messages with role and content

    Returns:
        Formatted history for Gemini
    """
    formatted_history = []

    for msg in messages:
        role = msg.get('role', 'user')
        content = msg.get('content', '')

        # Map frontend roles to Gemini roles
        if role == 'assistant':
            role = 'model'

        formatted_history.append({
            'role': role,
            'parts': [content]
        })

    return formatted_history


def generate_stream_response(message: str, chat_history: list = None):
    """
    Generate streaming response from Celeste AI.

    Args:
        message: User's message
        chat_history: Optional chat history for context

    Yields:
        Response chunks
    """
    global model

    if not model:
        init_ai_model()

    try:
        # Start a chat session
        chat = model.start_chat(history=chat_history or [])

        # Send message and stream response
        response = chat.send_message(message, stream=True)

        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        print(f"Error streaming response: {e}")
        yield f"Desculpe, ocorreu um erro: {str(e)}"
