import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, Wallet, Clock, DollarSign, Gift, Calendar, BookOpen, Sparkles, ArrowRight, Calculator } from "lucide-react";

const calculators = [
  {
    id: "vacation",
    title: "Calculadora de Férias",
    description: "Calcule valores de férias e 1/3 constitucional para seus períodos",
    icon: TrendingUp,
    path: "/tools/vacation-calculator",
    gradient: "gradient-red-pink",
    color: "red"
  },
  {
    id: "termination",
    title: "Calculadora de Rescisão",
    description: "Calcule os valores de sua rescisão trabalhista",
    icon: FileText,
    path: "/tools/termination-calculator",
    gradient: "gradient-pink-purple",
    color: "pink"
  },
  {
    id: "fgts",
    title: "Calculadora de FGTS",
    description: "Calcule depósitos mensais e acumulado do FGTS",
    icon: Wallet,
    path: "/tools/fgts-calculator",
    gradient: "gradient-blue-cyan",
    color: "blue"
  },
  {
    id: "overtime",
    title: "Horas Extras",
    description: "Calcule horas extras, adicional noturno e DSR",
    icon: Clock,
    path: "/tools/overtime-calculator",
    gradient: "gradient-yellow",
    color: "yellow"
  },
  {
    id: "net-salary",
    title: "Salário Líquido",
    description: "Calcule quanto você realmente receberá após descontos",
    icon: DollarSign,
    path: "/tools/net-salary-calculator",
    gradient: "gradient-green",
    color: "green"
  },
  {
    id: "thirteenth",
    title: "13º Salário",
    description: "Calcule de forma integral, proporcional ou resignatário",
    icon: Gift,
    path: "/tools/thirteenth-salary-calculator",
    gradient: "gradient-warm",
    color: "orange"
  }
];

const resources = [
  {
    id: "calendar",
    title: "Calendário Trabalhista",
    description: "Acompanhe prazos do eSocial, FGTS, DCT e outras obrigações mensais",
    icon: Calendar,
    path: "/tools/work-calendar",
    gradient: "gradient-purple-blue"
  },
  {
    id: "glossary",
    title: "Glossário Trabalhista",
    description: "Dicionário completo com termos e definições da legislação",
    icon: BookOpen,
    path: "/tools/glossary",
    gradient: "gradient-pink-purple"
  }
];

export const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Premium Header */}
      <div className="relative pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-block mb-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-purple-blue rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-purple-blue rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <Calculator className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Ferramentas <span className="gradient-text">Trabalhistas</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Calculadoras profissionais e recursos essenciais para simplificar sua rotina de CLT
          </p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        {/* Calculators Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
            <div className="w-10 h-10 gradient-blue-cyan rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            Calculadoras
            <span className="glass border border-purple-300 text-purple-700 text-sm font-bold px-3 py-1.5 rounded-xl">
              {calculators.length} ferramentas
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="glass border-2 border-white/40 cursor-pointer hover-lift group overflow-hidden relative transition-premium shadow-premium animate-fade-in"
                  onClick={() => navigate(tool.path)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 ${tool.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-premium animate-float`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-extrabold text-xl mb-3 text-gray-900 group-hover:gradient-text transition-all">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center font-bold text-sm gradient-text-blue group-hover:translate-x-2 transition-transform">
                      Acessar ferramenta
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
            <div className="w-10 h-10 gradient-pink-purple rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            Recursos Adicionais
            <span className="glass border border-pink-300 text-pink-700 text-sm font-bold px-3 py-1.5 rounded-xl">
              {resources.length} recursos
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="glass border-2 border-white/40 cursor-pointer hover-lift group overflow-hidden relative transition-premium shadow-premium animate-fade-in"
                  onClick={() => navigate(tool.path)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <CardContent className="p-8 flex items-center gap-6 relative z-10">
                    <div className={`w-20 h-20 ${tool.gradient} rounded-2xl flex items-center justify-center shadow-premium animate-float flex-shrink-0`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-2xl mb-3 text-gray-900 group-hover:gradient-text transition-all">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center font-bold gradient-text-blue group-hover:translate-x-2 transition-transform">
                        Acessar agora
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Premium CTA - Celeste */}
        <Card className="glass-dark border-2 border-white/20 shadow-premium-lg overflow-hidden relative group">
          <div className="absolute inset-0 gradient-animate opacity-90" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 relative z-10 text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl animate-float">
              <img
                src="/celeste.png"
                alt="Celeste"
                className="w-20 h-20 rounded-full"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-extrabold mb-3">
                Precisa de ajuda personalizada?
              </h3>
              <p className="text-white/95 text-lg mb-6 leading-relaxed">
                Converse com <strong>Celeste</strong>, nossa assistente de IA especializada em CLT.
                Tire dúvidas complexas, faça cálculos detalhados e obtenha orientações confiáveis em segundos.
              </p>
              <Button
                className="bg-white text-purple-700 hover:bg-gray-100 shadow-xl px-8 py-6 text-lg font-bold rounded-xl hover-lift"
                onClick={() => navigate("/ai-agent")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Conversar com Celeste Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
