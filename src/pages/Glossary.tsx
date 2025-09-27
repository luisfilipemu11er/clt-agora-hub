import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

// Mock glossary data
export const glossaryTerms = [
  {
    term: "Abono Pecuniário",
    definition: "Conversão de 1/3 das férias em dinheiro, permitida pela CLT.",
    example: "Funcionário com 30 dias de férias pode vender 10 dias e gozar 20 dias."
  },
  {
    term: "Aviso Prévio",
    definition: "Comunicação antecipada do término do contrato de trabalho.",
    example: "Empregador deve comunicar com 30 dias de antecedência ou pagar o período."
  },
  {
    term: "CLT",
    definition: "Consolidação das Leis do Trabalho - principal legislação trabalhista brasileira.",
    example: "Decreto-Lei nº 5.452 de 1943, que regulamenta as relações de trabalho."
  },
  {
    term: "eSocial", 
    definition: "Sistema de escrituração digital das obrigações fiscais, previdenciárias e trabalhistas.",
    example: "Todas as informações trabalhistas devem ser enviadas pelo eSocial mensalmente."
  },
  {
    term: "FGTS",
    definition: "Fundo de Garantia do Tempo de Serviço - depósito mensal de 8% do salário.",
    example: "Salário de R$ 3.000 gera depósito de R$ 240 no FGTS."
  },
  {
    term: "Insalubridade",
    definition: "Adicional por exposição a agentes nocivos à saúde.",
    example: "Trabalho com produtos químicos pode gerar adicional de 10%, 20% ou 40%."
  },
  {
    term: "Jornada de Trabalho",
    definition: "Período diário de trabalho, limitado a 8 horas diárias ou 44 semanais.",
    example: "Segunda a sexta: 8h48min por dia para completar 44h semanais."
  },
  {
    term: "Rescisão",
    definition: "Término do contrato de trabalho com pagamento das verbas devidas.",
    example: "Demissão sem justa causa gera direito a aviso prévio, férias e 13º salário."
  }
];

export const Glossary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const filteredTerms = glossaryTerms.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLetter = selectedLetter === null || 
      item.term.charAt(0).toUpperCase() === selectedLetter;
    
    return matchesSearch && matchesLetter;
  });

  const availableLetters = new Set(
    glossaryTerms.map(item => item.term.charAt(0).toUpperCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/tools")}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Glossário Trabalhista</h1>
              <p className="text-primary-foreground/80">
                Termos e definições da legislação trabalhista
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Search */}
        <Card className="shadow-card bg-gradient-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar termos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alphabet Filter */}
        <Card className="shadow-card bg-gradient-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLetter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(null)}
              >
                Todas
              </Button>
              {alphabet.map(letter => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  disabled={!availableLetters.has(letter)}
                  className="w-10 h-10 p-0"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms List */}
        <div className="space-y-4">
          {filteredTerms.map((item, index) => (
            <Card key={index} className="shadow-card bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">
                  {item.term}
                </h3>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-foreground">Definição:</h4>
                  <p className="text-foreground/80 leading-relaxed">
                    {item.definition}
                  </p>
                </div>

                <div className="p-4 bg-news-highlight/5 rounded-lg border border-news-highlight/20">
                  <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-news-highlight" />
                    Exemplo Prático:
                  </h4>
                  <p className="text-foreground/90 text-sm">
                    {item.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum termo encontrado para sua busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};