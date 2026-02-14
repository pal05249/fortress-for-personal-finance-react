export function calculateSurplus(income: number, expenses: number) {
  return Math.max(income - expenses, 0)
}

export function monthsToTarget(
  monthlyInvestment: number,
  target: number
) {
  if (monthlyInvestment <= 0) return Infinity
  return Math.ceil(target / monthlyInvestment)
}
