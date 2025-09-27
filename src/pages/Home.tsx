
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Newspaper, Calculator, BookOpen, AlertCircle } from "lucide-react";
import { tools } from "./Tools"; // Assuming tools can be exported from Tools.tsx
import { glossaryTerms } from "./Glossary"; // Assuming glossaryTerms can be exported from Glossary.tsx

// --- API Fetching ---
const fetchNews = async () => {
  // This should point to your local Flask API endpoint
  const response = await fetch("http://127.0.0.1:5000/api/chat");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// --- Data Transformation ---
type SearchableItem = {
  type: "news" | "tool" | "glossary";
  title: string;
  description: string;
  path: string;
};

const transformNewsData = (data: any[]): SearchableItem[] => {
  return data.map(item => ({
    type: "news",
    title: item.title,
    description: `Fonte: ${item.source} | Categoria: ${item.category}`,
    path: `/news/${encodeURIComponent(item.link)}`, // Assuming a news detail route
  }));
};

const transformToolsData = (data: any[]): SearchableItem[] => {
  return data.map(item => ({
    type: "tool",
    title: item.title,
    description: item.description,
    path: item.path,
  }));
};

const transformGlossaryData = (data: any[]): SearchableItem[] => {
  return data.map(item => ({
    type: "glossary",
    title: item.term,
    description: item.definition,
    path: "/tools/glossary", // Navigate to the main glossary page
  }));
};

// --- Category Configuration ---
const categoryConfig = {
  news: {
    icon: Newspaper,
    color: "text-blue-500",
    badgeColor: "bg-blue-100 text-blue-800",
    label: "Notícia",
  },
  tool: {
    icon: Calculator,
    color: "text-green-500",
    badgeColor: "bg-green-100 text-green-800",
    label: "Ferramenta",
  },
  glossary: {
    icon: BookOpen,
    color: "text-purple-500",
    badgeColor: "bg-purple-100 text-purple-800",
    label: "Glossário",
  },
};

export const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const allContent = useMemo(() => {
    const news = newsData ? transformNewsData(newsData) : [];
    const toolsList = transformToolsData(tools);
    const glossaryList = transformGlossaryData(glossaryTerms);
    return [...news, ...toolsList, ...glossaryList];
  }, [newsData]);

  const filteredContent = useMemo(() => {
    if (!searchTerm) return [];
    return allContent.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allContent]);

  const popularSuggestions = useMemo(() => {
    // Simple logic: take the first tool, first glossary, and first news
    const tool = allContent.find(i => i.type === 'tool');
    const glossary = allContent.find(i => i.type === 'glossary');
    const news = allContent.find(i => i.type === 'news');
    return [tool, glossary, news].filter(Boolean) as SearchableItem[];
  }, [allContent]);

  const renderItem = (item: SearchableItem) => {
    const config = categoryConfig[item.type];
    const Icon = config.icon;

    return (
      <Card
        key={item.path + item.title}
        className="cursor-pointer hover:shadow-elevated transition-shadow duration-300"
        onClick={() => navigate(item.path)}
      >
        <CardContent className="p-4 flex items-start gap-4">
          <div className={`p-2 rounded-full ${config.badgeColor}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <Badge className={`${config.badgeColor} hidden sm:inline-flex`}>{config.label}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-8 px-4 text-center shadow-md">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="text-primary-foreground/80 mt-1">
          Busque em notícias, ferramentas e no glossário.
        </p>
      </header>

      {/* Search Interface */}
      <main className="max-w-3xl mx-auto p-4 -mt-8">
        <Card className="shadow-elevated">
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Digite sua busca..."
                className="pl-10 h-12 text-base border-none focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mt-6">
          {isLoading && <p className="text-center text-muted-foreground">Carregando notícias...</p>}
          {error && (
            <div className="text-center text-destructive">
              <AlertCircle className="mx-auto w-8 h-8 mb-2" />
              <p>Erro ao carregar notícias. Verifique se a API local está rodando.</p>
            </div>
          )}

          {!searchTerm && !isLoading && (
            <div>
              <h2 className="font-semibold text-lg mb-3 text-foreground">Sugestões Populares</h2>
              <div className="space-y-3">
                {popularSuggestions.map(renderItem)}
              </div>
            </div>
          )}

          {searchTerm && filteredContent.length > 0 && (
            <div className="space-y-3">
              {filteredContent.map(renderItem)}
            </div>
          )}

          {searchTerm && !isLoading && filteredContent.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">Tente uma busca diferente.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
