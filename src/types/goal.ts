export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  completed: boolean;
  completedDate?: string;
  order: number;
}
