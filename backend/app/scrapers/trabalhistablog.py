"""
Trabalhista Blog Scraper
"""
from typing import List, Dict
from app.scrapers.base import BaseScraper


class TrabalhstaBlogScraper(BaseScraper):
    """Scraper for Trabalhista Blog news."""

    def __init__(self):
        super().__init__(
            source_name='Trabalhista Blog',
            base_url='https://trabalhistablog.com.br'
        )

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape articles from Trabalhista Blog.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries
        """
        articles = []

        try:
            # Fetch the main blog page
            url = self.base_url
            soup = self.fetch_page(url)

            # Find article elements (adjust selectors based on actual site structure)
            article_elements = soup.select('article, div.post, div.blog-post')[:max_articles]

            for element in article_elements:
                try:
                    # Extract title
                    title_elem = element.select_one('h1 a, h2 a, h3 a, .entry-title a')
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    article_url = title_elem.get('href', '')

                    # Extract content/excerpt
                    content_elem = element.select_one('.entry-summary, .post-content, .excerpt, p')
                    content = content_elem.get_text(strip=True) if content_elem else ''

                    # Extract date
                    date_elem = element.select_one('.entry-date, .post-date, time, .published')
                    date = date_elem.get_text(strip=True) if date_elem else ''

                    # Extract author
                    author_elem = element.select_one('.author, .entry-author')
                    author = author_elem.get_text(strip=True) if author_elem else ''

                    # Extract image
                    image_elem = element.select_one('.post-thumbnail img, .entry-image img, img')
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
