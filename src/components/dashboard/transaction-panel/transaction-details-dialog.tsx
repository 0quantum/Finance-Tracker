"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
};

export function TransactionDetailsDialog({ open, onClose, value, onChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">Опис транзакції</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Наприклад: обід у кафе, зарплата за березень…"
          className="min-h-[100px] resize-none rounded-xl text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
        <button
          onClick={onClose}
          className="mt-1 w-full rounded-xl border py-2 text-sm transition-colors hover:bg-muted"
        >
          Готово
        </button>
      </DialogContent>
    </Dialog>
  );
}