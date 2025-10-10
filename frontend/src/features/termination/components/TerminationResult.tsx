import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertTriangle, Calculator } from "lucide-react";
import type { TerminationResult as TerminationResultType } from "@/lib/termination-calculations";

interface TerminationResultProps {
  result: TerminationResultType | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

export const TerminationResult = ({ result }: TerminationResultProps) => {
  return (
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
  );
};
