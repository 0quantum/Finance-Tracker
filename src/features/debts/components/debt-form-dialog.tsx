"use client";

import { useState } from "react";
import { Plus, Check, Loader2, CalendarIcon } from "lucide-react";
import { DatePickerDialog } from "@/src/components/date-dialog";
import type { DebtWithPayments, NewDebtInput } from "@/src/types/debts";

export function DebtFormDialog({
  initial,
  onSave,
  onClose,
}: {
  initial?: DebtWithPayments;
  onSave: (input: NewDebtInput) => Promise<unknown>;
  onClose: () => void;
}) {
  const [personName, setPersonName] = useState(initial?.person_name ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [direction, setDirection] = useState<"i_owe" | "they_owe">(
    initial?.direction ?? "i_owe",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState<Date | null>(
    initial?.due_date ? new Date(initial.due_date) : null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial;

  const handleSubmit = async () => {
    if (!personName.trim()) {
      setError("Введіть ім'я");
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Введіть суму");
      return;
    }
    setLoading(true);
    const err = await onSave({
      person_name: personName.trim(),
      amount: amt,
      direction,
      description: description.trim() || null,
      due_date: dueDate ? dueDate.toISOString() : null,
    });
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            {isEdit ? "Редагування боргу" : "Новий борг"}
          </h2>

          <div className="flex rounded-xl border overflow-hidden text-sm">
            {(["i_owe", "they_owe"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={[
                  "flex-1 py-2.5 font-medium transition-all duration-150",
                  direction === d
                    ? d === "i_owe"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                    : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {d === "i_owe" ? "Я винен" : "Мені винні"}
              </button>
            ))}
          </div>

          <input
            placeholder="Ім'я"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Сума"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="w-full flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className={dueDate ? "text-foreground" : "text-muted-foreground"}>
              {dueDate
                ? dueDate.toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Дедлайн (необов'язково)"}
            </span>
          </button>

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
              ) : isEdit ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {isEdit ? "Зберегти" : "Додати"}
            </button>
          </div>
        </div>
      </div>
      <DatePickerDialog
        title="Дедлайн повернення"
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        value={dueDate}
        onChange={setDueDate}
      />
    </>
  );
}