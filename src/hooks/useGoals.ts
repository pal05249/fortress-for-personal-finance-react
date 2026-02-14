import { useState, useEffect } from "react";
import type { Goal } from "@/types/goal";

const DEFAULT_GOALS: Goal[] = [
  {
    id: "1",
    title: "Emergency Moat",
    description: "Emergency fund for 6 months of expenses",
    targetAmount: 210000,
    currentAmount: 0,
    completed: false,
    order: 1,
  },
  {
    id: "2",
    title: "Marriage Fund",
    description: "Savings for wedding and related expenses",
    targetAmount: 1500000,
    currentAmount: 0,
    completed: false,
    order: 2,
  },
  {
    id: "3",
    title: "Gold + Scooter",
    description: "Gold investment and scooter purchase",
    targetAmount: 950000,
    currentAmount: 0,
    completed: false,
    order: 3,
  },
  {
    id: "4",
    title: "House Citadel",
    description: "Down payment for house purchase",
    targetAmount: 4000000,
    currentAmount: 0,
    completed: false,
    order: 4,
  },
];

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load goals from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fortress-goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch {
        setGoals(DEFAULT_GOALS);
      }
    } else {
      setGoals(DEFAULT_GOALS);
    }
    setIsLoaded(true);
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fortress-goals", JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  const createGoal = (goal: Omit<Goal, "id" | "completed" | "currentAmount">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      completed: false,
      currentAmount: 0,
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const addSavings = (id: string, amount: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const newAmount = g.currentAmount + amount;
          const isCompleted = newAmount >= g.targetAmount;
          return {
            ...g,
            currentAmount: newAmount,
            completed: isCompleted,
            completedDate: isCompleted && !g.completed ? new Date().toISOString() : g.completedDate,
          };
        }
        return g;
      })
    );
  };

  const resetGoalAmount = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, currentAmount: 0 } : g)));
  };

  const carryOverSavings = (fromId: string, toId: string) => {
    const fromGoal = goals.find((g) => g.id === fromId);
    if (!fromGoal) return;

    const carryOverAmount = Math.max(0, fromGoal.currentAmount - fromGoal.targetAmount);
    
    setGoals(
      goals.map((g) => {
        if (g.id === fromId) {
          return { ...g, currentAmount: fromGoal.targetAmount };
        }
        if (g.id === toId) {
          return { ...g, currentAmount: g.currentAmount + carryOverAmount };
        }
        return g;
      })
    );
  };

  const isGoalLocked = (goalOrder: number): boolean => {
    const previousGoal = goals.find((g) => g.order === goalOrder - 1);
    return goalOrder > 1 && (!previousGoal || !previousGoal.completed);
  };

  const getUnlockedGoals = (): Goal[] => {
    return goals.filter((g) => !isGoalLocked(g.order));
  };

  return {
    goals,
    createGoal,
    updateGoal,
    deleteGoal,
    addSavings,
    resetGoalAmount,
    carryOverSavings,
    isGoalLocked,
    getUnlockedGoals,
    isLoaded,
  };
}
