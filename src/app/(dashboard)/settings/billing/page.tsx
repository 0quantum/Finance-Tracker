// src/app/(dashboard)/settings/billing/page.tsx
import BillingClient from "@/src/features/settings/billing/components/billing-client";

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <BillingClient />
    </div>
  );
}