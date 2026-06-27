"use client";

import { Plus } from "lucide-react";
import { CurrencyInput } from "./currency-input-preview";
import { IconButton } from "./icon-button";
import { TransactionActions } from "./transaction-actions";

type TransactionFormProps = {
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  onOpenDetails: () => void;
  onOpenDatePicker: () => void;
  onOpenSettings: () => void;
};

export function TransactionForm({
  amount,
  onAmountChange,
  onSubmit,
  onOpenDetails,
  onOpenDatePicker,
  onOpenSettings,
}: TransactionFormProps) {
  const hasAmount = amount.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <CurrencyInput
        value={amount}
        onChange={onAmountChange}
        onKeyDown={handleKeyDown}
        size="sm"
        className="flex-1"
      />

      <TransactionActions
        visible={hasAmount}
        onOpenDetails={onOpenDetails}
        onOpenDatePicker={onOpenDatePicker}
        onOpenSettings={onOpenSettings}
      />

      <IconButton aria-label="Add transaction" onClick={onSubmit}>
        <Plus className="h-4 w-4" />
      </IconButton>
    </div>
  );
}