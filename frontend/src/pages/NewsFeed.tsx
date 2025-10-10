import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "@/components/NewsCard";
import { FilterBar } from "@/components/FilterBar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import type { NewsItem, ApiNewsItem } from "@/types";

// Fetch function
export const fetchNews = async (): Promise<NewsItem[]> => {
  const response = await fetch("http://127.0.0.1:5000/api/news");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ApiNewsItem[] = await response.json();
  
  // Adapt the data to the shape expected by NewsCard
  return data.map(item => ({
    id: item.link, // Using link as a unique ID
    titulo: item.title,
    link: item.link,
    source: item.source,
    categoria: item.category,
    data_publicacao: item.date,
    importance_score: item.importance_score,
  }));
};

const fixedCategories = ['Legislação', 'Carreira', 'Gestão', 'Notícias', 'Outros'];

export const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: news, isLoading, isError, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const filteredNews = useMemo(() => {
    if (!news) return [];
    
    if (selectedCategory) {
      return news.filter(item => item.categoria === selectedCategory);
    }

    // For "Todas", sort by importance score, then by date
    return [...news].sort((a, b) => {
      if (a.importance_score !== b.importance_score) {
        return b.importance_score - a.importance_score;
      }
      return new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime();
    });

  }, [news, selectedCategory]);

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
        <FilterBar 
          categories={fixedCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </> 
          )}
          {isError && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Erro ao carregar notícias: {error.message}
              </p>
            </div>
          )}
          {filteredNews && filteredNews.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
          {filteredNews && filteredNews.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma notícia encontrada.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <Button
        onClick={() => navigate('/ai-agent')}
        className="fixed bottom-24 right-6 md:bottom-6 h-14 px-4 rounded-full bg-primary hover:bg-primary/90 shadow-elevated z-40 flex items-center gap-2"
      >
        <Bot className="w-6 h-6" />
        <span className="text-base">Consultar IA</span>
      </Button>

      <BottomNavigation />
    </div>
  );
};