"use client";

import { StatCard } from "./stat-card";
import { TransactionsPanel } from "@/src/features/transactions/components/panel/transactions-panel";
import { useDashboardSummary } from "@/src/features/transactions/hooks/use-dashboard-summary";
import type { DashboardSummary } from "@/src/types/dashboard";

type Props = { initialSummary: DashboardSummary };

export function DashboardClient({ initialSummary }: Props) {
  const { summary, refresh } = useDashboardSummary(initialSummary);
  const net = summary.income - summary.expenses;

  return (
    <div className="flex flex-col gap-3">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard
          highlighted
          title="Баланс"
          value={`$${summary.balance.toFixed(2)}`}
          change={2.4}
          badgeVariant="positive"
          subtitle="Порівняно з минулим місяцем"
        />
        <StatCard
          title="Доходи"
          value={`$${summary.income.toFixed(2)}`}
          change={3.2}
          badgeVariant="positive"
          subtitle="Цього місяця"
        />
        <StatCard
          title="Витрати"
          value={`$${summary.expenses.toFixed(2)}`}
          change={1.8}
          badgeVariant="negative"
          subtitle="Цього місяця"
        />
        <StatCard
          title="Нетто"
          value={`${net >= 0 ? "+" : "-"}$${Math.abs(net).toFixed(2)}`}
          change={net}
          badgeVariant="net"
          subtitle="Цього місяця"
        />
      </div>

      {/* категорії — повна ширина */}
      <TransactionsPanel onTransactionAdded={refresh} />

      {/* два плейсхолдери */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 min-h-[180px]">
          <p className="text-xs text-muted-foreground">Скоро тут буде графік</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 min-h-[180px]">
          <p className="text-xs text-muted-foreground">Скоро тут буде графік</p>
        </div>
      </div>
    </div>
  );
}
