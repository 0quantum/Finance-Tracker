"use client";

import { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Infinity,
  Loader2,
  ExternalLink,
  AlertTriangle,
  BadgeCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { PLANS } from "@/src/config/plans";
import { useSubscription } from "@/src/features/billing/hooks/use-subscription";
import { useBilling } from "@/src/features/billing/hooks/use-billing";
import type { Plan } from "@/src/types/billing";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPriceId(plan: Plan, interval: "month" | "year" | "lifetime") {
  if (interval === "lifetime") return plan.stripe_price_id_lifetime ?? "";
  if (interval === "year") return plan.stripe_price_id_yearly ?? "";
  return plan.stripe_price_id_monthly ?? "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IntervalToggle({
  value,
  onChange,
}: {
  value: "month" | "year";
  onChange: (v: "month" | "year") => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1 text-sm">
      {(["month", "year"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={[
            "rounded-lg px-4 py-1.5 font-medium transition-all",
            value === v
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {v === "month" ? "Щомісяця" : "Щороку"}
          {v === "year" && (
            <span className="ml-1.5 text-[10px] font-semibold text-green-500">−25%</span>
          )}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  interval,
  isCurrentPlan,
  isBusy,
  onSelect,
}: {
  plan: Plan;
  interval: "month" | "year" | "lifetime";
  isCurrentPlan: boolean;
  isBusy: boolean;
  onSelect: () => void;
}) {
  const isLifetime = plan.slug === "lifetime";
  const price = isLifetime
    ? plan.lifetimePrice!
    : interval === "year"
    ? plan.yearlyPrice
    : plan.monthlyPrice;

  const isFree = plan.slug === "free";

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border p-5 transition-all",
        plan.highlighted
          ? "border-foreground shadow-lg shadow-foreground/5"
          : "border-border",
        isCurrentPlan ? "bg-muted/20" : "bg-background",
      ].join(" ")}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full border border-foreground bg-foreground text-background px-3 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {plan.slug === "free" && <Zap className="h-4 w-4 text-muted-foreground" />}
            {plan.slug === "pro" && <Sparkles className="h-4 w-4 text-violet-500" />}
            {plan.slug === "lifetime" && <Infinity className="h-4 w-4 text-amber-500" />}
            <p className="font-semibold">{plan.name}</p>
          </div>
          <p className="text-xs text-muted-foreground">{plan.description}</p>
        </div>
        {isCurrentPlan && (
          <span className="rounded-lg border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 whitespace-nowrap">
            Поточний
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-5">
        {isFree ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">Безкоштовно</span>
          </div>
        ) : isLifetime ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-sm text-muted-foreground">одноразово</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${price}</span>
              <span className="text-sm text-muted-foreground">/міс</span>
            </div>
            {interval === "year" && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                ${(price * 12).toFixed(0)} на рік · економія ${((plan.monthlyPrice - price) * 12).toFixed(0)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        disabled={isCurrentPlan || isBusy || isFree}
        onClick={onSelect}
        className={[
          "w-full rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 mb-5",
          isCurrentPlan || isFree
            ? "border border-border text-muted-foreground cursor-default"
            : plan.highlighted
            ? "bg-foreground text-background hover:opacity-90 active:scale-[0.98]"
            : "border border-foreground text-foreground hover:bg-muted active:scale-[0.98]",
        ].join(" ")}
      >
        {isBusy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isCurrentPlan ? (
          "Активний план"
        ) : isFree ? (
          "Поточний безкоштовний"
        ) : (
          <>
            {isLifetime ? "Купити назавжди" : "Почати з 7 днів безкоштовно"}
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5">
            <div
              className={[
                "mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center",
                f.included ? "bg-green-500/10" : "bg-muted",
              ].join(" ")}
            >
              {f.included ? (
                <Check className="h-2.5 w-2.5 text-green-500" />
              ) : (
                <X className="h-2.5 w-2.5 text-muted-foreground/40" />
              )}
            </div>
            <span
              className={[
                "text-sm leading-snug",
                !f.included && "text-muted-foreground/50",
                f.highlight && f.included && "font-medium",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CurrentPlanBanner({
  subscription,
  onPortal,
  portalLoading,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscription>["subscription"]>;
  onPortal: () => void;
  portalLoading: boolean;
}) {
  const isFree = subscription.planSlug === "free";
  const isLifetime = subscription.planSlug === "lifetime";
  const isTrial = subscription.status === "trialing";
  const isPastDue = subscription.status === "past_due";
  const willCancel = subscription.cancelAtPeriodEnd;

  if (isFree) return null;

  return (
    <div
      className={[
        "rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3",
        isPastDue
          ? "border-orange-500/20 bg-orange-500/5"
          : "border-border/60 bg-muted/20",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={[
            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
            isPastDue ? "bg-orange-500/10" : "bg-foreground/5",
          ].join(" ")}
        >
          {isPastDue ? (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          ) : isLifetime ? (
            <Infinity className="h-4 w-4 text-amber-500" />
          ) : isTrial ? (
            <Clock className="h-4 w-4" />
          ) : (
            <BadgeCheck className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {isPastDue && "Проблема з оплатою"}
            {!isPastDue && isTrial && `Пробний період до ${formatDate(subscription.trialEndsAt)}`}
            {!isPastDue && !isTrial && isLifetime && "Lifetime доступ активний"}
            {!isPastDue && !isTrial && !isLifetime && willCancel && `Скасовується ${formatDate(subscription.currentPeriodEnd)}`}
            {!isPastDue && !isTrial && !isLifetime && !willCancel && `Наступне списання ${formatDate(subscription.currentPeriodEnd)}`}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {isPastDue && "Оновіть платіжні дані, щоб зберегти доступ"}
            {!isPastDue && isTrial && "Після закінчення перейде на платний тариф"}
            {!isPastDue && !isTrial && isLifetime && "Всі функції доступні без обмежень"}
            {!isPastDue && !isTrial && !isLifetime && willCancel && "Доступ залишиться до кінця періоду"}
            {!isPastDue && !isTrial && !isLifetime && !willCancel && "Скасуйте будь-коли в налаштуваннях"}
          </p>
        </div>
      </div>
      {!isLifetime && (
        <button
          onClick={onPortal}
          disabled={portalLoading}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors shrink-0"
        >
          {portalLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              Керувати підпискою
              <ExternalLink className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [interval, setInterval] = useState<"month" | "year">("year");
  const { subscription, loading } = useSubscription();
  const { startCheckout, openPortal, loadingPriceId, portalLoading, error } = useBilling();

  // Show lifetime as a separate third option in the toggle? No — show it as plan card always.
  // The toggle only affects pro plan pricing.

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 h-full overflow-y-auto scrollbar-none max-w-3xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Підписка</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">
          Оберіть план, що підходить вам
        </p>
      </div>

      {/* Current plan status */}
      {!loading && subscription && (
        <CurrentPlanBanner
          subscription={subscription}
          onPortal={openPortal}
          portalLoading={portalLoading}
        />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Interval toggle */}
      <div className="flex justify-center">
        <IntervalToggle value={interval} onChange={setInterval} />
      </div>

      {/* Plan cards */}
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

      {/* Trust signals */}
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

      {/* FAQ */}
      <div className="rounded-2xl border border-border/60 bg-muted/10 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold">Часті запитання</p>
        {[
          {
            q: "Що відбувається після закінчення пробного періоду?",
            a: "Автоматично списується оплата за обраним тарифом. Ви можете скасувати до кінця пробного.",
          },
          {
            q: "Чи можна перейти з місячного на річний тариф?",
            a: "Так, будь-коли через Stripe Portal — різниця буде зарахована пропорційно.",
          },
          {
            q: "Що включає Lifetime?",
            a: "Всі поточні та майбутні функції Pro назавжди — без жодних повторних платежів.",
          },
          {
            q: "Що станеться з даними після скасування?",
            a: "Дані зберігаються. Доступ обмежується до ліміту Free плану.",
          },
        ].map((item) => (
          <div key={item.q} className="border-t border-border/40 pt-4 first:border-0 first:pt-0">
            <p className="text-sm font-medium mb-1">{item.q}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}