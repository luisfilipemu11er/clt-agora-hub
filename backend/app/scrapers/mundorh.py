"""
Mundo RH Scraper
"""
from typing import List, Dict
from app.scrapers.base import BaseScraper


class MundoRHScraper(BaseScraper):
    """Scraper for Mundo RH labor law news."""

    def __init__(self):
        super().__init__(
            source_name='Mundo RH',
            base_url='https://www.mundorh.com.br'
        )

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape articles from Mundo RH.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries
        """
        articles = []

        try:
            # Fetch the main page or category page
            url = f"{self.base_url}/legislacao-trabalhista"
            soup = self.fetch_page(url)

            # Find article elements (adjust selectors based on actual site structure)
            article_elements = soup.select('article, div.post, div.noticia-item')[:max_articles]

            for element in article_elements:
                try:
                    # Extract title
                    title_elem = element.select_one('h2 a, h3 a, .entry-title a, .post-title a')
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    article_url = title_elem.get('href', '')

                    # Extract content/excerpt
                    content_elem = element.select_one('.entry-content, .post-excerpt, .excerpt, p')
                    content = content_elem.get_text(strip=True) if content_elem else ''

                    # Extract date
                    date_elem = element.select_one('.entry-date, .post-date, time, .date')
                    date = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract author
                    author_elem = element.select_one('.author, .entry-author, .post-author')
                    author = author_elem.get_text(strip=True) if author_elem else ''

                    # Extract image
                    image_elem = element.select_one('img, .post-thumbnail img')
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
