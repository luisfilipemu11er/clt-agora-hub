import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface VacationFormProps {
  salary: string;
  setSalary: (salary: string) => void;
  vacationDays: string;
  setVacationDays: (days: string) => void;
  dependents: string;
  setDependents: (dependents: string) => void;
  calculateVacation: () => void;
}

export const VacationForm = ({ 
  salary, 
  setSalary, 
  vacationDays, 
  setVacationDays, 
  dependents, 
  setDependents, 
  calculateVacation 
}: VacationFormProps) => {
  return (
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
  );
};