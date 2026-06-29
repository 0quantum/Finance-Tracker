"use client";

import { useState } from "react";
import { Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { useRecurring } from "../hooks/use-recurring";
import { RecurringCard } from "./recurring-card";
import { RecurringFormDialog } from "./recurring-form-dialog";
import type { RecurringTransaction } from "@/src/types/recurring";

function SkeletonCard() {
  return <div className="h-[116px] rounded-2xl bg-muted animate-pulse" />;
}

function SummaryBar({ items }: { items: RecurringTransaction[] }) {
  const active = items.filter((i) => i.active);
  const monthlyOut = active
    .filter((i) => i.type === "expense")
    .reduce((sum, i) => {
      if (i.frequency === "daily")   return sum + i.amount * 30;
      if (i.frequency === "weekly")  return sum + i.amount * 4.33;
      if (i.frequency === "monthly") return sum + i.amount;
      if (i.frequency === "yearly")  return sum + i.amount / 12;
      return sum;
    }, 0);
  const monthlyIn = active
    .filter((i) => i.type === "income")
    .reduce((sum, i) => {
      if (i.frequency === "daily")   return sum + i.amount * 30;
      if (i.frequency === "weekly")  return sum + i.amount * 4.33;
      if (i.frequency === "monthly") return sum + i.amount;
      if (i.frequency === "yearly")  return sum + i.amount / 12;
      return sum;
    }, 0);

  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Активних",  value: String(active.length),                          color: "" },
        { label: "Витрати/міс", value: `−${Math.round(monthlyOut).toLocaleString("uk-UA")}`, color: "text-red-400" },
        { label: "Доходи/міс", value: `+${Math.round(monthlyIn).toLocaleString("uk-UA")}`,  color: "text-green-500" },
      ].map((s) => (
        <div key={s.label} className="rounded-2xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
          <p className={["text-lg font-bold tabular-nums leading-tight", s.color].join(" ")}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

export default function RecurringClient() {
  const { items, loading, error, create, update, remove, toggle } = useRecurring();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | undefined>();

  const active   = items.filter((i) => i.active);
  const inactive = items.filter((i) => !i.active);

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 max-w-2xl mx-auto w-full">

      {/* header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Регулярні платежі</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Підписки, оренда, регулярні доходи
          </p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setDialogOpen(true); }}
          className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3 py-2 text-sm font-medium hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Додати
        </button>
      </div>

      {/* summary */}
      {!loading && items.length > 0 && <SummaryBar items={items} />}

      {/* error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex gap-2 items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* skeleton */}
      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* empty */}
      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 py-14 flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-medium">Немає регулярних платежів</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Додайте підписки, оренду або регулярні доходи
            </p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setDialogOpen(true); }}
            className="mt-1 flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Додати перший
          </button>
        </div>
      )}

      {/* активні */}
      {!loading && active.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5">
            Активні
          </p>
          {active.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              onEdit={(i) => { setEditing(i); setDialogOpen(true); }}
              onDelete={remove}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      {/* призупинені */}
      {!loading && inactive.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5">
            Призупинені
          </p>
          {inactive.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              onEdit={(i) => { setEditing(i); setDialogOpen(true); }}
              onDelete={remove}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      <RecurringFormDialog
        open={dialogOpen}
        initial={editing}
        onSave={editing
          ? (input) => update(editing.id, input)
          : create
        }
        onClose={() => { setDialogOpen(false); setEditing(undefined); }}
      />
    </div>
  );
}