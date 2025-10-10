"""
Guia Trabalhista Scraper
"""
from typing import List, Dict
from app.scrapers.base import BaseScraper


class GuiaTrabalhstaScraper(BaseScraper):
    """Scraper for Guia Trabalhista news."""

    def __init__(self):
        super().__init__(
            source_name='Guia Trabalhista',
            base_url='https://www.guiatrabalhista.com.br'
        )

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape articles from Guia Trabalhista.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries
        """
        articles = []

        try:
            # Fetch the news page
            url = f"{self.base_url}/noticias/"
            soup = self.fetch_page(url)

            # Find article elements (adjust selectors based on actual site structure)
            article_elements = soup.select('div.noticia, div.news-item, article')[:max_articles]

            for element in article_elements:
                try:
                    # Extract title
                    title_elem = element.select_one('h2 a, h3 a, .titulo a, .title a')
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    article_url = title_elem.get('href', '')

                    # Extract content/excerpt
                    content_elem = element.select_one('.resumo, .texto, .content, p')
                    content = content_elem.get_text(strip=True) if content_elem else ''

                    # Extract date
                    date_elem = element.select_one('.data, .date, time')
                    date = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract author
                    author_elem = element.select_one('.autor, .author')
                    author = author_elem.get_text(strip=True) if author_elem else 'Guia Trabalhista'

                    # Extract image
                    image_elem = element.select_one('img')
                    image_url = image_elem.get('src', '') if image_elem else ''

                    # Create article
                    article = self.create_article(
                        title=title,
                        url=article_url,
                        content=content,
                        date=date,
                        author=author,
                        image_url=image_url
                    )

                    articles.append(article)

                except Exception as e:
                    print(f"Error parsing article from {self.source_name}: {e}")
                    continue

        except Exception as e:
            print(f"Error scraping {self.source_name}: {e}")

        return articles
