# CLT Agora

![CLT Agora Logo](public/clt-favicon.svg)

CLT Agora is a comprehensive web application designed to empower Brazilian workers with essential labor law information, practical calculators, and an intelligent AI assistant. Our goal is to demystify complex labor legislation, making it accessible and understandable for everyone.

## 🚀 Features

-   **Calculadora de Rescisão:** Estimate termination payments with detailed breakdowns, covering various dismissal reasons, proportional vacations, 13th salary, FGTS, INSS, and IRRF calculations.
-   **Calculadora de Férias:** Calculate vacation entitlements and values.
-   **Glossário Trabalhista:** A searchable and filterable glossary of key labor law terms, complete with definitions and practical examples.
-   **Agente IA:** An AI-powered assistant ready to answer your questions about Brazilian labor legislation. Available as a full-page chat interface and a convenient floating mini-chat widget.
-   **Feed de Notícias:** Stay updated with the latest news and developments in labor law.
-   **Navegação Responsiva:** A modern and intuitive sidebar navigation, optimized for both desktop and mobile devices.

## 🛠️ Technologies Used

This project leverages a robust stack of modern web and backend technologies:

**Frontend:**

-   **React:** A declarative, component-based JavaScript library for building user interfaces.
-   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
-   **Vite:** A fast frontend build tool that provides an excellent development experience.
-   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
-   **Shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
-   **`react-router-dom`:** For declarative routing in React applications.
-   **`lucide-react`:** A beautiful and customizable icon library.
-   **`date-fns`:** A comprehensive JavaScript date utility library.
-   **`react-markdown` & `remark-gfm`:** For rendering Markdown content, especially in the AI chat.

**Backend:**

-   **Python:** The primary language for backend services.
-   **Flask:** A lightweight WSGI web application framework for Python, likely used for the AI API.
-   **`requests`:** For making HTTP requests (e.g., to external APIs).
-   **`BeautifulSoup4`:** For web scraping (if applicable).

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   Node.js (LTS version recommended) & npm (or [Bun](https://bun.sh/))
-   Python 3.8+
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/luisfilipemu11er/clt-agora-hub.git
cd clt-agora-hub
```

### 2. Install Frontend Dependencies

```bash
npm install # or bun install
```

### 3. Install Backend Dependencies

It's recommended to use a virtual environment for Python projects.

```bash
python -m venv venv
./venv/Scripts/activate # On Windows
source venv/bin/activate # On macOS/Linux

pip install -r requirements.txt
```

## ▶️ How to Run the Project

### 1. Start the Backend Server

Navigate to the project root and run the Flask application:

```bash
./venv/Scripts/activate # On Windows (if not already active)
source venv/bin/activate # On macOS/Linux (if not already active)

python app.py
```

The backend server should start on `http://127.0.0.1:5000`.

### 2. Start the Frontend Development Server

In a separate terminal, navigate to the project root and start the Vite development server:

```bash
npm run dev # or bun run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).

## 📂 Project Structure (Key Directories)

-   `public/`: Static assets like favicons and images.
-   `src/`: Contains all frontend source code.
    -   `src/components/`: Reusable UI components.
        -   `src/components/ui/`: Shadcn/ui components and custom UI elements.
        -   `src/components/AIChatWidget.tsx`: The floating AI chat widget.
        -   `src/components/Layout.tsx`: The main application layout, including the sidebar.
    -   `src/features/`: Feature-specific modules (e.g., `termination`, `vacation`).
    -   `src/hooks/`: Custom React hooks.
    -   `src/lib/`: Utility functions and helper modules (e.g., `calculations.ts`, `date-utils.ts`).
    -   `src/pages/`: Top-level page components (e.g., `Home.tsx`, `Glossary.tsx`, `AIAgent.tsx`).
-   `app.py`: Main Python backend application (likely Flask).
-   `processing.py`: Python script for data processing.
-   `scraper.py`: Python script for web scraping.
-   `requirements.txt`: Python dependencies.
-   `package.json`: Frontend dependencies and scripts.

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your improvements.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).