import { getDashboardSummary } from "@/lib/db/dashboard";
import { DashboardClient } from "@/src/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 p-3 sm:p-6 md:p-8">
        <DashboardClient
          initialSummary={{
            balance:  Number(summary?.balance  ?? 0),
            income:   Number(summary?.income   ?? 0),
            expenses: Number(summary?.expenses ?? 0),
          }}
        />
      </div>
    </div>
  );
}