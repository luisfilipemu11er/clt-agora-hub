"""
AI Service - Gemini chat service for Celeste
Uses GOOGLE_API_KEY for chat interactions
"""
import google.generativeai as genai
from app.config import Config

# Global model instance
model = None


def init_ai_model():
    """Initialize the Gemini AI model."""
    global model
    try:
        genai.configure(api_key=Config.GOOGLE_API_KEY)
        model = genai.GenerativeModel(
            model_name=Config.AI_MODEL,
            system_instruction=Config.SYSTEM_PROMPT
        )
        print(f"AI model initialized: {Config.AI_MODEL}")
    except Exception as e:
        print(f"Error initializing AI model: {e}")
        raise


def get_chat_response(message: str, chat_history: list = None) -> dict:
    """
    Get a response from Celeste AI.

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
        # Start a chat session
        chat = model.start_chat(history=chat_history or [])

        # Send message and get response
        response = chat.send_message(message)

        return {
            'success': True,
            'response': response.text,
            'history': chat.history
        }

    except Exception as e:
        print(f"Error getting chat response: {e}")
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
