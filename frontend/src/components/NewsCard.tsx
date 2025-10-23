import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parseDate } from "@/lib/date-utils";

interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data_publicacao: string;
  importance_score?: number;
  imagem?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();
  const formattedDate = parseDate(news.data_publicacao)?.toLocaleDateString('pt-BR') || news.data_publicacao;

  // Determine badge color based on category
  const getCategoryColor = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('clt') || cat.includes('legislação')) return 'gradient-purple-blue';
    if (cat.includes('jurídico') || cat.includes('direito')) return 'gradient-blue-cyan';
    if (cat.includes('economia')) return 'gradient-warm';
    return 'gradient-pink-purple';
  };

  const isHighImportance = (news.importance_score || 0) >= 75;

  return (
    <Card
      className="glass border-2 border-white/40 shadow-premium hover-lift cursor-pointer group overflow-hidden relative transition-premium"
      onClick={() => navigate(`/news/${encodeURIComponent(news.id)}`, { state: { news } })}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 ${getCategoryColor(news.categoria)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      <CardContent className="p-7 relative z-10">
        {/* Header with Badge and Date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`${getCategoryColor(news.categoria)} text-white border-none shadow-lg font-bold px-4 py-1.5 text-xs uppercase tracking-wide`}
            >
              {news.categoria}
            </Badge>
            {isHighImportance && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                Destaque
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500 text-sm font-medium">
            <Calendar className="w-4 h-4 mr-1.5" />
            {formattedDate}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-xl mb-4 text-gray-900 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
          {news.titulo}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
          {news.resumo}
        </p>

        {/* Read More Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center font-bold text-base group-hover:gradient-text transition-all">
            <span className="mr-2">Ler notícia completa</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>

          {/* Importance indicator */}
          {news.importance_score && news.importance_score > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-4 rounded-full ${
                      i < Math.floor((news.importance_score || 0) / 20)
                        ? 'bg-gradient-to-t from-purple-600 to-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
