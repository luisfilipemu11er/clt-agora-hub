
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Newspaper, Calculator, BookMarked } from "lucide-react";

// --- Data Types ---
type SearchableItem = {
  type: "news" | "tool" | "glossary";
  title: string;
  description: string;
  path: string;
};

// --- Category Configuration ---
const categoryConfig = {
  news: {
    icon: Newspaper,
    color: "text-purple-500",
    badgeColor: "bg-purple-100 text-purple-800",
    label: "Notícia",
  },
  tool: {
    icon: Calculator,
    color: "text-orange-500",
    badgeColor: "bg-orange-100 text-orange-800",
    label: "Ferramenta",
  },
  glossary: {
    icon: BookMarked,
    color: "text-teal-500",
    badgeColor: "bg-teal-100 text-teal-800",
    label: "Glossário",
  },
};

const featuredTools: SearchableItem[] = [
  {
    type: "news",
    title: "Notícias",
    description: "Mantenha-se atualizado com as últimas notícias sobre o mundo do trabalho.",
    path: "/news-feed",
  },
  {
    type: "tool",
    title: "Calculadora de Férias",
    description: "Calcule valores de férias e abono pecuniário",
    path: "/tools/vacation-calculator",
  },
  {
    type: "tool",
    title: "Calculadora de Rescisão",
    description: "Calcule valores rescisórios trabalhistas",
    path: "/tools/termination-calculator",
  },
  {
    type: "glossary",
    title: "Glossário Trabalhista",
    description: "Termos e definições da legislação trabalhista",
    path: "/tools/glossary",
  },
];

export const Home = () => {
  const navigate = useNavigate();

  const renderItem = (item: SearchableItem) => {
    const config = categoryConfig[item.type];
    const Icon = config.icon;

    let color = config.color;
    let badgeColor = config.badgeColor;

    if (item.title === "Calculadora de Rescisão") {
      color = "text-blue-500";
      badgeColor = "bg-blue-100 text-blue-800";
    }

    return (
      <Card
        key={item.path + item.title}
        className="cursor-pointer hover:shadow-elevated transition-shadow duration-300"
        onClick={() => navigate(item.path)}
      >
        <CardContent className="p-4 flex items-start gap-4">
          <div className={`p-2 rounded-full ${badgeColor}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <Badge className={`${badgeColor} hidden sm:inline-flex`}>{config.label}</Badge>
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
        <h1 className="text-3xl font-bold">CLT Agora</h1>
        <p className="text-primary-foreground/80 mt-1 max-w-2xl mx-auto">
          Sua plataforma completa para descomplicar a CLT. Encontre notícias, ferramentas e um glossário completo.
        </p>
      </header>

      {/* AI Agent CTA */}
      <main className="max-w-3xl mx-auto p-4 -mt-8">
        <Card className="shadow-elevated">
          <CardContent className="p-2">
            <div 
              className="relative cursor-pointer" 
              onClick={() => navigate("/ai-agent")}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pergunte algo à nossa IA Trabalhista..."
                className="pl-10 h-12 text-base border-none focus-visible:ring-primary bg-transparent"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Tools Section */}
        <div className="mt-6">
          <div>
            <h2 className="font-semibold text-lg mb-3 text-foreground">Ferramentas</h2>
            <div className="space-y-3">
              {featuredTools.map(renderItem)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
