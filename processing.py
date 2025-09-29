import datetime

def normalize_category(category):
    """Normalizes the category to a fixed set."""
    category = category.lower()
    if 'legislação' in category or 'legislacao' in category:
        return 'Legislação'
    if 'carreira' in category:
        return 'Carreira'
    if 'gestão' in category or 'gestao' in category:
        return 'Gestão'
    if 'notícia' in category or 'noticias' in category:
        return 'Notícias'
    return 'Outros'

def calculate_importance(title):
    """Calculates a simple importance score based on keywords."""
    score = 0
    title = title.lower()
    important_keywords = {
        "urgente": 3, "importante": 3, "nova lei": 3, "decreto": 3, 
        "prazo": 2, "atenção": 2, "regras": 2, "muda": 2, "novo": 1
    }
    for keyword, weight in important_keywords.items():
        if keyword in title:
            score += weight
    return score

def parse_date(date_str, source):
    """Parses date strings from different sources."""
    # Set a timezone to make datetimes timezone-aware
    utc_tz = datetime.timezone.utc
    
    try:
        if source == 'Mundo RH' or source == 'Trabalhista Blog':
            # Handles ISO format like "2024-07-26T14:00:00Z"
            return datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        
        elif source == 'Contábeis':
            # Handles RSS feed format like 'Sat, 27 Jul 2024 10:00:00 -0300'
            if '+' in date_str or '-' in date_str[10:]: # Check for timezone info
                 return datetime.datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
            # Handles HTML formats
            elif 'Hoje' in date_str:
                time_str = date_str.replace('Hoje', '').strip()
                today = datetime.datetime.now(utc_tz)
                return today.replace(hour=int(time_str.split(':')[0]), minute=int(time_str.split(':')[1]), second=0, microsecond=0)
            elif 'Ontem' in date_str:
                time_str = date_str.replace('Ontem', '').strip()
                yesterday = datetime.datetime.now(utc_tz) - datetime.timedelta(days=1)
                return yesterday.replace(hour=int(time_str.split(':')[0]), minute=int(time_str.split(':')[1]), second=0, microsecond=0)
            else: # Handles 'dd/mm/yyyy HH:MM' or 'dd/mm/yyyy'
                try:
                    return datetime.datetime.strptime(date_str, '%d/%m/%Y %H:%M').astimezone(utc_tz)
                except ValueError:
                    return datetime.datetime.strptime(date_str, '%d/%m/%Y').astimezone(utc_tz)

        elif source == 'Guia Trabalhista':
            # Handles 'dd/mm/yyyy'
            return datetime.datetime.strptime(date_str, '%d/%m/%Y').replace(tzinfo=utc_tz)
            
    except (ValueError, TypeError) as e:
        print(f"Date parsing error for source '{source}' with date '{date_str}': {e}")
        return None
        
    return None