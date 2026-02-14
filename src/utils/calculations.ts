import type { Goal } from "@/types/goal";
import type { ExpenseCategory } from "@/types/expense";

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

export function calculateExpenseTotal(categories: ExpenseCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.amount, 0)
}

export function isGoalLocked(goalOrder: number, goals: Goal[]): boolean {
  if (goalOrder <= 1) return false
  const previousGoal = goals.find((g) => g.order === goalOrder - 1)
  return !previousGoal || !previousGoal.completed
}

export function distributeProportional(
  amount: number,
  unlockedGoals: Goal[]
): Record<string, number> {
  if (unlockedGoals.length === 0) return {}

  const distribution: Record<string, number> = {}
  const baseAmount = Math.floor(amount / unlockedGoals.length)
  const remainder = amount % unlockedGoals.length

  unlockedGoals.forEach((goal, index) => {
    distribution[goal.id] = baseAmount + (index < remainder ? 1 : 0)
  })

  return distribution
}

export function calculateGoalProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100)
}
