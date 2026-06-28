"use client";

import { CurrencyInput } from "./currency-input-preview";
import { TransactionActions } from "./transaction-actions";

type TransactionFormProps = {
  amount: string;
  onAmountChange: (value: string) => void;
  onOpenDetails: () => void;
  onOpenDatePicker: () => void;
  onOpenSettings: () => void;
};

export function TransactionForm({
  amount,
  onAmountChange,
  onOpenDetails,
  onOpenDatePicker,
  onOpenSettings,
}: TransactionFormProps) {
  const hasAmount = amount.trim().length > 0;

  return (
    <div className="flex items-center gap-2 mb-4">
      <CurrencyInput
        value={amount}
        onChange={onAmountChange}
        size="sm"
        className="flex-1"
      />
      <TransactionActions
        visible={hasAmount}
        onOpenDetails={onOpenDetails}
        onOpenDatePicker={onOpenDatePicker}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
