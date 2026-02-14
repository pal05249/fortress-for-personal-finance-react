import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/types/goal";

type AddMoneyModalProps = {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (goalId: string, amount: number) => void;
};

export function AddMoneyModal({ goal, open, onClose, onSubmit }: AddMoneyModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && goal) {
      onSubmit(goal.id, parsedAmount);
      setAmount("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money to {goal?.title}</DialogTitle>
          <DialogDescription>
            Current: ₹{goal?.currentAmount.toLocaleString()} / Target: ₹
            {goal?.targetAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!amount || parseInt(amount) <= 0}
          >
            Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
