"use client";

import { useState } from "react";
import { Plus, Wallet, Loader2 } from "lucide-react";
import { useAccounts } from "@/src/features/accounts/hooks/use-accounts";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import { ConfirmDialog } from "@/src/components/confirm-dialog";
import { AccountCard } from "./account-card";
import { AccountFormDialog } from "./account-form-dialog";
import { AccountDetail } from "./account-detail";
import type { Account } from "@/src/types/accounts";

export default function AccountsClient() {
  const { accounts, loading, error, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Account | null>(null);
  const [detailTarget, setDetailTarget] = useState<Account | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteAccount(deleteTarget);
    setDeleting(false);
    setDeleteTarget(null);
    setDetailTarget(null);
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
          <h1 className="text-lg font-semibold">Рахунки</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">
            Загалом:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {formatCurrency(totalBalance)}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Додати рахунок
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-20 flex flex-col items-center justify-center gap-3">
          <Wallet className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/50">Немає рахунків</p>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-xl border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Додати перший рахунок
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} onClick={() => setDetailTarget(a)} />
          ))}
        </div>
      )}

      {showAdd && (
        <AccountFormDialog onSave={addAccount} onClose={() => setShowAdd(false)} />
      )}
      {editTarget && (
        <AccountFormDialog
          initial={editTarget}
          onSave={(input) => updateAccount(editTarget.id, input)}
          onClose={() => setEditTarget(null)}
        />
      )}
      {detailTarget && (
        <AccountDetail
          account={detailTarget}
          onClose={() => setDetailTarget(null)}
          onEdit={() => { setEditTarget(detailTarget); setDetailTarget(null); }}
          onDelete={() => setDeleteTarget(detailTarget.id)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message="Видалити рахунок? Транзакції залишаться, але від'єднаються від рахунку."
          onConfirm={handleDelete}
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