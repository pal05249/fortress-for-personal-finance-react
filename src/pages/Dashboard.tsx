import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useFortress } from "@/hooks/useFortress"
import { useGoals } from "@/hooks/useGoals"
import { useExpenses } from "@/hooks/useExpenses"
import { GoalsList } from "@/components/goals/GoalsList"
import { GoalForm } from "@/components/goals/GoalForm"
import { AddMoneyModal } from "@/components/goals/AddMoneyModal"
import { GoalCompletion } from "@/components/goals/GoalCompletion"
import { ExpenseBreakdown } from "@/components/expenses/ExpenseBreakdown"
import { AddCategoryModal } from "@/components/expenses/AddCategoryModal"
import { ConfirmExpenseButton } from "@/components/expenses/ConfirmExpenseButton"
import type { Goal } from "@/types/goal"
import { distributeProportional } from "@/utils/calculations"

export default function Dashboard() {
  const { income, expenses, surplus, setIncome, setExpenses } = useFortress()
  const {
    goals,
    createGoal,
    updateGoal,
    deleteGoal,
    addSavings,
    resetGoalAmount,
    carryOverSavings,
    isGoalLocked,
    getUnlockedGoals,
  } = useGoals()
  const { categories, updateAmount, createCategory, deleteCategory, getTotalExpenses } =
    useExpenses()

  // Modal states
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [selectedGoalForMoney, setSelectedGoalForMoney] = useState<Goal | null>(null)
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showGoalCompletion, setShowGoalCompletion] = useState(false)
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null)
  const [distributionMode, setDistributionMode] = useState<"manual" | "auto">("manual")

  // Check if any goal just completed
  useEffect(() => {
    const justCompleted = goals.find(
      (g) => g.completed && g.completedDate && !completedGoal?.id?.includes(g.id)
    )
    if (justCompleted) {
      setCompletedGoal(justCompleted)
      setShowGoalCompletion(true)
    }
  }, [goals])

  const handleCreateGoal = (goalData: Omit<Goal, "id" | "currentAmount" | "completed">) => {
    const newOrder = Math.max(...goals.map((g) => g.order), 0) + 1
    createGoal({ ...goalData, order: newOrder })
    setShowGoalForm(false)
    setEditingGoal(null)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowGoalForm(true)
  }

  const handleUpdateGoal = (goalData: Omit<Goal, "id" | "currentAmount" | "completed">) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData)
      setShowGoalForm(false)
      setEditingGoal(null)
    }
  }

  const handleAddMoney = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      setSelectedGoalForMoney(goal)
      setShowAddMoneyModal(true)
    }
  }

  const handleAddMoneySubmit = (goalId: string, amount: number) => {
    addSavings(goalId, amount)
    setShowAddMoneyModal(false)
    setSelectedGoalForMoney(null)
  }

  const handleDistributeSurplus = () => {
    const unlockedGoals = getUnlockedGoals()
    if (unlockedGoals.length === 0 || surplus <= 0) return

    if (distributionMode === "auto") {
      const distribution = distributeProportional(surplus, unlockedGoals)
      Object.entries(distribution).forEach(([goalId, amount]) => {
        addSavings(goalId, amount)
      })
    }

    // Reset distribution after confirmation
    setExpenses(expenses)
  }

  const handleConfirmExpenses = (amount: number) => {
    setExpenses(amount)
    setShowExpenseBreakdown(false)
  }

  const handleCarryOver = (fromGoalId: string, toGoalId: string) => {
    carryOverSavings(fromGoalId, toGoalId)
    setShowGoalCompletion(false)
    setCompletedGoal(null)
  }

  const handleResetGoal = (goalId: string) => {
    resetGoalAmount(goalId)
    setShowGoalCompletion(false)
    setCompletedGoal(null)
  }

  const nextGoal =
    completedGoal &&
    goals.find((g) => g.order === completedGoal.order + 1 && !g.completed)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">🏰 Financial Fortress</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Build your financial goals step by step
        </p>
      </div>

      {/* Income & Expenses Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-4 sm:p-6 rounded-lg">
        <div>
          <Label className="text-sm sm:text-base">Monthly Income</Label>
          <Input
            type="number"
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="mt-2 text-sm sm:text-base"
            placeholder="0"
          />
        </div>

        <div>
          <Label className="text-sm sm:text-base">
            Monthly Expenses {!showExpenseBreakdown && "(Total)"}
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(+e.target.value)}
              className="text-sm sm:text-base"
              placeholder="0"
              disabled={showExpenseBreakdown}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowExpenseBreakdown(!showExpenseBreakdown)}
              className="text-xs sm:text-sm flex-shrink-0"
            >
              {showExpenseBreakdown ? "Hide" : "Details"}
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Expense Breakdown */}
      {showExpenseBreakdown && (
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
          <ExpenseBreakdown
            categories={categories}
            onUpdateAmount={updateAmount}
            onDeleteCategory={deleteCategory}
            onAddCustom={() => setShowAddCategoryModal(true)}
          />
          <div className="mt-4">
            <ConfirmExpenseButton
              totalExpenses={getTotalExpenses()}
              onConfirm={handleConfirmExpenses}
            />
          </div>
        </div>
      )}

      {/* Surplus Display */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-lg border border-green-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-green-600">
              ₹{income.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Monthly Expenses</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-red-600">
              ₹{expenses.toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Monthly Surplus</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
              ₹{surplus.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Distribution Mode Selection */}
        {surplus > 0 && getUnlockedGoals().length > 0 && (
          <div className="mt-4 space-y-3">
            <div>
              <Label className="text-xs sm:text-sm">How to distribute surplus?</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant={distributionMode === "manual" ? "default" : "outline"}
                  onClick={() => setDistributionMode("manual")}
                  className="text-xs sm:text-sm"
                >
                  Manual
                </Button>
                <Button
                  size="sm"
                  variant={distributionMode === "auto" ? "default" : "outline"}
                  onClick={() => setDistributionMode("auto")}
                  className="text-xs sm:text-sm"
                >
                  Auto-Distribute
                </Button>
              </div>
            </div>
            {distributionMode === "auto" && (
              <Button
                onClick={handleDistributeSurplus}
                className="w-full text-xs sm:text-sm"
              >
                Distribute ₹{surplus.toLocaleString()} to Unlocked Goals
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Goals Section */}
      <GoalsList
        goals={goals}
        isGoalLocked={isGoalLocked}
        onAddMoney={handleAddMoney}
        onEdit={handleEditGoal}
        onDelete={deleteGoal}
        onCreateNew={() => {
          setEditingGoal(null)
          setShowGoalForm(true)
        }}
      />

      {/* Goal Form Modal */}
      <GoalForm
        goal={editingGoal}
        open={showGoalForm}
        onClose={() => {
          setShowGoalForm(false)
          setEditingGoal(null)
        }}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
      />

      {/* Add Money Modal */}
      <AddMoneyModal
        goal={selectedGoalForMoney}
        open={showAddMoneyModal}
        onClose={() => {
          setShowAddMoneyModal(false)
          setSelectedGoalForMoney(null)
        }}
        onSubmit={handleAddMoneySubmit}
      />

      {/* Goal Completion Modal */}
      <GoalCompletion
        goal={completedGoal}
        nextGoal={nextGoal || null}
        open={showGoalCompletion}
        onCarryOver={handleCarryOver}
        onReset={handleResetGoal}
        onClose={() => {
          setShowGoalCompletion(false)
          setCompletedGoal(null)
        }}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        open={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSubmit={(name) => {
          createCategory(name)
          setShowAddCategoryModal(false)
        }}
      />
    </div>
  )
}
