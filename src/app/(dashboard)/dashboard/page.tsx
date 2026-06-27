"use client";

import { BalanceCard } from "@/src/components/balance-card";

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
        <div className="flex-1 h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />

        {/* skeleton 2 */}
        <div className="flex-1 h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />

        {/* skeleton 3 */}
        <div className="flex-1 h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />

      </div>

      {/* bottom row */}
      <div className="flex flex-1 gap-2 min-h-0">
        <div className="flex-1 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700" />
        <div className="flex-1 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700" />
      </div>

    </div>
  );
}