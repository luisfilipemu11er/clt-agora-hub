"""
Mundo RH News Scraper
"""
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta


class MundoRHScraper:
    """Scraper for Mundo RH labor law news."""

    def __init__(self):
        self.source_name = "Mundo RH"
        self.base_url = "https://www.mundorh.com.br"
        self.news_url = "https://www.mundorh.com.br/noticias"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """Scrape labor law news from Mundo RH."""
        articles = []

        try:
            response = requests.get(self.news_url, headers=self.headers, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find news items
            news_items = soup.select('article, .post, .news-item, .noticia')[:max_articles * 2]

            for item in news_items:
                if len(articles) >= max_articles:
                    break

                try:
                    # Extract title and link
                    title_elem = item.select_one('h2 a, h3 a, .title a, a.post-title')
                    if not title_elem:
                        title_elem = item.select_one('a')

                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    link = title_elem.get('href', '')

                    if not link or len(title) < 10:
                        continue

                    if not link.startswith('http'):
                        link = self.base_url + link

                    # Extract date
                    date_elem = item.select_one('time, .date, .pub-date, [datetime]')
                    if date_elem and date_elem.get('datetime'):
                        date_str = date_elem['datetime']
                    else:
                        date_str = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract summary
                    summary_elem = item.select_one('.excerpt, .resumo, .description, p')
                    summary = summary_elem.get_text(strip=True) if summary_elem else title

                    # Parse date
                    article_date = self._parse_date(date_str)

                    # Only include articles from last 7 days
                    if article_date:
                        days_diff = (datetime.now() - article_date).days
                        if days_diff > 7:
                            continue

                    articles.append({
                        'title': title,
                        'link': link,
                        'source': self.source_name,
                        'category': 'Empregados',
                        'date': article_date.strftime('%Y-%m-%d') if article_date else datetime.now().strftime('%Y-%m-%d'),
                        'content': summary[:500],
                        'importance_score': 6
                    })

                except Exception as e:
                    print(f"Error parsing Mundo RH article: {e}")
                    continue

        except Exception as e:
            print(f"Error fetching Mundo RH news: {e}")

        return articles

    def _parse_date(self, date_str: str) -> datetime:
        """Parse date from various formats."""
        try:
            # ISO format
            if 'T' in date_str:
                return datetime.fromisoformat(date_str.replace('Z', '+00:00'))

            # Brazilian formats
            formats = [
                '%d/%m/%Y',
                '%d/%m/%Y %H:%M',
                '%Y-%m-%d',
                '%d.%m.%Y'
            ]

            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except:
                    continue

            return datetime.now()
        except:
            return datetime.now()
