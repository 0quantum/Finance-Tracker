"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { CurrentSubscription } from "@/src/types/billing";

export function useSubscription() {
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("subscriptions")
        .select(`
          status,
          current_period_end,
          cancel_at_period_end,
          trial_ends_at,
          subscription_plans ( slug )
        `)
        .eq("user_id", user.id)
        .single();

      if (!mounted) return;

      if (!data) {
        // No row → free plan
        setSubscription({ planSlug: "free", status: "active" });
      } else {
        setSubscription({
          planSlug: (data.subscription_plans as any)?.slug ?? "free",
          status: data.status,
          currentPeriodEnd: data.current_period_end ?? undefined,
          cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
          trialEndsAt: data.trial_ends_at ?? undefined,
        });
      }
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, []);

  const isPro = subscription?.planSlug === "pro" && subscription.status === "active";
  const isLifetime = subscription?.planSlug === "lifetime" && subscription.status === "active";
  const hasAccess = isPro || isLifetime;

  // Feature gates
  const can = {
    investmentSimulator: hasAccess,
    unlimitedAccounts: hasAccess,
    unlimitedTransactions: hasAccess,
    exportData: hasAccess,
    prioritySupport: isLifetime,
  };

  return { subscription, loading, isPro, isLifetime, hasAccess, can };
}