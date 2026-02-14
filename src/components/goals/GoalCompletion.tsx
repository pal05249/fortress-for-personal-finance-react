import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/types/goal";

type GoalCompletionProps = {
  goal: Goal | null;
  nextGoal: Goal | null;
  open: boolean;
  onCarryOver: (fromGoalId: string, toGoalId: string) => void;
  onReset: (goalId: string) => void;
  onClose: () => void;
};

export function GoalCompletion({
  goal,
  nextGoal,
  open,
  onCarryOver,
  onReset,
  onClose,
}: GoalCompletionProps) {
  if (!goal) return null;

  const carryOverAmount = Math.max(0, goal.currentAmount - goal.targetAmount);

  const handleCarryOver = () => {
    if (nextGoal) {
      onCarryOver(goal.id, nextGoal.id);
    }
    onClose();
  };

  const handleReset = () => {
    onReset(goal.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-green-600">🎉 Goal Completed!</DialogTitle>
          <DialogDescription>
            You've successfully completed the "{goal.title}" goal!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3 text-sm">
          <p>
            Goal Target: <strong>₹{goal.targetAmount.toLocaleString()}</strong>
          </p>
          <p>
            Total Saved: <strong>₹{goal.currentAmount.toLocaleString()}</strong>
          </p>
          {carryOverAmount > 0 && (
            <div className="bg-blue-50 p-3 rounded text-blue-900">
              <p>
                Extra Amount: <strong>₹{carryOverAmount.toLocaleString()}</strong>
              </p>
              <p className="text-xs mt-1">
                You can carry this over to the next goal "{nextGoal?.title}" or start fresh.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReset}>
            {carryOverAmount > 0 ? "Reset & Start Fresh" : "Continue"}
          </Button>
          {carryOverAmount > 0 && nextGoal && (
            <Button onClick={handleCarryOver} className="bg-green-600 hover:bg-green-700">
              Carry Over ₹{carryOverAmount.toLocaleString()}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
