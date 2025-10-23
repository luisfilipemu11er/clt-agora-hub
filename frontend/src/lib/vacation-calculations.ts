/**
 * Cálculos de Férias conforme CLT
 */

export interface VacationInput {
  salarioBruto: number;
  dataInicio: string;
  dependentes: number;
}

export interface VacationResult {
  salarioBruto: number;
  diasFerias: number;
  valorFerias: number;
  adicionalTerco: number;
  totalBruto: number;
  inss: number;
  irrf: number;
  totalLiquido: number;
  detalhamento: {
    baseCalculo: number;
    aliquotaINSS: number;
    aliquotaIRRF: number;
    parcelaDeducaoIRRF: number;
  };
}

// Tabela INSS 2024
const tabelaINSS = [
  { ate: 1412.00, aliquota: 7.5 },
  { ate: 2666.68, aliquota: 9.0 },
  { ate: 4000.03, aliquota: 12.0 },
  { ate: 7786.02, aliquota: 14.0 },
];

// Tabela IRRF 2024
const tabelaIRRF = [
  { ate: 2259.20, aliquota: 0, parcela: 0 },
  { ate: 2826.65, aliquota: 7.5, parcela: 169.44 },
  { ate: 3751.05, aliquota: 15.0, parcela: 381.44 },
  { ate: 4664.68, aliquota: 22.5, parcela: 662.77 },
  { ate: Infinity, aliquota: 27.5, parcela: 896.00 },
];

function calcularINSS(salario: number): { valor: number; aliquota: number } {
  let inss = 0;
  let salarioRestante = salario;
  let aliquotaEfetiva = 0;

  for (let i = 0; i < tabelaINSS.length; i++) {
    const faixa = tabelaINSS[i];
    const faixaAnterior = i > 0 ? tabelaINSS[i - 1].ate : 0;
    const baseFaixa = Math.min(salarioRestante, faixa.ate - faixaAnterior);

    if (baseFaixa > 0) {
      inss += baseFaixa * (faixa.aliquota / 100);
      aliquotaEfetiva = faixa.aliquota;
    }

    salarioRestante -= baseFaixa;
    if (salarioRestante <= 0) break;
  }

  return { valor: inss, aliquota: aliquotaEfetiva };
}

function calcularIRRF(baseCalculo: number, dependentes: number): { valor: number; aliquota: number; parcela: number } {
  const deducaoPorDependente = 189.59;
  const baseIRRF = Math.max(0, baseCalculo - (dependentes * deducaoPorDependente));

  for (const faixa of tabelaIRRF) {
    if (baseIRRF <= faixa.ate) {
      const irrf = Math.max(0, (baseIRRF * (faixa.aliquota / 100)) - faixa.parcela);
      return { valor: irrf, aliquota: faixa.aliquota, parcela: faixa.parcela };
    }
  }

  return { valor: 0, aliquota: 0, parcela: 0 };
}

export function calculateVacation(input: VacationInput): VacationResult {
  const { salarioBruto, dependentes } = input;

  // Cálculo de férias (30 dias)
  const diasFerias = 30;
  const valorFerias = salarioBruto;

  // Adicional de 1/3 constitucional
  const adicionalTerco = salarioBruto / 3;

  // Total bruto
  const totalBruto = valorFerias + adicionalTerco;

  // Cálculo do INSS sobre férias + 1/3
  const resultadoINSS = calcularINSS(totalBruto);
  const inss = resultadoINSS.valor;

  // Base de cálculo para IRRF (férias + 1/3 - INSS)
  const baseCalculoIRRF = totalBruto - inss;

  // Cálculo do IRRF
  const resultadoIRRF = calcularIRRF(baseCalculoIRRF, dependentes);
  const irrf = resultadoIRRF.valor;

  // Total líquido
  const totalLiquido = totalBruto - inss - irrf;

  return {
    salarioBruto,
    diasFerias,
    valorFerias,
    adicionalTerco,
    totalBruto,
    inss,
    irrf,
    totalLiquido,
    detalhamento: {
      baseCalculo: totalBruto,
      aliquotaINSS: resultadoINSS.aliquota,
      aliquotaIRRF: resultadoIRRF.aliquota,
      parcelaDeducaoIRRF: resultadoIRRF.parcela,
    },
  };
}
