export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type RecurringType = "income" | "expense";

export interface RecurringTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: RecurringType;
  category_id: string | null;
  frequency: RecurringFrequency;
  next_run: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface NewRecurringInput {
  amount: number;
  type: RecurringType;
  category_id: string | null;
  frequency: RecurringFrequency;
  next_run: string;
  description: string | null;
  active: boolean;
}