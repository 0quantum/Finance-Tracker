"use client";

import { useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  CreditCard,
  Wallet,
  Pencil,
  RotateCcw,
  CalendarIcon,
} from "lucide-react";
import { useDebts } from "@/src/features/debts/hooks/use-debts";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import { DatePickerDialog } from "@/src/components/date-dialog";
import type { DebtWithPayments, NewDebtInput } from "@/src/types/debts";

// ── Confirm dialog ───────────────────────────────────────────────

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <p className="text-sm text-center">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit debt dialog ───────────────────────────────────────

function DebtFormDialog({
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <input
            placeholder="Сума"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <input
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
          />

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="w-full flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span
              className={dueDate ? "text-foreground" : "text-muted-foreground"}
            >
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

// ── Add payment dialog ───────────────────────────────────────────

function AddPaymentDialog({
  debt,
  onAdd,
  onClose,
}: {
  debt: DebtWithPayments;
  onAdd: (amount: number, note: string | null) => Promise<unknown>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Введіть суму");
      return;
    }
    if (amt > debt.remaining) {
      setError(`Максимум ${formatCurrency(debt.remaining)}`);
      return;
    }
    setLoading(true);
    const err = await onAdd(amt, note.trim() || null);
    setLoading(false);
    if (err) {
      setError("Помилка. Спробуйте ще раз.");
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Погашення боргу</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {debt.person_name} · залишок {formatCurrency(debt.remaining)}
          </p>
        </div>
        <input
          placeholder="Сума погашення"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
          autoFocus
        />
        <input
          placeholder="Нотатка (необов'язково)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
        />
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
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Погасити
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Debt card ────────────────────────────────────────────────────

function DebtCard({
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

      {/* Actions */}
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
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(debt.id)}
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
              className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(debt.id)}
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

// ── Column ───────────────────────────────────────────────────────

function DebtColumn({
  title,
  icon,
  debts,
  totalRemaining,
  accentClass,
  onAddPayment,
  onSettle,
  onReopen,
  onDelete,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  debts: DebtWithPayments[];
  totalRemaining: number;
  accentClass: string;
  onAddPayment: (debt: DebtWithPayments) => void;
  onSettle: (id: string) => Promise<unknown>;
  onReopen: (id: string) => Promise<unknown>;
  onDelete: (id: string) => void;
  onEdit: (debt: DebtWithPayments) => void;
}) {
  const active = debts.filter((d) => !d.is_settled);
  const settled = debts.filter((d) => d.is_settled);
  const [showSettled, setShowSettled] = useState(false);

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {active.length}
          </span>
        </div>
        <p
          className={["text-sm font-semibold tabular-nums", accentClass].join(
            " ",
          )}
        >
          {formatCurrency(totalRemaining)}
        </p>
      </div>

      <div className="space-y-2">
        {active.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground/50">Немає активних</p>
          </div>
        )}
        {active.map((d) => (
          <DebtCard
            key={d.id}
            debt={d}
            onAddPayment={onAddPayment}
            onSettle={onSettle}
            onReopen={onReopen}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {settled.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowSettled(!showSettled)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground/60 px-1 hover:text-muted-foreground transition-colors"
          >
            {showSettled ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Закриті ({settled.length})
          </button>
          {showSettled &&
            settled.map((d) => (
              <DebtCard
                key={d.id}
                debt={d}
                onAddPayment={onAddPayment}
                onSettle={onSettle}
                onReopen={onReopen}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────

export default function DebtsClient() {
  const {
    debts,
    loading,
    error,
    addDebt,
    updateDebt,
    addPayment,
    settleDebt,
    reopenDebt,
    deleteDebt,
  } = useDebts();
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [editTarget, setEditTarget] = useState<DebtWithPayments | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<DebtWithPayments | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const iOwe = debts.filter((d) => d.direction === "i_owe");
  const theyOwe = debts.filter((d) => d.direction === "they_owe");
  const totalIOwe = iOwe
    .filter((d) => !d.is_settled)
    .reduce((s, d) => s + d.remaining, 0);
  const totalTheyOwe = theyOwe
    .filter((d) => !d.is_settled)
    .reduce((s, d) => s + d.remaining, 0);
  const net = totalTheyOwe - totalIOwe;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteDebt(deleteTarget);
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (error) return <p className="text-sm text-red-500 p-4">{error}</p>;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 h-full overflow-y-auto scrollbar-none">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold">Борги</h1>
          <p
            className={[
              "text-sm mt-0.5 font-medium tabular-nums",
              net >= 0 ? "text-green-500" : "text-red-400",
            ].join(" ")}
          >
            {net >= 0 ? "Вам мають повернути " : "Ви винні "}
            {formatCurrency(Math.abs(net))} нетто
          </p>
        </div>
        <button
          onClick={() => setShowAddDebt(true)}
          className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Додати борг
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DebtColumn
          title="Я винен"
          icon={<CreditCard className="h-4 w-4 text-red-400" />}
          debts={iOwe}
          totalRemaining={totalIOwe}
          accentClass="text-red-500"
          onAddPayment={setPaymentTarget}
          onSettle={settleDebt}
          onReopen={reopenDebt}
          onDelete={setDeleteTarget}
          onEdit={setEditTarget}
        />
        <DebtColumn
          title="Мені винні"
          icon={<Wallet className="h-4 w-4 text-green-500" />}
          debts={theyOwe}
          totalRemaining={totalTheyOwe}
          accentClass="text-green-500"
          onAddPayment={setPaymentTarget}
          onSettle={settleDebt}
          onReopen={reopenDebt}
          onDelete={setDeleteTarget}
          onEdit={setEditTarget}
        />
      </div>

      {showAddDebt && (
        <DebtFormDialog
          onSave={addDebt}
          onClose={() => setShowAddDebt(false)}
        />
      )}
      {editTarget && (
        <DebtFormDialog
          initial={editTarget}
          onSave={(input) => updateDebt(editTarget.id, input)}
          onClose={() => setEditTarget(null)}
        />
      )}
      {paymentTarget && (
        <AddPaymentDialog
          debt={paymentTarget}
          onAdd={(amount, note) =>
            addPayment({ debt_id: paymentTarget.id, amount, note })
          }
          onClose={() => setPaymentTarget(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message="Видалити борг? Всі погашення також будуть видалені."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {deleting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
