import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../form/currency-input-preview";
import type { Transaction } from "@/src/types/database";

type TransactionRowProps = {
  transaction: Transaction;
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const time = new Date(transaction.date).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isIncome
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-red-500/10 text-red-500"
        }`}
      >
        {isIncome ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">
          {transaction.description ?? "Без опису"}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>

      <span
        className={`shrink-0 font-mono text-sm tracking-tight ${
          isIncome ? "text-green-600 dark:text-green-400" : "text-red-500"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
}
