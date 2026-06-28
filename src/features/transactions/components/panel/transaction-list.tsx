import { AlertCircle, Receipt } from "lucide-react";
import { formatCurrency } from "../form/currency-input-preview";
import { TransactionRow } from "@/src/features/transactions/components/panel/transaction-row";

import type { Transaction } from "@/src/types/database";

type TransactionGroup = {
  label: string;
  items: Transaction[];
  net: number;
};

function getGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Сьогодні";
  if (isSameDay(date, yesterday)) return "Вчора";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  }).format(date);
}

// Транзакції вже приходять відсортовані за датою (DESC) з хука,
// тож однакові дні гарантовано йдуть підряд — повторне сортування не потрібне.
function groupTransactions(transactions: Transaction[]): TransactionGroup[] {
  const groups: TransactionGroup[] = [];

  for (const tx of transactions) {
    const label = getGroupLabel(tx.date);
    const last = groups[groups.length - 1];

    if (last && last.label === label) {
      last.items.push(tx);
    } else {
      groups.push({ label, items: [tx], net: 0 });
    }
  }

  for (const group of groups) {
    group.net = group.items.reduce(
      (sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount),
      0,
    );
  }

  return groups;
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2">
      <div className="h-9 w-9 shrink-0 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-3.5 w-14 rounded bg-muted animate-pulse" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 text-center">
      <Receipt className="h-6 w-6 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">Поки немає транзакцій</p>
      <p className="text-xs text-muted-foreground/70">
        Введіть суму вище і натисніть «+»
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

type TransactionListProps = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
};

export function TransactionList({
  transactions,
  loading,
  error,
}: TransactionListProps) {
  if (error) {
    return <ErrorState message={error} />;
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  const groups = groupTransactions(transactions);

  return (
    <div className="flex-1 overflow-auto pr-1 -mr-1">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="flex items-baseline justify-between px-1 pb-1.5 pt-4 first:pt-0">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </span>
            <span
              className={`font-mono text-xs tracking-tight ${
                group.net >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500"
              }`}
            >
              {group.net >= 0 ? "+" : ""}
              {formatCurrency(group.net)}
            </span>
          </div>

          <div className="space-y-0.5">
            {group.items.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
