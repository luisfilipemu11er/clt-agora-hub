"""
Scraper Service - News scraping orchestration with AI-selected "News of the Day"
"""
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta
import google.generativeai as genai
from app.config import Config
from app.scrapers.tst_scraper import TSTScraper
from app.scrapers.conjur_scraper import ConjurScraper
from app.scrapers.jota_scraper import JotaScraper
from app.scrapers.contabeis_scraper import ContabeisScraper
from app.scrapers.mundorh_scraper import MundoRHScraper
from app.scrapers.guia_trabalhista_scraper import GuiaTrabalhistaScraper


class ScraperService:
    """Orchestrates multiple news scrapers and AI selection."""

    def __init__(self):
        """Initialize all scrapers and AI."""
        self.scrapers = [
            TSTScraper(),
            ConjurScraper(),
            JotaScraper(),
            ContabeisScraper(),
            MundoRHScraper(),
            GuiaTrabalhistaScraper()
        ]

        # Initialize Gemini AI for news selection
        genai.configure(api_key=Config.GOOGLE_API_KEY_ANALYSIS)
        self.ai_model = genai.GenerativeModel(
            model_name='gemini-2.0-flash-exp'
        )

    def scrape_all_news(self, max_articles_per_source: int = 10) -> List[Dict]:
        """
        Scrape news from all sources concurrently.
        Only returns articles from the last 7 days, ordered by publication date.

        Args:
            max_articles_per_source: Maximum articles per source

        Returns:
            List of article dictionaries from last 7 days, sorted by date
        """
        all_articles = []
        seven_days_ago = datetime.now() - timedelta(days=7)

        # Use ThreadPoolExecutor for concurrent scraping
        with ThreadPoolExecutor(max_workers=len(self.scrapers)) as executor:
            # Submit scraping tasks
            future_to_scraper = {
                executor.submit(scraper.scrape, max_articles_per_source): scraper
                for scraper in self.scrapers
            }

            # Collect results as they complete
            for future in as_completed(future_to_scraper):
                scraper = future_to_scraper[future]
                try:
                    articles = future.result()

                    # Filter articles from last 7 days
                    recent_articles = []
                    for article in articles:
                        try:
                            article_date = datetime.strptime(article['date'], '%Y-%m-%d')
                            if article_date >= seven_days_ago:
                                recent_articles.append(article)
                        except:
                            # If date parsing fails, include the article anyway
                            recent_articles.append(article)

                    all_articles.extend(recent_articles)
                    print(f"Scraped {len(recent_articles)} articles from {scraper.source_name} (last 7 days)")
                except Exception as e:
                    print(f"Error scraping {scraper.source_name}: {e}")

        # Sort by date (newest first)
        all_articles.sort(key=lambda x: x.get('date', ''), reverse=True)

        return all_articles

    def select_news_of_the_day(self, articles: List[Dict]) -> Dict:
        """
        Use AI to select the "News of the Day" from available articles.

        Args:
            articles: List of article dictionaries

        Returns:
            Selected article with news_of_the_day flag
        """
        if not articles:
            return None

        try:
            # Prepare article summaries for AI
            articles_summary = ""
            for idx, article in enumerate(articles[:20]):  # Analyze top 20 articles
                articles_summary += f"\n{idx}. [{article['source']}] {article['title']}\n   {article['content'][:200]}...\n"

            prompt = f"""Você é um especialista em direito trabalhista brasileiro.
Sua tarefa é analisar notícias trabalhistas e escolher a mais importante do dia.

Critérios para escolher a "Notícia do Dia":
1. Impacto direto nos direitos dos trabalhadores brasileiros
2. Mudanças na legislação ou jurisprudência
3. Decisões judiciais relevantes
4. Relevância social e número de trabalhadores afetados
5. Urgência e atualidade do tema

Responda APENAS com o número (índice) da notícia escolhida e uma breve justificativa (máximo 2 frases).

Analise as seguintes notícias trabalhistas e escolha a mais importante para ser a "Notícia do Dia":

{articles_summary}

Responda com o número da notícia escolhida e justificativa (máximo 2 frases)."""

            response = self.ai_model.generate_content(prompt)
            response_text = response.text.strip()

            # Extract the index from response
            import re
            match = re.search(r'^(\d+)', response_text)
            if match:
                selected_idx = int(match.group(1))
                if 0 <= selected_idx < len(articles):
                    selected_article = articles[selected_idx].copy()
                    selected_article['news_of_the_day'] = True
                    selected_article['ai_justification'] = response_text
                    selected_article['importance_score'] = 10  # Maximum importance
                    print(f"AI selected News of the Day: {selected_article['title']}")
                    return selected_article

        except Exception as e:
            print(f"Error selecting news of the day: {e}")

        # Fallback: select first article
        if articles:
            fallback = articles[0].copy()
            fallback['news_of_the_day'] = True
            fallback['importance_score'] = 10
            return fallback

        return None

    def get_news_with_highlights(self, max_articles: int = 50) -> Dict:
        """
        Get all news with AI-selected "News of the Day" highlighted.
        Falls back to AI-generated news if scrapers fail.

        Args:
            max_articles: Maximum total articles

        Returns:
            Dictionary with 'news_of_the_day' and 'other_news'
        """
        all_articles = self.scrape_all_news(max_articles_per_source=20)

        # FALLBACK: If no articles scraped, generate with AI
        if not all_articles or len(all_articles) < 5:
            print("Warning: Scrapers returned few/no articles. Using AI fallback...")
            all_articles = self._generate_fallback_news(max_articles)

        if not all_articles:
            return {
                'news_of_the_day': None,
                'other_news': [],
                'total': 0
            }

        # Select news of the day
        news_of_the_day = self.select_news_of_the_day(all_articles)

        # Remove the selected news from the main list
        other_news = [
            article for article in all_articles
            if article.get('link') != news_of_the_day.get('link')
        ][:max_articles - 1]

        return {
            'news_of_the_day': news_of_the_day,
            'other_news': other_news,
            'total': len(other_news) + (1 if news_of_the_day else 0)
        }

    def _generate_fallback_news(self, count: int = 20) -> List[Dict]:
        """
        Generate fallback news using AI when scrapers fail.

        Args:
            count: Number of articles to generate

        Returns:
            List of AI-generated articles
        """
        try:
            from app.scrapers.ai_news_generator import AINewsGenerator
            generator = AINewsGenerator()
            articles = generator.scrape(count)
            print(f"Generated {len(articles)} fallback articles using AI")
            return articles
        except Exception as e:
            print(f"Error generating fallback news: {e}")
            return []

    def get_available_sources(self) -> List[str]:
        """
        Get list of available news sources.

        Returns:
            List of source names
        """
        return [scraper.source_name for scraper in self.scrapers]


# Global scraper service instance
scraper_service = ScraperService()


def get_latest_news(limit: int = 50) -> Dict:
    """
    Get latest news with AI-selected News of the Day.

    Args:
        limit: Maximum number of articles

    Returns:
        Dictionary with news_of_the_day and other_news
    """
    return scraper_service.get_news_with_highlights(max_articles=limit)


def get_news_by_source(source: str, limit: int = 10) -> List[Dict]:
    """
    Get news from a specific source.

    Args:
        source: Source name
        limit: Maximum number of articles

    Returns:
        List of articles from source
    """
    all_articles = scraper_service.scrape_all_news(max_articles_per_source=limit)
    return [article for article in all_articles if article['source'].lower() == source.lower()][:limit]


def search_news(query: str, limit: int = 20) -> List[Dict]:
    """
    Search news by keyword.

    Args:
        query: Search query
        limit: Maximum results

    Returns:
        List of matching articles
    """
    all_articles = scraper_service.scrape_all_news(max_articles_per_source=30)

    # Filter articles by query
    query_lower = query.lower()
    filtered_articles = [
        article for article in all_articles
        if query_lower in article.get('title', '').lower() or
           query_lower in article.get('content', '').lower()
    ]

    return filtered_articles[:limit]
