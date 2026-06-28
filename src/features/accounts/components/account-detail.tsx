"use client";

import { Pencil, Trash2, X, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useAccountStats } from "@/src/features/accounts/hooks/use-account-stats";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";
import { BalanceChart, FlowChart } from "./account-charts";
import { TYPE_COLORS, typeIcon, typeLabel } from "./account-card";
import type { Account } from "@/src/types/accounts";

export function AccountDetail({ account, onClose, onEdit, onDelete }: {
  account: Account;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { stats, loading } = useAccountStats(account.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-background border border-border flex flex-col max-h-[92dvh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 shrink-0 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className={["flex h-10 w-10 items-center justify-center rounded-2xl", TYPE_COLORS[account.type]].join(" ")}>
              {typeIcon(account.type)}
            </div>
            <div>
              <p className="text-base font-semibold">{account.name}</p>
              <p className="text-xs text-muted-foreground">{typeLabel(account.type)} · {account.currency}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onEdit}
              className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDelete}
              className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={onClose}
              className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-none flex-1 p-5 space-y-6">

          {/* Balance block */}
          <div className="rounded-2xl bg-muted/30 border border-border/60 p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Поточний баланс</p>
            <p className="text-3xl font-bold tabular-nums leading-none">
              {formatCurrency(account.balance)}
              <span className="text-base font-normal text-muted-foreground ml-1.5">{account.currency}</span>
            </p>
            {stats && (
              <div className="flex gap-5 mt-3 pt-3 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-500 tabular-nums">{formatCurrency(stats.incomeThisMonth)}</p>
                    <p className="text-[10px] text-muted-foreground">дохід</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-400 tabular-nums">{formatCurrency(stats.expenseThisMonth)}</p>
                    <p className="text-[10px] text-muted-foreground">витрати</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {stats && (
            <>
              {/* Charts */}
              <div className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-6">
                <BalanceChart data={stats.dailyBalances} />
                <FlowChart data={stats.monthlyFlow} />
              </div>

              {/* Recent transactions */}
              {stats.recentTransactions.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
                    Останні транзакції
                  </p>
                  <div className="rounded-2xl border border-border/60 overflow-hidden">
                    {stats.recentTransactions.map((t, i) => (
                      <div key={t.id}
                        className={[
                          "flex items-center justify-between px-4 py-3",
                          i !== stats.recentTransactions.length - 1 ? "border-b border-border/40" : "",
                        ].join(" ")}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          {t.category ? (
                            <div
                              className="h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-medium"
                              style={{ background: t.category.color + "20", color: t.category.color }}>
                              {t.category.icon ?? t.category.name.slice(0, 1).toUpperCase()}
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-xl shrink-0 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              —
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm truncate">{t.description ?? t.category?.name ?? "—"}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(t.date).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                        </div>
                        <p className={[
                          "text-sm font-medium tabular-nums shrink-0 ml-3",
                          t.type === "income" ? "text-green-500" : "text-red-400",
                        ].join(" ")}>
                          {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}