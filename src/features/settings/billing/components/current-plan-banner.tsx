// src/features/billing/components/current-plan-banner.tsx
"use client";

import {
  AlertTriangle, BadgeCheck, Clock,
  ExternalLink, Infinity, Loader2,
} from "lucide-react";
import type { useSubscription } from "@/src/features/settings/billing/hooks/use-subscription";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric", month: "long", year: "numeric",
  });
}

type Subscription = NonNullable<ReturnType<typeof useSubscription>["subscription"]>;

export function CurrentPlanBanner({
  subscription,
  onPortal,
  portalLoading,
}: {
  subscription: Subscription;
  onPortal: () => void;
  portalLoading: boolean;
}) {
  const isFree     = subscription.planSlug === "free";
  const isLifetime = subscription.planSlug === "lifetime";
  const isTrial    = subscription.status === "trialing";
  const isPastDue  = subscription.status === "past_due";
  const willCancel = subscription.cancelAtPeriodEnd;

  if (isFree) return null;

  return (
    <div className={[
      "rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3",
      isPastDue ? "border-orange-500/20 bg-orange-500/5" : "border-border/60 bg-muted/20",
    ].join(" ")}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={[
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
          isPastDue ? "bg-orange-500/10" : "bg-foreground/5",
        ].join(" ")}>
          {isPastDue  ? <AlertTriangle className="h-4 w-4 text-orange-500" />  :
           isLifetime ? <Infinity      className="h-4 w-4 text-amber-500" />   :
           isTrial    ? <Clock         className="h-4 w-4" />                  :
                        <BadgeCheck    className="h-4 w-4 text-green-500" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {isPastDue                                  && "Проблема з оплатою"}
            {!isPastDue && isTrial                      && `Пробний період до ${formatDate(subscription.trialEndsAt)}`}
            {!isPastDue && !isTrial && isLifetime        && "Lifetime доступ активний"}
            {!isPastDue && !isTrial && !isLifetime && willCancel  && `Скасовується ${formatDate(subscription.currentPeriodEnd)}`}
            {!isPastDue && !isTrial && !isLifetime && !willCancel && `Наступне списання ${formatDate(subscription.currentPeriodEnd)}`}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {isPastDue                                  && "Оновіть платіжні дані, щоб зберегти доступ"}
            {!isPastDue && isTrial                      && "Після закінчення перейде на платний тариф"}
            {!isPastDue && !isTrial && isLifetime        && "Всі функції доступні без обмежень"}
            {!isPastDue && !isTrial && !isLifetime && willCancel  && "Доступ залишиться до кінця періоду"}
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
          {portalLoading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <><span>Керувати підпискою</span><ExternalLink className="h-3 w-3" /></>}
        </button>
      )}
    </div>
  );
}