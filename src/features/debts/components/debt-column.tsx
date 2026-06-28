"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import { DebtCard } from "./debt-card";
import type { DebtWithPayments } from "@/src/types/debts";

export function DebtColumn({
  title,
  icon,
  debts,
  totalRemaining,
  accentClass,
  onAddPayment,
  onSettle,
  onReopen,
  onDelete,
  onEdit,
}: {
  title: string;
  icon: ReactNode;
  debts: DebtWithPayments[];
  totalRemaining: number;
  accentClass: string;
  onAddPayment: (debt: DebtWithPayments) => void;
  onSettle: (id: string) => Promise<unknown>;
  onReopen: (id: string) => Promise<unknown>;
  onDelete: (id: string) => void;
  onEdit: (debt: DebtWithPayments) => void;
}) {
  const active = debts.filter((d) => !d.is_settled);
  const settled = debts.filter((d) => d.is_settled);
  const [showSettled, setShowSettled] = useState(false);

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {active.length}
          </span>
        </div>
        <p className={["text-sm font-semibold tabular-nums", accentClass].join(" ")}>
          {formatCurrency(totalRemaining)}
        </p>
      </div>

      <div className="space-y-2">
        {active.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground/50">Немає активних</p>
          </div>
        )}
        {active.map((d) => (
          <DebtCard
            key={d.id}
            debt={d}
            onAddPayment={onAddPayment}
            onSettle={onSettle}
            onReopen={onReopen}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {settled.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowSettled(!showSettled)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground/60 px-1 hover:text-muted-foreground transition-colors"
          >
            {showSettled ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Закриті ({settled.length})
          </button>
          {showSettled &&
            settled.map((d) => (
              <DebtCard
                key={d.id}
                debt={d}
                onAddPayment={onAddPayment}
                onSettle={onSettle}
                onReopen={onReopen}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
        </div>
      )}
    </div>
  );
}