import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Info, TrendingUp, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { TerminationForm } from "@/features/termination/components/TerminationForm";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

export const TerminationCalculator = () => {
  const [result, setResult] = useState<{
    verbas: Record<string, number>;
    descontos: Record<string, number>;
    totalBruto: number;
    totalLiquido: number;
  } | null>(null);

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
              <div className="absolute inset-0 gradient-pink-purple rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-pink-purple rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calculadora de <span className="gradient-text">Rescisão</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Estime todos os valores da sua rescisão trabalhista de forma precisa
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form - 2 columns */}
          <div className="lg:col-span-2">
            <TerminationForm setResult={setResult} />
          </div>

          {/* Results - 3 columns */}
          <div className="lg:col-span-3">
            <Card className="glass border-2 border-white/40 shadow-premium-lg h-full">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
                  <div className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  Resultado do Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {result ? (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className="text-center py-8 glass border-2 border-pink-200 rounded-3xl">
                      <div className="w-16 h-16 gradient-pink-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium animate-pulse-glow">
                        <DollarSign className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        Valor Líquido a Receber
                      </p>
                      <p className="text-5xl font-extrabold gradient-text mb-1">
                        {formatCurrency(result.totalLiquido)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Já descontados INSS e IRRF</p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-6 border-2 border-gray-100 space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-pink-600" />
                        Detalhamento do Cálculo
                      </h3>

                      <div className="space-y-3">
                        {/* Verbas (Credits) */}
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Verbas Rescisórias</h4>
                          {Object.entries(result.verbas).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-700 font-medium">{key}</span>
                              <span className="font-bold text-lg text-green-600">
                                + {formatCurrency(value)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total Bruto */}
                        <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-xl border-2 border-blue-200">
                          <span className="font-bold text-gray-900">Total Bruto</span>
                          <span className="font-extrabold text-xl text-blue-700">
                            {formatCurrency(result.totalBruto)}
                          </span>
                        </div>

                        {/* Deductions */}
                        {Object.keys(result.descontos).length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Descontos</h4>
                            {Object.entries(result.descontos).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-700 font-medium">(-) {key}</span>
                                <span className="font-bold text-lg text-red-600">
                                  - {formatCurrency(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Net Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-pink-50 to-purple-50 px-4 rounded-xl border-2 border-pink-300 mt-4">
                          <span className="font-extrabold text-lg text-gray-900">Valor Líquido Total</span>
                          <span className="font-extrabold text-2xl text-pink-600">
                            {formatCurrency(result.totalLiquido)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-900">
                        <p className="font-bold mb-1">Importante:</p>
                        <p className="leading-relaxed">
                          Este é um cálculo estimado. Os valores exatos podem variar conforme acordos coletivos, convenções e particularidades do contrato de trabalho. Consulte sempre um profissional especializado.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg font-semibold mb-2">
                      Aguardando dados
                    </p>
                    <p className="text-gray-500">
                      Preencha os campos ao lado para calcular sua rescisão
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
