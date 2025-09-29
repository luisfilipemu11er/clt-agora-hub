import requests
from bs4 import BeautifulSoup

# --- Helper Functions ---

def _fetch_soup(url, headers=None, timeout=20):
    """Fetches a URL and returns a BeautifulSoup object."""
    if headers is None:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    try:
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        return BeautifulSoup(response.content, "html.parser")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_article_content(url):
    """Fetches and extracts the main text content of a news article."""
    soup = _fetch_soup(url)
    if not soup:
        return ""
    
    main_content = soup.find('article') or soup.find('main') or soup.body
    if not main_content:
        return ""
        
    paragraphs = main_content.find_all('p')
    return ' '.join([p.get_text() for p in paragraphs])

# --- Scraping Functions ---

def scrape_contabeis():
    """Scrapes news from contabeis.com.br/noticias/."""
    URL = "https://www.contabeis.com.br/noticias/"
    BASE_URL = "https://www.contabeis.com.br"
    news_list = []
    soup = _fetch_soup(URL)
    if not soup:
        return news_list

    articles = soup.select("section.materiasList article")
    for article in articles:
        link_tag = article.find('a')
        if link_tag and link_tag.has_attr('href'):
            title_tag = link_tag.find('h2')
            category_tag = link_tag.find('strong')
            date_tag = link_tag.find('em', class_='timestamp')
            if title_tag and category_tag and date_tag:
                link = link_tag['href']
                if not link.startswith('http'):
                    link = BASE_URL + "/" + link.lstrip('/')
                news_list.append({
                    'title': title_tag.get_text(strip=True),
                    'link': link,
                    'date': date_tag.get_text(strip=True),
                    'source': 'Contábeis',
                    'category': category_tag.get_text(strip=True)
                })
    return news_list

def scrape_mundorh():
    """Scrapes news from mundorh.com.br."""
    URL = "https://mundorh.com.br/"
    news_list = []
    soup = _fetch_soup(URL)
    if not soup:
        return news_list

    articles = soup.find_all('article', class_='l-post')
    for article in articles:
        category_tag = article.find('a', rel='category')
        if category_tag:
            category_href = category_tag.get('href', '').lower()
            if 'legislacao-trabalhista' in category_href or 'carreira' in category_href or 'gestao' in category_href:
                title_tag = article.find('h2', class_='is-title')
                link_tag = title_tag.find('a') if title_tag else None
                time_tag = article.find('time', class_='post-date')
                if link_tag and time_tag and link_tag.has_attr('href'):
                    news_list.append({
                        'title': link_tag.get_text(strip=True),
                        'link': link_tag['href'],
                        'date': time_tag['datetime'],
                        'source': 'Mundo RH',
                        'category': category_tag.get_text(strip=True)
                    })
    return news_list

def scrape_guiatrabalhista():
    """Scrapes news from guiatrabalhista.com.br."""
    URL = "https://www.guiatrabalhista.com.br/box-noticias.htm"
    news_list = []
    soup = _fetch_soup(URL)
    if not soup:
        return news_list

    items = soup.find_all('li')
    for item in items:
        link_tag = item.find('a')
        date_tag = item.find('span', class_='post-date')
        if link_tag and date_tag:
            news_list.append({
                'title': link_tag.get_text(strip=True),
                'link': link_tag.get('href'),
                'date': date_tag.get_text(strip=True),
                'source': 'Guia Trabalhista',
                'category': 'Legislação'
            })
    return news_list

def scrape_trabalhistablog():
    """Scrapes news from trabalhista.blog."""
    URL = "https://trabalhista.blog/"
    news_list = []
    soup = _fetch_soup(URL)
    if not soup:
        return news_list

    articles = soup.find_all('article')
    for article in articles:
        title_tag = article.find('h2', class_='entry-title')
        if title_tag:
            link_tag = title_tag.find('a')
            time_tag = article.find('time', class_='entry-date')
            if link_tag and time_tag:
                news_list.append({
                    'title': link_tag.get_text(strip=True),
                    'link': link_tag.get('href'),
                    'date': time_tag.get('datetime'),
                    'source': 'Trabalhista Blog',
                    'category': 'Notícias'
                })
    return news_list