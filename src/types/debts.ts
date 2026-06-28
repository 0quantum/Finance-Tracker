export type DebtDirection = "i_owe" | "they_owe";

export type Debt = {
  id: string;
  user_id: string;
  person_name: string;
  amount: number;
  direction: DebtDirection;
  description: string | null;
  due_date: string | null;
  is_settled: boolean;
  created_at: string;
};

export type DebtPayment = {
  id: string;
  debt_id: string;
  amount: number;
  note: string | null;
  paid_at: string;
};

export type DebtWithPayments = Debt & {
  payments: DebtPayment[];
  paid_total: number;
  remaining: number;
};

export type NewDebtInput = {
  person_name: string;
  amount: number;
  direction: DebtDirection;
  description?: string | null;
  due_date?: string | null;
};

export type NewPaymentInput = {
  debt_id: string;
  amount: number;
  note?: string | null;
};