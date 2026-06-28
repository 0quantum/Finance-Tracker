"use client";

import { useState } from "react";
import { Plus, CreditCard, Wallet, Loader2 } from "lucide-react";
import { useDebts } from "@/src/features/debts/hooks/use-debts";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import { ConfirmDialog } from "@/src/components/confirm-dialog";
import { DebtFormDialog } from "./debt-form-dialog";
import { AddPaymentDialog } from "./add-payment-dialog";
import { DebtColumn } from "./debt-column";
import type { DebtWithPayments } from "@/src/types/debts";

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
  const [paymentTarget, setPaymentTarget] = useState<DebtWithPayments | null>(null);
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