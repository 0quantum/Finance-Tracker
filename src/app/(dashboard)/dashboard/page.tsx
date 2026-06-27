import { getDashboardSummary } from "@/lib/db/dashboard";
import { DashboardClient } from "@/src/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="flex flex-1 flex-col gap-2 min-h-0 overflow-auto rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <DashboardClient
        initialSummary={{
          balance: Number(summary?.balance ?? 0),
          income: Number(summary?.income ?? 0),
          expenses: Number(summary?.expenses ?? 0),
        }}
      />
    </div>
  );
}