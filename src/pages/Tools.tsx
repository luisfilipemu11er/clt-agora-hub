import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";

export const tools = [
  {
    id: "vacation-calculator",
    title: "Calculadora de Férias",
    description: "Calcule valores de férias e abono pecuniário",
    icon: Calculator,
    path: "/tools/vacation-calculator",
    color: "bg-primary/10 text-primary"
  },
  {
    id: "termination-calculator", 
    title: "Calculadora de Rescisão",
    description: "Calcule valores rescisórios trabalhistas",
    icon: FileText,
    path: "/tools/termination-calculator",
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: "glossary",
    title: "Glossário Trabalhista",
    description: "Termos e definições da legislação trabalhista",
    icon: BookOpen,
    path: "/tools/glossary",
    color: "bg-news-highlight/10 text-news-highlight"
  }
];

export const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold mb-1">Ferramentas</h1>
            <p className="text-primary-foreground/80">
              Calculadoras e recursos para profissionais de RH
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
                onClick={() => navigate(tool.path)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {tool.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-medium">
                    Acessar ferramenta →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border/50">
          <h2 className="font-semibold text-lg mb-3 text-foreground">
            Em Breve
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div>
                <p className="font-medium text-sm">Calculadora de FGTS</p>
                <p className="text-xs text-muted-foreground">Calcule depósitos e saques</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div>
                <p className="font-medium text-sm">Calendário Trabalhista</p>
                <p className="text-xs text-muted-foreground">Prazos e obrigações</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};