"use client";

import { AlertTriangle, CheckCircle2, Wallet, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";
import { ResultChart } from "./result-chart";
import { formatCurrency, monthsToText } from "../utils/formatters";
import type { SimulationInput, SimulationResult } from "@/src/types/investment";

export function InvestmentResults({ result, input }: { result: SimulationResult; input: SimulationInput }) {
  const goal = parseFloat(input.goal.replace(/\s/g, "")) || 0;
  const efficiencyTotal = result.totalContributions + result.totalInterest;

  return (
    <div className="flex flex-col gap-4">
      {result.warning ? (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 flex gap-3 items-start">
          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-500/90">{result.warning}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3 flex gap-3 items-start">
          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-500/90">
            {result.mode === "find_monthly" && `Щомісяця потрібно відкладати ${formatCurrency(result.monthlyRequired!)} €`}
            {result.mode === "find_time" && `Ціль досягнете за ${monthsToText(result.monthsRequired!)}`}
            {result.mode === "validate" && `Накопичите ${formatCurrency(result.finalBalance)} € — ціль досягнута!`}
          </p>
        </div>
      )}

      {result.mode === "find_monthly" && result.monthlyRequired !== undefined && (
        <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
          <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Потрібен щомісячний внесок</p>
          <p className="text-4xl font-bold tabular-nums mt-1">
            {formatCurrency(result.monthlyRequired)}
            <span className="text-lg font-normal text-muted-foreground ml-1">€/міс</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            при прибутковості {input.rate}% річних протягом {input.years} років
          </p>
        </div>
      )}

      {result.mode === "find_time" && result.monthsRequired !== undefined && (
        <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
          <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Час до цілі</p>
          <p className="text-4xl font-bold mt-1">{monthsToText(result.monthsRequired)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            при внеску {formatCurrency(parseFloat(input.monthly))} €/міс і прибутковості {input.rate}%
          </p>
        </div>
      )}

      {result.mode === "validate" && (
        <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
          <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Підсумковий баланс</p>
          <p className={["text-4xl font-bold tabular-nums mt-1", result.isRealistic ? "text-green-500" : "text-orange-500"].join(" ")}>
            {formatCurrency(result.finalBalance)}
            <span className="text-lg font-normal text-muted-foreground ml-1">€</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            через {input.years} {Number(input.years) === 1 ? "рік" : "років"} при {input.rate}% річних
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Всього внесків" value={`${formatCurrency(result.totalContributions)} €`} sub="Ваші гроші" />
        <StatCard label="Прибуток від %" value={`${formatCurrency(result.totalInterest)} €`} sub="Гроші роблять гроші" color="text-green-500" />
      </div>

      {result.totalContributions > 0 && (
        <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-2">
            <span>Ваші внески</span>
            <span>Складний відсоток</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-700"
              style={{ width: `${Math.min(100, (result.totalContributions / efficiencyTotal) * 100).toFixed(1)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] mt-1.5">
            <span className="font-medium tabular-nums">{((result.totalContributions / efficiencyTotal) * 100).toFixed(0)}%</span>
            <span className="font-medium tabular-nums text-green-500">{((result.totalInterest / efficiencyTotal) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <ResultChart data={result.chartData} goal={goal} />

      <p className="text-[10px] text-muted-foreground/50 text-center pb-2">
        Розрахунок є орієнтовним. Реальна прибутковість може відрізнятись через ринкові умови, інфляцію та інші фактори.
      </p>
    </div>
  );
}