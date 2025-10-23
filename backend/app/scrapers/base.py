"""
Base Scraper Class
"""
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from abc import ABC, abstractmethod
from app.config import Config
from app.utils.date_parser import parse_date
from app.utils.text_processor import clean_text, truncate_text
from app.utils.url_validator import is_valid_url


class BaseScraper(ABC):
    """Abstract base class for news scrapers."""

    def __init__(self, source_name: str, base_url: str):
        """
        Initialize scraper.

        Args:
            source_name: Name of the news source
            base_url: Base URL of the website
        """
        self.source_name = source_name
        self.base_url = base_url
        self.timeout = Config.SCRAPER_TIMEOUT
        self.headers = {
            'User-Agent': Config.SCRAPER_USER_AGENT
        }

    def fetch_page(self, url: str) -> BeautifulSoup:
        """
        Fetch and parse a web page.

        Args:
            url: URL to fetch

        Returns:
            BeautifulSoup object

        Raises:
            Exception if fetch fails
        """
        try:
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            raise

    def create_article(self, title: str, url: str, content: str = '', date: str = '',
                      author: str = '', image_url: str = '') -> Dict:
        """
        Create a standardized article dictionary.

        Args:
            title: Article title
            url: Article URL
            content: Article content/excerpt
            date: Publication date
            author: Author name
            image_url: Image URL

        Returns:
            Standardized article dictionary
        """
        # Clean and validate data
        title = clean_text(title)
        content = clean_text(content)
        author = clean_text(author)

        # Validate and normalize URL
        if not is_valid_url(url):
            url = self.base_url + url if url.startswith('/') else self.base_url + '/' + url

        # Parse date
        parsed_date = parse_date(date)

        return {
            'title': title,
            'url': url,
            'content': truncate_text(content, max_length=500),
            'date': parsed_date,
            'author': author,
            'source': self.source_name,
            'image_url': image_url if is_valid_url(image_url) else ''
        }

    @abstractmethod
    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape articles from the source.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries
        """
        pass

    def safe_scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Safely scrape articles with error handling.

        Args:
            max_articles: Maximum number of articles to scrape

        Returns:
            List of article dictionaries (empty list on error)
        """
        try:
            return self.scrape(max_articles)
        except Exception as e:
            print(f"Error scraping {self.source_name}: {e}")
            return []
