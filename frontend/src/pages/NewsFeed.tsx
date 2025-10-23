import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Search, Filter, TrendingUp, Sparkles } from "lucide-react";
import type { NewsItem, ApiNewsItem } from "@/types";

// Fetch function
export const fetchNews = async (): Promise<NewsItem[]> => {
  const response = await fetch("http://127.0.0.1:5000/api/news");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();

  // API returns { articles: [], count: 0, success: true }
  const data: ApiNewsItem[] = result.articles || [];

  return data.map(item => ({
    id: item.link,
    titulo: item.title,
    link: item.link,
    source: item.source,
    categoria: item.category,
    conteudo: item.content,
    data_publicacao: item.date,
    importance_score: item.importance_score,
    news_of_the_day: item.news_of_the_day,
    ai_justification: item.ai_justification,
  }));
};

const categories = ['Todos', 'CLT', 'Jurídico', 'Empregados', 'Economia', 'Direito', 'reforma'];

export const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: news, isLoading, isError, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const filteredNews = useMemo(() => {
    if (!news) return [];

    let filtered = news;

    // Exclude "News of the Day" from regular list (only when no filters)
    if (!searchQuery.trim() && (!selectedCategory || selectedCategory === 'Todos')) {
      filtered = filtered.filter(item => !item.news_of_the_day);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'Todos') {
      filtered = filtered.filter(item =>
        item.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by date (newest first)
    return [...filtered].sort((a, b) => {
      return new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime();
    });

  }, [news, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-40 pointer-events-none" />

      {/* Premium Header */}
      <div className="relative pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fade-in border border-white/40">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">
              Atualizado diariamente
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-delay-1">
            <div className="w-20 h-20 gradient-purple-blue rounded-3xl flex items-center justify-center shadow-premium animate-float">
              <Newspaper className="w-11 h-11 text-white" />
            </div>
            <h1 className="text-6xl font-extrabold">
              Notícias <span className="gradient-text">Trabalhistas</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2">
            Fique por dentro das <span className="font-semibold text-gray-800">últimas mudanças na legislação</span>,
            novidades e tudo que impacta o mundo do trabalho
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        {/* Search and Filter Card */}
        <div className="glass border border-white/40 rounded-3xl shadow-premium-lg p-8 mb-10 animate-fade-in-delay-3">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Buscar notícias sobre CLT, direitos trabalhistas, leis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-base border-2 border-purple-200/50 focus:border-purple-400 rounded-2xl bg-white/80 font-medium"
              />
            </div>
            <Button className="gradient-purple-blue hover:opacity-90 text-white px-8 h-14 shadow-premium rounded-2xl font-bold hover-lift">
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? "gradient-purple-blue text-white hover:opacity-90 shadow-premium font-bold px-6 py-2 rounded-xl hover-scale"
                    : "glass border-2 border-purple-200/50 text-gray-700 hover:bg-white font-semibold px-6 py-2 rounded-xl hover-scale"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {filteredNews && filteredNews.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200/50 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">
                <span className="font-bold text-purple-600 text-lg">{filteredNews.length}</span> {filteredNews.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Ordenado por relevância</span>
              </div>
            </div>
          )}
        </div>

        {/* News of the Day Section */}
        {!searchQuery && !selectedCategory && news && news.length > 0 && news.find(n => n.news_of_the_day) && (
          <div className="mb-10 animate-fade-in-delay-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 gradient-purple-blue rounded-2xl flex items-center justify-center shadow-premium">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Notícia do Dia</h2>
                <p className="text-sm text-gray-600">Escolhida pela IA Celeste</p>
              </div>
            </div>

            {(() => {
              const newsOfDay = news.find(n => n.news_of_the_day);
              if (!newsOfDay) return null;

              return (
                <div className="glass border-2 border-purple-300/50 rounded-3xl shadow-premium-lg overflow-hidden hover-lift">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3">
                    <div className="flex items-center gap-2 text-white text-sm font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>DESTAQUE</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <NewsCard news={newsOfDay} />
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {isLoading && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl glass" />
              ))}
            </>
          )}

          {isError && (
            <div className="col-span-2 glass border-2 border-red-300/50 rounded-3xl shadow-premium text-center py-16 px-6 animate-fade-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-700 text-lg font-bold mb-2">
                Erro ao carregar notícias
              </p>
              <p className="text-red-600">
                {error.message}
              </p>
            </div>
          )}

          {filteredNews && filteredNews.map((newsItem, index) => (
            <div
              key={newsItem.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NewsCard news={newsItem} />
            </div>
          ))}

          {filteredNews && filteredNews.length === 0 && !isLoading && (
            <div className="col-span-2 glass border border-white/40 rounded-3xl shadow-premium text-center py-20 px-6 animate-fade-in">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-800 text-xl font-bold mb-2">
                Nenhuma notícia encontrada
              </p>
              <p className="text-gray-600">
                Tente ajustar seus filtros ou termo de busca
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
