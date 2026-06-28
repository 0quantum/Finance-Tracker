export type AccountType = "cash" | "bank" | "card" | "crypto";

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  created_at: string;
}

export type NewAccountInput = {
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
};