import { useEffect, useState } from "react"
import { calculateSurplus } from "@/utils/calculations"

export function useFortress() {
  const [income, setIncome] = useState(80000)
  const [expenses, setExpenses] = useState(35000)
  const [isLoaded, setIsLoaded] = useState(false)

  const surplus = calculateSurplus(income, expenses)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fortress")
    if (saved) {
      try {
        const { income: savedIncome, expenses: savedExpenses } = JSON.parse(saved)
        setIncome(savedIncome)
        setExpenses(savedExpenses)
      } catch {
        // Use defaults if parsing fails
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever income/expenses change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "fortress",
        JSON.stringify({ income, expenses })
      )
    }
  }, [income, expenses, isLoaded])

  return {
    income,
    expenses,
    surplus,
    setIncome,
    setExpenses,
  }
}
