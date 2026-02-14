import type { Goal } from "@/types/goal";
import { GoalCard } from "./GoalCard";
import { Button } from "@/components/ui/button";

type GoalsListProps = {
  goals: Goal[]
  isGoalLocked: (goalOrder: number) => boolean
  onAddMoney: (goalId: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onCreateNew: () => void
};

export function GoalsList({
  goals,
  isGoalLocked,
  onAddMoney,
  onEdit,
  onDelete,
  onCreateNew,
}: GoalsListProps) {
  const sortedGoals = [...goals].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">Your Goals</h2>
        <Button size="sm" onClick={onCreateNew} className="text-xs sm:text-sm">
          + New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {sortedGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isLocked={isGoalLocked(goal.order)}
            onAddMoney={onAddMoney}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No goals yet. Create your first financial goal!</p>
          <Button onClick={onCreateNew}>Create Goal</Button>
        </div>
      )}
    </div>
  );
}
