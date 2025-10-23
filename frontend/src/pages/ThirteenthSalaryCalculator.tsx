import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Calculator, DollarSign, Info, Sparkles, TrendingUp, Award, Calendar } from "lucide-react";
import { toast } from "sonner";
import { calculateINSS, calculateIRRF } from "@/lib/calculations";

export const ThirteenthSalaryCalculator = () => {
  const [salary, setSalary] = useState("");
  const [calculationType, setCalculationType] = useState<"integral" | "proporcional" | "rescisao">("integral");
  const [monthsWorked, setMonthsWorked] = useState("12");
  const [dependents, setDependents] = useState("0");
  const [result, setResult] = useState<{
    gross13th: number;
    inss: number;
    irrf: number;
    net13th: number;
    monthsWorked: number;
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

  const calculate13th = () => {
    // Parse formatted currency back to number
    const salaryValue = parseFloat(salary.replace(/\./g, "").replace(",", "."));
    const dependentsValue = parseInt(dependents);
    const monthsWorkedValue = parseInt(monthsWorked);

    if (!salaryValue || salaryValue <= 0) {
      toast.error("Digite um salário válido");
      return;
    }

    if (calculationType !== "integral" && (!monthsWorkedValue || monthsWorkedValue <= 0 || monthsWorkedValue > 12)) {
      toast.error("Digite um número válido de meses (1-12)");
      return;
    }

    let gross13th = salaryValue;
    let actualMonthsWorked = 12;

    if (calculationType === "proporcional" || calculationType === "rescisao") {
      actualMonthsWorked = monthsWorkedValue;
      gross13th = (salaryValue / 12) * monthsWorkedValue;
    }

    const inss = calculateINSS(gross13th);
    const irrfBase = gross13th - inss;
    const irrf = calculateIRRF(irrfBase, dependentsValue);
    const net13th = gross13th - inss - irrf;

    setResult({
      gross13th,
      inss,
      irrf,
      net13th,
      monthsWorked: actualMonthsWorked,
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
              <div className="absolute inset-0 gradient-warm rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-warm rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calculadora de <span className="gradient-text-warm">13º Salário</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Calcule o 13º salário integral, proporcional ou rescisório
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
                  <div className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  Dados para Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Salary Input */}
                <div className="space-y-3">
                  <Label htmlFor="salary" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
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
                      className="h-14 pl-12 text-lg font-bold border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Informe o valor do salário mensal
                  </p>
                </div>

                {/* Calculation Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-orange-600" />
                    Tipo de Cálculo
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={calculationType === "integral" ? "default" : "outline"}
                      onClick={() => setCalculationType("integral")}
                      className={`h-12 font-bold ${
                        calculationType === "integral"
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0"
                          : "border-2 border-orange-200 hover:border-orange-400"
                      }`}
                    >
                      Integral
                    </Button>
                    <Button
                      type="button"
                      variant={calculationType === "proporcional" ? "default" : "outline"}
                      onClick={() => setCalculationType("proporcional")}
                      className={`h-12 font-bold ${
                        calculationType === "proporcional"
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0"
                          : "border-2 border-orange-200 hover:border-orange-400"
                      }`}
                    >
                      Proporcional
                    </Button>
                    <Button
                      type="button"
                      variant={calculationType === "rescisao" ? "default" : "outline"}
                      onClick={() => setCalculationType("rescisao")}
                      className={`h-12 font-bold ${
                        calculationType === "rescisao"
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0"
                          : "border-2 border-orange-200 hover:border-orange-400"
                      }`}
                    >
                      Rescisão
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Selecione o tipo de cálculo do 13º salário
                  </p>
                </div>

                {/* Months Worked (only for proporcional or rescisao) */}
                {(calculationType === "proporcional" || calculationType === "rescisao") && (
                  <div className="space-y-3">
                    <Label htmlFor="monthsWorked" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      Meses Trabalhados no Ano
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="monthsWorked"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="12"
                      value={monthsWorked}
                      onChange={(e) => setMonthsWorked(e.target.value)}
                      className="h-14 text-lg font-bold border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      Quantidade de meses trabalhados no ano (1 a 12)
                    </p>
                  </div>
                )}

                {/* Dependents Input */}
                <div className="space-y-3">
                  <Label htmlFor="dependents" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    Número de Dependentes
                  </Label>
                  <Input
                    id="dependents"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="h-14 text-lg font-bold border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Número de dependentes para cálculo do IRRF
                  </p>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={calculate13th}
                  className="w-full gradient-warm hover:opacity-90 text-white h-16 text-lg font-bold shadow-premium hover-lift rounded-xl mt-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calcular 13º Salário
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
                    <div className="text-center py-8 glass border-2 border-orange-200 rounded-3xl">
                      <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium animate-pulse-glow">
                        <Gift className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        13º Salário Líquido
                      </p>
                      <p className="text-5xl font-extrabold gradient-text-warm mb-1">
                        {formatCurrency(result.net13th)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {result.monthsWorked === 12 ? "Valor integral" : `Proporcional a ${result.monthsWorked} meses`}
                      </p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-6 border-2 border-gray-100 space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-orange-600" />
                        Detalhamento do Cálculo
                      </h3>

                      <div className="space-y-3">
                        {/* Gross 13th */}
                        <div className="flex justify-between items-center py-3 bg-orange-50 px-4 rounded-xl border-2 border-orange-200">
                          <span className="font-bold text-gray-900">13º Salário Bruto</span>
                          <span className="font-extrabold text-xl text-orange-700">
                            {formatCurrency(result.gross13th)}
                          </span>
                        </div>

                        {/* Deductions */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">(-) INSS</span>
                          <span className="font-bold text-lg text-red-600">
                            - {formatCurrency(result.inss)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">(-) IRRF</span>
                          <span className="font-bold text-lg text-red-600">
                            - {formatCurrency(result.irrf)}
                          </span>
                        </div>

                        {/* Net Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-orange-50 to-pink-50 px-4 rounded-xl border-2 border-orange-300 mt-4">
                          <span className="font-extrabold text-lg text-gray-900">13º Salário Líquido</span>
                          <span className="font-extrabold text-2xl text-orange-600">
                            {formatCurrency(result.net13th)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-900">
                        <p className="font-bold mb-1">Sobre o cálculo:</p>
                        <p className="leading-relaxed">
                          O 13º salário integral equivale a 1 salário completo. O proporcional é calculado como (salário ÷ 12) × meses trabalhados. Consideram-se meses completos aqueles com 15 dias ou mais de trabalho. Os descontos de INSS e IRRF são aplicados sobre o valor bruto.
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
                      Preencha os campos ao lado para calcular seu 13º salário
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
