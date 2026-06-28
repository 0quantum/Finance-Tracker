"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import type { DebtWithPayments } from "@/src/types/debts";

export function AddPaymentDialog({
  debt,
  onAdd,
  onClose,
}: {
  debt: DebtWithPayments;
  onAdd: (amount: number, note: string | null) => Promise<unknown>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Введіть суму");
      return;
    }
    if (amt > debt.remaining) {
      setError(`Максимум ${formatCurrency(debt.remaining)}`);
      return;
    }
    setLoading(true);
    const err = await onAdd(amt, note.trim() || null);
    setLoading(false);
    if (err) {
      setError("Помилка. Спробуйте ще раз.");
      return;
    }
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Погашення боргу</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {debt.person_name} · залишок {formatCurrency(debt.remaining)}
          </p>
        </div>
        <input
          placeholder="Сума погашення"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
          autoFocus
        />
        <input
          placeholder="Нотатка (необов'язково)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
        />
        {error && (
          <p className="text-xs text-red-500 bg-red-500/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Погасити
          </button>
        </div>
      </div>
    </div>
  );
}