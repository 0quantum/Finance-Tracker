"use client";

import { Banknote, Wallet, CreditCard, Bitcoin, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import type { Account, AccountType } from "@/src/types/accounts";

export const ACCOUNT_TYPES = [
  { value: "cash"   as AccountType, label: "Готівка", icon: <Banknote className="h-4 w-4" /> },
  { value: "bank"   as AccountType, label: "Банк",    icon: <Wallet className="h-4 w-4" /> },
  { value: "card"   as AccountType, label: "Картка",  icon: <CreditCard className="h-4 w-4" /> },
  { value: "crypto" as AccountType, label: "Крипто",  icon: <Bitcoin className="h-4 w-4" /> },
];

export const TYPE_COLORS: Record<AccountType, string> = {
  cash:   "bg-emerald-500/10 text-emerald-500",
  bank:   "bg-blue-500/10 text-blue-500",
  card:   "bg-violet-500/10 text-violet-500",
  crypto: "bg-orange-500/10 text-orange-500",
};

export function typeIcon(type: AccountType) {
  return ACCOUNT_TYPES.find((t) => t.value === type)?.icon;
}

export function typeLabel(type: AccountType) {
  return ACCOUNT_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function AccountCard({ account, onClick }: { account: Account; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-border bg-muted/20 p-4 hover:bg-muted/40 active:scale-[0.99] transition-all duration-150 flex items-center gap-3"
    >
      <div className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", TYPE_COLORS[account.type]].join(" ")}>
        {typeIcon(account.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{account.name}</p>
        <p className="text-[11px] text-muted-foreground">{typeLabel(account.type)} · {account.currency}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <p className="text-sm font-semibold tabular-nums">{formatCurrency(account.balance)}</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}