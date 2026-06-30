"use client";

import { useState } from "react";
import { Loader2, Plus, Save } from "lucide-react";
import type { Goal, NewGoalInput } from "@/src/types/goals";

const ICONS = ["🎯","🚗","🏠","✈️","💻","📱","🎓","💍","🏋️","🎸","⛵","🐾","🌍","💎","🏖️","👶"];
const COLORS = ["#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899","#14b8a6"];

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10";

export function GoalFormDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Goal;
  onSave: (input: NewGoalInput) => Promise<string | null>;
  onClose: () => void;
}) {
  const [name, setName]               = useState(initial?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(initial ? String(initial.target_amount) : "");
  const [savedAmount, setSavedAmount]   = useState(initial ? String(initial.saved_amount) : "0");
  const [targetDate, setTargetDate]     = useState(initial?.target_date?.slice(0, 10) ?? "");
  const [icon, setIcon]               = useState(initial?.icon ?? "🎯");
  const [color, setColor]             = useState(initial?.color ?? "#6366f1");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority]       = useState(initial?.priority ?? 0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const isEdit = !!initial;

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Введіть назву цілі"); return; }
    const target = parseFloat(targetAmount);
    if (!target || target <= 0) { setError("Введіть коректну цільову суму"); return; }
    const saved = parseFloat(savedAmount) || 0;

    setLoading(true);
    const err = await onSave({
      name: name.trim(),
      target_amount: target,
      saved_amount: saved,
      target_date: targetDate ? new Date(targetDate).toISOString() : null,
      icon,
      color,
      description: description.trim() || null,
      priority,
    });
    setLoading(false);
    if (err) { setError(err); return; }
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    if (!isEdit) {
      setName(""); setTargetAmount(""); setSavedAmount("0");
      setTargetDate(""); setIcon("🎯"); setColor("#6366f1");
      setDescription(""); setPriority(0);
    }
    onClose();
  };

  if (!open) return null;

  const progress = targetAmount
    ? Math.min((parseFloat(savedAmount || "0") / parseFloat(targetAmount)) * 100, 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto scrollbar-none">
        <h2 className="text-base font-semibold">{isEdit ? "Редагувати ціль" : "Нова фінансова ціль"}</h2>

        {/* preview */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 flex items-center gap-3">
          <div
            className="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}22` }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name || "Назва цілі"}</p>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: color }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {progress.toFixed(0)}% накопичено
            </p>
          </div>
        </div>

        {/* іконка */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Іконка</p>
          <div className="grid grid-cols-8 gap-1">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={[
                  "aspect-square rounded-xl text-base flex items-center justify-center transition-all",
                  icon === ic ? "bg-foreground/10 ring-2 ring-foreground/20 scale-110" : "hover:bg-muted",
                ].join(" ")}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* колір */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Колір</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={[
                  "h-7 w-7 rounded-full transition-all",
                  color === c ? "scale-125 ring-2 ring-offset-2 ring-foreground/25" : "opacity-70 hover:opacity-100 hover:scale-110",
                ].join(" ")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* назва */}
        <input
          placeholder="Назва цілі (напр. Купити авто)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        {/* опис */}
        <input
          placeholder="Опис (необов'язково)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />

        {/* суми */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Цільова сума</label>
            <input
              type="text" inputMode="decimal"
              placeholder="50 000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Вже є</label>
            <input
              type="text" inputMode="decimal"
              placeholder="0"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* дата */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Дата цілі (необов'язково)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* пріоритет */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Пріоритет</label>
          <div className="flex gap-1.5">
            {[
              { value: 0, label: "Низький" },
              { value: 1, label: "Середній" },
              { value: 2, label: "Високий" },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={[
                  "flex-1 rounded-xl border py-1.5 text-xs font-medium transition-all",
                  priority === p.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

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
            {isEdit ? "Зберегти" : "Створити"}
          </button>
        </div>
      </div>
    </div>
  );
}