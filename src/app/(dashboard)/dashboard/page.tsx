"use client";

import { BalanceCard } from "@/src/components/balance-card";
import { IncomeCard } from "@/src/components/income-card";
import { ExpensesCard } from "@/src/components/expenses-card";
import { NetCard } from "@/src/components/net-card";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-auto">
      {/* top row */}
      <div className="flex gap-2">
        {/* реальна картка */}
        <div className="flex-1">
          <BalanceCard
            title="Balance"
            value="$12,430"
            change={2.4}
            subtitle="Compared to last month"
          />
        </div>

        {/* skeleton 1 */}
        <div className="flex-1">
          <IncomeCard value="$5,200" change={3.2} subtitle="This month" />
        </div>

        {/* skeleton 2 */}
        <div className="flex-1">
          <ExpensesCard value="$3,180" change={-1.8} subtitle="This month" />
        </div>

        {/* skeleton 3 */}
        <div className="flex-1">
          <NetCard income={5200} expenses={3180} subtitle="This month" />
        </div>
      </div>

      {/* bottom row */}
      <div className="flex flex-1 gap-2 min-h-0">
        <div className="flex-1 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700" />
        <div className="flex-1 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700" />
      </div>
    </div>
  );
}
