"use client";

import { Card } from "@/src/components/ui/card";
import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionForm } from "./transaction-form";
import { TransactionList } from "./transaction-list";

type TransactionsPanelProps = {
  onTransactionAdded?: () => void;
};

export function TransactionsPanel({ onTransactionAdded }: TransactionsPanelProps) {
  const { transactions, loading, error, addTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTransaction = async () => {
    if (!amount || isSubmitting) return;

    setIsSubmitting(true);
    const result = await addTransaction({
      amount: Number(amount),
      type: "expense", // TODO: підставити значення з діалогу/налаштувань
    });
    setIsSubmitting(false);

    if (result) {
      setAmount("");
      onTransactionAdded?.();
    }
  };

  const openDetailsDialog = () => {
    // TODO: діалог з description/категорією транзакції
  };

  const openDatePicker = () => {
    // TODO: вибір дати транзакції (поле date)
  };

  const openSettingsDialog = () => {
    // TODO: вибір account_id / category_id / type
  };

  return (
    <Card className="flex min-h-[200px] flex-col rounded-2xl border bg-white p-5 shadow-sm dark:bg-muted">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Transactions
        </h3>
      </div>

      <TransactionForm
        amount={amount}
        onAmountChange={setAmount}
        onSubmit={handleAddTransaction}
        onOpenDetails={openDetailsDialog}
        onOpenDatePicker={openDatePicker}
        onOpenSettings={openSettingsDialog}
      />

      <TransactionList
        transactions={transactions}
        loading={loading}
        error={error}
      />
    </Card>
  );
}