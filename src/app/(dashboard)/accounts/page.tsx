// src/app/(dashboard)/accounts/page.tsx
import AccountsClient from "@/src/features/accounts/components/accounts-client";

export default function AccountsPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <AccountsClient />
    </div>
  );
}