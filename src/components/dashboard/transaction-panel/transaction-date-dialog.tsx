"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  open: boolean;
  onClose: () => void;
  value: Date | null;
  onChange: (d: Date | null) => void;
};

export function TransactionDateDialog({ open, onClose, value, onChange }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(value ?? undefined);

  const handleConfirm = () => {
    onChange(selected ?? null);
    onClose();
  };

  const handleClear = () => {
    setSelected(undefined);
    onChange(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-base">Дата транзакції</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            locale={undefined}
            weekStartsOn={1}
            showOutsideDays
            classNames={{
              root: "text-sm",
              months: "flex flex-col",
              month: "space-y-2",
              caption: "flex justify-center items-center relative py-1",
              caption_label: "text-sm font-medium",
              nav: "flex items-center gap-1",
              nav_button:
                "h-7 w-7 rounded-lg border bg-transparent hover:bg-muted flex items-center justify-center transition-colors",
              nav_button_previous: "absolute left-0",
              nav_button_next: "absolute right-0",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-xs text-center",
              row: "flex w-full mt-1",
              cell: "h-9 w-9 text-center text-sm relative",
              day:
                "h-9 w-9 rounded-lg hover:bg-muted transition-colors font-normal aria-selected:opacity-100",
              day_selected:
                "bg-foreground text-background hover:bg-foreground hover:text-background font-medium",
              day_today: "border border-border font-medium",
              day_outside: "text-muted-foreground/40",
              day_disabled: "text-muted-foreground/30",
            }}
          />
        </div>

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