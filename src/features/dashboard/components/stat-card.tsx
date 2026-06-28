"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { BackgroundGradient } from "@/src/components/ui/background-gradient";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type BadgeVariant = "positive" | "negative" | "net";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  badgeVariant?: BadgeVariant;
  highlighted?: boolean; // BackgroundGradient wrapper
}

// ── slot-machine hook ──────────────────────────────────────────────
function useSlotValue(value: string) {
  const [from, setFrom] = useState(value);
  const [to, setTo] = useState(value);
  const [phase, setPhase] = useState<"idle" | "spin">("idle");
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    setFrom(prev.current);
    setTo(value);
    prev.current = value;

    setPhase("idle");
    // next tick so React flushes the idle state first
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("spin"));
    });
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const onAnimationEnd = () => {
    setFrom(value);
    setPhase("idle");
  };

  return { from, to, phase, onAnimationEnd };
}

// ── badge ──────────────────────────────────────────────────────────
function ChangeBadge({
  change,
  variant = "positive",
}: {
  change: number;
  variant?: BadgeVariant;
}) {
  if (variant === "net") {
    const pos = change >= 0;
    const Icon = pos ? TrendingUp : TrendingDown;
    return (
      <div
        className={`flex items-center gap-1 text-sm font-medium ${
          pos ? "text-green-500" : "text-red-500"
        }`}
      >
        <Icon className="h-4 w-4" />
        {pos ? "+" : "-"}${Math.abs(change).toFixed(2)}
      </div>
    );
  }

  const pos = variant === "positive";
  const Icon = pos ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium ${
        pos ? "text-green-500" : "text-red-500"
      }`}
    >
      <Icon className="h-4 w-4" />
      {Math.abs(change)}%
    </div>
  );
}

// ── animated value ─────────────────────────────────────────────────
function SlotValue({ value }: { value: string }) {
  const { from, to, phase, onAnimationEnd } = useSlotValue(value);

  return (
    <>
      <style>{`
        @keyframes _slot-up {
          0%   { transform: translateY(0);    opacity: 1; }
          40%  { transform: translateY(-110%); opacity: 0; }
          41%  { transform: translateY(110%);  opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        ._slot-spin {
          animation: _slot-up 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <div style={{ overflow: "hidden", height: "2rem" }}>
        <div
          className={phase === "spin" ? "_slot-spin" : undefined}
          onAnimationEnd={onAnimationEnd}
          style={{ willChange: "transform" }}
        >
          {phase === "spin" ? (
            <h2 className="text-2xl font-semibold tracking-tight">{to}</h2>
          ) : (
            <h2 className="text-2xl font-semibold tracking-tight">{from}</h2>
          )}
        </div>
      </div>
    </>
  );
}

// ── card body ──────────────────────────────────────────────────────
function StatCardInner({
  title,
  value,
  subtitle,
  change,
  badgeVariant,
}: Omit<StatCardProps, "highlighted">) {
  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm h-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {change !== undefined && (
          <ChangeBadge change={change} variant={badgeVariant} />
        )}
      </div>

      <div className="mt-3">
        <SlotValue value={value} />
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}

// ── public export ──────────────────────────────────────────────────
export function StatCard(props: StatCardProps) {
  if (props.highlighted) {
    return (
      <BackgroundGradient className="rounded-2xl h-full">
        <StatCardInner {...props} />
      </BackgroundGradient>
    );
  }
  return <StatCardInner {...props} />;
}