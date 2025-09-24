import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2, ExternalLink, Lightbulb } from "lucide-react";
import { toast } from "sonner";

// Mock data - same as NewsFeed
const mockNews = [
  {
    id: "1",
    titulo: "Nova regulamentação do eSocial para 2024",
    resumo: "Ministério do Trabalho anuncia mudanças importantes no cronograma de obrigatoriedades do eSocial que afetam empresas de todos os portes.",
    analise_pratica: "Empresas devem se preparar para as novas exigências até março de 2024. Recomenda-se revisar os layouts e testar as transmissões com antecedência. É fundamental que os departamentos de RH iniciem imediatamente o processo de adequação dos sistemas internos e treinem suas equipes para as novas funcionalidades.",
    categoria: "eSocial",
    data_publicacao: "2024-01-15",
    link_original: "https://exemplo.com"
  },
  {
    id: "2", 
    titulo: "STF decide sobre terceirização em atividade-fim",
    resumo: "Supremo Tribunal Federal estabelece novos parâmetros para contratação de terceirizados em atividades principais das empresas.",
    analise_pratica: "A decisão impacta diretamente os contratos em vigor. Empresas devem revisar seus acordos de terceirização para adequação às novas regras. Recomenda-se auditoria jurídica imediata dos contratos existentes.",
    categoria: "Decisões Judiciais",
    data_publicacao: "2024-01-12",
    link_original: "https://exemplo.com"
  },
  {
    id: "3",
    titulo: "Mudanças na CLT: Novo texto sobre trabalho híbrido",
    resumo: "Congresso aprova alterações na Consolidação das Leis do Trabalho para regulamentar modalidades de trabalho remoto e híbrido.",
    analise_pratica: "Empregadores devem formalizar políticas internas de trabalho híbrido e ajustar contratos de trabalho conforme as novas diretrizes. É necessário estabelecer métricas claras de produtividade.",
    categoria: "Legislação",
    data_publicacao: "2024-01-10",
    link_original: "https://exemplo.com"
  }
];

export const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const news = mockNews.find(item => item.id === id);

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Notícia não encontrada</h2>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.titulo,
        text: news.resumo,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card border-b border-border/50 p-4 shadow-card z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground">Detalhes da Notícia</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-8">
            {/* Category and date */}
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {news.categoria}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground mb-6 leading-tight">
              {news.titulo}
            </h1>

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Resumo</h2>
              <p className="text-foreground/80 leading-relaxed">
                {news.resumo}
              </p>
            </div>

            {/* Practical Analysis - Highlighted section */}
            <Card className="bg-news-highlight/5 border-news-highlight/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-news-highlight mr-2" />
                  <h2 className="text-lg font-bold text-foreground">Análise Prática</h2>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  {news.analise_pratica}
                </p>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex gap-3 pt-6 border-t border-border/50">
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => window.open(news.link_original, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Fonte Original
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};