import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calculator } from "lucide-react";
import { VacationCalculationResult } from "@/lib/calculations";

interface VacationResultProps {
  result: VacationCalculationResult | null;
  salary: string;
  vacationDays: string;
  formatCurrency: (value: number) => string;
}

export const VacationResult = ({ result, salary, vacationDays, formatCurrency }: VacationResultProps) => {
  if (!result) {
    return (
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-success-green" />
            Resultado do Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Preencha os dados acima para ver o resultado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-success-green" />
          Resultado do Cálculo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};