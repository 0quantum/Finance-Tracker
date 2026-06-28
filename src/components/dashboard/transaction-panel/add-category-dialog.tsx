"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";

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

    setName("");
    setType("expense");
    setColor(COLORS[0]);
    setIcon(ICONS[0]);
    onCreated();
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  // preview блок зверху
  const preview = (
    <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors"
        style={{ backgroundColor: `${color}22` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {name.trim() || "Назва категорії"}
        </p>
        <p className={`text-xs mt-0.5 ${type === "income" ? "text-green-500" : "text-red-400"}`}>
          {type === "income" ? "Дохід" : "Витрата"}
        </p>
      </div>
      <div
        className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl p-5 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">Нова категорія</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* preview */}
          {preview}

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
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-red-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {t === "income" ? "Дохід" : "Витрата"}
              </button>
            ))}
          </div>

          {/* назва */}
          <Input
            id="cat-name"
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
            <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {error}
            </p>
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