import type { ExpenseCategory } from "@/types/expense";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type ExpenseBreakdownProps = {
  categories: ExpenseCategory[];
  onUpdateAmount: (id: string, amount: number) => void;
  onDeleteCategory: (id: string) => void;
  onAddCustom: () => void;
};

export function ExpenseBreakdown({
  categories,
  onUpdateAmount,
  onDeleteCategory,
  onAddCustom,
}: ExpenseBreakdownProps) {
  const defaultCategories = categories.filter((c) => !c.isCustom);
  const customCategories = categories.filter((c) => c.isCustom);
  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-semibold">Expense Breakdown</h3>

      <div className="space-y-3">
        {defaultCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-600">Default Categories</h4>
            <div className="space-y-2">
              {defaultCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm flex-shrink-0 w-24">
                    {category.name}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={category.amount}
                    onChange={(e) => onUpdateAmount(category.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-xs sm:text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {customCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-600">Custom Categories</h4>
            <div className="space-y-2">
              {customCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm flex-shrink-0 w-24">
                    {category.name}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={category.amount}
                    onChange={(e) => onUpdateAmount(category.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-xs sm:text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm sm:text-base font-semibold">
          Total Expenses: <span className="text-blue-600">₹{totalExpenses.toLocaleString()}</span>
        </p>
      </div>

      <Button size="sm" variant="outline" onClick={onAddCustom} className="text-xs sm:text-sm">
        + Add Custom Category
      </Button>
    </div>
  );
}
