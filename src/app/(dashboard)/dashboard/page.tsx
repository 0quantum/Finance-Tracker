import { getDashboardSummary } from "@/lib/db/dashboard";

import { BalanceCard } from "@/src/components/dashboard/balance-card";
import { IncomeCard } from "@/src/components/dashboard/income-card";
import { ExpensesCard } from "@/src/components/dashboard/expenses-card";
import { NetCard } from "@/src/components/dashboard/net-card";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  const balance = Number(summary?.balance ?? 0);
  const income = Number(summary?.income ?? 0);
  const expenses = Number(summary?.expenses ?? 0);

  return (
    <div className="flex flex-1 flex-col gap-2 min-h-0 overflow-auto rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">

      {/* TOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

        <BalanceCard
          title="Balance"
          value={`$${balance.toFixed(2)}`}
          change={2.4}
          subtitle="Compared to last month"
        />

        <IncomeCard
          value={`$${income.toFixed(2)}`}
          change={3.2}
          subtitle="This month"
        />

        <ExpensesCard
          value={`$${expenses.toFixed(2)}`}
          change={-1.8}
          subtitle="This month"
        />

        <NetCard
          income={income}
          expenses={expenses}
          subtitle="This month"
        />

      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 min-h-0">
        <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 min-h-[200px]" />
        <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 min-h-[200px]" />
      </div>

    </div>
  );
}