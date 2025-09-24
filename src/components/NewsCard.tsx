import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data_publicacao: string;
  imagem?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
      onClick={() => navigate(`/news/${news.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {news.categoria}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-3 text-foreground line-clamp-2 leading-tight">
          {news.titulo}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {news.resumo}
        </p>
        
        <div className="flex items-center text-primary text-sm font-medium">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ler mais
        </div>
      </CardContent>
    </Card>
  );
};