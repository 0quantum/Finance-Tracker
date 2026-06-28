// src/app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/src/lib/supabase/server";
import { PLANS } from "@/src/config/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { priceId, planSlug, interval } = await req.json() as {
      priceId: string;
      planSlug: string;
      interval: "month" | "year" | "lifetime";
    };

    if (!priceId || !planSlug) {
      return NextResponse.json({ error: "Missing priceId or planSlug" }, { status: 400 });
    }

    const plan = PLANS.find((p) => p.slug === planSlug);
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email ?? "",
        name: profile?.full_name ?? "",
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    // Lifetime = one-time payment
    if (interval === "lifetime") {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/settings/billing?success=true&plan=${planSlug}`,
        cancel_url: `${origin}/settings/billing?canceled=true`,
        metadata: {
          supabase_user_id: user.id,
          plan_slug: planSlug,
          interval,
        },
        allow_promotion_codes: true,
      });
      return NextResponse.json({ url: session.url });
    }

    // Subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/settings/billing?success=true&plan=${planSlug}`,
      cancel_url: `${origin}/settings/billing?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_slug: planSlug,
        },
        trial_period_days: planSlug === "pro" ? 7 : undefined,
      },
      metadata: {
        supabase_user_id: user.id,
        plan_slug: planSlug,
        interval,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[billing/checkout]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}