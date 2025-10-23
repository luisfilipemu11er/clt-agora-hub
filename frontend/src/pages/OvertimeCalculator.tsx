import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calculator, DollarSign, Info, Sparkles, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

export const OvertimeCalculator = () => {
  const [salary, setSalary] = useState("");
  const [normalHours, setNormalHours] = useState("220");
  const [extraHours, setExtraHours] = useState("");
  const [nighttimeHours, setNighttimeHours] = useState("0");
  const [includeDSR, setIncludeDSR] = useState(false);
  const [result, setResult] = useState<{
    hourlyRate: number;
    extraHourRate: number;
    nighttimeRate: number;
    totalExtra: number;
    totalNighttime: number;
    dsr: number;
    totalToReceive: number;
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

  const calculateOvertime = () => {
    // Parse formatted currency back to number
    const salaryValue = parseFloat(salary.replace(/\./g, "").replace(",", "."));
    const normalHoursValue = parseFloat(normalHours);
    const extraHoursValue = parseFloat(extraHours);
    const nighttimeHoursValue = parseFloat(nighttimeHours);

    if (!salaryValue || salaryValue <= 0) {
      toast.error("Digite um salário válido");
      return;
    }

    if (!normalHoursValue || normalHoursValue <= 0) {
      toast.error("Digite as horas mensais contratadas");
      return;
    }

    if (!extraHoursValue || extraHoursValue < 0) {
      toast.error("Digite as horas extras realizadas");
      return;
    }

    const hourlyRate = salaryValue / normalHoursValue;
    const extraHourRate = hourlyRate * 1.5; // 50% adicional
    const nighttimeRate = hourlyRate * 1.2; // 20% adicional noturno
    const totalExtra = extraHourRate * extraHoursValue;
    const totalNighttime = nighttimeRate * nighttimeHoursValue;

    // DSR calculation (approximately 1/6 of total extra hours)
    const dsr = includeDSR ? (totalExtra + totalNighttime) / 6 : 0;
    const totalToReceive = totalExtra + totalNighttime + dsr;

    setResult({
      hourlyRate,
      extraHourRate,
      nighttimeRate,
      totalExtra,
      totalNighttime,
      dsr,
      totalToReceive,
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
              <div className="absolute inset-0 gradient-yellow rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-yellow rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <Clock className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Calculadora de <span className="gradient-text-yellow">Horas Extras</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Calcule horas extras, adicional noturno e DSR de forma precisa
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
                  <div className="w-10 h-10 gradient-yellow rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  Dados para Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Salary Input */}
                <div className="space-y-3">
                  <Label htmlFor="salary" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-600" />
                    Salário Base Mensal
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
                      className="h-14 pl-12 text-lg font-bold border-2 border-yellow-200 focus:border-yellow-400 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Informe o salário base mensal
                  </p>
                </div>

                {/* Normal Hours Input */}
                <div className="space-y-3">
                  <Label htmlFor="normalHours" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Horas Mensais Contratadas
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="normalHours"
                    type="number"
                    placeholder="220"
                    value={normalHours}
                    onChange={(e) => setNormalHours(e.target.value)}
                    className="h-14 text-lg font-bold border-2 border-yellow-200 focus:border-yellow-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Exemplo: 220 horas para jornada de 44h/semana
                  </p>
                </div>

                {/* Extra Hours Input */}
                <div className="space-y-3">
                  <Label htmlFor="extraHours" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    Horas Extras Realizadas
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="extraHours"
                    type="number"
                    placeholder="0"
                    value={extraHours}
                    onChange={(e) => setExtraHours(e.target.value)}
                    className="h-14 text-lg font-bold border-2 border-yellow-200 focus:border-yellow-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Quantidade de horas extras no mês
                  </p>
                </div>

                {/* Nighttime Hours Input */}
                <div className="space-y-3">
                  <Label htmlFor="nighttimeHours" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    Horas Noturnas (22h-5h)
                  </Label>
                  <Input
                    id="nighttimeHours"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={nighttimeHours}
                    onChange={(e) => setNighttimeHours(e.target.value)}
                    className="h-14 text-lg font-bold border-2 border-yellow-200 focus:border-yellow-400 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Horas trabalhadas entre 22h e 5h (adicional 20%)
                  </p>
                </div>

                {/* DSR Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <input
                    type="checkbox"
                    id="include-dsr"
                    className="w-5 h-5 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                    checked={includeDSR}
                    onChange={(e) => setIncludeDSR(e.target.checked)}
                  />
                  <Label htmlFor="include-dsr" className="text-sm font-semibold cursor-pointer text-gray-700">
                    Incluir DSR sobre horas extras
                  </Label>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={calculateOvertime}
                  className="w-full gradient-yellow hover:opacity-90 text-white h-16 text-lg font-bold shadow-premium hover-lift rounded-xl mt-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calcular Horas Extras
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
                    <div className="text-center py-8 glass border-2 border-yellow-200 rounded-3xl">
                      <div className="w-16 h-16 gradient-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium animate-pulse-glow">
                        <Clock className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mb-2">
                        Total a Receber
                      </p>
                      <p className="text-5xl font-extrabold gradient-text-yellow mb-1">
                        {formatCurrency(result.totalToReceive)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">Horas extras + adicional noturno{includeDSR ? ' + DSR' : ''}</p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-6 border-2 border-gray-100 space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-yellow-600" />
                        Detalhamento do Cálculo
                      </h3>

                      <div className="space-y-3">
                        {/* Hourly Rates */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">Valor Hora Normal</span>
                          <span className="font-bold text-lg text-gray-900">
                            {formatCurrency(result.hourlyRate)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700 font-medium flex items-center gap-2">
                            Valor Hora Extra (50%)
                            <Award className="w-4 h-4 text-yellow-500" />
                          </span>
                          <span className="font-bold text-lg text-yellow-600">
                            {formatCurrency(result.extraHourRate)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 bg-yellow-50 px-4 rounded-xl border-2 border-yellow-200">
                          <span className="font-bold text-gray-900">Total Horas Extras</span>
                          <span className="font-extrabold text-xl text-yellow-700">
                            + {formatCurrency(result.totalExtra)}
                          </span>
                        </div>

                        {/* Nighttime */}
                        {result.totalNighttime > 0 && (
                          <>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-700 font-medium">Valor Hora Noturna (20%)</span>
                              <span className="font-bold text-lg text-blue-600">
                                {formatCurrency(result.nighttimeRate)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                              <span className="text-gray-700 font-medium">Total Adicional Noturno</span>
                              <span className="font-bold text-lg text-blue-600">
                                + {formatCurrency(result.totalNighttime)}
                              </span>
                            </div>
                          </>
                        )}

                        {/* DSR */}
                        {result.dsr > 0 && (
                          <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">DSR sobre Extras</span>
                            <span className="font-bold text-lg text-green-600">
                              + {formatCurrency(result.dsr)}
                            </span>
                          </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 rounded-xl border-2 border-yellow-300 mt-4">
                          <span className="font-extrabold text-lg text-gray-900">Total a Receber</span>
                          <span className="font-extrabold text-2xl text-yellow-600">
                            {formatCurrency(result.totalToReceive)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-bold mb-1">Sobre o cálculo:</p>
                        <p className="leading-relaxed">
                          Horas extras têm adicional de 50% sobre o valor da hora normal. O adicional noturno (22h às 5h) é de 20%. O DSR (Descanso Semanal Remunerado) corresponde a aproximadamente 1/6 do valor das horas extras.
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
                      Preencha os campos ao lado para calcular suas horas extras
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
