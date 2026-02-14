import { Button } from "@/components/ui/button";

type ConfirmExpenseButtonProps = {
  totalExpenses: number;
  onConfirm: (amount: number) => void;
};

export function ConfirmExpenseButton({ totalExpenses, onConfirm }: ConfirmExpenseButtonProps) {
  return (
    <Button
      onClick={() => onConfirm(totalExpenses)}
      className="w-full text-xs sm:text-sm"
      size="sm"
    >
      Confirm Expenses: ₹{totalExpenses.toLocaleString()}
    </Button>
  );
}
