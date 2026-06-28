"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { uk } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
  open: boolean;
  onClose: () => void;
  value: Date | null;
  onChange: (d: Date | null) => void;
};

export function TransactionDateDialog({
  open,
  onClose,
  value,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<Date | undefined>(
    value ?? undefined,
  );
  const today = new Date();

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
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-sm rounded-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-base">Дата транзакції</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center [&_.rdp]:m-0">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            locale={uk}
            weekStartsOn={1}
            showOutsideDays
            disabled={{ after: today }}
            endMonth={today}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ),
            }}
            classNames={{
  root: "text-sm w-full",
  months: "flex flex-col w-full",
  month: "w-full space-y-3",
  month_caption: "flex justify-between items-center px-1 py-1",
  caption_label: "text-sm font-medium capitalize",
  nav: "flex items-center gap-1",
  button_previous: [
    "h-8 w-8 rounded-xl border border-border bg-background",
    "hover:bg-muted transition-colors",
    "flex items-center justify-center",
    "text-muted-foreground hover:text-foreground",
    "disabled:opacity-30 disabled:pointer-events-none",
  ].join(" "),
  button_next: [
    "h-8 w-8 rounded-xl border border-border bg-background",
    "hover:bg-muted transition-colors",
    "flex items-center justify-center",
    "text-muted-foreground hover:text-foreground",
    "disabled:opacity-30 disabled:pointer-events-none",
  ].join(" "),
  month_grid: "w-full border-collapse",
  weekdays: "flex w-full",
  weekday: "flex-1 text-center text-xs font-normal text-muted-foreground py-1",
  week: "flex w-full mt-1 gap-0.5",
  day: "flex-1 text-center text-sm",
  day_button: [
    "w-full aspect-square rounded-xl text-sm",
    "hover:bg-muted transition-colors",
    "font-normal text-foreground",
    "flex items-center justify-center mx-auto",
  ].join(" "),
  selected: [
    "!bg-foreground !text-background",
    "hover:!bg-foreground hover:!text-background",
    "font-medium rounded-xl",
  ].join(" "),
  today: "border border-border font-semibold rounded-xl",
  outside: "text-muted-foreground/30",
  disabled: "text-muted-foreground/20 pointer-events-none line-through",
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
            className="flex-1 rounded-xl bg-foreground text-background py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          >
            Підтвердити
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
