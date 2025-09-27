import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "@/components/NewsCard";
import { FilterBar } from "@/components/FilterBar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageCircle } from "lucide-react";
import type { NewsItem, ApiNewsItem } from "@/types";
import { parseDate } from "@/lib/date-utils";

// Fetch function
export const fetchNews = async (): Promise<NewsItem[]> => {
  const response = await fetch("http://127.0.0.1:5000/api/chat");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ApiNewsItem[] = await response.json();
  
  // Adapt the data to the shape expected by NewsCard
  return data.map(item => ({
    id: item.link, // Using link as a unique ID
    titulo: item.title,
    resumo: item.summary,
    categoria: item.category,
    data_publicacao: item.publication_date,
  }));
};

export const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: news, isLoading, isError, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const categories = useMemo(() => {
    if (!news) return [];
    const allCategories = news.map(item => item.categoria).filter(Boolean);
    return [...new Set(allCategories)];
  }, [news]);

  const filteredNews = useMemo(() => {
    if (!news) return [];
    
    if (selectedCategory) {
      return news.filter(item => item.categoria === selectedCategory);
    }

    // Filter for the last 7 days for "Todas"
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return news.filter(item => {
        try {
            const newsDate = parseDate(item.data_publicacao);
            return newsDate && newsDate > sevenDaysAgo;
        } catch {
            return false;
        }
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
          categories={categories}
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
        className="fixed bottom-24 right-6 md:bottom-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-elevated z-40"
        size="icon"
      >
        <Bot className="w-6 h-6" />
      </Button>

      <BottomNavigation />
    </div>
  );
};