import type { Goal } from "@/types/goal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculateGoalProgress } from "@/utils/calculations";


type GoalCardProps = {
  goal: Goal;
  isLocked: boolean;
  onAddMoney: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
};

export function GoalCard({
  goal,
  isLocked,
  onAddMoney,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);

  return (
    <Card className={`${isLocked ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">{goal.title}</CardTitle>
              {isLocked && (
                <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">
                  Locked 🔒
                </span>
              )}
              {goal.completed && (
                <span className="text-xs bg-green-300 text-green-700 px-2 py-1 rounded">
                  Completed ✅
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {goal.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="text-xs sm:text-sm text-muted-foreground">
          <p>
            ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
          </p>
          <p className="text-xs mt-1">{Math.round(progress)}% complete</p>
        </div>

        {goal.completed && (
          <p className="text-sm font-medium text-green-600">Goal Achieved! 🎉</p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {!isLocked && !goal.completed && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onAddMoney(goal.id)}
              className="text-xs sm:text-sm"
            >
              Add Money
            </Button>
          )}
          {!isLocked && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(goal)}
                className="text-xs sm:text-sm"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(goal.id)}
                className="text-xs sm:text-sm"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
