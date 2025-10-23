import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calculator, Info, Sparkles, TrendingUp, Award, FileText } from "lucide-react";
import { toast } from "sonner";
import { calculateINSS, calculateIRRF } from "@/lib/calculations";

export const NetSalaryCalculator = () => {
  const [salary, setSalary] = useState("");
  const [dependents, setDependents] = useState("0");
  const [transportVoucher, setTransportVoucher] = useState(false);
  const [otherDiscounts, setOtherDiscounts] = useState("");
  const [result, setResult] = useState<{
    grossSalary: number;
    inss: number;
    irrf: number;
    transport: number;
    otherDiscounts: number;
    netSalary: number;
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

  const handleOtherDiscountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setOtherDiscounts(formatted);
  };

  const calculateNetSalary = () => {
    // Parse formatted currency back to number
    const salaryValue = parseFloat(salary.replace(/\./g, "").replace(",", "."));
    const dependentsValue = parseInt(dependents);
    const otherDiscountsValue = otherDiscounts
      ? parseFloat(otherDiscounts.replace(/\./g, "").replace(",", "."))
      : 0;

    if (!salaryValue || salaryValue <= 0) {
      toast.error("Digite um salário válido");
      return;
    }

    const inss = calculateINSS(salaryValue);
    const irrfBase = salaryValue - inss;
    const irrf = calculateIRRF(irrfBase, dependentsValue);
    const transport = transportVoucher ? salaryValue * 0.06 : 0;
    const netSalary = salaryValue - inss - irrf - transport - otherDiscountsValue;

    setResult({
      grossSalary: salaryValue,
      inss,
      irrf,
      transport,
      otherDiscounts: otherDiscountsValue,
      netSalary,
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
              <div className="absolute inset-0 gradient-green rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-green rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calculadora de <span className="gradient-text-green">Salário Líquido</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Descubra quanto você realmente vai receber após todos os descontos
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
                  <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  Dados para Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Salary Input */}
                <div className="space-y-3">
                  <Label htmlFor="salary" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
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
                      className="h-14 pl-12 text-lg font-bold border-2 border-green-200 focus:border-green-400 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Informe o valor do salário bruto mensal
                  </p>
                </div>

                {/* Dependents Input */}
                <div className="space-y-3">
                  <Label htmlFor="dependents" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    Número de Dependentes
                  </Label>
                  <Input
                    id="dependents"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="h-14 text-lg font-bold border-2 border-green-200 focus:border-green-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Número de dependentes para cálculo do IRRF
                  </p>
                </div>

                {/* Transport Voucher Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <input
                    type="checkbox"
                    id="transport-voucher"
                    className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
                    checked={transportVoucher}
                    onChange={(e) => setTransportVoucher(e.target.checked)}
                  />
                  <Label htmlFor="transport-voucher" className="text-sm font-semibold cursor-pointer text-gray-700">
                    Desconto Vale-Transporte (6%)
                  </Label>
                </div>

                {/* Other Discounts Input */}
                <div className="space-y-3">
                  <Label htmlFor="otherDiscounts" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Outros Descontos
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                      R$
                    </span>
                    <Input
                      id="otherDiscounts"
                      type="text"
                      placeholder="0,00"
                      value={otherDiscounts}
                      onChange={handleOtherDiscountsChange}
                      className="h-14 pl-12 text-lg font-bold border-2 border-green-200 focus:border-green-400 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Ex: plano de saúde, empréstimos, pensão alimentícia, etc
                  </p>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={calculateNetSalary}
                  className="w-full gradient-green hover:opacity-90 text-white h-16 text-lg font-bold shadow-premium hover-lift rounded-xl mt-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calcular Salário Líquido
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
                    <div className="text-center py-8 glass border-2 border-green-200 rounded-3xl">
                      <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium animate-pulse-glow">
                        <DollarSign className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        Salário Líquido a Receber
                      </p>
                      <p className="text-5xl font-extrabold gradient-text-green mb-1">
                        {formatCurrency(result.netSalary)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Valor após todos os descontos</p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-6 border-2 border-gray-100 space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-green-600" />
                        Detalhamento do Cálculo
                      </h3>

                      <div className="space-y-3">
                        {/* Gross Salary */}
                        <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-xl border-2 border-green-200">
                          <span className="font-bold text-gray-900">Salário Bruto</span>
                          <span className="font-extrabold text-xl text-green-700">
                            {formatCurrency(result.grossSalary)}
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

                        {result.transport > 0 && (
                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">(-) Vale-Transporte (6%)</span>
                            <span className="font-bold text-lg text-red-600">
                              - {formatCurrency(result.transport)}
                            </span>
                          </div>
                        )}

                        {result.otherDiscounts > 0 && (
                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">(-) Outros Descontos</span>
                            <span className="font-bold text-lg text-red-600">
                              - {formatCurrency(result.otherDiscounts)}
                            </span>
                          </div>
                        )}

                        {/* Net Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 px-4 rounded-xl border-2 border-green-300 mt-4">
                          <span className="font-extrabold text-lg text-gray-900">Salário Líquido</span>
                          <span className="font-extrabold text-2xl text-green-600">
                            {formatCurrency(result.netSalary)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-900">
                        <p className="font-bold mb-1">Sobre o cálculo:</p>
                        <p className="leading-relaxed">
                          O salário líquido é calculado subtraindo do salário bruto os descontos obrigatórios (INSS e IRRF) e opcionais (vale-transporte e outros). O INSS é calculado de forma progressiva e o IRRF considera os dependentes declarados.
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
                      Preencha os campos ao lado para calcular seu salário líquido
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
