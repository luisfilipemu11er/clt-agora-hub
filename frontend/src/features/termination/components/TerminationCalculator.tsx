
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { TerminationForm } from "./TerminationForm";
import { TerminationResult } from "./TerminationResult";
import type { TerminationResult as TerminationResultType } from "@/lib/termination-calculations";

export const TerminationCalculator = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<TerminationResultType | null>(null);

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
              <h1 className="text-2xl font-bold">Calculadora de Rescisão</h1>
              <p className="text-primary-foreground/80">
                Estime os valores da sua rescisão trabalhista
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <TerminationForm setResult={setResult} />
          <TerminationResult result={result} />
        </div>
      </div>
    </div>
  );
};
