import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Calculator, Calendar, DollarSign, Info, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const FGTSCalculator = () => {
  const [salary, setSalary] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [result, setResult] = useState<{
    monthlyDeposit: number;
    totalDeposit: number;
    months: number;
  } | null>(null);

  // Format currency as user types
  const formatCurrencyInput = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    // Convert to number and divide by 100 to get decimal
    const numberValue = parseInt(numbers) / 100;

    // Format as Brazilian currency
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setSalary(formatted);
  };

  const calculateFGTS = () => {
    // Parse formatted currency back to number
    const salaryValue = parseFloat(salary.replace(/\./g, "").replace(",", "."));

    if (!salaryValue || salaryValue <= 0) {
      toast.error("Digite um salário válido");
      return;
    }

    if (!admissionDate) {
      toast.error("Digite a data de admissão");
      return;
    }

    const monthlyDeposit = salaryValue * 0.08;
    const admission = new Date(admissionDate);
    const today = new Date();
    const months = Math.floor((today.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const totalDeposit = monthlyDeposit * months;

    setResult({
      monthlyDeposit,
      totalDeposit,
      months,
    });

    toast.success("Cálculo realizado com sucesso!");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

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
              <div className="absolute inset-0 gradient-blue-cyan rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-blue-cyan rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <Wallet className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calculadora de <span className="gradient-text-blue">FGTS</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Calcule depósitos mensais e acumulado do FGTS de forma precisa
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="glass border-2 border-white/40 shadow-premium-lg">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
                  <div className="w-10 h-10 gradient-blue-cyan rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  Dados para Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Salary Input */}
                <div className="space-y-3">
                  <Label htmlFor="salary" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Salário Bruto Mensal
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                      R$
                    </span>
                    <Input
                      id="salary"
                      type="text"
                      placeholder="0,00"
                      value={salary}
                      onChange={handleSalaryChange}
                      className="h-14 pl-12 text-lg font-bold border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Digite o valor do salário bruto mensal
                  </p>
                </div>

                {/* Date Input */}
                <div className="space-y-3">
                  <Label htmlFor="admissionDate" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Data de Admissão
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="h-14 text-base font-semibold border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Informe a data de início no emprego
                  </p>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={calculateFGTS}
                  className="w-full gradient-blue-cyan hover:opacity-90 text-white h-16 text-lg font-bold shadow-premium hover-lift rounded-xl mt-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calcular FGTS
                  <Calculator className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
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
                    <div className="text-center py-8 glass border-2 border-blue-200 rounded-3xl">
                      <div className="w-16 h-16 gradient-blue-cyan rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium animate-pulse-glow">
                        <Wallet className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        Total Acumulado FGTS
                      </p>
                      <p className="text-5xl font-extrabold gradient-text-blue mb-1">
                        {formatCurrency(result.totalDeposit)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Estimativa baseada em {result.months} meses</p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-6 border-2 border-gray-100 space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Detalhamento do Cálculo
                      </h3>

                      <div className="space-y-3">
                        {/* Monthly Deposit */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">Depósito Mensal (8%)</span>
                          <span className="font-bold text-lg text-gray-900">
                            {formatCurrency(result.monthlyDeposit)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">Meses Trabalhados</span>
                          <span className="font-bold text-lg text-blue-600">
                            {result.months} meses
                          </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 rounded-xl border-2 border-blue-300 mt-4">
                          <span className="font-extrabold text-lg text-gray-900">Total Acumulado</span>
                          <span className="font-extrabold text-2xl text-blue-600">
                            {formatCurrency(result.totalDeposit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-bold mb-1">Sobre o cálculo:</p>
                        <p className="leading-relaxed">
                          O FGTS corresponde a 8% do salário bruto mensal depositado pelo empregador. O cálculo é uma estimativa baseada no período informado, sem considerar variações salariais, 13º salário ou férias.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
                      <Calculator className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg font-semibold mb-2">
                      Aguardando dados
                    </p>
                    <p className="text-gray-500">
                      Preencha os campos ao lado para calcular seu FGTS
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
