"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2, RefreshCw, Pause, Play } from "lucide-react";
import type { RecurringTransaction, RecurringFrequency } from "@/src/types/recurring";

export const FREQ_LABEL: Record<RecurringFrequency, string> = {
  daily:   "Щодня",
  weekly:  "Щотижня",
  monthly: "Щомісяця",
  yearly:  "Щороку",
};

export function toMonthly(item: RecurringTransaction): number {
  switch (item.frequency) {
    case "daily":   return item.amount * 30;
    case "weekly":  return item.amount * 4.33;
    case "monthly": return item.amount;
    case "yearly":  return item.amount / 12;
  }
}

export function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function RecurringCard({
  item,
  onEdit,
  onDeleteRequest,
  onToggle,
}: {
  item: RecurringTransaction;
  onEdit: (item: RecurringTransaction) => void;
  onDeleteRequest: (item: RecurringTransaction) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const [toggling, setToggling] = useState(false);

  const isIncome = item.type === "income";
  const days = daysUntil(item.next_run);
  const isOverdue = days < 0;
  const isToday   = days === 0;
  const isSoon    = days > 0 && days <= 3;

  const nextLabel = isOverdue
    ? `Прострочено ${Math.abs(days)} дн.`
    : isToday  ? "Сьогодні"
    : isSoon   ? `Через ${days} дн.`
    : new Date(item.next_run).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  const monthly = toMonthly(item);

  return (
    <div className={[
      "rounded-2xl border bg-muted/20 transition-all duration-200",
      !item.active ? "opacity-50 border-border/40" : isOverdue ? "border-red-500/30" : "border-border",
    ].join(" ")}>
      <div className="flex items-center gap-3 p-4">
        <div className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isIncome ? "bg-green-500/10" : "bg-red-500/10",
        ].join(" ")}>
          <RefreshCw className={["h-4 w-4", isIncome ? "text-green-500" : "text-red-500"].join(" ")} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {item.description || (isIncome ? "Дохід" : "Витрата")}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground">
              {FREQ_LABEL[item.frequency as RecurringFrequency]}
            </span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className={[
              "text-[11px] font-medium",
              isOverdue ? "text-red-400" : isToday ? "text-orange-400" : isSoon ? "text-yellow-500" : "text-muted-foreground",
            ].join(" ")}>
              {nextLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <p className={[
            "text-sm font-semibold tabular-nums",
            isIncome ? "text-green-500" : "text-red-400",
          ].join(" ")}>
            {isIncome ? "+" : "−"}{item.amount.toLocaleString("uk-UA")}
          </p>
          <p className="text-[10px] text-muted-foreground tabular-nums">
            ~{Math.round(monthly).toLocaleString("uk-UA")}/міс
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-1.5 px-4 pb-3">
        <button
          onClick={async () => {
            setToggling(true);
            await onToggle(item.id, !item.active);
            setToggling(false);
          }}
          disabled={toggling}
          className="rounded-xl border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {toggling
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : item.active
              ? <Pause className="h-3 w-3" />
              : <Play className="h-3 w-3" />
          }
          {item.active ? "Призупинити" : "Активувати"}
        </button>

        <button
          onClick={() => onEdit(item)}
          aria-label="Редагувати"
          className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>

        <button
          onClick={() => onDeleteRequest(item)}
          aria-label="Видалити"
          className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}