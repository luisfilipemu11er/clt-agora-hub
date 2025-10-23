"""
Portal Contabeis Scraper
"""
from typing import List, Dict
from app.scrapers.base import BaseScraper


class ContabeisScraper(BaseScraper):
    """Scraper for Portal Contabeis labor law news."""

    def __init__(self):
        super().__init__(
            source_name='Portal Contábeis',
            base_url='https://www.contabeis.com.br'
        )

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape articles from Portal Contabeis.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries
        """
        articles = []

        try:
            # Fetch the main page or category page
            url = f"{self.base_url}/noticias/trabalhista/"
            soup = self.fetch_page(url)

            # Find article elements (adjust selectors based on actual site structure)
            article_elements = soup.select('article.noticia, div.item-noticia, div.post')[:max_articles]

            for element in article_elements:
                try:
                    # Extract title
                    title_elem = element.select_one('h2 a, h3 a, .titulo a, .title a')
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    article_url = title_elem.get('href', '')

                    # Extract content/excerpt
                    content_elem = element.select_one('.resumo, .excerpt, .description, p')
                    content = content_elem.get_text(strip=True) if content_elem else ''

                    # Extract date
                    date_elem = element.select_one('.data, .date, time, .published')
                    date = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract author
                    author_elem = element.select_one('.author, .autor, .by')
                    author = author_elem.get_text(strip=True) if author_elem else ''

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
