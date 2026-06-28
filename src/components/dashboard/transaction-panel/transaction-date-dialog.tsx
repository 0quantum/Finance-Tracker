"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  value: Date | null;
  onChange: (d: Date | null) => void;
};

export function TransactionDateDialog({ open, onClose, value, onChange }: Props) {
  const toInputValue = (d: Date | null) =>
    d ? d.toISOString().slice(0, 16) : "";

  const [local, setLocal] = useState(toInputValue(value));

  const handleConfirm = () => {
    onChange(local ? new Date(local) : null);
    onClose();
  };

  const handleClear = () => {
    setLocal("");
    onChange(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">Дата транзакції</DialogTitle>
        </DialogHeader>

        <input
          type="datetime-local"
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />

        <div className="flex gap-2 mt-1">
          <button
            onClick={handleClear}
            className="flex-1 rounded-xl border py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            Скинути
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl border py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Підтвердити
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}