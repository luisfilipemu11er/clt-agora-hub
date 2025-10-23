
export interface VacationCalculationResult {
  grossVacation: number;
  oneThirdBonus: number;
  totalGross: number;
  inssBase: number;
  inss: number;
  irrfBase: number;
  irrf: number;
  netVacation: number;
}

export const calculateINSS = (base: number): number => {
  let inss = 0;

  if (base <= 1518.0) {
    inss = base * 0.075;
  } else if (base <= 2793.88) {
    inss = 1518.0 * 0.075 + (base - 1518.0) * 0.09;
  } else if (base <= 4190.83) {
    inss = 1518.0 * 0.075 + (2793.88 - 1518.0) * 0.09 + (base - 2793.88) * 0.12;
  } else if (base <= 8157.41) {
    inss =
      1518.0 * 0.075 +
      (2793.88 - 1518.0) * 0.09 +
      (4190.83 - 2793.88) * 0.12 +
      (base - 4190.83) * 0.14;
  } else {
    inss =
      1518.0 * 0.075 +
      (2793.88 - 1518.0) * 0.09 +
      (4190.83 - 2793.88) * 0.12 +
      (8157.41 - 4190.83) * 0.14;
  }

  return parseFloat(inss.toFixed(2));
};

export const calculateIRRF = (base: number, dependents: number): number => {
  const dependentDeduction = 189.59 * dependents;
  const calculationBase = base - dependentDeduction;
  let irrf = 0;

  if (calculationBase <= 2428.8) {
    irrf = 0;
  } else if (calculationBase <= 2826.65) {
    irrf = calculationBase * 0.075 - 182.16;
  } else if (calculationBase <= 3751.05) {
    irrf = calculationBase * 0.15 - 394.16;
  } else if (calculationBase <= 4664.68) {
    irrf = calculationBase * 0.225 - 662.77;
  } else {
    irrf = calculationBase * 0.275 - 896.0;
  }

  return parseFloat(Math.max(0, irrf).toFixed(2));
};
