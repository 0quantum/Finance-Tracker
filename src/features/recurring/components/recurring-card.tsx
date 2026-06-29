"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import type { RecurringTransaction, RecurringFrequency } from "@/src/types/recurring";

const FREQ_LABEL: Record<RecurringFrequency, string> = {
  daily:   "Щодня",
  weekly:  "Щотижня",
  monthly: "Щомісяця",
  yearly:  "Щороку",
};

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function RecurringCard({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: RecurringTransaction;
  onEdit: (item: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isIncome = item.type === "income";
  const days = daysUntil(item.next_run);
  const isOverdue = days < 0;
  const isToday = days === 0;

  const nextLabel = isOverdue
    ? `Прострочено ${Math.abs(days)} дн.`
    : isToday
      ? "Сьогодні"
      : `Через ${days} дн.`;

  return (
    <div className={[
      "rounded-2xl border bg-muted/20 transition-all duration-200",
      !item.active ? "opacity-50 border-border/40" : "border-border",
    ].join(" ")}>
      <div className="flex items-center gap-3 p-4">

        {/* іконка типу */}
        <div className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isIncome ? "bg-green-500/10" : "bg-red-500/10",
        ].join(" ")}>
          <RefreshCw className={["h-4 w-4", isIncome ? "text-green-500" : "text-red-500"].join(" ")} />
        </div>

        {/* інфо */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {item.description || (isIncome ? "Дохід" : "Витрата")}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground">
              {FREQ_LABEL[item.frequency as RecurringFrequency]}
            </span>
            <span className="text-[10px] text-muted-foreground/50">·</span>
            <span className={[
              "text-[11px] font-medium",
              isOverdue ? "text-red-400" : isToday ? "text-orange-400" : "text-muted-foreground",
            ].join(" ")}>
              {nextLabel}
            </span>
          </div>
        </div>

        {/* сума */}
        <p className={[
          "shrink-0 text-sm font-semibold tabular-nums",
          isIncome ? "text-green-500" : "text-red-400",
        ].join(" ")}>
          {isIncome ? "+" : "-"}{item.amount.toLocaleString("uk-UA")}
        </p>
      </div>

      {/* кнопки */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-1.5 px-4 pb-3">
        <button
          onClick={async () => {
            setToggling(true);
            await onToggle(item.id, !item.active);
            setToggling(false);
          }}
          disabled={toggling}
          className="rounded-xl border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {toggling
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : null
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
          onClick={async () => {
            setDeleting(true);
            await onDelete(item.id);
            setDeleting(false);
          }}
          disabled={deleting}
          aria-label="Видалити"
          className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <Trash2 className="h-3 w-3" />
          }
        </button>
      </div>
    </div>
  );
}