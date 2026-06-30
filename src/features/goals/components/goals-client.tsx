"use client";

import { useState, useMemo } from "react";
import { Plus, Target, Search, X, Trophy, AlertTriangle, TrendingUp } from "lucide-react";
import { useGoals } from "../hooks/use-goals";
import { GoalCard } from "./goal-card";
import { GoalFormDialog } from "./goal-form-dialog";
import { AddContributionDialog } from "./add-contribution-dialog";
import type { GoalWithContributions } from "@/src/types/goals";

// ─── Delete confirm ───────────────────────────────────────────────

function DeleteConfirmDialog({ goal, onConfirm, onCancel }: {
  goal: GoalWithContributions;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold">Видалити ціль?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            «{goal.name}» і всі внески будуть видалені назавжди.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            Скасувати
          </button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); }}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────

function SummaryBar({ goals }: { goals: GoalWithContributions[] }) {
  const active    = goals.filter((g) => !g.is_completed);
  const completed = goals.filter((g) => g.is_completed);
  const totalTarget = active.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved  = active.reduce((s, g) => s + g.saved_amount, 0);
  const overallPct  = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Активних цілей", value: String(active.length),                                      icon: <Target className="h-3.5 w-3.5 text-muted-foreground" /> },
          { label: "Накопичено",     value: totalSaved.toLocaleString("uk-UA"),                          icon: <TrendingUp className="h-3.5 w-3.5 text-green-500" /> },
          { label: "Виконано",       value: String(completed.length),                                    icon: <Trophy className="h-3.5 w-3.5 text-yellow-500" /> },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1">{s.icon}<p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p></div>
            <p className="text-base font-bold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
      {totalTarget > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Загальний прогрес</span>
            <span>{overallPct.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-foreground transition-all duration-700" style={{ width: `${overallPct}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {totalSaved.toLocaleString("uk-UA")} з {totalTarget.toLocaleString("uk-UA")}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────

function SkeletonCard() {
  return <div className="h-[180px] rounded-2xl bg-muted animate-pulse" />;
}

// ─── Main ─────────────────────────────────────────────────────────

type SortKey = "priority" | "date" | "progress" | "created";

export default function GoalsClient() {
  const { goals, loading, error, create, update, remove, complete, addContribution, deleteContribution } = useGoals();

  const [formOpen, setFormOpen]             = useState(false);
  const [editing, setEditing]               = useState<GoalWithContributions | undefined>();
  const [deleteTarget, setDeleteTarget]     = useState<GoalWithContributions | null>(null);
  const [contribTarget, setContribTarget]   = useState<GoalWithContributions | null>(null);
  const [search, setSearch]                 = useState("");
  const [sort, setSort]                     = useState<SortKey>("priority");
  const [showCompleted, setShowCompleted]   = useState(false);

  const activeGoals    = goals.filter((g) => !g.is_completed);
  const completedGoals = goals.filter((g) => g.is_completed);

  const filtered = useMemo(() => {
    return activeGoals
      .filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "priority") return b.priority - a.priority;
        if (sort === "progress") {
          const pa = a.saved_amount / a.target_amount;
          const pb = b.saved_amount / b.target_amount;
          return pb - pa;
        }
        if (sort === "date") {
          if (!a.target_date) return 1;
          if (!b.target_date) return -1;
          return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [activeGoals, search, sort]);

  const overdue = filtered.filter((g) => g.target_date && new Date(g.target_date) < new Date());

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 max-w-2xl mx-auto w-full">

      {/* header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Планування витрат</h1>
          </div>
          <p className="text-sm text-muted-foreground">Цілі, накопичення, великі покупки</p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setFormOpen(true); }}
          className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3 py-2 text-sm font-medium hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Додати ціль
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex gap-2 items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && goals.length > 0 && <SummaryBar goals={goals} />}

      {/* overdue banner */}
      {!loading && overdue.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex gap-2 items-start">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500/90">
            {overdue.length} {overdue.length === 1 ? "ціль прострочена" : "цілі прострочені"} — перевірте терміни
          </p>
        </div>
      )}

      {/* фільтри */}
      {!loading && goals.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Пошук цілей..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 items-center flex-wrap">
            {(["priority","date","progress","created"] as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={[
                  "rounded-xl border px-2.5 py-1 text-xs font-medium transition-all",
                  sort === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {s === "priority" ? "Пріоритет" : s === "date" ? "Дата" : s === "progress" ? "Прогрес" : "Дата створення"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* empty */}
      {!loading && goals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 py-14 flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-3xl">🎯</div>
          <div>
            <p className="text-sm font-medium">Немає фінансових цілей</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
              Додайте першу ціль — машину, квартиру, відпустку або будь-що інше
            </p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setFormOpen(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Додати першу ціль
          </button>
        </div>
      )}

      {/* no results */}
      {!loading && goals.length > 0 && filtered.length === 0 && search && (
        <div className="rounded-2xl border border-dashed border-border/60 py-8 flex flex-col items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Нічого не знайдено</p>
        </div>
      )}

      {/* активні цілі */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5">
            Активні · {filtered.length}
          </p>
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => { setEditing(g); setFormOpen(true); }}
              onDeleteRequest={setDeleteTarget}
              onAddContribution={setContribTarget}
              onDeleteContribution={deleteContribution}
              onComplete={complete}
            />
          ))}
        </div>
      )}

      {/* виконані */}
      {!loading && completedGoals.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5 hover:text-foreground transition-colors"
          >
            <Trophy className="h-3 w-3 text-yellow-500" />
            Виконані · {completedGoals.length}
            {showCompleted ? <X className="h-3 w-3 ml-auto" /> : <Plus className="h-3 w-3 ml-auto" />}
          </button>
          {showCompleted && completedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => { setEditing(g); setFormOpen(true); }}
              onDeleteRequest={setDeleteTarget}
              onAddContribution={setContribTarget}
              onDeleteContribution={deleteContribution}
              onComplete={complete}
            />
          ))}
        </div>
      )}

      <div className="pb-4" />

      <GoalFormDialog
        open={formOpen}
        initial={editing}
        onSave={editing ? (input) => update(editing.id, input) : create}
        onClose={() => { setFormOpen(false); setEditing(undefined); }}
      />

      {contribTarget && (
        <AddContributionDialog
          goal={contribTarget}
          onSave={addContribution}
          onClose={() => setContribTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          goal={deleteTarget}
          onConfirm={async () => { await remove(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}