import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Info, Filter, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const eventTypes = ["Todos", "FGTS", "eSocial", "INSS", "IRRF", "CAGED", "RAIS"];

const allEvents = [
  // Janeiro 2025
  { id: 1, title: "FGTS - Dezembro/2024", date: "07/01/2025", month: "Janeiro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a dezembro/2024. O depósito deve ser feito até o dia 7 do mês seguinte." },
  { id: 2, title: "eSocial - Folha de Pagamento", date: "15/01/2025", month: "Janeiro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de dezembro/2024 ao eSocial." },
  { id: 3, title: "INSS - GPS", date: "20/01/2025", month: "Janeiro", types: ["INSS"], description: "Vencimento da GPS (Guia da Previdência Social) referente a dezembro/2024." },
  { id: 4, title: "IRRF - Fonte", date: "22/01/2025", month: "Janeiro", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de dezembro/2024." },

  // Fevereiro 2025
  { id: 5, title: "FGTS - Janeiro/2025", date: "07/02/2025", month: "Fevereiro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a janeiro/2025." },
  { id: 6, title: "eSocial - Folha de Pagamento", date: "15/02/2025", month: "Fevereiro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de janeiro/2025 ao eSocial." },
  { id: 7, title: "INSS - GPS", date: "20/02/2025", month: "Fevereiro", types: ["INSS"], description: "Vencimento da GPS referente a janeiro/2025." },
  { id: 8, title: "IRRF - Fonte", date: "20/02/2025", month: "Fevereiro", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de janeiro/2025." },

  // Março 2025
  { id: 9, title: "FGTS - Fevereiro/2025", date: "07/03/2025", month: "Março", types: ["FGTS"], description: "Recolhimento do FGTS relativo a fevereiro/2025." },
  { id: 10, title: "RAIS - Ano Base 2024", date: "21/03/2025", month: "Março", types: ["RAIS"], description: "Prazo final para entrega da RAIS (Relação Anual de Informações Sociais) ano-base 2024." },
  { id: 11, title: "eSocial - Folha de Pagamento", date: "15/03/2025", month: "Março", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de fevereiro/2025 ao eSocial." },
  { id: 12, title: "INSS - GPS", date: "20/03/2025", month: "Março", types: ["INSS"], description: "Vencimento da GPS referente a fevereiro/2025." },

  // Abril 2025
  { id: 13, title: "FGTS - Março/2025", date: "07/04/2025", month: "Abril", types: ["FGTS"], description: "Recolhimento do FGTS relativo a março/2025." },
  { id: 14, title: "eSocial - Folha de Pagamento", date: "15/04/2025", month: "Abril", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de março/2025 ao eSocial." },
  { id: 15, title: "INSS - GPS", date: "22/04/2025", month: "Abril", types: ["INSS"], description: "Vencimento da GPS referente a março/2025." },
  { id: 16, title: "IRRF - Fonte", date: "22/04/2025", month: "Abril", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de março/2025." },

  // Maio 2025
  { id: 17, title: "FGTS - Abril/2025", date: "07/05/2025", month: "Maio", types: ["FGTS"], description: "Recolhimento do FGTS relativo a abril/2025." },
  { id: 18, title: "eSocial - Folha de Pagamento", date: "15/05/2025", month: "Maio", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de abril/2025 ao eSocial." },
  { id: 19, title: "INSS - GPS", date: "20/05/2025", month: "Maio", types: ["INSS"], description: "Vencimento da GPS referente a abril/2025." },
  { id: 20, title: "IRRF - Fonte", date: "22/05/2025", month: "Maio", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de abril/2025." },

  // Junho 2025
  { id: 21, title: "FGTS - Maio/2025", date: "09/06/2025", month: "Junho", types: ["FGTS"], description: "Recolhimento do FGTS relativo a maio/2025." },
  { id: 22, title: "eSocial - Folha de Pagamento", date: "15/06/2025", month: "Junho", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de maio/2025 ao eSocial." },
  { id: 23, title: "INSS - GPS", date: "20/06/2025", month: "Junho", types: ["INSS"], description: "Vencimento da GPS referente a maio/2025." },
  { id: 24, title: "IRRF - Fonte", date: "20/06/2025", month: "Junho", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de maio/2025." },

  // Julho 2025
  { id: 25, title: "FGTS - Junho/2025", date: "07/07/2025", month: "Julho", types: ["FGTS"], description: "Recolhimento do FGTS relativo a junho/2025." },
  { id: 26, title: "eSocial - Folha de Pagamento", date: "15/07/2025", month: "Julho", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de junho/2025 ao eSocial." },
  { id: 27, title: "INSS - GPS", date: "22/07/2025", month: "Julho", types: ["INSS"], description: "Vencimento da GPS referente a junho/2025." },
  { id: 28, title: "IRRF - Fonte", date: "22/07/2025", month: "Julho", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de junho/2025." },

  // Agosto 2025
  { id: 29, title: "FGTS - Julho/2025", date: "07/08/2025", month: "Agosto", types: ["FGTS"], description: "Recolhimento do FGTS relativo a julho/2025." },
  { id: 30, title: "eSocial - Folha de Pagamento", date: "15/08/2025", month: "Agosto", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de julho/2025 ao eSocial." },
  { id: 31, title: "INSS - GPS", date: "20/08/2025", month: "Agosto", types: ["INSS"], description: "Vencimento da GPS referente a julho/2025." },
  { id: 32, title: "IRRF - Fonte", date: "22/08/2025", month: "Agosto", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de julho/2025." },

  // Setembro 2025
  { id: 33, title: "FGTS - Agosto/2025", date: "05/09/2025", month: "Setembro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a agosto/2025." },
  { id: 34, title: "eSocial - Folha de Pagamento", date: "15/09/2025", month: "Setembro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de agosto/2025 ao eSocial." },
  { id: 35, title: "INSS - GPS", date: "22/09/2025", month: "Setembro", types: ["INSS"], description: "Vencimento da GPS referente a agosto/2025." },
  { id: 36, title: "IRRF - Fonte", date: "22/09/2025", month: "Setembro", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de agosto/2025." },

  // Outubro 2025
  { id: 37, title: "FGTS - Setembro/2025", date: "07/10/2025", month: "Outubro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a setembro/2025." },
  { id: 38, title: "eSocial - Folha de Pagamento", date: "15/10/2025", month: "Outubro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de setembro/2025 ao eSocial." },
  { id: 39, title: "INSS - GPS", date: "20/10/2025", month: "Outubro", types: ["INSS"], description: "Vencimento da GPS referente a setembro/2025." },
  { id: 40, title: "IRRF - Fonte", date: "22/10/2025", month: "Outubro", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de setembro/2025." },

  // Novembro 2025
  { id: 41, title: "FGTS - Outubro/2025", date: "07/11/2025", month: "Novembro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a outubro/2025." },
  { id: 42, title: "eSocial - Folha de Pagamento", date: "17/11/2025", month: "Novembro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de outubro/2025 ao eSocial." },
  { id: 43, title: "INSS - GPS", date: "20/11/2025", month: "Novembro", types: ["INSS"], description: "Vencimento da GPS referente a outubro/2025." },
  { id: 44, title: "IRRF - Fonte", date: "20/11/2025", month: "Novembro", types: ["IRRF"], description: "Recolhimento do IRRF retido na fonte sobre salários de outubro/2025." },

  // Dezembro 2025
  { id: 45, title: "FGTS - Novembro/2025", date: "05/12/2025", month: "Dezembro", types: ["FGTS"], description: "Recolhimento do FGTS relativo a novembro/2025." },
  { id: 46, title: "13º Salário - 1ª Parcela", date: "30/11/2025", month: "Dezembro", types: ["eSocial"], description: "Prazo máximo para pagamento da primeira parcela do 13º salário." },
  { id: 47, title: "13º Salário - 2ª Parcela", date: "20/12/2025", month: "Dezembro", types: ["eSocial"], description: "Prazo máximo para pagamento da segunda parcela do 13º salário." },
  { id: 48, title: "eSocial - Folha de Pagamento", date: "15/12/2025", month: "Dezembro", types: ["eSocial"], description: "Envio dos eventos periódicos de folha de pagamento de novembro/2025 ao eSocial." },
  { id: 49, title: "INSS - GPS", date: "22/12/2025", month: "Dezembro", types: ["INSS"], description: "Vencimento da GPS referente a novembro/2025." },
];

export const WorkCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState("Outubro");
  const [selectedType, setSelectedType] = useState("Todos");

  // Filter events based on month and type
  const filteredEvents = allEvents.filter((event) => {
    const matchesMonth = event.month === selectedMonth;
    const matchesType = selectedType === "Todos" || event.types.includes(selectedType);
    return matchesMonth && matchesType;
  });

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
                <Calendar className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calendário <span className="gradient-text">Trabalhista 2025</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Acompanhe prazos do eSocial, FGTS, DCT e outras obrigações mensais
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        {/* Filters Card */}
        <Card className="glass border-2 border-white/40 shadow-premium-lg mb-8">
          <CardHeader className="border-b border-gray-100 pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
              <div className="w-10 h-10 gradient-purple-blue rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Mês
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-14 border-2 border-purple-200 focus:border-purple-400 rounded-xl font-semibold">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month} className="font-medium">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Tipo de Obrigação
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-14 border-2 border-purple-200 focus:border-purple-400 rounded-xl font-semibold">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type} className="font-medium">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
            <Card key={event.id} className="glass border-2 border-white/40 shadow-premium hover-lift transition-premium animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  {event.date && (
                    <div className="flex-shrink-0">
                      <div className="glass border-2 border-purple-200 rounded-2xl p-4 text-center min-w-[100px]">
                        <div className="w-12 h-12 gradient-purple-blue rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-bold text-purple-600">{event.date}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-extrabold text-xl text-gray-900">{event.title}</h3>
                      {event.types.map((type, idx) => (
                        <Badge
                          key={idx}
                          className={
                            type === "FGTS"
                              ? "glass border-2 border-green-300 bg-green-50 text-green-700 hover:bg-green-100 font-bold px-3 py-1"
                              : type === "eSocial"
                              ? "glass border-2 border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold px-3 py-1"
                              : type === "INSS"
                              ? "glass border-2 border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1"
                              : type === "IRRF"
                              ? "glass border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-bold px-3 py-1"
                              : type === "RAIS"
                              ? "glass border-2 border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-bold px-3 py-1"
                              : "glass border-2 border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-bold px-3 py-1"
                          }
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <Card className="glass border-2 border-white/40 shadow-premium-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  Nenhuma obrigação encontrada
                </h3>
                <p className="text-gray-500">
                  Não há obrigações trabalhistas para os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações Importantes */}
          <Card className="glass border-2 border-blue-300 bg-blue-50/50 shadow-premium-lg">
            <CardHeader className="border-b border-blue-200 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-extrabold text-blue-700">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm text-gray-800">
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Os prazos podem sofrer alterações. Sempre conferir o Diário Oficial.</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Os prazos e vencimentos para obrigações que caem em finais de semana ou feriados são prorrogados para o primeiro dia útil.</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Verifique se há extensões de prazo para sua categoria específica.</span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Não atendimento aos prazos pode gerar multas e penalidades.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
