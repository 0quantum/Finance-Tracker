// src/features/billing/components/billing-client.tsx
"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { PLANS } from "@/src/config/plans";
import { useSubscription } from "@/src/features/settings/billing/hooks/use-subscription";
import { useBilling } from "@/src/features/settings/billing/hooks/use-billing";
import { IntervalToggle } from "./interval-toggle";
import { PlanCard } from "./plan-card";
import { CurrentPlanBanner } from "./current-plan-banner";
import { BillingFaq } from "./billing-faq";
import type { Plan } from "@/src/types/billing";

function getPriceId(plan: Plan, interval: "month" | "year" | "lifetime") {
  if (interval === "lifetime") return plan.stripe_price_id_lifetime ?? "";
  if (interval === "year") return plan.stripe_price_id_yearly ?? "";
  return plan.stripe_price_id_monthly ?? "";
}

export default function BillingClient() {
  const [interval, setInterval] = useState<"month" | "year">("year");
  const { subscription, loading } = useSubscription();
  const { startCheckout, openPortal, loadingPriceId, portalLoading, error } = useBilling();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 h-full overflow-y-auto scrollbar-none max-w-3xl mx-auto w-full">

      <div>
        <h1 className="text-lg font-semibold">Підписка</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Оберіть план, що підходить вам</p>
      </div>

      {!loading && subscription && (
        <CurrentPlanBanner
          subscription={subscription}
          onPortal={openPortal}
          portalLoading={portalLoading}
        />
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <IntervalToggle value={interval} onChange={setInterval} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const effectiveInterval: "month" | "year" | "lifetime" =
              plan.slug === "lifetime" ? "lifetime" : interval;
            const priceId = getPriceId(plan, effectiveInterval);
            const isCurrentPlan = subscription?.planSlug === plan.slug;
            const isBusy = loadingPriceId === priceId;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                interval={effectiveInterval}
                isCurrentPlan={!!isCurrentPlan}
                isBusy={isBusy}
                onSelect={() => startCheckout(priceId, plan.slug, effectiveInterval)}
              />
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: "🔒", text: "Stripe — безпечна оплата" },
          { icon: "↩️", text: "Скасування будь-коли" },
          { icon: "🛡️", text: "7 днів безкоштовно для Pro" },
        ].map((t) => (
          <div key={t.text} className="rounded-2xl border border-border/40 bg-muted/10 px-3 py-3">
            <p className="text-base mb-1">{t.icon}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{t.text}</p>
          </div>
        ))}
      </div>

      <BillingFaq />
    </div>
  );
}