"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ACCOUNT_TYPES, TYPE_COLORS, typeIcon } from "./account-card";
import type { Account, AccountType, NewAccountInput } from "@/src/types/accounts";

const CURRENCIES = ["UAH", "USD", "EUR", "GBP", "PLN"];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10";

export function AccountFormDialog({ initial, onSave, onClose }: {
  initial?: Account;
  onSave: (input: NewAccountInput) => Promise<unknown>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<AccountType>(initial?.type ?? "cash");
  const [currency, setCurrency] = useState(initial?.currency ?? "UAH");
  const [balance, setBalance] = useState(initial ? String(initial.balance) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial;

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Введіть назву"); return; }
    const bal = parseFloat(balance);
    if (isNaN(bal)) { setError("Введіть баланс"); return; }
    setLoading(true);
    const err = await onSave({ name: name.trim(), type, currency, balance: bal });
    setLoading(false);
    if (err) { setError("Помилка. Спробуйте ще раз."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold">
          {isEdit ? "Редагування рахунку" : "Новий рахунок"}
        </h2>

        <div className="grid grid-cols-4 gap-1.5">
          {ACCOUNT_TYPES.map((t) => (
            <button key={t.value} type="button" onClick={() => setType(t.value)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all",
                type === t.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted",
              ].join(" ")}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <input
          placeholder="Назва рахунку"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <div className="flex gap-1.5 flex-wrap">
          {CURRENCIES.map((c) => (
            <button key={c} type="button" onClick={() => setCurrency(c)}
              className={[
                "rounded-xl border px-3 py-1.5 text-sm font-medium transition-all",
                currency === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted",
              ].join(" ")}>
              {c}
            </button>
          ))}
        </div>

        <input
          placeholder="Початковий баланс"
          type="text"
          inputMode="decimal"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className={inputClass}
        />

        {error && (
          <p className="text-xs text-red-500 bg-red-500/10 rounded-xl px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            Скасувати
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
            {loading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Plus className="h-3.5 w-3.5" />}
            {isEdit ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
}