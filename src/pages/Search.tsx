import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, FileText, Calculator, BookOpen } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";

// Mock search data combining all content
const searchableContent = [
  {
    id: "news-1",
    title: "Nova regulamentação do eSocial para 2024",
    description: "Ministério do Trabalho anuncia mudanças importantes no cronograma",
    type: "news",
    path: "/news/1",
    icon: FileText
  },
  {
    id: "news-2", 
    title: "STF decide sobre terceirização em atividade-fim",
    description: "Supremo Tribunal Federal estabelece novos parâmetros",
    type: "news",
    path: "/news/2",
    icon: FileText
  },
  {
    id: "tool-vacation",
    title: "Calculadora de Férias",
    description: "Calcule valores de férias e abono pecuniário",
    type: "tool",
    path: "/tools/vacation-calculator",
    icon: Calculator
  },
  {
    id: "tool-glossary",
    title: "Glossário Trabalhista",
    description: "Termos e definições da legislação trabalhista",
    type: "tool", 
    path: "/tools/glossary",
    icon: BookOpen
  },
  {
    id: "term-abono",
    title: "Abono Pecuniário",
    description: "Conversão de 1/3 das férias em dinheiro",
    type: "glossary",
    path: "/tools/glossary",
    icon: BookOpen
  },
  {
    id: "term-aviso",
    title: "Aviso Prévio", 
    description: "Comunicação antecipada do término do contrato",
    type: "glossary",
    path: "/tools/glossary",
    icon: BookOpen
  }
];

const typeColors = {
  news: "bg-primary/10 text-primary",
  tool: "bg-secondary/10 text-secondary", 
  glossary: "bg-news-highlight/10 text-news-highlight"
};

const typeLabels = {
  news: "Notícia",
  tool: "Ferramenta",
  glossary: "Glossário"
};

export const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = searchTerm.length >= 2 
    ? searchableContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <SearchIcon className="w-6 h-6" />
            Buscar
          </h1>
          <p className="text-primary-foreground/80">
            Encontre notícias, ferramentas e termos trabalhistas
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Search Input */}
        <Card className="shadow-card bg-gradient-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Digite pelo menos 2 caracteres para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searchTerm.length >= 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">
                Resultados para "{searchTerm}"
              </h2>
              <span className="text-sm text-muted-foreground">
                ({filteredResults.length} encontrado{filteredResults.length !== 1 ? 's' : ''})
              </span>
            </div>

            {filteredResults.map((result) => {
              const Icon = result.icon;
              return (
                <Card 
                  key={result.id}
                  className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
                  onClick={() => navigate(result.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${typeColors[result.type]} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {result.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${typeColors[result.type]} font-medium`}>
                            {typeLabels[result.type]}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum resultado encontrado para "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}

        {searchTerm.length < 2 && searchTerm.length > 0 && (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Digite pelo menos 2 caracteres para buscar
            </p>
          </div>
        )}

        {searchTerm.length === 0 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Buscar Conteúdo</h3>
              <p className="text-muted-foreground">
                Pesquise por notícias, ferramentas ou termos do glossário trabalhista
              </p>
            </div>

            <Card className="shadow-card bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Conteúdo Disponível:</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Notícias</p>
                      <p className="text-xs text-muted-foreground">Legislação e decisões</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calculator className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">Calculadoras</p>
                      <p className="text-xs text-muted-foreground">Férias, rescisão, etc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-news-highlight" />
                    <div>
                      <p className="font-medium text-sm">Glossário</p>
                      <p className="text-xs text-muted-foreground">Termos trabalhistas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};