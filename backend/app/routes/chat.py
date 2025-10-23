"""
Chat Routes - Endpoints for Celeste AI chat
"""
from flask import Blueprint, request, jsonify
from app.services.ai_service import get_chat_response, format_chat_history
from app.utils.input_sanitizer import sanitize_input
from app.utils.rate_limiter import check_rate_limit

bp = Blueprint('chat', __name__, url_prefix='/api')


@bp.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat messages to Celeste AI.

    Expected JSON:
    {
        "message": "user message",
        "history": [optional chat history]
    }

    Returns:
        JSON response with AI reply
    """
    try:
        # Check rate limit
        if not check_rate_limit(request.remote_addr):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429

        # Get request data
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400

        # Sanitize input
        message = sanitize_input(data['message'])

        if not message or len(message.strip()) == 0:
            return jsonify({
                'success': False,
                'error': 'Message cannot be empty'
            }), 400

        # Get chat history if provided
        history = data.get('history', [])
        formatted_history = format_chat_history(history) if history else None

        # Get AI response
        result = get_chat_response(message, formatted_history)

        if result['success']:
            return jsonify({
                'success': True,
                'message': result['response'],
                'history': result.get('history', [])
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Unknown error'),
                'message': result.get('response', 'Error processing request')
            }), 500

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': 'Desculpe, ocorreu um erro. Por favor, tente novamente.'
        }), 500


@bp.route('/chat/clear', methods=['POST'])
def clear_chat():
    """
    Clear chat history.

    Returns:
        Success confirmation
    """
    return jsonify({
        'success': True,
        'message': 'Chat history cleared'
    }), 200


# For backward compatibility
chat_bp = bp
