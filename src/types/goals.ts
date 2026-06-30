export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  priority: number;
  is_completed: boolean;
  created_at: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  amount: number;
  note: string | null;
  contributed_at: string;
}

export interface GoalWithContributions extends Goal {
  contributions: GoalContribution[];
}

export interface NewGoalInput {
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  priority: number;
}