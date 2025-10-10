"""
URL Validator - Validate and normalize URLs
"""
import re
from urllib.parse import urlparse, urljoin


def is_valid_url(url: str) -> bool:
    """
    Validate if string is a valid URL.

    Args:
        url: URL string to validate

    Returns:
        True if valid URL
    """
    if not url:
        return False

    # Basic URL pattern
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or IP
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )

    return bool(url_pattern.match(url))


def normalize_url(url: str, base_url: str = None) -> str:
    """
    Normalize URL (add scheme, join with base URL if relative).

    Args:
        url: URL to normalize
        base_url: Base URL for relative URLs

    Returns:
        Normalized URL
    """
    if not url:
        return ''

    url = url.strip()

    # If URL is relative and base_url is provided
    if base_url and not url.startswith(('http://', 'https://', '//')):
        return urljoin(base_url, url)

    # Add https:// if no scheme
    if not url.startswith(('http://', 'https://')):
        if url.startswith('//'):
            url = 'https:' + url
        else:
            url = 'https://' + url

    return url


def get_domain(url: str) -> str:
    """
    Extract domain from URL.

    Args:
        url: Full URL

    Returns:
        Domain name
    """
    if not url:
        return ''

    try:
        parsed = urlparse(url)
        return parsed.netloc
    except Exception:
        return ''


def is_same_domain(url1: str, url2: str) -> bool:
    """
    Check if two URLs are from the same domain.

    Args:
        url1: First URL
        url2: Second URL

    Returns:
        True if same domain
    """
    domain1 = get_domain(url1)
    domain2 = get_domain(url2)

    return domain1 == domain2 and domain1 != ''


def sanitize_url(url: str) -> str:
    """
    Sanitize URL for safe usage.

    Args:
        url: URL to sanitize

    Returns:
        Sanitized URL
    """
    if not url:
        return ''

    # Remove whitespace
    url = url.strip()

    # Remove dangerous protocols
    dangerous_protocols = ['javascript:', 'data:', 'file:', 'vbscript:']
    for protocol in dangerous_protocols:
        if url.lower().startswith(protocol):
            return ''

    # Validate URL format
    if not is_valid_url(url):
        return ''

    return url


def extract_urls(text: str) -> list:
    """
    Extract URLs from text.

    Args:
        text: Text containing URLs

    Returns:
        List of URLs found in text
    """
    if not text:
        return []

    # URL pattern
    url_pattern = re.compile(
        r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b'
        r'(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)',
        re.IGNORECASE
    )

    urls = url_pattern.findall(text)
    return list(set(urls))  # Remove duplicates


def is_absolute_url(url: str) -> bool:
    """
    Check if URL is absolute (has scheme).

    Args:
        url: URL to check

    Returns:
        True if absolute URL
    """
    if not url:
        return False

    return bool(urlparse(url).scheme)


def join_url(base: str, path: str) -> str:
    """
    Safely join base URL with path.

    Args:
        base: Base URL
        path: Path to join

    Returns:
        Joined URL
    """
    if not base:
        return path

    if not path:
        return base

    return urljoin(base, path)


def get_url_path(url: str) -> str:
    """
    Extract path from URL.

    Args:
        url: Full URL

    Returns:
        URL path
    """
    if not url:
        return ''

    try:
        parsed = urlparse(url)
        return parsed.path
    except Exception:
        return ''


def get_url_params(url: str) -> dict:
    """
    Extract query parameters from URL.

    Args:
        url: Full URL

    Returns:
        Dictionary of parameters
    """
    if not url:
        return {}

    try:
        from urllib.parse import parse_qs
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        # Convert lists to single values
        return {k: v[0] if len(v) == 1 else v for k, v in params.items()}
    except Exception:
        return {}
