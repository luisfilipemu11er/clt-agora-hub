import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  Shield,
  Zap,
  Calculator,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "IA Inteligente",
      description: "Assistente especializada com respostas personalizadas em tempo real",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "100% Confiável",
      description: "Baseado na legislação trabalhista brasileira atualizada",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Resultados Instantâneos",
      description: "Cálculos precisos e rápidos para todas suas necessidades",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const tools = [
    {
      icon: TrendingUp,
      title: "Notícias Trabalhistas",
      description: "Últimas atualizações e mudanças na legislação",
      gradient: "gradient-purple-blue",
      path: "/news-feed"
    },
    {
      icon: Calculator,
      title: "Calculadora de Férias",
      description: "Calcule férias vencidas, próximas e abono",
      gradient: "gradient-red-pink",
      path: "/tools/vacation-calculator"
    },
    {
      icon: Calendar,
      title: "Calendário Trabalhista",
      description: "Prazos do eSocial, FGTS e obrigações mensais",
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
      path: "/tools/work-calendar"
    },
    {
      icon: BookOpen,
      title: "Glossário Trabalhista",
      description: "Dicionário completo de termos trabalhistas",
      gradient: "gradient-pink-purple",
      path: "/tools/glossary"
    }
  ];


  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Hero Section with Premium Design */}
      <div className="relative pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fade-in border border-white/40">
            <Award className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Plataforma #1 em Direito Trabalhista
            </span>
          </div>

          {/* Main Title with Gradient */}
          <h1 className="text-7xl font-extrabold mb-6 animate-fade-in-delay-1 leading-tight">
            Descomplicando a{" "}
            <span className="gradient-text block mt-2">CLT para Você</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 animate-fade-in-delay-2 max-w-3xl mx-auto leading-relaxed">
            Ferramentas inteligentes, calculadoras precisas e IA especializada para resolver
            <span className="font-semibold text-gray-800"> todas suas dúvidas trabalhistas</span> de forma simples e rápida
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-3xl mx-auto mb-8 animate-fade-in-delay-3">
            <div
              className="relative cursor-pointer glass rounded-2xl p-2 shadow-premium hover:shadow-premium-lg transition-premium group"
              onClick={() => navigate("/ai-agent")}
            >
              <div className="flex items-center">
                <Search className="absolute left-6 w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
                <Input
                  placeholder="Pergunte qualquer coisa sobre CLT, direitos trabalhistas, cálculos..."
                  className="pl-14 pr-24 h-14 text-base border-none focus-visible:ring-0 bg-transparent text-gray-800 placeholder:text-gray-600 font-medium"
                  readOnly
                />
                <div className="absolute right-3 gradient-purple-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg animate-pulse-glow">
                  <Sparkles className="w-4 h-4" />
                  AI
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 animate-fade-in-delay-3">
            <Button
              className="gradient-purple-blue hover:opacity-90 text-white px-10 py-6 text-lg font-bold shadow-premium hover-lift rounded-xl"
              onClick={() => navigate("/ai-agent")}
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Começar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-2 border-purple-300 text-purple-700 hover:bg-white hover:border-purple-400 px-10 py-6 text-lg font-bold rounded-xl hover-lift shadow-lg"
              onClick={() => navigate("/tools")}
            >
              Ver Ferramentas
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold mb-4">
            Por que escolher o <span className="gradient-text">CLT Agora</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tecnologia de ponta combinada com conhecimento especializado
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass border border-white/40 hover-lift overflow-hidden group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <CardContent className="p-8 text-center relative z-10">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-premium animate-float`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold mb-4">
            Ferramentas <span className="gradient-text">Poderosas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa em um só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="glass border border-white/40 cursor-pointer hover-lift group overflow-hidden relative"
              onClick={() => navigate(tool.path)}
            >
              <div className={`absolute inset-0 ${tool.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              <CardContent className="p-8 flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 ${tool.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:gradient-text transition-all">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-purple-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Tools Button */}
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="glass border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg font-bold rounded-xl hover-lift"
            onClick={() => navigate("/tools")}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Ver Todas as Ferramentas
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Premium CTA Section - Celeste */}
      <div className="relative max-w-5xl mx-auto px-6 pb-20">
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
                Conheça Celeste, sua assistente IA
              </h3>
              <p className="text-white/95 text-lg mb-6 leading-relaxed">
                Especializada em CLT e legislação trabalhista brasileira.
                Tire dúvidas complexas, faça cálculos detalhados e obtenha orientações
                confiáveis em segundos.
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