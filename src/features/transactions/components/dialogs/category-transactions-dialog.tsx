"use client";

import { Dialog, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { DialogNoClose } from "./dialog-no-close";
import { useCategoryTransactions } from "@/src/features/transactions/hooks/use-category-transactions";
import { EditTransactionRow } from "./add-category-dialog";
import { supabase } from "@/src/lib/supabase/browser";
import { Loader2, Receipt, X } from "lucide-react";
import { formatCurrency } from "../form/currency-input-preview";
import type { CategorySummary } from "@/src/features/dashboard/hooks/use-category-summary";

type Props = {
  category: CategorySummary | null;
  onClose: () => void;
};

export function CategoryTransactionsDialog({ category, onClose }: Props) {
  const { transactions, loading, error, setTransactions } =
    useCategoryTransactions(category?.id ?? null);

  const handleSave = async (
    id: string,
    patch: { description?: string | null; amount?: number },
  ) => {
    const { data } = await supabase
      .from("transactions")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const total = transactions.reduce(
    (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
    0,
  );

  return (
    <Dialog
      open={!!category}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogNoClose className="max-w-sm w-full rounded-2xl flex flex-col max-h-[80vh]">
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 px-4 pt-4 pb-0">
          <DialogTitle asChild>
            <div className="flex items-center gap-2 min-w-0">
              {/* іконка категорії */}
              {category?.icon && (
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base select-none"
                  style={{ backgroundColor: `${category.color}22` }}
                >
                  {category.icon}
                </span>
              )}

              {/* назва */}
              <span className="flex-1 truncate text-base font-semibold leading-tight">
                {category?.name}
              </span>

              {/* баланс */}
              <span
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                  total >= 0 ? "text-green-500" : "text-red-400"
                }`}
              >
                {total >= 0 ? "+" : ""}
                {formatCurrency(total)}
              </span>

              {/* свій хрестик — після балансу, не накладається */}
              <button
                onClick={onClose}
                className="shrink-0 ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Закрити"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* ── Список транзакцій ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 pt-3 pb-4 space-y-0.5">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && <p className="text-xs text-red-500 px-2">{error}</p>}

          {!loading && !error && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Receipt className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Немає транзакцій</p>
            </div>
          )}

          {transactions.map((tx) => (
            <EditTransactionRow
              key={tx.id}
              tx={tx}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DialogNoClose>
    </Dialog>
  );
}
