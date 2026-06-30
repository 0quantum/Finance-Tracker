"use client";

import { useState, useMemo } from "react";
import {
  Plus, RefreshCw, AlertTriangle, Search, X,
  TrendingDown, TrendingUp, Wallet, CalendarClock,
} from "lucide-react";
import { useRecurring } from "../hooks/use-recurring";
import { RecurringCard, FREQ_LABEL, toMonthly, daysUntil } from "./recurring-card";
import { RecurringFormDialog } from "./recurring-form-dialog";
import type { RecurringTransaction, RecurringFrequency } from "@/src/types/recurring";

// ─── Delete confirm ───────────────────────────────────────────────

function DeleteConfirmDialog({
  item,
  onConfirm,
  onCancel,
}: {
  item: RecurringTransaction;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Видалити платіж?</p>
          <p className="text-xs text-muted-foreground">
            «{item.description || (item.type === "income" ? "Дохід" : "Витрата")}» буде видалено назавжди.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); }}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary cards ────────────────────────────────────────────────

function SummaryBar({ items }: { items: RecurringTransaction[] }) {
  const active = items.filter((i) => i.active);

  const monthlyOut = active.filter((i) => i.type === "expense").reduce((s, i) => s + toMonthly(i), 0);
  const monthlyIn  = active.filter((i) => i.type === "income").reduce((s, i) => s + toMonthly(i), 0);
  const net = monthlyIn - monthlyOut;

  const stats = [
    {
      label: "Витрати / міс",
      value: `−${Math.round(monthlyOut).toLocaleString("uk-UA")}`,
      sub: `${Math.round(monthlyOut * 12).toLocaleString("uk-UA")} / рік`,
      color: "text-red-400",
      icon: <TrendingDown className="h-4 w-4 text-red-400" />,
    },
    {
      label: "Доходи / міс",
      value: `+${Math.round(monthlyIn).toLocaleString("uk-UA")}`,
      sub: `${Math.round(monthlyIn * 12).toLocaleString("uk-UA")} / рік`,
      color: "text-green-500",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      label: "Нетто / міс",
      value: `${net >= 0 ? "+" : ""}${Math.round(net).toLocaleString("uk-UA")}`,
      sub: `${Math.round(net * 12).toLocaleString("uk-UA")} / рік`,
      color: net >= 0 ? "text-green-500" : "text-red-400",
      icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            {s.icon}
          </div>
          <p className={["text-base font-bold tabular-nums leading-tight", s.color].join(" ")}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground tabular-nums">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Upcoming timeline ────────────────────────────────────────────

function UpcomingTimeline({ items }: { items: RecurringTransaction[] }) {
  const upcoming = items
    .filter((i) => i.active)
    .map((i) => ({ ...i, days: daysUntil(i.next_run) }))
    .filter((i) => i.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);

  if (!upcoming.length) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Найближчі 30 днів
        </p>
      </div>
      <div className="flex flex-col gap-0.5">
        {upcoming.map((item) => {
          const isOverdue = item.days < 0;
          const isToday   = item.days === 0;
          const isIncome  = item.type === "income";

          return (
            <div key={item.id} className="flex items-center gap-3 py-1.5">
              {/* день */}
              <div className="w-12 shrink-0 text-right">
                <p className={[
                  "text-[11px] font-medium tabular-nums",
                  isOverdue ? "text-red-400" : isToday ? "text-orange-400" : "text-muted-foreground",
                ].join(" ")}>
                  {isOverdue ? `−${Math.abs(item.days)}д` : isToday ? "сьогодні" : `+${item.days}д`}
                </p>
              </div>

              {/* лінія */}
              <div className={[
                "w-0.5 h-6 rounded-full shrink-0",
                isOverdue ? "bg-red-400" : isToday ? "bg-orange-400" : "bg-border",
              ].join(" ")} />

              {/* дата + назва */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {item.description || (isIncome ? "Дохід" : "Витрата")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(item.next_run).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
                  {" · "}{FREQ_LABEL[item.frequency as RecurringFrequency]}
                </p>
              </div>

              {/* сума */}
              <p className={[
                "shrink-0 text-xs font-semibold tabular-nums",
                isIncome ? "text-green-500" : "text-red-400",
              ].join(" ")}>
                {isIncome ? "+" : "−"}{item.amount.toLocaleString("uk-UA")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filters ──────────────────────────────────────────────────────

type FilterType = "all" | "income" | "expense";
type FilterFreq = "all" | RecurringFrequency;
type SortKey    = "next_run" | "amount" | "name";

function FilterBar({
  search, setSearch,
  filterType, setFilterType,
  filterFreq, setFilterFreq,
  sort, setSort,
  count,
}: {
  search: string; setSearch: (v: string) => void;
  filterType: FilterType; setFilterType: (v: FilterType) => void;
  filterFreq: FilterFreq; setFilterFreq: (v: FilterFreq) => void;
  sort: SortKey; setSort: (v: SortKey) => void;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* пошук */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Пошук..."
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

      <div className="flex gap-1.5 flex-wrap items-center">
        {/* тип */}
        {(["all", "expense", "income"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={[
              "rounded-xl border px-2.5 py-1 text-xs font-medium transition-all",
              filterType === t
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {t === "all" ? "Всі" : t === "expense" ? "Витрати" : "Доходи"}
          </button>
        ))}

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* частота */}
        {(["all", "daily", "weekly", "monthly", "yearly"] as (FilterFreq)[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilterFreq(f)}
            className={[
              "rounded-xl border px-2.5 py-1 text-xs font-medium transition-all",
              filterFreq === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {f === "all" ? "Будь-яка" : FREQ_LABEL[f as RecurringFrequency]}
          </button>
        ))}

        {/* сортування */}
        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground outline-none cursor-pointer"
          >
            <option value="next_run">За датою</option>
            <option value="amount">За сумою</option>
            <option value="name">За назвою</option>
          </select>
        </div>
      </div>

      {count > 0 && (
        <p className="text-[11px] text-muted-foreground px-0.5">{count} платежів</p>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────

function SkeletonCard() {
  return <div className="h-[116px] rounded-2xl bg-muted animate-pulse" />;
}

// ─── Main ─────────────────────────────────────────────────────────

export default function RecurringClient() {
  const { items, loading, error, create, update, remove, toggle } = useRecurring();

  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editing, setEditing]           = useState<RecurringTransaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<RecurringTransaction | null>(null);

  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterFreq, setFilterFreq] = useState<FilterFreq>("all");
  const [sort, setSort]             = useState<SortKey>("next_run");

  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        if (filterType !== "all" && i.type !== filterType) return false;
        if (filterFreq !== "all" && i.frequency !== filterFreq) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!i.description?.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "next_run") return new Date(a.next_run).getTime() - new Date(b.next_run).getTime();
        if (sort === "amount")   return b.amount - a.amount;
        if (sort === "name")     return (a.description ?? "").localeCompare(b.description ?? "");
        return 0;
      });
  }, [items, search, filterType, filterFreq, sort]);

  const active   = filtered.filter((i) => i.active);
  const inactive = filtered.filter((i) => !i.active);

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit   = (item: RecurringTransaction) => { setEditing(item); setDialogOpen(true); };

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
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3 py-2 text-sm font-medium hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Додати
        </button>
      </div>

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

      {!loading && items.length > 0 && (
        <>
          <SummaryBar items={items} />
          <UpcomingTimeline items={items} />
          <FilterBar
            search={search} setSearch={setSearch}
            filterType={filterType} setFilterType={setFilterType}
            filterFreq={filterFreq} setFilterFreq={setFilterFreq}
            sort={sort} setSort={setSort}
            count={filtered.length}
          />
        </>
      )}

      {/* empty state */}
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
            onClick={openCreate}
            className="mt-1 flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Додати перший
          </button>
        </div>
      )}

      {/* no results */}
      {!loading && items.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 py-8 flex flex-col items-center gap-2 text-center">
          <Search className="h-5 w-5 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Нічого не знайдено</p>
          <button
            onClick={() => { setSearch(""); setFilterType("all"); setFilterFreq("all"); }}
            className="text-xs text-muted-foreground underline underline-offset-2"
          >
            Скинути фільтри
          </button>
        </div>
      )}

      {/* активні */}
      {!loading && active.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5">
            Активні · {active.length}
          </p>
          {active.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDeleteRequest={setDeleteTarget}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      {/* призупинені */}
      {!loading && inactive.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-0.5">
            Призупинені · {inactive.length}
          </p>
          {inactive.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDeleteRequest={setDeleteTarget}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      <div className="pb-4" />

      {/* form dialog */}
      <RecurringFormDialog
        open={dialogOpen}
        initial={editing}
        onSave={editing ? (input) => update(editing.id, input) : create}
        onClose={() => { setDialogOpen(false); setEditing(undefined); }}
      />

      {/* delete confirm */}
      {deleteTarget && (
        <DeleteConfirmDialog
          item={deleteTarget}
          onConfirm={async () => {
            await remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}