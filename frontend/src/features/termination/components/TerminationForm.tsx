import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator } from "lucide-react";
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

  const handleCalculate = () => {
    const formValues: TerminationFormValues = {
      admissionDate,
      dismissalDate,
      lastSalary: parseFloat(lastSalary.replace(",", ".")),
      fgtsBalance: parseFloat(fgtsBalance.replace(",", ".")),
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
              <SelectItem value="indenizado">Indenizado pelo empregador</SelectItem>
              <SelectItem value="trabalhado">Trabalhado</SelectItem>
              <SelectItem value="nao_cumprido">Não cumprido pelo empregado</SelectItem>
              <SelectItem value="dispensado">Dispensado</SelectItem>
            </SelectContent>
          </Select>
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

        <Button onClick={handleCalculate} className="w-full shadow-button" size="lg">
          <Calculator className="w-4 h-4 mr-2" />
          Calcular Rescisão
        </Button>
      </CardContent>
    </Card>
  );
};
