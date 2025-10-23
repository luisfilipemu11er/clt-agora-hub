import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Calendar, DollarSign, FileText, Award, Info, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { calculateTermination, type TerminationFormValues } from "@/lib/termination-calculations";

interface TerminationFormProps {
  setResult: (result: any) => void;
}

export const TerminationForm = ({ setResult }: TerminationFormProps) => {
  const [admissionDate, setAdmissionDate] = useState("");
  const [dismissalDate, setDismissalDate] = useState("");
  const [lastSalary, setLastSalary] = useState("");
  const [fgtsBalance, setFgtsBalance] = useState("");
  const [dismissalReason, setDismissalReason] = useState("sem_justa_causa");
  const [noticeType, setNoticeType] = useState("indenizado");
  const [dependents, setDependents] = useState("0");
  const [expiredVacationDays, setExpiredVacationDays] = useState("0");

  // Format currency as user types
  const formatCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const numberValue = parseInt(numbers) / 100;
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setLastSalary(formatted);
  };

  const handleFGTSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFgtsBalance(formatted);
  };

  const handleCalculate = () => {
    const formValues: TerminationFormValues = {
      admissionDate,
      dismissalDate,
      lastSalary: parseFloat(lastSalary.replace(/\./g, "").replace(",", ".")),
      fgtsBalance: parseFloat(fgtsBalance.replace(/\./g, "").replace(",", ".")) || 0,
      dismissalReason,
      expiredVacationDays: parseInt(expiredVacationDays),
      noticeType,
      dependents: parseInt(dependents),
    };

    if (!admissionDate || !dismissalDate || !lastSalary) {
      toast.error("Preencha as datas e o salário.");
      return;
    }
    if (new Date(admissionDate) > new Date(dismissalDate)) {
      toast.error("A data de admissão não pode ser posterior à data de demissão.");
      return;
    }
    if (dismissalReason === "sem_justa_causa" && !fgtsBalance) {
      toast.error("Para dispensa sem justa causa, informe o saldo do FGTS para cálculo da multa.");
      return;
    }

    const result = calculateTermination(formValues);
    setResult(result);
    toast.success("Cálculo de rescisão estimado com sucesso!");
  };

  return (
    <Card className="glass border-2 border-white/40 shadow-premium-lg">
      <CardHeader className="border-b border-gray-100 pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
          <div className="w-10 h-10 gradient-pink-purple rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          Dados da Rescisão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Dates Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="admission-date" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              Data de Admissão
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="admission-date"
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              className="h-14 text-base font-semibold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="dismissal-date" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              Data de Demissão
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dismissal-date"
              type="date"
              value={dismissalDate}
              onChange={(e) => setDismissalDate(e.target.value)}
              className="h-14 text-base font-semibold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
            />
          </div>
        </div>

        {/* Currency Fields Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="last-salary" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-pink-600" />
              Último Salário Bruto
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                R$
              </span>
              <Input
                id="last-salary"
                type="text"
                placeholder="0,00"
                value={lastSalary}
                onChange={handleSalaryChange}
                className="h-14 pl-12 text-lg font-bold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Salário bruto mensal na data de rescisão
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="fgts-balance" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-pink-600" />
              Saldo do FGTS
              {dismissalReason === "sem_justa_causa" && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                R$
              </span>
              <Input
                id="fgts-balance"
                type="text"
                placeholder="0,00"
                value={fgtsBalance}
                onChange={handleFGTSChange}
                className="h-14 pl-12 text-lg font-bold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Necessário para cálculo da multa de 40%
            </p>
          </div>
        </div>

        {/* Dismissal Reason */}
        <div className="space-y-3">
          <Label htmlFor="dismissal-reason" className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-pink-600" />
            Tipo de Rescisão
            <span className="text-red-500">*</span>
          </Label>
          <Select value={dismissalReason} onValueChange={setDismissalReason}>
            <SelectTrigger id="dismissal-reason" className="h-14 text-base font-semibold border-2 border-pink-200 rounded-xl">
              <SelectValue placeholder="Selecione o tipo" />
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

        {/* Notice Type */}
        <div className="space-y-3">
          <Label htmlFor="notice-type" className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-pink-600" />
            Aviso Prévio
          </Label>
          <Select value={noticeType} onValueChange={setNoticeType}>
            <SelectTrigger id="notice-type" className="h-14 text-base font-semibold border-2 border-pink-200 rounded-xl">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indenizado">Indenizado pelo empregador</SelectItem>
              <SelectItem value="trabalhado">Trabalhado</SelectItem>
              <SelectItem value="nao_cumprido">Não cumprido pelo empregado</SelectItem>
              <SelectItem value="dispensado">Dispensado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Fields Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="dependents" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-600" />
              Dependentes (IRRF)
            </Label>
            <Input
              id="dependents"
              type="number"
              min="0"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="h-14 text-lg font-bold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="expired-vacation-days" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              Dias de Férias Vencidas
            </Label>
            <Input
              id="expired-vacation-days"
              type="number"
              min="0"
              max="30"
              value={expiredVacationDays}
              onChange={(e) => setExpiredVacationDays(e.target.value)}
              className="h-14 text-lg font-bold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full gradient-pink-purple hover:opacity-90 text-white h-16 text-lg font-bold shadow-premium hover-lift rounded-xl mt-8"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Calcular Rescisão
          <Calculator className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
