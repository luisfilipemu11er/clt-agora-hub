# CLT Agora

![CLT Agora Logo](public/clt-favicon.svg)

CLT Agora é uma aplicação web abrangente projetada para capacitar trabalhadores brasileiros com informações essenciais sobre leis trabalhistas, calculadoras práticas e um assistente de IA inteligente. Nosso objetivo é desmistificar a complexa legislação trabalhista, tornando-a acessível e compreensível para todos.

## 🚀 Funcionalidades

-   **Calculadora de Rescisão:** Estime pagamentos de rescisão com detalhamento, cobrindo várias razões de demissão, férias proporcionais, 13º salário, cálculos de FGTS, INSS e IRRF.
-   **Calculadora de Férias:** Calcule os direitos e valores de férias.
-   **Glossário Trabalhista:** Um glossário pesquisável e filtrável de termos-chave da legislação trabalhista, completo com definições e exemplos práticos.
-   **Agente IA:** Um assistente alimentado por IA pronto para responder às suas perguntas sobre a legislação trabalhista brasileira. Disponível como uma interface de chat em página inteira e um conveniente widget de mini-chat flutuante.
-   **Feed de Notícias:** Mantenha-se atualizado com as últimas notícias e desenvolvimentos na legislação trabalhista.
-   **Navegação Responsiva:** Uma navegação lateral moderna e intuitiva, otimizada para dispositivos desktop e móveis.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza um conjunto robusto de tecnologias web e backend modernas:

**Frontend:**

-   **React:** Uma biblioteca JavaScript declarativa e baseada em componentes para construir interfaces de usuário.
-   **TypeScript:** Um superconjunto tipado de JavaScript que compila para JavaScript puro, melhorando a qualidade e a manutenibilidade do código.
-   **Vite:** Uma ferramenta de construção de frontend rápida que oferece uma excelente experiência de desenvolvimento.
-   **Tailwind CSS:** Um framework CSS utility-first para construir rapidamente designs personalizados.
-   **Shadcn/ui:** Uma coleção de componentes reutilizáveis construídos com Radix UI e Tailwind CSS.
-   **`react-router-dom`:** Para roteamento declarativo em aplicações React.
-   **`lucide-react`:** Uma biblioteca de ícones bonita e personalizável.
-   **`date-fns`:** Uma biblioteca abrangente de utilitários de data JavaScript.
-   **`react-markdown` & `remark-gfm`:** Para renderização de conteúdo Markdown, especialmente no chat da IA.

**Backend:**

-   **Python:** A linguagem principal para serviços de backend.
-   **Flask:** Um framework web WSGI leve para Python, provavelmente usado para a API da IA.
-   **`requests`:** Para fazer requisições HTTP (por exemplo, para APIs externas).
-   **`BeautifulSoup4`:** Para web scraping (se aplicável).

## ⚙️ Configuração e Instalação

Siga estes passos para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

-   Node.js (versão LTS recomendada) & npm (ou [Bun](https://bun.sh/))
-   Python 3.8+
-   Git

### 1. Clone o Repositório

```bash
git clone https://github.com/luisfilipemu11er/clt-agora-hub.git
cd clt-agora-hub
```

### 2. Instale as Dependências do Frontend

```bash
npm install # ou bun install
```

### 3. Instale as Dependências do Backend

É recomendado usar um ambiente virtual para projetos Python.

```bash
python -m venv venv
./venv/Scripts/activate # No Windows
source venv/bin/activate # No macOS/Linux

pip install -r requirements.txt
```

## ▶️ Como Executar o Projeto

### 1. Inicie o Servidor Backend

Navegue até a raiz do projeto e execute a aplicação Flask:

```bash
./venv/Scripts/activate # No Windows (se ainda não estiver ativo)
source venv/bin/activate # No macOS/Linux (se ainda não estiver ativo)

python app.py
```

O servidor backend deve iniciar em `http://127.0.0.1:5000`.

### 2. Inicie o Servidor de Desenvolvimento Frontend

Em um terminal separado, navegue até a raiz do projeto e inicie o servidor de desenvolvimento Vite:

```bash
npm run dev # ou bun run dev
```

A aplicação frontend será aberta em seu navegador em `http://localhost:5173` (ou outra porta disponível).

## 📂 Estrutura do Projeto (Diretórios Chave)

-   `public/`: Ativos estáticos como favicons e imagens.
-   `src/`: Contém todo o código-fonte do frontend.
    -   `src/components/`: Componentes de UI reutilizáveis.
        -   `src/components/ui/`: Componentes Shadcn/ui e elementos de UI personalizados.
        -   `src/components/AIChatWidget.tsx`: O widget de chat flutuante da IA.
        -   `src/components/Layout.tsx`: O layout principal da aplicação, incluindo a barra lateral.
    -   `src/features/`: Módulos específicos de funcionalidades (por exemplo, `termination`, `vacation`).
    -   `src/hooks/`: Hooks React personalizados.
    -   `src/lib/`: Funções de utilidade e módulos auxiliares (por exemplo, `calculations.ts`, `date-utils.ts`).
    -   `src/pages/`: Componentes de página de nível superior (por exemplo, `Home.tsx`, `Glossary.tsx`, `AIAgent.tsx`).
-   `app.py`: Aplicação principal do backend Python (provavelmente Flask).
-   `processing.py`: Script Python para processamento de dados.
-   `scraper.py`: Script Python para web scraping.
-   `requirements.txt`: Dependências Python.
-   `package.json`: Dependências e scripts do frontend.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para fazer um fork do repositório, criar uma nova branch e enviar um pull request com suas melhorias.

## 📄 Licença

Este projeto é de código aberto e está disponível sob a [Licença MIT](LICENSE).