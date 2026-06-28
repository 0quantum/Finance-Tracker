export type TransactionType = "income" | "expense";

// Точна відповідність таблиці public.transactions
export type Transaction = {
  id: string;
  user_id: string;
  account_id: string | null;
  category_id: string | null;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string; // timestamp without time zone -> ISO string на клієнті
  created_at: string;
};

// Поля, які реально потрібні при створенні —
// id/user_id/date/created_at підставляються автоматично
export type NewTransactionInput = {
  amount: number;
  type: TransactionType;
  description?: string;
  account_id?: string | null;
  category_id?: string | null;
  date?: string;
};