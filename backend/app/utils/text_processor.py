"""
Text Processor - Process and clean text
"""
import re


def clean_text(text: str) -> str:
    """
    Clean and normalize text.

    Args:
        text: Raw text

    Returns:
        Cleaned text
    """
    if not text:
        return ''

    # Remove extra whitespace
    text = ' '.join(text.split())

    # Remove control characters
    text = ''.join(char for char in text if char.isprintable() or char in '\n\r\t')

    # Normalize line breaks
    text = re.sub(r'\n\s*\n', '\n\n', text)

    return text.strip()


def truncate_text(text: str, max_length: int = 500, suffix: str = '...') -> str:
    """
    Truncate text to maximum length.

    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to append if truncated

    Returns:
        Truncated text
    """
    if not text:
        return ''

    text = clean_text(text)

    if len(text) <= max_length:
        return text

    # Try to break at word boundary
    truncated = text[:max_length - len(suffix)]
    last_space = truncated.rfind(' ')

    if last_space > max_length * 0.8:  # If space is reasonably close to end
        truncated = truncated[:last_space]

    return truncated + suffix


def extract_excerpt(text: str, max_length: int = 300) -> str:
    """
    Extract excerpt from text (first paragraph or truncated).

    Args:
        text: Full text
        max_length: Maximum excerpt length

    Returns:
        Excerpt
    """
    if not text:
        return ''

    text = clean_text(text)

    # Try to get first paragraph
    paragraphs = text.split('\n\n')
    first_para = paragraphs[0] if paragraphs else text

    return truncate_text(first_para, max_length)


def remove_html_tags(text: str) -> str:
    """
    Remove HTML tags from text.

    Args:
        text: Text with HTML tags

    Returns:
        Plain text
    """
    if not text:
        return ''

    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Decode common HTML entities
    html_entities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
    }

    for entity, char in html_entities.items():
        text = text.replace(entity, char)

    return clean_text(text)


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text.

    Args:
        text: Text with irregular whitespace

    Returns:
        Normalized text
    """
    if not text:
        return ''

    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)

    # Replace multiple line breaks with double line break
    text = re.sub(r'\n\n+', '\n\n', text)

    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)

    return text.strip()


def count_words(text: str) -> int:
    """
    Count words in text.

    Args:
        text: Text to count

    Returns:
        Word count
    """
    if not text:
        return 0

    text = clean_text(text)
    words = text.split()
    return len(words)


def extract_keywords(text: str, max_keywords: int = 10) -> list:
    """
    Extract keywords from text (simple implementation).

    Args:
        text: Text to analyze
        max_keywords: Maximum number of keywords

    Returns:
        List of keywords
    """
    if not text:
        return []

    # Clean text
    text = clean_text(text.lower())

    # Remove common Portuguese stop words
    stop_words = {
        'a', 'o', 'e', 'é', 'de', 'da', 'do', 'em', 'um', 'uma', 'os', 'as',
        'para', 'por', 'com', 'sem', 'sob', 'ao', 'no', 'na', 'dos', 'das',
        'à', 'às', 'pelo', 'pela', 'pelos', 'pelas', 'que', 'qual', 'quais',
        'quando', 'onde', 'como', 'mais', 'menos', 'muito', 'pouco', 'todo',
        'toda', 'todos', 'todas', 'outro', 'outra', 'se', 'si', 'são', 'foi',
        'ser', 'estar', 'ter', 'haver', 'fazer', 'dizer', 'dar', 'ver'
    }

    # Extract words
    words = re.findall(r'\b[a-záéíóúàèìòùâêîôûãõç]{3,}\b', text)

    # Filter and count
    word_freq = {}
    for word in words:
        if word not in stop_words:
            word_freq[word] = word_freq.get(word, 0) + 1

    # Sort by frequency
    keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

    return [word for word, _ in keywords[:max_keywords]]


def highlight_text(text: str, query: str, tag: str = 'mark') -> str:
    """
    Highlight search query in text.

    Args:
        text: Original text
        query: Search query
        tag: HTML tag for highlighting

    Returns:
        Text with highlighted query
    """
    if not text or not query:
        return text

    # Escape special regex characters
    query_escaped = re.escape(query)

    # Case-insensitive replacement
    pattern = re.compile(query_escaped, re.IGNORECASE)
    highlighted = pattern.sub(f'<{tag}>\\g<0></{tag}>', text)

    return highlighted
