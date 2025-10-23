# CLT Agora - Hub de Informações Trabalhistas

O CLT Agora é uma aplicação web completa para profissionais de RH, contabilidade e gestão de pessoal, oferecendo notícias, calculadoras e ferramentas relacionadas à Consolidação das Leis do Trabalho (CLT) no Brasil.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

*   `/frontend`: Uma aplicação single-page (SPA) construída com React e Vite, responsável pela interface do usuário.
*   `/backend`: Uma API RESTful construída com Flask (Python), responsável pela lógica de negócio, scraping de notícias e interação com a IA.

## Tecnologias Utilizadas

### Frontend
*   **Framework:** React com Vite
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS & shadcn/ui
*   **Roteamento:** React Router
*   **Gerenciamento de Estado:** React Query

### Backend
*   **Framework:** Flask
*   **Linguagem:** Python
*   **Servidor WSGI:** Gunicorn
*   **IA:** Google Gemini
*   **Web Scraping:** BeautifulSoup & Requests

## Começando

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [Python](https://www.python.org/) (versão 3.10 ou superior)

### Configuração do Backend

1.  **Navegue até a pasta do backend:**
    ```sh
    cd backend
    ```

2.  **Crie e ative um ambiente virtual:**
    ```sh
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS / Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    *   Renomeie o arquivo `.env.example` (se houver) para `.env`.
    *   Adicione sua chave da API do Google no arquivo `.env`:
        ```
        GOOGLE_API_KEY=SUA_CHAVE_API_AQUI
        GOOGLE_API_KEY_ANALYSIS=SUA_OUTRA_CHAVE_API_AQUI
        ```

5.  **Inicie o servidor de desenvolvimento:**
    ```sh
    python run.py
    ```
    O backend estará rodando em `http://127.0.0.1:5000`.

### Configuração do Frontend

1.  **Navegue até a pasta do frontend:**
    ```sh
    cd frontend
    ```

2.  **Instale as dependências:**
    ```sh
    npm install
    ```

3.  **Configure a variável de ambiente:**
    *   Crie um arquivo `.env.local` na pasta `frontend`.
    *   Adicione a URL da API do backend:
        ```
        VITE_API_URL=http://127.0.0.1:5000
        ```

4.  **Inicie o servidor de desenvolvimento:**
    ```sh
    npm run dev
    ```
    A aplicação estará acessível em `http://localhost:8080` (ou outra porta indicada no terminal).

## Deploy

A aplicação pode ser implantada usando a seguinte combinação:

*   **Backend (Flask):** No [Render](https://render.com/), utilizando o arquivo `render.yaml` presente no projeto.
*   **Frontend (React):** Na [Vercel](https://vercel.com/), que detectará e configurará automaticamente o projeto Vite.

Lembre-se de configurar as variáveis de ambiente (`GOOGLE_API_KEY` no Render e `VITE_API_URL` na Vercel) nos dashboards das respectivas plataformas.