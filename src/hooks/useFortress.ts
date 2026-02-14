import { useEffect, useState } from "react"
import { calculateSurplus } from "@/utils/calculations"

export function useFortress() {
  const [income, setIncome] = useState(80000)
  const [expenses, setExpenses] = useState(35000)

  const surplus = calculateSurplus(income, expenses)

  useEffect(() => {
    localStorage.setItem(
      "fortress",
      JSON.stringify({ income, expenses })
    )
  }, [income, expenses])

  return {
    income,
    expenses,
    surplus,
    setIncome,
    setExpenses,
  }
}
