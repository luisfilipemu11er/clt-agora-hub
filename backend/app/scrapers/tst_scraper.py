"""
TST (Tribunal Superior do Trabalho) News Scraper
"""
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta


class TSTScraper:
    """Scraper for TST official news."""

    def __init__(self):
        self.source_name = "Tribunal Superior do Trabalho"
        self.base_url = "https://www.tst.jus.br"
        self.news_url = "https://www.tst.jus.br/noticias"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """Scrape news from TST."""
        articles = []

        try:
            response = requests.get(self.news_url, headers=self.headers, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find news items
            news_items = soup.select('.noticia-item, .news-item, article')[:max_articles]

            for item in news_items:
                try:
                    # Extract title
                    title_elem = item.select_one('h2, h3, .titulo, .title')
                    if not title_elem:
                        continue
                    title = title_elem.get_text(strip=True)

                    # Extract link
                    link_elem = item.select_one('a')
                    if not link_elem or not link_elem.get('href'):
                        continue
                    link = link_elem['href']
                    if not link.startswith('http'):
                        link = self.base_url + link

                    # Extract date
                    date_elem = item.select_one('.data, .date, time')
                    date_str = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract summary
                    summary_elem = item.select_one('.resumo, .summary, p')
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
                        'category': 'Jurídico',
                        'date': article_date.strftime('%Y-%m-%d') if article_date else datetime.now().strftime('%Y-%m-%d'),
                        'content': summary[:500],
                        'importance_score': 8
                    })

                except Exception as e:
                    print(f"Error parsing TST article: {e}")
                    continue

        except Exception as e:
            print(f"Error fetching TST news: {e}")

        return articles

    def _parse_date(self, date_str: str) -> datetime:
        """Parse Brazilian date formats."""
        try:
            # Try common Brazilian formats
            formats = [
                '%d/%m/%Y',
                '%d/%m/%Y %H:%M',
                '%d.%m.%Y',
                '%d-%m-%Y'
            ]

            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except:
                    continue

            # If no format matches, return current date
            return datetime.now()
        except:
            return datetime.now()
