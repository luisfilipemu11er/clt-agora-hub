"""
News Routes - Endpoints for labor law news
"""
from flask import Blueprint, request, jsonify
from app.services.scraper_service import get_latest_news, get_news_by_source, search_news
from app.utils.rate_limiter import check_rate_limit

bp = Blueprint('news', __name__, url_prefix='/api')


@bp.route('/news', methods=['GET'])
def get_news():
    """
    Get latest labor law news.

    Query parameters:
        limit: Maximum number of articles (default: 20)
        source: Filter by specific source (optional)
        search: Search query (optional)

    Returns:
        JSON with list of news articles
    """
    try:
        # Check rate limit
        if not check_rate_limit(request.remote_addr):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429

        # Get query parameters
        limit = request.args.get('limit', default=20, type=int)
        source = request.args.get('source', default=None, type=str)
        search_query = request.args.get('search', default=None, type=str)

        # Validate limit
        if limit < 1 or limit > 100:
            limit = 20

        # Get news based on parameters
        if search_query or source:
            # For search/filter, return simple list
            if search_query:
                articles = search_news(search_query, limit=limit)
            else:
                articles = get_news_by_source(source, limit=limit)

            return jsonify({
                'success': True,
                'count': len(articles),
                'articles': articles
            }), 200
        else:
            # For main feed, return with News of the Day
            news_data = get_latest_news(limit=limit)

            # Combine news_of_the_day + other_news into a single articles list
            all_articles = []
            if news_data.get('news_of_the_day'):
                all_articles.append(news_data['news_of_the_day'])
            all_articles.extend(news_data.get('other_news', []))

            return jsonify({
                'success': True,
                'count': len(all_articles),
                'news_of_the_day': news_data.get('news_of_the_day'),
                'articles': all_articles
            }), 200

    except Exception as e:
        print(f"Error in news endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch news',
            'articles': []
        }), 500


@bp.route('/news/sources', methods=['GET'])
def get_sources():
    """
    Get list of available news sources.

    Returns:
        JSON with list of source names
    """
    try:
        from app.services.scraper_service import scraper_service

        sources = scraper_service.get_available_sources()

        return jsonify({
            'success': True,
            'sources': sources
        }), 200

    except Exception as e:
        print(f"Error in sources endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch sources',
            'sources': []
        }), 500


@bp.route('/news/refresh', methods=['POST'])
def refresh_news():
    """
    Force refresh news from all sources.

    Returns:
        JSON with updated news count
    """
    try:
        # Check rate limit (stricter for refresh)
        if not check_rate_limit(request.remote_addr, max_requests=10):
            return jsonify({
                'success': False,
                'error': 'Too many refresh requests. Please try again later.'
            }), 429

        articles = get_latest_news(limit=50)

        return jsonify({
            'success': True,
            'message': 'News refreshed successfully',
            'count': len(articles)
        }), 200

    except Exception as e:
        print(f"Error in refresh endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to refresh news'
        }), 500


# For backward compatibility
news_bp = bp
