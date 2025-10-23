"""
Date Parser - Parse and format dates
"""
import re
from datetime import datetime, timedelta
from typing import Optional


def parse_date(date_str: str) -> str:
    """
    Parse date string to standardized format (YYYY-MM-DD).

    Args:
        date_str: Date string in various formats

    Returns:
        Standardized date string or empty string if parsing fails
    """
    if not date_str:
        return ''

    date_str = date_str.strip()

    # Try different date formats
    formats = [
        '%Y-%m-%d',           # 2024-01-15
        '%d/%m/%Y',           # 15/01/2024
        '%d-%m-%Y',           # 15-01-2024
        '%Y/%m/%d',           # 2024/01/15
        '%d de %B de %Y',     # 15 de janeiro de 2024
        '%d %B %Y',           # 15 janeiro 2024
        '%d/%m/%y',           # 15/01/24
        '%d-%m-%y',           # 15-01-24
    ]

    # Portuguese month names mapping
    pt_months = {
        'janeiro': 'january',
        'fevereiro': 'february',
        'março': 'march',
        'abril': 'april',
        'maio': 'may',
        'junho': 'june',
        'julho': 'july',
        'agosto': 'august',
        'setembro': 'september',
        'outubro': 'october',
        'novembro': 'november',
        'dezembro': 'december'
    }

    # Replace Portuguese month names with English for parsing
    date_str_lower = date_str.lower()
    for pt_month, en_month in pt_months.items():
        if pt_month in date_str_lower:
            date_str = date_str_lower.replace(pt_month, en_month)
            break

    # Try parsing with different formats
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue

    # Try parsing relative dates (hoje, ontem, etc.)
    relative_date = parse_relative_date(date_str)
    if relative_date:
        return relative_date

    # If all parsing fails, return empty string
    return ''


def parse_relative_date(date_str: str) -> Optional[str]:
    """
    Parse relative date strings (hoje, ontem, há 2 dias).

    Args:
        date_str: Relative date string

    Returns:
        Date in YYYY-MM-DD format or None
    """
    date_str_lower = date_str.lower()

    # Today
    if 'hoje' in date_str_lower or 'today' in date_str_lower:
        return datetime.now().strftime('%Y-%m-%d')

    # Yesterday
    if 'ontem' in date_str_lower or 'yesterday' in date_str_lower:
        return (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    # X days ago
    days_ago_pattern = r'há (\d+) dias?|(\d+) days? ago'
    match = re.search(days_ago_pattern, date_str_lower)
    if match:
        days = int(match.group(1) or match.group(2))
        return (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')

    # X hours ago
    hours_ago_pattern = r'há (\d+) horas?|(\d+) hours? ago'
    match = re.search(hours_ago_pattern, date_str_lower)
    if match:
        hours = int(match.group(1) or match.group(2))
        return (datetime.now() - timedelta(hours=hours)).strftime('%Y-%m-%d')

    return None


def format_date_pt(date_str: str) -> str:
    """
    Format date to Brazilian Portuguese format.

    Args:
        date_str: Date string in YYYY-MM-DD format

    Returns:
        Date in DD/MM/YYYY format
    """
    if not date_str:
        return ''

    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        return dt.strftime('%d/%m/%Y')
    except ValueError:
        return date_str


def format_date_verbose(date_str: str) -> str:
    """
    Format date to verbose Portuguese format.

    Args:
        date_str: Date string in YYYY-MM-DD format

    Returns:
        Date like "15 de janeiro de 2024"
    """
    if not date_str:
        return ''

    months_pt = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ]

    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        month_name = months_pt[dt.month - 1]
        return f"{dt.day} de {month_name} de {dt.year}"
    except (ValueError, IndexError):
        return date_str


def is_valid_date(date_str: str) -> bool:
    """
    Check if date string is valid.

    Args:
        date_str: Date string

    Returns:
        True if valid date
    """
    return bool(parse_date(date_str))


def get_current_date() -> str:
    """
    Get current date in YYYY-MM-DD format.

    Returns:
        Current date
    """
    return datetime.now().strftime('%Y-%m-%d')
