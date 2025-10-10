import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Info } from "lucide-react";
import { toast } from "sonner";
import {
  calculateINSS,
  calculateIRRF,
  type VacationCalculationResult,
} from "@/lib/calculations";

export const VacationCalculator = () => {
  const navigate = useNavigate();
  const [salary, setSalary] = useState("");
  const [vacationDays, setVacationDays] = useState("30");
  const [dependents, setDependents] = useState("0");
  const [result, setResult] = useState<VacationCalculationResult | null>(null);

  const calculateVacation = () => {
    const salaryValue = parseFloat(salary.replace(/\./g, "").replace(",", "."));
    const daysValue = parseInt(vacationDays);
    const dependentsValue = parseInt(dependents);

    if (!salaryValue || salaryValue <= 0) {
      toast.error("Digite um salário válido");
      return;
    }

    if (!daysValue || daysValue <= 0 || daysValue > 30) {
      toast.error("Digite um número válido de dias (1-30)");
      return;
    }

    const dailySalary = salaryValue / 30;
    const grossVacation = dailySalary * daysValue;
    const oneThirdBonus = grossVacation / 3;
    const totalGross = grossVacation + oneThirdBonus;

    const inss = calculateINSS(totalGross);
    const irrfBase = totalGross - inss;
    const irrf = calculateIRRF(irrfBase, dependentsValue);

    const netVacation = totalGross - inss - irrf;

    setResult({
      grossVacation,
      oneThirdBonus,
      totalGross,
      inssBase: totalGross,
      inss,
      irrfBase,
      irrf,
      netVacation,
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
            <Calculator className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Calculadora de Férias</h1>
              <p className="text-primary-foreground/80">
                Calcule valores de férias e 1/3 constitucional
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Dados para Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Salário Bruto (R$)</Label>
                <Input
                  id="salary"
                  type="text"
                  placeholder="0,00"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">Dias de Férias</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  value={vacationDays}
                  onChange={(e) => setVacationDays(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Máximo: 30 dias
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Dependentes (para IRRF)</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Button 
                onClick={calculateVacation}
                className="w-full shadow-button"
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Férias
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-success-green" />
                Resultado do Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Salário Bruto:</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(salary.replace(/\./g, "").replace(",", ".")))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Dias de Férias:</span>
                        <span className="font-semibold">
                          {vacationDays}
                        </span>
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Férias brutas:</span>
                          <span className="font-semibold">
                            {formatCurrency(result.grossVacation)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">1/3 Constitucional:</span>
                          <span className="font-semibold">
                            {formatCurrency(result.oneThirdBonus)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                          <span className="">Total Bruto:</span>
                          <span className="">
                            {formatCurrency(result.totalGross)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3">
                        <div className="flex justify-between items-center text-red-500">
                          <span className="">INSS:</span>
                          <span className="">
                            - {formatCurrency(result.inss)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                          <span className="">IRRF:</span>
                          <span className="">
                            - {formatCurrency(result.irrf)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-border/50 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total Líquido:</span>
                          <span className="font-bold text-xl text-success-green">
                            {formatCurrency(result.netVacation)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-news-highlight/5 rounded-lg border border-news-highlight/20">
                    <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-news-highlight" />
                      Observações Importantes
                    </h3>
                    <ul className="text-sm text-foreground/80 space-y-1">
                      <li>• Valores aproximados. Confirme com seu RH.</li>
                      <li>• FGTS de 8% sobre o total bruto é depositado, não descontado.</li>
                      <li>• Cálculo não inclui abono pecuniário ou outras variáveis.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Preencha os dados acima para ver o resultado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};