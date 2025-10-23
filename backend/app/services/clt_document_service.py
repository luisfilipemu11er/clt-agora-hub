"""
CLT Document Service - Fetches and caches official CLT documents
"""
import requests
from bs4 import BeautifulSoup
import os
import pickle
from datetime import datetime, timedelta
from typing import Optional, Dict
import PyPDF2
import io

# Cache directory
CACHE_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'cache')
os.makedirs(CACHE_DIR, exist_ok=True)

# Document URLs
CLT_PLANALTO_URL = "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm"
CLT_SENADO_PDF_URL = "https://www2.senado.leg.br/bdsf/bitstream/handle/id/535468/clt_e_normas_correlatas_1ed.pdf"

# Cache expiration (7 days)
CACHE_EXPIRATION = timedelta(days=7)


class CLTDocumentService:
    """Service to fetch and cache CLT documents."""

    def __init__(self):
        self.cache_file_planalto = os.path.join(CACHE_DIR, 'clt_planalto.pkl')
        self.cache_file_senado = os.path.join(CACHE_DIR, 'clt_senado.pkl')
        self.planalto_content = None
        self.senado_content = None

    def _is_cache_valid(self, cache_file: str) -> bool:
        """Check if cache file exists and is not expired."""
        if not os.path.exists(cache_file):
            return False

        # Check file modification time
        file_time = datetime.fromtimestamp(os.path.getmtime(cache_file))
        return datetime.now() - file_time < CACHE_EXPIRATION

    def _load_cache(self, cache_file: str) -> Optional[Dict]:
        """Load cached content."""
        try:
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        except Exception as e:
            print(f"Error loading cache from {cache_file}: {e}")
            return None

    def _save_cache(self, cache_file: str, content: Dict):
        """Save content to cache."""
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(content, f)
        except Exception as e:
            print(f"Error saving cache to {cache_file}: {e}")

    def fetch_planalto_document(self) -> str:
        """
        Fetch CLT from Planalto website.
        Returns the full text content.
        """
        # Try to load from cache first
        if self._is_cache_valid(self.cache_file_planalto):
            cached = self._load_cache(self.cache_file_planalto)
            if cached:
                print("Loading CLT Planalto from cache")
                self.planalto_content = cached['content']
                return self.planalto_content

        print("Fetching CLT from Planalto website...")
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(CLT_PLANALTO_URL, headers=headers, timeout=30)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract text content (remove scripts and styles)
            for script in soup(["script", "style"]):
                script.decompose()

            text = soup.get_text(separator='\n', strip=True)

            # Cache the content
            self._save_cache(self.cache_file_planalto, {
                'content': text,
                'fetched_at': datetime.now().isoformat()
            })

            self.planalto_content = text
            print(f"CLT Planalto fetched successfully ({len(text)} characters)")
            return text

        except Exception as e:
            print(f"Error fetching CLT from Planalto: {e}")
            return ""

    def fetch_senado_document(self) -> str:
        """
        Fetch CLT PDF from Senado website.
        Returns the extracted text content.
        """
        # Try to load from cache first
        if self._is_cache_valid(self.cache_file_senado):
            cached = self._load_cache(self.cache_file_senado)
            if cached:
                print("Loading CLT Senado from cache")
                self.senado_content = cached['content']
                return self.senado_content

        print("Fetching CLT PDF from Senado...")
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(CLT_SENADO_PDF_URL, headers=headers, timeout=60)
            response.raise_for_status()

            # Extract text from PDF
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text_content = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content.append(page.extract_text())

            text = '\n'.join(text_content)

            # Cache the content
            self._save_cache(self.cache_file_senado, {
                'content': text,
                'fetched_at': datetime.now().isoformat()
            })

            self.senado_content = text
            print(f"CLT Senado PDF fetched successfully ({len(text)} characters)")
            return text

        except Exception as e:
            print(f"Error fetching CLT PDF from Senado: {e}")
            return ""

    def get_all_documents(self) -> Dict[str, str]:
        """
        Get both CLT documents.
        Returns a dictionary with document names and contents.
        """
        documents = {}

        planalto = self.fetch_planalto_document()
        if planalto:
            documents['Planalto (CLT Oficial)'] = planalto

        senado = self.fetch_senado_document()
        if senado:
            documents['Senado (CLT e Normas Correlatas)'] = senado

        return documents

    def search_in_documents(self, query: str, max_results: int = 5) -> list:
        """
        Search for query in both documents.
        Returns relevant excerpts.
        """
        results = []

        # Ensure documents are loaded
        if not self.planalto_content:
            self.fetch_planalto_document()
        if not self.senado_content:
            self.fetch_senado_document()

        query_lower = query.lower()

        # Search in Planalto document
        if self.planalto_content:
            lines = self.planalto_content.split('\n')
            for i, line in enumerate(lines):
                if query_lower in line.lower():
                    # Get context (3 lines before and after)
                    start = max(0, i - 3)
                    end = min(len(lines), i + 4)
                    context = '\n'.join(lines[start:end])
                    results.append({
                        'source': 'Planalto (CLT Oficial)',
                        'excerpt': context,
                        'relevance': line.lower().count(query_lower)
                    })
                    if len(results) >= max_results:
                        break

        # Search in Senado document if we need more results
        if len(results) < max_results and self.senado_content:
            lines = self.senado_content.split('\n')
            for i, line in enumerate(lines):
                if query_lower in line.lower():
                    start = max(0, i - 3)
                    end = min(len(lines), i + 4)
                    context = '\n'.join(lines[start:end])
                    results.append({
                        'source': 'Senado (CLT e Normas Correlatas)',
                        'excerpt': context,
                        'relevance': line.lower().count(query_lower)
                    })
                    if len(results) >= max_results:
                        break

        # Sort by relevance
        results.sort(key=lambda x: x['relevance'], reverse=True)
        return results[:max_results]


# Global instance
clt_service = CLTDocumentService()
