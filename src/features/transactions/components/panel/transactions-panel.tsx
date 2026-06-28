"use client";

import { Card } from "@/src/components/ui/card";
import { useState } from "react";
import { useTransactions } from "@/src/features/transactions/hooks/use-transactions";
import { useCategorySummary } from "@/src/features/dashboard/hooks/use-category-summary";
import { TransactionForm } from "../form/transaction-form";
import { CategoryGrid } from "../category-grid";
import { TransactionDetailsDialog } from "../dialogs/transaction-details-dialog";
import { DatePickerDialog } from "@/src/components/date-dialog";
import { TransactionSettingsDialog } from "../dialogs/transaction-settings-dialog";
import { AddCategoryDialog } from "../dialogs/add-category-dialog";

type Props = { onTransactionAdded?: () => void };

export function TransactionsPanel({ onTransactionAdded }: Props) {
  const { addTransaction } = useTransactions();
  const { categories, loading, error, refresh } = useCategorySummary();

  const [amount, setAmount] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  const parsedAmount = parseFloat(amount.replace(",", "."));
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleAddToCategory = async (
    categoryId: string,
    type: "income" | "expense",
  ) => {
    if (!isValidAmount || isSubmitting) return;
    setSubmitting(true);

    const result = await addTransaction({
      amount: parsedAmount,
      type,
      category_id: categoryId,
      description: description || undefined,
      account_id: accountId || undefined,
      date: date?.toISOString(),
    });

    setSubmitting(false);
    if (result) {
      setAmount("");
      setDescription("");
      setDate(null);
      refresh();
      onTransactionAdded?.();
    }
  };

  return (
    <>
      <Card className="flex flex-col rounded-2xl border bg-white dark:bg-muted shadow-sm p-4 sm:p-5">
        {/* header */}
        <div className="mb-3 flex items-center justify-between gap-2 shrink-0">
          <h3 className="text-sm font-medium text-muted-foreground">
            Категорії
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 min-w-0">
            {description && (
              <span className="truncate max-w-[120px]">{description}</span>
            )}
            {date && (
              <span className="shrink-0">
                {date.toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>

        {/* form */}
        <div className="shrink-0">
          <TransactionForm
            amount={amount}
            onAmountChange={setAmount}
            onOpenDetails={() => setDetailsOpen(true)}
            onOpenDatePicker={() => setDateOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* grid */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <CategoryGrid
            categories={categories}
            loading={loading}
            error={error}
            isValidAmount={isValidAmount}
            onCategoryClick={handleAddToCategory}
            isSubmitting={isSubmitting}
            onAddCategory={() => setAddCategoryOpen(true)}
          />
        </div>
      </Card>

      <TransactionDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        value={description}
        onChange={setDescription}
      />
      <DatePickerDialog
        title="Дата транзакції"
        maxDate={new Date()}
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        value={date}
        onChange={setDate}
      />

      <TransactionSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        accountId={accountId}
        onAccountChange={setAccountId}
      />
      <AddCategoryDialog
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onCreated={refresh}
      />
    </>
  );
}
