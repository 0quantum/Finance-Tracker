"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import type { GoalWithContributions } from "@/src/types/goals";

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10";

export function AddContributionDialog({
  goal,
  onSave,
  onClose,
}: {
  goal: GoalWithContributions;
  onSave: (goalId: string, amount: number, note: string | null) => Promise<string | null>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const remaining = Math.max(0, goal.target_amount - goal.saved_amount);
  const progress  = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
  const newProgress = amount
    ? Math.min(((goal.saved_amount + parseFloat(amount)) / goal.target_amount) * 100, 100)
    : progress;

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Введіть коректну суму"); return; }
    setLoading(true);
    const err = await onSave(goal.id, amt, note.trim() || null);
    setLoading(false);
    if (err) { setError(err); return; }
    onClose();
  };

  const quickAmounts = [
    Math.round(remaining * 0.1),
    Math.round(remaining * 0.25),
    Math.round(remaining * 0.5),
    Math.round(remaining),
  ].filter((v) => v > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Поповнити ціль</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{goal.name}</p>
        </div>

        {/* прогрес */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>{goal.saved_amount.toLocaleString("uk-UA")}</span>
            <span>{goal.target_amount.toLocaleString("uk-UA")}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="relative h-full rounded-full" style={{ width: `${newProgress}%`, backgroundColor: goal.color ?? "#6366f1", transition: "width 0.4s ease" }}>
              {amount && parseFloat(amount) > 0 && (
                <div
                  className="absolute right-0 top-0 h-full rounded-full opacity-40"
                  style={{ width: `${((parseFloat(amount) / goal.target_amount) * 100 / (newProgress / 100)).toFixed(1)}%`, backgroundColor: goal.color ?? "#6366f1" }}
                />
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {newProgress.toFixed(0)}% · Лишилось {Math.max(0, remaining - (parseFloat(amount) || 0)).toLocaleString("uk-UA")}
          </p>
        </div>

        {/* швидкі суми */}
        {quickAmounts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quickAmounts.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAmount(String(q))}
                className="rounded-xl border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                {i === 0 ? "10%" : i === 1 ? "25%" : i === 2 ? "50%" : "Все"}
                {" "}· {q.toLocaleString("uk-UA")}
              </button>
            ))}
          </div>
        )}

        <input
          type="text" inputMode="decimal"
          placeholder="Сума поповнення"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Нотатка (необов'язково)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
        />

        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">{error}</p>
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
            className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Додати
          </button>
        </div>
      </div>
    </div>
  );
}