
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calculator, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { differenceInMonths, differenceInDays, getDaysInMonth } from "date-fns";
import { calculateINSS, calculateIRRF } from "@/lib/calculations";

// --- Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

// --- Main Component ---
export const TerminationCalculator = () => {
  const navigate = useNavigate();

  // --- State ---
  const [admissionDate, setAdmissionDate] = useState("");
  const [dismissalDate, setDismissalDate] = useState("");
  const [lastSalary, setLastSalary] = useState("");
  const [fgtsBalance, setFgtsBalance] = useState("");
  const [dismissalReason, setDismissalReason] = useState("sem_justa_causa");

  const [noticeType, setNoticeType] = useState("indenizado");
  const [dependents, setDependents] = useState("0");
  const [expiredVacationDays, setExpiredVacationDays] = useState("0");
  const [result, setResult] = useState<{
    verbas: Record<string, number>;
    descontos: Record<string, number>;
    totalBruto: number;
    totalLiquido: number;
    avisos: string[];
  } | null>(null);

  // --- Calculation Logic ---
  const calculateTermination = () => {
    const lastSalaryNum = parseFloat(lastSalary.replace(",", "."));
    const fgtsBalanceNum = parseFloat(fgtsBalance.replace(",", "."));
    const admission = new Date(admissionDate);
    const dismissal = new Date(dismissalDate);
    const dependentsNum = parseInt(dependents);
    const expiredVacationDaysNum = parseInt(expiredVacationDays);

    if (!admissionDate || !dismissalDate || !lastSalary) {
      toast.error("Preencha as datas e o salário.");
      return;
    }
    if (admission > dismissal) {
      toast.error("A data de admissão não pode ser posterior à data de demissão.");
      return;
    }
    if (dismissalReason === "sem_justa_causa" && !fgtsBalance) {
        toast.error("Para dispensa sem justa causa, informe o saldo do FGTS para cálculo da multa.");
        return;
    }

    let verbas: Record<string, number> = {};
    let descontos: Record<string, number> = {};
    let avisos: string[] = [];

    // 1. Saldo de Salário
    const daysWorkedInMonth = dismissal.getDate();
    const salaryBalance = (lastSalaryNum / getDaysInMonth(dismissal)) * daysWorkedInMonth;
    verbas["Saldo de Salário"] = salaryBalance;

    // 2. 13º Salário Proporcional
    const monthsForThirteenth = dismissal.getMonth() + 1;
    const thirteenthSalary = (lastSalaryNum / 12) * monthsForThirteenth;
    verbas["13º Salário Proporcional"] = thirteenthSalary;

    // 3. Férias Proporcionais + 1/3
    const monthsForVacation = (differenceInMonths(dismissal, admission) % 12) + 1;
    const proportionalVacation = (lastSalaryNum / 12) * monthsForVacation;
    const proportionalVacationBonus = proportionalVacation / 3;
    verbas["Férias Proporcionais + 1/3"] = proportionalVacation + proportionalVacationBonus;

    // 4. Férias Vencidas + 1/3
    if (expiredVacationDaysNum > 0) {
      const dueVacation = (lastSalaryNum / 30) * expiredVacationDaysNum;
      const dueVacationBonus = dueVacation / 3;
      verbas["Férias Vencidas + 1/3"] = dueVacation + dueVacationBonus;
    }

    // 5. Lógica por Motivo de Demissão
    switch (dismissalReason) {
      case "sem_justa_causa":
      case "rescisao_indireta":
      case "falecimento_empregador":
      case "termino_contrato_experiencia_antes_prazo": {
        if (noticeType === "indenizado") {
          verbas["Aviso Prévio Indenizado"] = lastSalaryNum;
        }
        const fgtsFine = fgtsBalanceNum * 0.4;
        verbas["Multa de 40% sobre FGTS"] = fgtsFine;
        verbas["Saque FGTS"] = fgtsBalanceNum + fgtsFine;
        avisos.push("Você tem direito ao seguro-desemprego (se preencher os requisitos).");
        if (dismissalReason === "termino_contrato_experiencia_antes_prazo") {
          avisos.push("Você pode ter direito à metade da remuneração a que teria direito até o fim do contrato (Art. 479 da CLT).");
        }
        break;
      }
      case "acordo_mutuo": {
        if (noticeType === "indenizado") {
          verbas["Aviso Prévio (50%)"] = lastSalaryNum / 2;
        }
        const fgtsFine = fgtsBalanceNum * 0.2;
        verbas["Multa de 20% sobre FGTS (acordo)"] = fgtsFine;
        verbas["Saque FGTS (80%)"] = fgtsBalanceNum * 0.8;
        break;
      }
      case "justa_causa": {
        verbas = { "Saldo de Salário": salaryBalance };
        if (expiredVacationDaysNum > 0) {
            const dueVacation = (lastSalaryNum / 30) * expiredVacationDaysNum;
            const dueVacationBonus = dueVacation / 3;
            verbas["Férias Vencidas + 1/3"] = dueVacation + dueVacationBonus;
        }
        descontos = {};
        break;
      }
      case "pedido_demissao":
      case "aposentadoria": {
        if (noticeType === "nao_cumprido") {
          descontos["Aviso Prévio (desconto)"] = lastSalaryNum;
        }
        break;
      }
      case "termino_contrato_experiencia_prazo": {
         verbas["Saque FGTS"] = fgtsBalanceNum;
        break;
      }
    }

    const totalBruto = Object.values(verbas).reduce((sum, value) => sum + value, 0);

    // Cálculo de descontos (INSS e IRRF)
    const inssBase = salaryBalance + thirteenthSalary;
    const inss = calculateINSS(inssBase);
    descontos["INSS"] = inss;

    const irrfBase = totalBruto - inss;
    const irrf = calculateIRRF(irrfBase, dependentsNum);
    descontos["IRRF"] = irrf;

    const totalDescontos = Object.values(descontos).reduce((sum, value) => sum + value, 0);
    const totalLiquido = totalBruto - totalDescontos;

    setResult({
      verbas,
      descontos,
      totalBruto,
      totalLiquido,
      avisos,
    });
    toast.success("Cálculo de rescisão estimado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/tools")} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Calculadora de Rescisão</h1>
              <p className="text-primary-foreground/80">Estime os valores da sua rescisão trabalhista</p>
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admission-date">Data de Admissão</Label>
                  <Input id="admission-date" type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dismissal-date">Data de Demissão</Label>
                  <Input id="dismissal-date" type="date" value={dismissalDate} onChange={(e) => setDismissalDate(e.target.value)} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last-salary">Último Salário Bruto (R$)</Label>
                  <Input id="last-salary" type="text" placeholder="0,00" value={lastSalary} onChange={(e) => setLastSalary(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fgts-balance">Saldo do FGTS (R$)</Label>
                  <Input id="fgts-balance" type="text" placeholder="0,00" value={fgtsBalance} onChange={(e) => setFgtsBalance(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dismissal-reason">Motivo da Demissão</Label>
                <Select value={dismissalReason} onValueChange={setDismissalReason}>
                  <SelectTrigger id="dismissal-reason">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem_justa_causa">Dispensa sem justa causa</SelectItem>
                    <SelectItem value="pedido_demissao">Pedido de demissão</SelectItem>
                    <SelectItem value="justa_causa">Dispensa por justa causa</SelectItem>
                    <SelectItem value="acordo_mutuo">Acordo Mútuo</SelectItem>
                    <SelectItem value="rescisao_indireta">Rescisão indireta</SelectItem>
                    <SelectItem value="termino_contrato_experiencia_prazo">Término de contrato de experiência no prazo</SelectItem>
                    <SelectItem value="termino_contrato_experiencia_antes_prazo">Término de contrato de experiência antes do prazo</SelectItem>
                    <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                    <SelectItem value="falecimento_empregador">Falecimento do empregador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice-type">Aviso Prévio</Label>
                <Select value={noticeType} onValueChange={setNoticeType}>
                  <SelectTrigger id="notice-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indenizado">Indenizado</SelectItem>
                    <SelectItem value="trabalhado">Trabalhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expired-vacation-days">Dias de Férias Vencidas</Label>
                <Input
                  id="expired-vacation-days"
                  type="number"
                  min="0"
                  value={expiredVacationDays}
                  onChange={(e) => setExpiredVacationDays(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Dependentes (para IRRF)</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                />
              </div>

              <Button onClick={calculateTermination} className="w-full shadow-button" size="lg">
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Rescisão
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-success-green" />
                Resultado Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-3">
                      {Object.entries(result.verbas).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-semibold">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border/50 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total Bruto Estimado:</span>
                          <span className="font-bold text-xl text-success-green">
                            {formatCurrency(result.totalBruto)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3">
                        {Object.entries(result.descontos).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-red-500">
                            <span className="">{key}:</span>
                            <span className="">- {formatCurrency(value)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total Líquido Estimado:</span>
                          <span className="font-bold text-xl text-success-green">
                            {formatCurrency(result.totalLiquido)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.avisos && result.avisos.length > 0 && (
                    <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                      <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-info" />
                        Informações Adicionais
                      </h3>
                      <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                        {result.avisos.map((aviso, index) => (
                          <li key={index}>{aviso}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Aviso Legal Importante
                    </h3>
                    <p className="text-sm text-foreground/80">
                      Esta calculadora fornece uma **estimativa** com base nos dados informados. O cálculo não inclui outros adicionais (horas extras, comissões). Para valores exatos, consulte um profissional de RH ou contabilidade.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Preencha os dados para estimar sua rescisão
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
