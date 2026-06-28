export type BillingInterval = "month" | "year" | "lifetime" | "none";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

export interface PlanFeature {
  label: string;
  included: boolean;
  highlight?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: "free" | "pro" | "lifetime";
  description: string;
  monthlyPrice: number;   // price when billed monthly
  yearlyPrice: number;    // price when billed yearly (per month)
  lifetimePrice?: number;
  currency: string;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  stripe_price_id_lifetime?: string;
  features: PlanFeature[];
  maxAccounts: number | null;
  maxTransactionsPerMonth: number | null;
  badge?: string;
  highlighted?: boolean;
}

export interface CurrentSubscription {
  planSlug: "free" | "pro" | "lifetime";
  status: SubscriptionStatus;
  currentPeriodEnd?: string; // ISO date
  cancelAtPeriodEnd?: boolean;
  trialEndsAt?: string;
}