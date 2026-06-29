import InvestmentClient from "@/src/features/investment/components/investment-client";
import { PaywallGuard } from "@/src/features/settings/billing/components/paywall-guard";

export default function InvestmentPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-none rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
  <PaywallGuard feature="investmentSimulator">
<InvestmentClient />
</PaywallGuard>
    </div>
);
}