"use client";

import { Lock, Sparkles } from "lucide-react";
import { useSubscription } from "@/src/features/billing/hooks/use-subscription";
import { useRouter } from "next/navigation";

interface PaywallGuardProps {
  feature: keyof ReturnType<typeof useSubscription>["can"];
  children: React.ReactNode;
  /** Compact inline lock instead of full overlay */
  inline?: boolean;
}

export function PaywallGuard({ feature, children, inline = false }: PaywallGuardProps) {
  const { can, loading } = useSubscription();
  const router = useRouter();

  if (loading) return <>{children}</>;
  if (can[feature]) return <>{children}</>;

  if (inline) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-40 blur-[1px]">{children}</div>
        <button
          onClick={() => router.push("/settings/billing")}
          className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
          Pro функція
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
      <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-base font-semibold mb-1">Pro функція</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Оновіть план, щоб отримати доступ до цього інструменту
        </p>
      </div>
      <button
        onClick={() => router.push("/settings/billing")}
        className="rounded-xl bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
      >
        Переглянути плани
      </button>
    </div>
  );
}