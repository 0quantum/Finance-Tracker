import InvestmentClient from "@/src/features/investment/components/investment-client";
import { PaywallGuard } from "@/src/features/settings/billing/components/paywall-guard";

export default function InvestmentPage() {
  return (<PaywallGuard feature="investmentSimulator">
<InvestmentClient />
</PaywallGuard>);
}