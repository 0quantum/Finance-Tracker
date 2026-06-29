"use client";

import { TrendingUp, RotateCcw, Info, AlertTriangle } from "lucide-react";
import { useInvestmentSimulator } from "../hooks/use-investment-simulator";
import { InvestmentForm } from "./investment-form";
import { InvestmentResults } from "./investment-results";

export default function InvestmentClient() {
  const { input, set, submitted, result, modeHint, canSubmit, handleSubmit, handleReset } = useInvestmentSimulator();

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 md:p-8 h-full overflow-y-auto scrollbar-none max-w-2xl mx-auto w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Симулятор інвестицій</h1>
          </div>
          <p className="text-sm text-muted-foreground">Розрахуйте, як досягти фінансової цілі</p>
        </div>
        {submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Скинути
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 flex gap-3">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          Заповніть <strong className="text-foreground">ціль</strong> та одне з двох:{" "}
          <strong className="text-foreground">термін</strong> або{" "}
          <strong className="text-foreground">місячний внесок</strong> — або обидва для перевірки.
        </div>
      </div>

      <InvestmentForm input={input} set={set} modeHint={modeHint} canSubmit={canSubmit} onSubmit={handleSubmit} />

      {result === null && submitted && (
        <div className="rounded-2xl border border-dashed border-border/60 py-8 flex flex-col items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Недостатньо даних для розрахунку</p>
        </div>
      )}

      {result && <InvestmentResults result={result} input={input} />}
    </div>
  );
}