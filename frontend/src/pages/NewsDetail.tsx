import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2, ExternalLink, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { parseDate } from "@/lib/date-utils";
import type { NewsItem } from "@/types";

const fetchArticleContent = async (url: string) => {
  const response = await fetch(`http://127.0.0.1:5000/api/article?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const newsItem = location.state?.news as NewsItem | undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleContent(id!),
    enabled: !!id,
  });

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Notícia não encontrada</h2>
          <p className="text-muted-foreground mb-4">Volte para o feed de notícias e selecione um artigo.</p>
          <Button onClick={() => navigate("/news-feed")}>Voltar ao Feed</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.titulo,
        text: newsItem.resumo,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };
  
  const formattedDate = parseDate(newsItem.data_publicacao)?.toLocaleDateString('pt-BR') || newsItem.data_publicacao;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card border-b border-border/50 p-4 shadow-card z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
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
                {newsItem.categoria}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {formattedDate}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground mb-6 leading-tight">
              {newsItem.titulo}
            </h1>

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Resumo</h2>
              <p className="text-foreground/80 leading-relaxed">
                {newsItem.resumo}
              </p>
            </div>

            {/* Full Content */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Conteúdo Completo</h2>
              {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
              {isError && <p className="text-destructive">Erro ao carregar o conteúdo da notícia.</p>}
              {data && <p className="text-foreground/80 leading-relaxed">{data.content}</p>}
            </div>

            {/* Practical Analysis - Highlighted section */}
            <Card className="bg-news-highlight/5 border-news-highlight/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-news-highlight mr-2" />
                  <h2 className="text-lg font-bold text-foreground">Análise Prática</h2>
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  {/* Placeholder for practical analysis */}
                  Análise prática será disponibilizada em breve.
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
                onClick={() => window.open(newsItem.id, '_blank')}
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