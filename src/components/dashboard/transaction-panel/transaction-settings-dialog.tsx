"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Account = { id: string; name: string; type: string; currency: string };

type Props = {
  open: boolean;
  onClose: () => void;
  accountId: string | null;
  onAccountChange: (id: string | null) => void;
};

const ACCOUNT_ICONS: Record<string, string> = {
  cash: "💵",
  bank: "🏦",
  card: "💳",
  crypto: "₿",
};

export function TransactionSettingsDialog({
  open,
  onClose,
  accountId,
  onAccountChange,
}: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("accounts")
      .select("id, name, type, currency")
      .then(({ data }) => setAccounts(data ?? []));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">Рахунок</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <button
            onClick={() => { onAccountChange(null); onClose(); }}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
              !accountId ? "border-primary/50 bg-primary/5" : ""
            }`}
          >
            <span className="text-base">🔀</span>
            <span className="flex-1 text-left">Без рахунку</span>
            {!accountId && <span className="text-xs text-muted-foreground">✓</span>}
          </button>

          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => { onAccountChange(acc.id); onClose(); }}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                accountId === acc.id ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <span className="text-base">{ACCOUNT_ICONS[acc.type] ?? "💰"}</span>
              <span className="flex-1 text-left">{acc.name}</span>
              <span className="text-xs text-muted-foreground">{acc.currency}</span>
              {accountId === acc.id && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </button>
          ))}

          {accounts.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Рахунки не знайдені
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}