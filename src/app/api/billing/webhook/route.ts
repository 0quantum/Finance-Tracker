// src/app/api/billing/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/src/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper: витягує period з нового Stripe API
function getSubPeriod(sub: Stripe.Subscription) {
  // У новому API period живе на першому item
  const item = sub.items?.data?.[0];
  const periodStart = (item as any)?.current_period_start ?? (sub as any).current_period_start;
  const periodEnd   = (item as any)?.current_period_end   ?? (sub as any).current_period_end;
  const trialEnd    = (sub as any).trial_end ?? null;
  const cancelAtEnd = (sub as any).cancel_at_period_end ?? false;

  return {
    periodStart: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    periodEnd:   periodEnd   ? new Date(periodEnd   * 1000).toISOString() : null,
    trialEndsAt: trialEnd    ? new Date(trialEnd    * 1000).toISOString() : null,
    cancelAtPeriodEnd: cancelAtEnd as boolean,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[webhook] signature verification failed", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency
  const { data: existing } = await supabase
    .from("billing_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .single();

  if (existing) return NextResponse.json({ received: true });

  await supabase.from("billing_events").insert({
    stripe_event_id: event.id,
    type: event.type,
    payload: event.data.object,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId   = session.metadata?.supabase_user_id;
        const planSlug = session.metadata?.plan_slug;
        const interval = session.metadata?.interval;
        if (!userId || !planSlug) break;

        if (interval === "lifetime" && session.mode === "payment") {
          await upsertSubscription(supabase, {
            userId,
            planSlug,
            status: "active",
            stripeSubscriptionId: null,
            periodStart: new Date().toISOString(),
            periodEnd: null,
            cancelAtPeriodEnd: false,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub      = event.data.object as Stripe.Subscription;
        const userId   = sub.metadata?.supabase_user_id;
        const planSlug = sub.metadata?.plan_slug;
        if (!userId || !planSlug) break;

        const { periodStart, periodEnd, trialEndsAt, cancelAtPeriodEnd } = getSubPeriod(sub);

        await upsertSubscription(supabase, {
          userId,
          planSlug,
          status: sub.status,
          stripeSubscriptionId: sub.id,
          periodStart,
          periodEnd,
          cancelAtPeriodEnd,
          trialEndsAt,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        const { data: freePlan } = await supabase
          .from("subscription_plans")
          .select("id")
          .eq("slug", "free")
          .single();

        if (freePlan) {
          await supabase
            .from("subscriptions")
            .update({
              plan_id: freePlan.id,
              status: "canceled",
              cancel_at_period_end: false,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  supabase: any,
  opts: {
    userId: string;
    planSlug: string;
    status: string;
    stripeSubscriptionId: string | null;
    periodStart: string | null;
    periodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: string | null;
  }
) {
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("slug", opts.planSlug)
    .single();

  if (!plan) throw new Error(`Plan not found: ${opts.planSlug}`);

  await supabase.from("subscriptions").upsert(
    {
      user_id:                opts.userId,
      plan_id:                plan.id,
      status:                 opts.status,
      stripe_subscription_id: opts.stripeSubscriptionId,
      current_period_start:   opts.periodStart,
      current_period_end:     opts.periodEnd,
      cancel_at_period_end:   opts.cancelAtPeriodEnd,
      trial_ends_at:          opts.trialEndsAt ?? null,
      updated_at:             new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}