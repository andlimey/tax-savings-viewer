import Decimal from "decimal.js-light";

interface TaxBracketRate {
  lowerLimit: number;
  upperLimit: number;
  taxRate: number;
}

const taxBrackets: Array<TaxBracketRate> = [
  { lowerLimit: 0, upperLimit: 20000, taxRate: 0 },
  { lowerLimit: 20000, upperLimit: 30000, taxRate: 0.02 },
  { lowerLimit: 30000, upperLimit: 40000, taxRate: 0.035 },
  { lowerLimit: 40000, upperLimit: 80000, taxRate: 0.07 },
  { lowerLimit: 80000, upperLimit: 120000, taxRate: 0.115 },
  { lowerLimit: 120000, upperLimit: 160000, taxRate: 0.15 },
  { lowerLimit: 160000, upperLimit: 200000, taxRate: 0.18 },
  { lowerLimit: 200000, upperLimit: 240000, taxRate: 0.19 },
  { lowerLimit: 240000, upperLimit: 280000, taxRate: 0.195 },
  { lowerLimit: 280000, upperLimit: 320000, taxRate: 0.2 },
  { lowerLimit: 320000, upperLimit: 500000, taxRate: 0.22 },
  { lowerLimit: 500000, upperLimit: 1000000, taxRate: 0.23 },
  { lowerLimit: 1000000, upperLimit: Number.POSITIVE_INFINITY, taxRate: 0.24 },
];

export default function calculateIncomeTax(
  income: number,
  relief: number = 0
): number {
  const chargeableIncome = income - relief;

  let taxPayable = 0;

  for (const bracket of taxBrackets) {
    if (chargeableIncome <= bracket.lowerLimit) break;

    const taxableAmount =
      Math.min(chargeableIncome, bracket.upperLimit) - bracket.lowerLimit;
    taxPayable += taxableAmount * bracket.taxRate;
  }

  return taxPayable;
}
