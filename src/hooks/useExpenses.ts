import { useState, useEffect } from "react";
import type { ExpenseCategory } from "@/types/expense";

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: "1", name: "Food", amount: 0, isCustom: false },
  { id: "2", name: "Rent", amount: 0, isCustom: false },
  { id: "3", name: "Utilities", amount: 0, isCustom: false },
  { id: "4", name: "Entertainment", amount: 0, isCustom: false },
  { id: "5", name: "Transportation", amount: 0, isCustom: false },
  { id: "6", name: "Other", amount: 0, isCustom: false },
];

export function useExpenses() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load categories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fortress-expenses");
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fortress-expenses", JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const updateAmount = (id: string, amount: number) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, amount: Math.max(0, amount) } : c))
    );
  };

  const createCategory = (name: string) => {
    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name,
      amount: 0,
      isCustom: true,
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const getTotalExpenses = (): number => {
    return categories.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const resetAllCategories = () => {
    setCategories(categories.map((c) => ({ ...c, amount: 0 })));
  };

  return {
    categories,
    updateAmount,
    createCategory,
    deleteCategory,
    getTotalExpenses,
    resetAllCategories,
    isLoaded,
  };
}
