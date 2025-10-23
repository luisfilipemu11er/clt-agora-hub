import { differenceInMonths, getDaysInMonth } from "date-fns";
import { calculateINSS, calculateIRRF } from "./calculations";

export interface TerminationFormValues {
  admissionDate: string;
  dismissalDate: string;
  lastSalary: number;
  fgtsBalance: number;
  dismissalReason: string;
  expiredVacationDays: number;
  noticeType: string;
  dependents: number;
}

export interface TerminationResult {
  verbas: Record<string, number>;
  descontos: Record<string, number>;
  totalBruto: number;
  totalLiquido: number;
  avisos: string[];
}

export const calculateTermination = (formValues: TerminationFormValues): TerminationResult => {
  const { 
    admissionDate, 
    dismissalDate, 
    lastSalary, 
    fgtsBalance, 
    dismissalReason, 
    expiredVacationDays, 
    noticeType, 
    dependents 
  } = formValues;

  const admission = new Date(admissionDate);
  const dismissal = new Date(dismissalDate);

  let verbas: Record<string, number> = {};
  let descontos: Record<string, number> = {};
  let avisos: string[] = [];

  // 1. Saldo de Salário
  const daysWorkedInMonth = dismissal.getDate();
  const salaryBalance = (lastSalary / getDaysInMonth(dismissal)) * daysWorkedInMonth;
  verbas["Saldo de Salário"] = salaryBalance;

  // 3. 13º Salário Proporcional
  const monthsForThirteenth = dismissal.getMonth() + 1;
  const thirteenthSalary = (lastSalary / 12) * monthsForThirteenth;
  verbas["13º Salário Proporcional"] = thirteenthSalary;

  // 4. Férias Proporcionais + 1/3
  const monthsForVacation = (differenceInMonths(dismissal, admission) % 12) + 1;
  const proportionalVacation = (lastSalary / 12) * monthsForVacation;
  const proportionalVacationBonus = proportionalVacation / 3;
  verbas["Férias Proporcionais + 1/3"] = proportionalVacation + proportionalVacationBonus;

  // 5. Férias Vencidas + 1/3
  if (expiredVacationDays > 0) {
    const dueVacation = (lastSalary / 30) * expiredVacationDays;
    const dueVacationBonus = dueVacation / 3;
    verbas["Férias Vencidas + 1/3"] = dueVacation + dueVacationBonus;
  }

  // 6. Lógica por Motivo de Demissão
  switch (dismissalReason) {
    case "sem_justa_causa":
    case "rescisao_indireta":
    case "falecimento_empregador":
    case "termino_contrato_experiencia_antes_prazo": {
      if (noticeType === "indenizado") {
        verbas["Aviso Prévio Indenizado"] = lastSalary;
      }
      const fgtsFine = fgtsBalance * 0.4;
      verbas["Multa de 40% sobre FGTS"] = fgtsFine;
      verbas["Saque FGTS"] = fgtsBalance + fgtsFine;
      avisos.push("Você tem direito ao seguro-desemprego (se preencher os requisitos).");
      if (dismissalReason === "termino_contrato_experiencia_antes_prazo") {
        avisos.push("Você pode ter direito à metade da remuneração a que teria direito até o fim do contrato (Art. 479 da CLT).");
      }
      break;
    }
    case "acordo_mutuo": {
      if (noticeType === "indenizado") {
        verbas["Aviso Prévio (50%)"] = lastSalary / 2;
      }
      const fgtsFine = fgtsBalance * 0.2;
      verbas["Multa de 20% sobre FGTS (acordo)"] = fgtsFine;
      verbas["Saque FGTS (80%)"] = fgtsBalance * 0.8;
      // No unemployment insurance in mutual agreement
      break;
    }
    case "justa_causa": {
      verbas = { "Saldo de Salário": salaryBalance };
      if (expiredVacationDays > 0) {
          const dueVacation = (lastSalary / 30) * expiredVacationDays;
          const dueVacationBonus = dueVacation / 3;
          verbas["Férias Vencidas + 1/3"] = dueVacation + dueVacationBonus;
      }
      descontos = {}; // No other discounts
      break;
    }
    case "pedido_demissao":
    case "aposentadoria": {
      if (noticeType === "nao_cumprido") {
        descontos["Aviso Prévio (desconto)"] = lastSalary;
      }
      // No FGTS fine or withdrawal
      break;
    }
    case "termino_contrato_experiencia_prazo": {
       verbas["Saque FGTS"] = fgtsBalance;
       // No FGTS fine or notice period
      break;
    }
  }

  const totalBruto = Object.values(verbas).reduce((sum, value) => sum + value, 0);

  // Cálculo de descontos (INSS e IRRF)
  const inssBase = salaryBalance + thirteenthSalary;
  const inss = calculateINSS(inssBase);
  descontos["INSS"] = inss;

  const irrfBase = totalBruto - inss;
  const irrf = calculateIRRF(irrfBase, dependents);
  descontos["IRRF"] = irrf;

  const totalDescontos = Object.values(descontos).reduce((sum, value) => sum + value, 0);
  const totalLiquido = totalBruto - totalDescontos;

  return {
    verbas,
    descontos,
    totalBruto,
    totalLiquido,
    avisos,
  };
};
