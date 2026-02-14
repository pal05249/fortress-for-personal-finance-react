import { useState, useEffect } from "react";
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

type GoalFormProps = {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, "id" | "currentAmount" | "completed">) => void;
};

export function GoalForm({ goal, open, onClose, onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setTargetAmount(goal.targetAmount.toString());
    } else {
      setTitle("");
      setDescription("");
      setTargetAmount("");
    }
  }, [goal, open]);

  const handleSubmit = () => {
    const parsedAmount = parseInt(targetAmount);
    if (title && description && !isNaN(parsedAmount) && parsedAmount > 0) {
      onSubmit({
        title,
        description,
        targetAmount: parsedAmount,
        order: goal?.order || 0,
      });
      setTitle("");
      setDescription("");
      setTargetAmount("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Update your goal details"
              : "Create a new financial goal to plan your fortress"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Emergency Fund"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Emergency fund for 6 months"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target">Target Amount (₹)</Label>
            <Input
              id="target"
              type="number"
              min="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Enter target amount"
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
            disabled={!title || !description || !targetAmount || parseInt(targetAmount) <= 0}
          >
            {goal ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
