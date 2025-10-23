import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Share2,
  ExternalLink,
  Lightbulb,
  Sparkles,
  TrendingUp,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { parseDate } from "@/lib/date-utils";
import type { NewsItem } from "@/types";

export const NewsDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const newsItem = location.state?.news as NewsItem | undefined;

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Notícia não encontrada</h2>
          <p className="text-gray-600 mb-6">
            Volte para o feed de notícias e selecione um artigo para visualizar.
          </p>
          <Button
            onClick={() => navigate("/news-feed")}
            className="gradient-purple-blue text-white hover:opacity-90 shadow-premium font-bold px-8 rounded-xl hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Feed
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.titulo,
        text: newsItem.conteudo,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const formattedDate = parseDate(newsItem.data_publicacao)?.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) || newsItem.data_publicacao;

  // Determine importance badge color
  const getImportanceColor = (score: number) => {
    if (score >= 9) return "bg-red-100 text-red-700 border-red-300";
    if (score >= 7) return "bg-orange-100 text-orange-700 border-orange-300";
    if (score >= 5) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
  };

  const getImportanceLabel = (score: number) => {
    if (score >= 9) return "Muito Importante";
    if (score >= 7) return "Importante";
    if (score >= 5) return "Moderado";
    return "Informativo";
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-white/50 text-gray-700 font-semibold px-4 py-2 rounded-xl hover-scale"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="hover:bg-white/50 rounded-xl hover-scale"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Top Badges */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Badge className="gradient-purple-blue text-white px-4 py-2 text-sm font-bold shadow-premium">
            {newsItem.categoria}
          </Badge>
          <Badge
            variant="outline"
            className={`${getImportanceColor(newsItem.importance_score)} px-4 py-2 text-sm font-bold border-2`}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            {getImportanceLabel(newsItem.importance_score)}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight animate-fade-in-delay-1">
          {newsItem.titulo}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10 animate-fade-in-delay-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-purple-blue rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fonte</p>
              <p className="font-semibold text-gray-800">{newsItem.source}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Publicado em</p>
              <p className="font-semibold text-gray-800">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="glass border-2 border-white/60 shadow-premium-lg mb-8 animate-fade-in-delay-3">
          <CardContent className="p-10">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed text-lg space-y-4">
                {newsItem.conteudo.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Card */}
        <Card className="glass border-2 border-blue-300/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 shadow-premium-lg mb-8 animate-fade-in-delay-4">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 gradient-purple-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-premium">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  Análise Prática
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                    IA Celeste
                  </Badge>
                </h2>
                <div className="glass border border-white/60 rounded-2xl p-6 bg-white/40">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    A IA Celeste pode te ajudar a entender melhor este conteúdo! Ela pode:
                  </p>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Explicar os termos jurídicos de forma simples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Mostrar como isso afeta seus direitos trabalhistas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Responder dúvidas específicas sobre o tema</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate('/ai-agent', {
                      state: {
                        initialMessage: `Explique de forma simples e prática: ${newsItem.titulo}`
                      }
                    })}
                    className="w-full gradient-purple-blue text-white hover:opacity-90 shadow-premium font-bold h-12 rounded-xl hover-lift"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Perguntar para a IA Celeste
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in-delay-5">
          <Button
            onClick={handleShare}
            variant="outline"
            className="glass border-2 border-purple-300/50 text-gray-700 hover:bg-white font-bold h-14 rounded-xl hover-lift text-base"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Notícia
          </Button>
          <Button
            onClick={() => window.open(newsItem.link, '_blank')}
            className="gradient-purple-blue text-white hover:opacity-90 shadow-premium font-bold h-14 rounded-xl hover-lift text-base"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Ver Fonte Original
          </Button>
        </div>

        {/* Related Topics */}
        <div className="mt-12 glass border border-white/40 rounded-3xl p-8 animate-fade-in-delay-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Tópicos Relacionados
          </h3>
          <div className="flex flex-wrap gap-2">
            {['CLT', 'Direitos Trabalhistas', 'Legislação', newsItem.categoria].map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2 text-sm font-semibold border-2 border-purple-200/50 hover:bg-purple-50 cursor-pointer hover-scale"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
