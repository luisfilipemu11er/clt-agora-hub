import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BookOpen, FileText } from "lucide-react";

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
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ferramentas</h1>
        <p className="text-muted-foreground">
          Calculadoras e recursos para simplificar sua rotina.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card flex flex-col"
              onClick={() => navigate(tool.path)}
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className={`w-14 h-14 rounded-lg ${tool.color} flex items-center justify-center mb-5`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="font-semibold text-xl mb-2 text-foreground">
                  {tool.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {tool.description}
                </p>
                
                <div className="flex items-center text-primary text-sm font-medium mt-auto">
                  Acessar ferramenta →
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Em Breve</h2>
        <div className="p-6 bg-muted/30 rounded-lg border border-border/50">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Calculadora de FGTS</p>
                <p className="text-xs text-muted-foreground">Calcule depósitos e saques</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Calendário Trabalhista</p>
                <p className="text-xs text-muted-foreground">Prazos e obrigações</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};