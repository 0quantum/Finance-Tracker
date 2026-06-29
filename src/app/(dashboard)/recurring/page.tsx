import RecurringClient from "@/src/features/recurring/components/recurring-client";

export default function RecurringPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <RecurringClient />
    </div>
  );
}
