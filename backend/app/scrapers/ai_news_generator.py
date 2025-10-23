"""
AI News Generator - Generates relevant labor law news using Gemini AI
"""
import google.generativeai as genai
from datetime import datetime, timedelta
import random
from app.config import Config
from typing import List, Dict


class AINewsGenerator:
    """Generates labor law news using AI when scrapers fail."""

    def __init__(self):
        """Initialize AI news generator."""
        self.source_name = "CLT Agora - Análises e Atualizações"
        genai.configure(api_key=Config.GOOGLE_API_KEY_ANALYSIS)
        self.model = genai.GenerativeModel(
            model_name='gemini-2.0-flash-exp',
            system_instruction="""Você é um especialista em direito trabalhista brasileiro e jornalismo.

Sua tarefa é criar notícias informativas e educacionais sobre legislação trabalhista, CLT e direitos trabalhistas no Brasil.

FORMATO DE RESPOSTA (JSON):
{
  "articles": [
    {
      "title": "Título da notícia (70-100 caracteres)",
      "summary": "Resumo de 2-3 frases explicando o tema",
      "category": "CLT|Direito|Jurídico|Empregados|Economia",
      "date": "YYYY-MM-DD",
      "importance": 1-10
    }
  ]
}

DIRETRIZES:
- Crie notícias EDUCACIONAIS sobre temas trabalhistas brasileiros
- Foque em: direitos do trabalhador, mudanças na CLT, jurisprudência, cálculos trabalhistas, obrigações do empregador
- Use linguagem clara e acessível
- As notícias devem ser informativas, não sensacionalistas
- Baseie-se em temas REAIS da legislação brasileira
- Varie entre temas: férias, 13º salário, FGTS, rescisão, jornada de trabalho, etc.
"""
        )

    def generate_news(self, count: int = 10) -> List[Dict]:
        """
        Generate news articles using AI.

        Args:
            count: Number of articles to generate

        Returns:
            List of generated articles
        """
        try:
            # Get current date for reference
            today = datetime.now().strftime('%Y-%m-%d')

            prompt = f"""Gere {count} notícias educacionais sobre legislação trabalhista brasileira.
Data atual: {today}

IMPORTANTE: Use datas RECENTES (outubro de 2024), não datas futuras.

TEMAS SUGERIDOS (escolha {count} diferentes):
1. Cálculo de férias e abono pecuniário
2. Direitos na rescisão de contrato
3. FGTS e suas regras
4. 13º salário - cálculo e pagamento
5. Jornada de trabalho e horas extras
6. Licença maternidade e paternidade
7. Adicional noturno e insalubridade
8. Banco de horas e compensação
9. Seguro-desemprego
10. Aviso prévio proporcional
11. Reforma trabalhista - principais mudanças
12. eSocial e obrigações do empregador
13. Home office na CLT
14. Estabilidade da gestante
15. Intervalos e descansos obrigatórios

Retorne APENAS o JSON válido, sem markdown ou formatação extra."""

            response = self.model.generate_content(prompt)

            # Parse response
            import json
            text = response.text.strip()

            # Remove markdown code blocks if present
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
                text = text.strip()

            data = json.loads(text)
            articles = data.get('articles', [])

            # Format articles
            formatted_articles = []
            base_date = datetime.now()

            for idx, article in enumerate(articles[:count]):
                # Vary dates over last 30 days
                days_ago = random.randint(0, 30)
                article_date = base_date - timedelta(days=days_ago)

                formatted_articles.append({
                    'title': article.get('title', 'Sem título'),
                    'link': f"https://cltagora.com/artigo/{idx+1}",
                    'source': self.source_name,
                    'category': article.get('category', 'CLT'),
                    'date': article_date.strftime('%Y-%m-%d'),  # Always use calculated date
                    'content': article.get('summary', ''),
                    'importance_score': article.get('importance', 5)
                })

            print(f"Generated {len(formatted_articles)} AI news articles")
            return formatted_articles

        except Exception as e:
            print(f"Error generating AI news: {e}")
            # Return fallback articles
            return self._get_fallback_articles()

    def _get_fallback_articles(self) -> List[Dict]:
        """Return fallback articles if AI generation fails."""
        base_date = datetime.now()

        fallback_articles = [
            {
                'title': 'Entenda o cálculo correto de férias e o abono pecuniário',
                'link': 'https://cltagora.com/artigo/ferias',
                'source': self.source_name,
                'category': 'CLT',
                'date': (base_date - timedelta(days=2)).strftime('%Y-%m-%d'),
                'content': 'Saiba como calcular corretamente suas férias, incluindo o adicional de 1/3 constitucional e a possibilidade de vender 10 dias através do abono pecuniário.',
                'importance_score': 8
            },
            {
                'title': 'FGTS: Quando e como sacar seu fundo de garantia',
                'link': 'https://cltagora.com/artigo/fgts',
                'source': self.source_name,
                'category': 'Direito',
                'date': (base_date - timedelta(days=5)).strftime('%Y-%m-%d'),
                'content': 'Conheça todas as situações em que você pode sacar o FGTS: demissão sem justa causa, aposentadoria, compra da casa própria e outras modalidades.',
                'importance_score': 9
            },
            {
                'title': '13º salário: Entenda as parcelas e prazos de pagamento',
                'link': 'https://cltagora.com/artigo/13-salario',
                'source': self.source_name,
                'category': 'Empregados',
                'date': (base_date - timedelta(days=7)).strftime('%Y-%m-%d'),
                'content': 'O 13º salário deve ser pago em duas parcelas: primeira até 30 de novembro e segunda até 20 de dezembro. Saiba calcular o valor proporcional.',
                'importance_score': 7
            },
            {
                'title': 'Horas extras: Cálculo e regras da CLT',
                'link': 'https://cltagora.com/artigo/horas-extras',
                'source': self.source_name,
                'category': 'CLT',
                'date': (base_date - timedelta(days=10)).strftime('%Y-%m-%d'),
                'content': 'As horas extras devem ser pagas com adicional mínimo de 50% em dias úteis e 100% em domingos e feriados. Entenda seus direitos.',
                'importance_score': 8
            },
            {
                'title': 'Rescisão de contrato: Direitos e verbas devidas',
                'link': 'https://cltagora.com/artigo/rescisao',
                'source': self.source_name,
                'category': 'Jurídico',
                'date': (base_date - timedelta(days=12)).strftime('%Y-%m-%d'),
                'content': 'Na demissão sem justa causa, o trabalhador tem direito a aviso prévio, férias proporcionais, 13º proporcional, multa de 40% do FGTS e saque do FGTS.',
                'importance_score': 9
            },
            {
                'title': 'Licença maternidade: Duração e direitos da gestante',
                'link': 'https://cltagora.com/artigo/licenca-maternidade',
                'source': self.source_name,
                'category': 'Direito',
                'date': (base_date - timedelta(days=15)).strftime('%Y-%m-%d'),
                'content': 'A licença maternidade é de 120 dias, podendo ser estendida para 180 dias em empresas participantes do Programa Empresa Cidadã. Conheça seus direitos.',
                'importance_score': 7
            },
            {
                'title': 'Adicional noturno: Quem tem direito e como calcular',
                'link': 'https://cltagora.com/artigo/adicional-noturno',
                'source': self.source_name,
                'category': 'CLT',
                'date': (base_date - timedelta(days=18)).strftime('%Y-%m-%d'),
                'content': 'Trabalho noturno (22h às 5h) deve receber adicional mínimo de 20% sobre a hora normal. Além disso, a hora noturna tem duração reduzida de 52min30s.',
                'importance_score': 6
            },
            {
                'title': 'Banco de horas: Regras e compensação de jornada',
                'link': 'https://cltagora.com/artigo/banco-horas',
                'source': self.source_name,
                'category': 'Empregados',
                'date': (base_date - timedelta(days=20)).strftime('%Y-%m-%d'),
                'content': 'O banco de horas permite compensar horas extras com folgas, mas deve seguir acordo coletivo e ser compensado em até 6 meses.',
                'importance_score': 6
            },
            {
                'title': 'Aviso prévio proporcional: Entenda seus direitos',
                'link': 'https://cltagora.com/artigo/aviso-previo',
                'source': self.source_name,
                'category': 'Jurídico',
                'date': (base_date - timedelta(days=23)).strftime('%Y-%m-%d'),
                'content': 'O aviso prévio começa em 30 dias e aumenta 3 dias por ano trabalhado, podendo chegar a 90 dias. Saiba calcular o seu.',
                'importance_score': 7
            },
            {
                'title': 'eSocial: Guia completo de obrigações trabalhistas',
                'link': 'https://cltagora.com/artigo/esocial',
                'source': self.source_name,
                'category': 'Economia',
                'date': (base_date - timedelta(days=25)).strftime('%Y-%m-%d'),
                'content': 'O eSocial unifica o envio de informações trabalhistas, previdenciárias e fiscais. Conheça os prazos e obrigações mensais.',
                'importance_score': 8
            }
        ]

        print(f"Using {len(fallback_articles)} fallback news articles")
        return fallback_articles

    def scrape(self, max_articles: int = 10) -> List[Dict]:
        """
        Generate news (compatible with scraper interface).

        Args:
            max_articles: Maximum articles to generate

        Returns:
            List of articles
        """
        return self.generate_news(count=max_articles)
