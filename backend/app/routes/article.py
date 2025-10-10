"""
Article Routes - Endpoints for article analysis
"""
from flask import Blueprint, request, jsonify
from app.services.openai_service import analyze_article, summarize_text, extract_key_points
from app.utils.input_sanitizer import sanitize_input
from app.utils.url_validator import is_valid_url
from app.utils.rate_limiter import check_rate_limit

bp = Blueprint('article', __name__, url_prefix='/api/article')


@bp.route('/analysis', methods=['POST'])
def analyze():
    """
    Analyze an article about labor law.

    Expected JSON:
    {
        "title": "article title",
        "content": "article content",
        "url": "article url (optional)"
    }

    Returns:
        JSON with article analysis
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

        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Validate required fields
        title = sanitize_input(data.get('title', ''))
        content = sanitize_input(data.get('content', ''))

        if not title or not content:
            return jsonify({
                'success': False,
                'error': 'Title and content are required'
            }), 400

        # Get optional URL
        url = data.get('url', '')
        if url and not is_valid_url(url):
            url = None

        # Analyze article
        result = analyze_article(title, content, url)

        if result['success']:
            return jsonify({
                'success': True,
                'analysis': result['analysis'],
                'title': result['title'],
                'url': result.get('url')
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Analysis failed')
            }), 500

    except Exception as e:
        print(f"Error in article analysis endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@bp.route('/summarize', methods=['POST'])
def summarize():
    """
    Summarize article text.

    Expected JSON:
    {
        "text": "text to summarize",
        "max_length": 300 (optional)
    }

    Returns:
        JSON with summary
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

        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400

        text = sanitize_input(data['text'])
        max_length = data.get('max_length', 300)

        # Summarize text
        result = summarize_text(text, max_length)

        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        print(f"Error in summarize endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@bp.route('/key-points', methods=['POST'])
def key_points():
    """
    Extract key points from article.

    Expected JSON:
    {
        "text": "text to analyze"
    }

    Returns:
        JSON with key points
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

        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400

        text = sanitize_input(data['text'])

        # Extract key points
        result = extract_key_points(text)

        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        print(f"Error in key-points endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


# For backward compatibility
article_bp = bp
