"use client";

import { BalanceCard } from "./balance-card";
import { IncomeCard } from "./income-card";
import { ExpensesCard } from "./expenses-card";
import { NetCard } from "./net-card";
import { TransactionsPanel } from "./transaction-panel/transactions-panel";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import type { DashboardSummary } from "@/types/dashboard";

type DashboardClientProps = {
  initialSummary: DashboardSummary;
};

export function DashboardClient({ initialSummary }: DashboardClientProps) {
  const { summary, refresh } = useDashboardSummary(initialSummary);

  return (
    <>
      {/* TOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <BalanceCard
          title="Balance"
          value={`$${summary.balance.toFixed(2)}`}
          change={2.4}
          subtitle="Compared to last month"
        />

        <IncomeCard
          value={`$${summary.income.toFixed(2)}`}
          change={3.2}
          subtitle="This month"
        />

        <ExpensesCard
          value={`$${summary.expenses.toFixed(2)}`}
          change={-1.8}
          subtitle="This month"
        />

        <NetCard
          income={summary.income}
          expenses={summary.expenses}
          subtitle="This month"
        />
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 min-h-0">
        <TransactionsPanel onTransactionAdded={refresh} />

        <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 min-h-[200px]" />
      </div>
    </>
  );
}