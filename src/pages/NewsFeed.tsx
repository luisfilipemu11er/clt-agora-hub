import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewsCard } from "@/components/NewsCard";
import { FilterBar } from "@/components/FilterBar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle } from "lucide-react";

// Mock data - in real app this would come from Supabase
const mockNews = [
  {
    id: "1",
    titulo: "Nova regulamentação do eSocial para 2024",
    resumo: "Ministério do Trabalho anuncia mudanças importantes no cronograma de obrigatoriedades do eSocial que afetam empresas de todos os portes.",
    analise_pratica: "Empresas devem se preparar para as novas exigências até março de 2024. Recomenda-se revisar os layouts e testar as transmissões com antecedência.",
    categoria: "eSocial",
    data_publicacao: "2024-01-15",
    link_original: "https://exemplo.com"
  },
  {
    id: "2", 
    titulo: "STF decide sobre terceirização em atividade-fim",
    resumo: "Supremo Tribunal Federal estabelece novos parâmetros para contratação de terceirizados em atividades principais das empresas.",
    analise_pratica: "A decisão impacta diretamente os contratos em vigor. Empresas devem revisar seus acordos de terceirização para adequação às novas regras.",
    categoria: "Decisões Judiciais",
    data_publicacao: "2024-01-12",
    link_original: "https://exemplo.com"
  },
  {
    id: "3",
    titulo: "Mudanças na CLT: Novo texto sobre trabalho híbrido",
    resumo: "Congresso aprova alterações na Consolidação das Leis do Trabalho para regulamentar modalidades de trabalho remoto e híbrido.",
    analise_pratica: "Empregadores devem formalizar políticas internas de trabalho híbrido e ajustar contratos de trabalho conforme as novas diretrizes.",
    categoria: "Legislação",
    data_publicacao: "2024-01-10",
    link_original: "https://exemplo.com"
  }
];

export const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredNews = selectedCategory 
    ? mockNews.filter(news => news.categoria === selectedCategory)
    : mockNews;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">CLT Agora</h1>
          <p className="text-primary-foreground/80">
            Seu hub completo de informações trabalhistas
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* AI Agent Call-to-Action */}
        <div className="mb-6 p-6 bg-gradient-card rounded-xl border shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                Pergunte à nossa IA Trabalhista
              </h3>
              <p className="text-muted-foreground text-sm">
                Tire suas dúvidas sobre legislação trabalhista instantaneamente
              </p>
            </div>
            <Button 
              onClick={() => navigate('/ai-agent')}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultar IA
            </Button>
          </div>
        </div>

        <FilterBar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-4">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma notícia encontrada para esta categoria.
            </p>
          </div>
        )}
      </div>

      {/* Floating Chatbot Button */}
      <Button
        onClick={() => navigate('/ai-agent')}
        className="fixed bottom-24 right-6 md:bottom-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-elevated z-40"
        size="icon"
      >
        <Bot className="w-6 h-6" />
      </Button>

      <BottomNavigation />
    </div>
  );
};