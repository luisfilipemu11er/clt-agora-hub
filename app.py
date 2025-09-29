import os
import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import google.generativeai as genai

# Import refactored modules
from scraper import (
    scrape_contabeis,
    scrape_mundorh,
    scrape_guiatrabalhista,
    scrape_trabalhistablog,
    get_article_content
)
from processing import (
    parse_date,
    normalize_category,
    calculate_importance
)

# --- App & AI Initialization ---

app = Flask(__name__)
CORS(app)
load_dotenv()

# System prompt for the AI agent
SYSTEM_PROMPT = '''
Você é um **Agente Consultivo Especialista em Legislação Trabalhista, Contabilidade, Previdência e conformidade (Compliance)**.

Sua missão é ser o principal recurso de atualização legal e consultoria prática para profissionais de Contabilidade, DP e RH. Adote um tom de voz **profissional, objetivo, didático e altamente preciso**, com foco total em **mitigar riscos e garantir a conformidade legal**.

### Regras de Operação (Curadoria e Consultoria)

**1. FUNÇÃO PRINCIPAL: Consultoria e Análise**
* **A. Resposta a Dúvidas:** Responda a perguntas específicas sobre aplicação da lei (CLT, Normas do MTE, RFB), eSocial, DCTFWeb e rotinas contábeis.
* **B. Análise Documental:** Ao receber textos (leis, portarias, notícias), sintetize o ponto principal, identifique o **impacto prático** e apresente as **ações imediatas recomendadas** para a adequação (o que mudar ou fazer agora).
* **C. Conformidade:** Sempre que possível, cite a **base legal/normativa** e inclua uma **análise de risco de conformidade** (potenciais passivos/multas).

**2. FUNÇÃO SECUNDÁRIA: Curadoria de Notícias (Sob Demanda)**
* Quando o usuário solicitar explicitamente ("Gerar relatório", "Buscar notícias", etc.), execute o relatório de curadoria:
    * **Escopo:** Últimas **24 horas** (Rolling 24h).
    * **Fontes Prioritárias:** **DOU/MTE, TST, Contábeis (contabeis.com.br)** e **Mundo RH (mundorh.com.br)**.
    * **Seleção:** Prioridade máxima para **Alterações Legais, Normas e Decisões Judiciais Relevantes** que causem impacto prático.
    * **Formato de Entrega (5 Notícias):**
        * Ranqueie de 1º (Mais Impactante) a 5º.
        * Inclua Título, Resumo, **Análise de Especialista (Implicações e Ações Imediatas)**, Link (URL), Data/Hora e Fontes.
        * Finalize com um parágrafo de **Metodologia** (termos de busca, hora da varredura, etc.).

**3. Restrição e Qualidade:**
* Não forneça aconselhamento jurídico personalizado. Use **disclaimer** se a pergunta demandar opinião legal formal.
* A resposta deve ser **objetiva, útil e diretamente aplicável** na rotina profissional.
* Idioma obrigatório: **Português (pt-BR)**.

**4. Formato da Resposta:**
* **Use Markdown:** Utilize negrito, itálico, listas (bullet points) e outros elementos do Markdown para estruturar a informação de forma clara e legível.
* **Emojis:** Use emojis de forma sutil e profissional para destacar pontos importantes e tornar a leitura mais agradável (e.g.,  legislação ⚖️, dinheiro 💰, calendário 📅).
* **Clareza e Concisão:** Apresente a informação em blocos de texto curtos e fáceis de ler.
'''

# Configure the generative AI model
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "SUA_CHAVE_API_AQUI":
        print("WARNING: GOOGLE_API_KEY not found or is a placeholder. The /api/chat endpoint will not work.")
        model = None
    else:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro-latest')
except Exception as e:
    print(f"Error configuring Generative AI: {e}")
    model = None

# --- Caching Mechanism ---

NEWS_CACHE = {
    "data": None,
    "timestamp": None
}
CACHE_DURATION = datetime.timedelta(minutes=10) # Cache for 10 minutes

# --- Helper Functions ---

def _get_and_process_news():
    """Fetches, processes, and returns news from multiple sources, with caching."""
    now = datetime.datetime.now()
    if NEWS_CACHE["timestamp"] and (now - NEWS_CACHE["timestamp"]) < CACHE_DURATION:
        print("Returning cached news.")
        return NEWS_CACHE["data"]

    print("Fetching and processing news...")
    scraper_functions = [
        scrape_contabeis,
        scrape_mundorh,
        scrape_guiatrabalhista,
        scrape_trabalhistablog
    ]
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(func) for func in scraper_functions]
        all_news = [item for future in futures for item in future.result()]

    processed_news = []
    for item in all_news:
        parsed_date = parse_date(item.get('date', ''), item.get('source', ''))
        if parsed_date:
            item['parsed_date'] = parsed_date
            item['category'] = normalize_category(item.get('category', ''))
            item['importance_score'] = calculate_importance(item.get('title', ''))
            processed_news.append(item)
        else:
            print(f"Could not parse date for item from {item.get('source')}: {item.get('date')}")

    processed_news.sort(key=lambda x: x['parsed_date'], reverse=True)
    
    # Update cache
    NEWS_CACHE["data"] = processed_news
    NEWS_CACHE["timestamp"] = now
    print("News cache updated.")

    return processed_news

# --- API Endpoints ---

@app.route('/api/news', methods=['GET'])
def news_endpoint():
    """Endpoint to get a list of processed news."""
    news_data = _get_and_process_news()
    # To avoid mutating the cache, create a new list of dicts for the response.
    response_data = []
    for item in news_data:
        new_item = item.copy()
        if 'parsed_date' in new_item:
            new_item['date'] = new_item['parsed_date'].isoformat()
            del new_item['parsed_date']
        response_data.append(new_item)
    return jsonify(response_data)

@app.route('/api/article', methods=['GET'])
def get_single_article():
    """Endpoint to fetch the content of a single article."""
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL parameter is missing"}), 400
    content = get_article_content(url)
    if not content:
        return jsonify({"error": "Could not fetch article content"}), 404
    return jsonify({"content": content})

@app.route('/api/chat', methods=['POST', 'GET'])
def chat_with_agent():
    """Endpoint to chat with the specialized AI agent."""
    if not model:
        return jsonify({"error": "Generative AI model not configured. Check GOOGLE_API_KEY."}), 500

    user_message = None
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        user_message = data.get("message")
    elif request.method == 'GET':
        user_message = request.args.get("message")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    final_prompt = ""
    is_news_report_request = any(keyword in user_message.lower() for keyword in ["gerar relatório", "buscar notícias"])

    if is_news_report_request:
        news_items = _get_and_process_news()
        now = datetime.datetime.now(datetime.timezone.utc)
        twenty_four_hours_ago = now - datetime.timedelta(hours=24)
        
        # Filter news from the last 24 hours
        recent_news = [
            news for news in news_items 
            if news.get('parsed_date') and news['parsed_date'] > twenty_four_hours_ago
        ]
        
        news_context = "\n\n--- INÍCIO DAS NOTÍCIAS COLETADAS NAS ÚLTIMAS 24 HORAS ---\n"
        if recent_news:
            for news in recent_news:
                news_context += f"Título: {news['title']}\nLink: {news['link']}\nFonte: {news['source']}\nData: {news['parsed_date'].isoformat()}\n\n"
        else:
            news_context += "Nenhuma notícia relevante encontrada nas últimas 24 horas nas fontes configuradas.\n"
        news_context += "--- FIM DAS NOTÍCIAS ---"
        
        final_prompt = f"{SYSTEM_PROMPT}\n\n{news_context}\n\nCom base nas notícias fornecidas e em suas fontes prioritárias, por favor, execute a função de curadoria de notícias conforme a solicitação do usuário: '{user_message}'"
    else:
        # For general questions, we just prepend the system prompt
        final_prompt = f"{SYSTEM_PROMPT}\n\nPergunta do Usuário: {user_message}\n\nResposta do Agente:"

    try:
        response = model.generate_content(final_prompt)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"Error generating content from AI model: {e}")
        return jsonify({"error": "Failed to get response from AI model."}, 500)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
