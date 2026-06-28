"use client";

import { useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import type { DebtWithPayments } from "@/src/types/debts";

export function DebtCard({
  debt,
  onAddPayment,
  onSettle,
  onReopen,
  onDelete,
  onEdit,
}: {
  debt: DebtWithPayments;
  onAddPayment: (debt: DebtWithPayments) => void;
  onSettle: (id: string) => Promise<unknown>;
  onReopen: (id: string) => Promise<unknown>;
  onDelete: (id: string) => void;
  onEdit: (debt: DebtWithPayments) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [settling, setSettling] = useState(false);
  const [reopening, setReopening] = useState(false);

  const isIOwe = debt.direction === "i_owe";
  const progress = Math.min((debt.paid_total / debt.amount) * 100, 100);
  const isOverdue =
    debt.due_date && !debt.is_settled && new Date(debt.due_date) < new Date();

  return (
    <div
      className={[
        "rounded-2xl border bg-muted/20 transition-all duration-200",
        debt.is_settled ? "opacity-70 border-border/40" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            isIOwe
              ? "bg-red-500/10 text-red-500"
              : "bg-green-500/10 text-green-500",
          ].join(" ")}
        >
          {debt.person_name.slice(0, 1).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium truncate">{debt.person_name}</p>
            {debt.is_settled && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">
                Закрито
              </span>
            )}
            {isOverdue && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                Прострочено
              </span>
            )}
          </div>
          {debt.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {debt.description}
            </p>
          )}
          {debt.due_date && (
            <p
              className={[
                "text-[11px] mt-0.5",
                isOverdue ? "text-red-400" : "text-muted-foreground",
              ].join(" ")}
            >
              до{" "}
              {new Date(debt.due_date).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
          {debt.paid_total > 0 && !debt.is_settled && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Погашено {formatCurrency(debt.paid_total)}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={[
                    "h-full rounded-full transition-all",
                    isIOwe ? "bg-red-400" : "bg-green-500",
                  ].join(" ")}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <p
            className={[
              "text-sm font-semibold tabular-nums",
              isIOwe ? "text-red-500" : "text-green-500",
            ].join(" ")}
          >
            {isIOwe ? "-" : "+"}
            {formatCurrency(debt.remaining)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            з {formatCurrency(debt.amount)}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 px-4 pb-3">
        {debt.is_settled ? (
          <>
            <button
              onClick={async () => {
                setReopening(true);
                await onReopen(debt.id);
                setReopening(false);
              }}
              disabled={reopening}
              className="flex-1 rounded-xl border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {reopening ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RotateCcw className="h-3 w-3" />
              )}
              Відновити
            </button>
            <button
              onClick={() => onEdit(debt)}
              aria-label="Редагувати борг"
              title="Редагувати"
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(debt.id)}
              aria-label="Видалити борг"
              title="Видалити"
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAddPayment(debt)}
              className="flex-1 rounded-xl border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="h-3 w-3" /> Погасити частково
            </button>
            <button
              onClick={async () => {
                setSettling(true);
                await onSettle(debt.id);
                setSettling(false);
              }}
              disabled={settling}
              className="flex-1 rounded-xl bg-foreground text-background py-1.5 text-xs font-medium hover:opacity-90 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {settling ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              Закрити
            </button>
            <button
              onClick={() => onEdit(debt)}
              aria-label="Редагувати борг"
              title="Редагувати"
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(debt.id)}
              aria-label="Видалити борг"
              title="Видалити"
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {debt.payments.length > 0 && (
        <div className="border-t border-border/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:bg-muted/30 transition-colors rounded-b-2xl"
          >
            <span>Погашення ({debt.payments.length})</span>
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {expanded && (
            <div className="px-4 pb-3 space-y-1.5">
              {debt.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-1"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.paid_at).toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    {p.note && (
                      <p className="text-[11px] text-muted-foreground/60">
                        {p.note}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-medium tabular-nums">
                    {formatCurrency(p.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}