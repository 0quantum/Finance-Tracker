"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Save } from "lucide-react";
import { supabase } from "@/src/lib/supabase/browser";
import type { NewRecurringInput, RecurringFrequency, RecurringType } from "@/src/types/recurring";
import type { RecurringTransaction } from "@/src/types/recurring";

type Category = { id: string; name: string; type: string; icon: string | null; color: string | null };

const FREQUENCIES: { value: RecurringFrequency; label: string; hint: string }[] = [
  { value: "daily",   label: "Щодня",    hint: "365×/рік"  },
  { value: "weekly",  label: "Щотижня",  hint: "52×/рік"   },
  { value: "monthly", label: "Щомісяця", hint: "12×/рік"   },
  { value: "yearly",  label: "Щороку",   hint: "1×/рік"    },
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10";

export function RecurringFormDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: RecurringTransaction;
  onSave: (input: NewRecurringInput) => Promise<string | null>;
  onClose: () => void;
}) {
  const [type, setType] = useState<RecurringType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [frequency, setFrequency] = useState<RecurringFrequency>(initial?.frequency ?? "monthly");
  const [nextRun, setNextRun] = useState(
    initial?.next_run
      ? initial.next_run.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(initial?.category_id ?? null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial;

  useEffect(() => {
    if (!open) return;
    supabase
      .from("categories")
      .select("id, name, type, icon, color")
      .then(({ data }) => setCategories(data ?? []));
  }, [open]);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError("Введіть коректну суму"); return; }
    if (!nextRun) { setError("Оберіть дату"); return; }

    setLoading(true);
    const err = await onSave({
      amount: amt,
      type,
      frequency,
      next_run: new Date(nextRun).toISOString(),
      description: description.trim() || null,
      category_id: categoryId,
      active: true,
    });
    setLoading(false);

    if (err) { setError(err); return; }
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    if (!isEdit) {
      setType("expense"); setAmount(""); setFrequency("monthly");
      setNextRun(new Date().toISOString().slice(0, 10));
      setDescription(""); setCategoryId(null);
    }
    onClose();
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto scrollbar-none">
        <h2 className="text-base font-semibold">
          {isEdit ? "Редагувати платіж" : "Новий регулярний платіж"}
        </h2>

        {/* тип */}
        <div className="flex rounded-xl border overflow-hidden text-sm">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCategoryId(null); }}
              className={[
                "flex-1 py-2 font-medium transition-all duration-150",
                type === t
                  ? t === "income" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  : "text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              {t === "income" ? "Дохід" : "Витрата"}
            </button>
          ))}
        </div>

        {/* сума */}
        <input
          type="text"
          inputMode="decimal"
          placeholder="Сума"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />

        {/* опис */}
        <input
          type="text"
          placeholder="Опис (напр. Netflix, Оренда)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />

        {/* частота */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Частота</p>
          <div className="grid grid-cols-2 gap-1.5">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFrequency(f.value)}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                  frequency === f.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span>{f.label}</span>
                <span className={["text-[10px]", frequency === f.value ? "opacity-60" : "text-muted-foreground/50"].join(" ")}>
                  {f.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* наступна дата */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Наступне списання</p>
          <input
            type="date"
            value={nextRun}
            onChange={(e) => setNextRun(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* категорія */}
        {filteredCategories.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Категорія</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={[
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                  categoryId === null
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                Без категорії
              </button>
              {filteredCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={[
                    "rounded-xl border px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1",
                    categoryId === c.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {c.icon && <span>{c.icon}</span>}
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">{error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : isEdit ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />
            }
            {isEdit ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
}