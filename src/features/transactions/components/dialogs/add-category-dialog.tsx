"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Loader2, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";

const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
  "#14b8a6", "#a855f7", "#84cc16", "#6366f1",
];

const ICONS = [
  "💼", "🏠", "🚗", "🍔", "🎮", "💊", "✈️", "📚",
  "🎵", "👕", "💰", "🏋️", "🐾", "☕", "🎁", "💡",
];

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

// ── inline row editor ────────────────────────────────────────────

type EditableTransaction = {
  id: string;
  description: string | null;
  amount: number;
  date: string;
};

export function EditTransactionRow({
  tx,
  onSave,
  onDelete,
}: {
  tx: EditableTransaction;
  onSave: (id: string, patch: Partial<EditableTransaction>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(tx.description ?? "");
  const [amount, setAmount] = useState(String(tx.amount));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(tx.id, {
      description: desc.trim() || null,
      amount: parseFloat(amount) || tx.amount,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(tx.id);
    setDeleting(false);
  };

  const time = new Date(tx.date).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
        <Input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Опис"
          className="h-7 text-xs"
        />
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сума"
          type="text"
          inputMode="decimal"
          className="h-7 text-xs"
        />
        <div className="flex gap-1.5">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-lg border py-1 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1"
          >
            <X className="h-3 w-3" /> Скасувати
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-lg bg-foreground text-background py-1 text-xs font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {saving
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : <Check className="h-3 w-3" />
            }
            Зберегти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-muted/50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">
          {tx.description || <span className="text-muted-foreground/50">Без опису</span>}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
      </div>
      <p className="shrink-0 text-xs font-semibold tabular-nums">${tx.amount.toFixed(2)}</p>
<div className="flex items-center gap-1 opacity-100 md:opacity-100 md:group-hover:opacity-100 transition-opacity">
        <button
  onClick={() => setEditing(true)}
  aria-label="Редагувати транзакцію"
  title="Редагувати"
  className="h-6 w-6 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
>
  <Pencil className="h-3 w-3" />
</button>
        <button
  onClick={handleDelete}
  disabled={deleting}
  aria-label="Видалити транзакцію"
  title="Видалити"
  className="h-6 w-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
>
  {deleting
    ? <Loader2 className="h-3 w-3 animate-spin" />
    : <Trash2 className="h-3 w-3" />
  }
</button>
      </div>
    </div>
  );
}

// ── main dialog ──────────────────────────────────────────────────

export function AddCategoryDialog({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Введіть назву категорії"); return; }
    setError(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Не авторизовано"); setLoading(false); return; }

    const { error: err } = await supabase.from("categories").insert({
      user_id: user.id,
      name: name.trim(),
      type,
      color,
      icon,
    });

    setLoading(false);
    if (err) {
      setError(err.message.includes("unique") ? "Така категорія вже існує" : "Помилка. Спробуйте ще раз.");
      return;
    }

    setName(""); setType("expense"); setColor(COLORS[0]); setIcon(ICONS[0]);
    onCreated();
    onClose();
  };

  const handleClose = () => { setError(null); onClose(); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl p-5 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">Нова категорія</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          {/* preview */}
          <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: `${color}22` }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {name.trim() || <span className="text-muted-foreground/40">Назва категорії</span>}
              </p>
              <p className={`text-xs mt-0.5 ${type === "income" ? "text-green-500" : "text-red-400"}`}>
                {type === "income" ? "Дохід" : "Витрата"}
              </p>
            </div>
            <div className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          </div>

          {/* тип */}
          <div className="flex rounded-xl border overflow-hidden text-sm">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={[
                  "flex-1 py-2 font-medium transition-all duration-150",
                  type === t
                    ? t === "income"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {t === "income" ? "Дохід" : "Витрата"}
              </button>
            ))}
          </div>

          {/* назва */}
          <Input
            placeholder="Назва категорії"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

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
                    "aspect-square rounded-xl text-base flex items-center justify-center transition-all duration-150",
                    icon === ic
                      ? "bg-foreground/10 ring-2 ring-foreground/20 scale-110"
                      : "hover:bg-muted hover:scale-105",
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
                  title="color"
                  onClick={() => setColor(c)}
                  className={[
                    "h-7 w-7 rounded-full transition-all duration-150 cursor-pointer",
                    color === c
                      ? "scale-125 ring-2 ring-offset-2 ring-foreground/25"
                      : "hover:scale-110 opacity-70 hover:opacity-100",
                  ].join(" ")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">{error}</p>
          )}

          {/* кнопки */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-foreground text-background py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Plus className="h-3.5 w-3.5" />
              }
              Створити
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}