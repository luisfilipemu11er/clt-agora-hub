"""
Input Sanitizer - Clean and validate user input
"""
import re
import html


def sanitize_input(text: str, max_length: int = 10000) -> str:
    """
    Sanitize user input text.

    Args:
        text: Input text to sanitize
        max_length: Maximum allowed length

    Returns:
        Sanitized text
    """
    if not text:
        return ''

    # Convert to string if not already
    text = str(text)

    # Truncate to max length
    text = text[:max_length]

    # Escape HTML entities
    text = html.escape(text)

    # Remove null bytes
    text = text.replace('\x00', '')

    # Normalize whitespace
    text = ' '.join(text.split())

    return text.strip()


def sanitize_html(text: str, allowed_tags: list = None) -> str:
    """
    Sanitize HTML content, allowing only specific tags.

    Args:
        text: HTML text to sanitize
        allowed_tags: List of allowed HTML tags (default: basic formatting)

    Returns:
        Sanitized HTML
    """
    if not text:
        return ''

    if allowed_tags is None:
        allowed_tags = ['p', 'br', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'a']

    # For now, escape all HTML (can be extended with proper HTML parsing)
    return html.escape(text)


def remove_special_characters(text: str, keep_spaces: bool = True) -> str:
    """
    Remove special characters from text.

    Args:
        text: Input text
        keep_spaces: Whether to keep spaces

    Returns:
        Cleaned text
    """
    if not text:
        return ''

    if keep_spaces:
        # Keep alphanumeric, spaces, and basic punctuation
        pattern = r'[^a-zA-Z0-9\s\-_.,!?áéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ]'
    else:
        # Keep only alphanumeric
        pattern = r'[^a-zA-Z0-9áéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ]'

    return re.sub(pattern, '', text)


def validate_email(email: str) -> bool:
    """
    Validate email format.

    Args:
        email: Email address to validate

    Returns:
        True if valid email format
    """
    if not email:
        return False

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe file operations.

    Args:
        filename: Original filename

    Returns:
        Safe filename
    """
    if not filename:
        return 'untitled'

    # Remove path separators
    filename = filename.replace('/', '_').replace('\\', '_')

    # Remove dangerous characters
    filename = re.sub(r'[^\w\s\-.]', '', filename)

    # Normalize spaces
    filename = '_'.join(filename.split())

    # Limit length
    name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
    name = name[:100]

    return f"{name}.{ext}" if ext else name


def is_safe_input(text: str, pattern: str = None) -> bool:
    """
    Check if input matches safe pattern.

    Args:
        text: Input to check
        pattern: Regex pattern (default: alphanumeric and spaces)

    Returns:
        True if input is safe
    """
    if not text:
        return False

    if pattern is None:
        pattern = r'^[a-zA-Z0-9\s\-_.áéíóúàèìòùâêîôûãõçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ]+$'

    return bool(re.match(pattern, text))
