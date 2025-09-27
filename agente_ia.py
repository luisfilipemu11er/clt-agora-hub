from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import datetime
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Helper Functions ---

def get_article_content(url):
    """Fetches and extracts the main text content of a news article."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        main_content = soup.find('article') or soup.find('main') or soup.body
        paragraphs = main_content.find_all('p')
        return ' '.join([p.get_text() for p in paragraphs])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching article {url}: {e}")
        return ""

def analyze_and_summarize(content):
    """Placeholder for AI-powered analysis and summarization."""
    return content[:500] + "..."

def parse_date(date_str, source):
    """Parses date strings from different sources."""
    if source == 'Mundo RH' or source == 'Trabalhista Blog':
        return datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    elif source == 'Contábeis' and '+' in date_str: # RSS feed
        return datetime.datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
    elif source == 'Guia Trabalhista':
        return datetime.datetime.strptime(date_str, '%d/%m/%Y').replace(tzinfo=datetime.timezone.utc)
    elif source == 'Contábeis': # HTML
        if 'Hoje' in date_str:
            time_str = date_str.replace('Hoje', '').strip()
            return datetime.datetime.strptime(time_str, '%H:%M').replace(year=datetime.date.today().year, month=datetime.date.today().month, day=datetime.date.today().day).astimezone(datetime.timezone.utc)
        elif 'Ontem' in date_str:
            time_str = date_str.replace('Ontem', '').strip()
            yesterday = datetime.date.today() - datetime.timedelta(days=1)
            return datetime.datetime.strptime(time_str, '%H:%M').replace(year=yesterday.year, month=yesterday.month, day=yesterday.day).astimezone(datetime.timezone.utc)
        else:
            try:
                return datetime.datetime.strptime(date_str, '%d/%m/%Y %H:%M').astimezone(datetime.timezone.utc)
            except ValueError:
                return datetime.datetime.strptime(date_str, '%d/%m/%Y').astimezone(datetime.timezone.utc)
    return None

# --- Scraping Functions ---

def scrape_contabeis():
    """Scrapes news from contabeis.com.br/noticias/."""
    URL = "https://www.contabeis.com.br/noticias/"
    BASE_URL = "https://www.contabeis.com.br"
    news_list = []
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(URL, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
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
                        link = BASE_URL + "/" + link
                    news_list.append({
                        'title': title_tag.get_text(strip=True),
                        'link': link,
                        'date': date_tag.get_text(strip=True),
                        'source': 'Contábeis',
                        'category': category_tag.get_text(strip=True)
                    })
    except requests.exceptions.RequestException as e:
        print(f"Error scraping Contábeis: {e}")
    return news_list

def scrape_mundorh():
    """Scrapes news from mundorh.com.br."""
    URL = "https://mundorh.com.br/"
    news_list = []
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(URL, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
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
    except requests.exceptions.RequestException as e:
        print(f"Error scraping Mundo RH: {e}")
    return news_list

def scrape_guiatrabalhista():
    """Scrapes news from guiatrabalhista.com.br."""
    URL = "https://www.guiatrabalhista.com.br/box-noticias.htm"
    news_list = []
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(URL, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
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
    except requests.exceptions.RequestException as e:
        print(f"Error scraping Guia Trabalhista: {e}")
    return news_list

def scrape_trabalhistablog():
    """Scrapes news from trabalhista.blog."""
    URL = "https://trabalhista.blog/"
    news_list = []
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(URL, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
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
    except requests.exceptions.RequestException as e:
        print(f"Error scraping Trabalhista Blog: {e}")
    return news_list

# --- Main API Endpoints ---

@app.route('/api/chat', methods=['GET'])
def chat():
    """Main function to run the AI agent and get news."""
    print("Fetching and processing news...")
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(f) for f in [scrape_contabeis, scrape_mundorh, scrape_guiatrabalhista, scrape_trabalhistablog]]
        all_news = [item for future in futures for item in future.result()]

    processed_news = []
    for item in all_news:
        try:
            parsed_date = parse_date(item['date'], item['source'])
            if parsed_date:
                item['parsed_date'] = parsed_date
                processed_news.append(item)
        except (ValueError, TypeError) as e:
            print(f"Could not parse date for item from {item['source']}: {item['date']} - {e}")

    # Sort by date, newest first
    processed_news.sort(key=lambda x: x['parsed_date'], reverse=True)

    # Convert datetime back to string for JSON serialization
    for item in processed_news:
        item['date'] = item['parsed_date'].isoformat()
        del item['parsed_date']


    return jsonify(processed_news)

@app.route('/api/article', methods=['GET'])
def article():
    """Fetches the content of a single article."""
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL parameter is missing"}), 400
    
    content = get_article_content(url)
    if not content:
        return jsonify({"error": "Could not fetch article content"}), 404
        
    return jsonify({"content": content})

if __name__ == "__main__":
    pass