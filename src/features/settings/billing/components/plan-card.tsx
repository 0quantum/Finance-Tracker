// src/features/billing/components/plan-card.tsx
"use client";

import { Check, X, Sparkles, Zap, Infinity, Loader2, ChevronRight } from "lucide-react";
import type { Plan } from "@/src/types/billing";

export function PlanCard({
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
  const isFree = plan.slug === "free";

  const price = isLifetime
    ? plan.lifetimePrice!
    : interval === "year"
    ? plan.yearlyPrice
    : plan.monthlyPrice;

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border p-5 transition-all",
        plan.highlighted ? "border-foreground shadow-lg shadow-foreground/5" : "border-border",
        isCurrentPlan ? "bg-muted/20" : "bg-background",
      ].join(" ")}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full border border-foreground bg-foreground text-background px-3 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {isFree     && <Zap      className="h-4 w-4 text-muted-foreground" />}
            {plan.slug === "pro"      && <Sparkles className="h-4 w-4 text-violet-500" />}
            {isLifetime && <Infinity className="h-4 w-4 text-amber-500" />}
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

      <div className="mb-5">
        {isFree ? (
          <span className="text-3xl font-bold">Безкоштовно</span>
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

      <ul className="flex flex-col gap-2">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5">
            <div className={[
              "mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center",
              f.included ? "bg-green-500/10" : "bg-muted",
            ].join(" ")}>
              {f.included
                ? <Check className="h-2.5 w-2.5 text-green-500" />
                : <X className="h-2.5 w-2.5 text-muted-foreground/40" />}
            </div>
            <span className={[
              "text-sm leading-snug",
              !f.included && "text-muted-foreground/50",
              f.highlight && f.included && "font-medium",
            ].filter(Boolean).join(" ")}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}