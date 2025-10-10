"""
Scraper Service - News scraping orchestration
"""
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
from app.scrapers.contabeis import ContabeisScraper
from app.scrapers.mundorh import MundoRHScraper
from app.scrapers.guiatrabalhista import GuiaTrabalhstaScraper
from app.scrapers.trabalhistablog import TrabalhstaBlogScraper


class ScraperService:
    """Orchestrates multiple news scrapers."""

    def __init__(self):
        """Initialize all scrapers."""
        self.scrapers = [
            ContabeisScraper(),
            MundoRHScraper(),
            GuiaTrabalhstaScraper(),
            TrabalhstaBlogScraper()
        ]

    def scrape_all_news(self, max_articles: int = 10) -> List[Dict]:
        """
        Scrape news from all sources concurrently.

        Args:
            max_articles: Maximum articles per source

        Returns:
            List of article dictionaries
        """
        all_articles = []

        # Use ThreadPoolExecutor for concurrent scraping
        with ThreadPoolExecutor(max_workers=len(self.scrapers)) as executor:
            # Submit scraping tasks
            future_to_scraper = {
                executor.submit(scraper.scrape, max_articles): scraper
                for scraper in self.scrapers
            }

            # Collect results as they complete
            for future in as_completed(future_to_scraper):
                scraper = future_to_scraper[future]
                try:
                    articles = future.result()
                    all_articles.extend(articles)
                    print(f"Scraped {len(articles)} articles from {scraper.source_name}")
                except Exception as e:
                    print(f"Error scraping {scraper.source_name}: {e}")

        # Sort by date (newest first)
        all_articles.sort(key=lambda x: x.get('date', ''), reverse=True)

        return all_articles

    def scrape_by_source(self, source_name: str, max_articles: int = 10) -> List[Dict]:
        """
        Scrape news from a specific source.

        Args:
            source_name: Name of the source
            max_articles: Maximum articles to fetch

        Returns:
            List of article dictionaries
        """
        for scraper in self.scrapers:
            if scraper.source_name.lower() == source_name.lower():
                try:
                    return scraper.scrape(max_articles)
                except Exception as e:
                    print(f"Error scraping {source_name}: {e}")
                    return []

        print(f"Source '{source_name}' not found")
        return []

    def get_available_sources(self) -> List[str]:
        """
        Get list of available news sources.

        Returns:
            List of source names
        """
        return [scraper.source_name for scraper in self.scrapers]

    def search_articles(self, query: str, max_results: int = 20) -> List[Dict]:
        """
        Search articles by keyword across all sources.

        Args:
            query: Search query
            max_results: Maximum results to return

        Returns:
            List of matching articles
        """
        all_articles = self.scrape_all_news(max_articles=30)

        # Filter articles by query
        query_lower = query.lower()
        filtered_articles = [
            article for article in all_articles
            if query_lower in article.get('title', '').lower() or
               query_lower in article.get('content', '').lower()
        ]

        return filtered_articles[:max_results]


# Global scraper service instance
scraper_service = ScraperService()


def get_latest_news(limit: int = 20) -> List[Dict]:
    """
    Get latest news from all sources.

    Args:
        limit: Maximum number of articles

    Returns:
        List of latest articles
    """
    return scraper_service.scrape_all_news(max_articles=limit)


def get_news_by_source(source: str, limit: int = 10) -> List[Dict]:
    """
    Get news from specific source.

    Args:
        source: Source name
        limit: Maximum number of articles

    Returns:
        List of articles from source
    """
    return scraper_service.scrape_by_source(source, max_articles=limit)


def search_news(query: str, limit: int = 20) -> List[Dict]:
    """
    Search news by keyword.

    Args:
        query: Search query
        limit: Maximum results

    Returns:
        List of matching articles
    """
    return scraper_service.search_articles(query, max_results=limit)
