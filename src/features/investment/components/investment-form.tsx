"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Target, ArrowRight } from "lucide-react";
import { NumInput } from "./num-input";
import { RateSelector } from "./rate-selector";
import type { SimulationInput } from "@/src/types/investment";

interface InvestmentFormProps {
  input: SimulationInput;
  set: (field: keyof SimulationInput) => (value: string | number) => void;
  modeHint: string;
  canSubmit: boolean;
  onSubmit: () => void;
}

export function InvestmentForm({ input, set, modeHint, canSubmit, onSubmit }: InvestmentFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 flex flex-col gap-4">
      <NumInput label="Фінансова ціль" placeholder="200 000" value={input.goal} onChange={set("goal")} suffix="€" hint="Скільки хочете накопичити?" />

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Термін" placeholder="10" value={input.years} onChange={set("years")} suffix="р." hint="Необов'язково" />
        <NumInput label="Місячний внесок" placeholder="500" value={input.monthly} onChange={set("monthly")} suffix="€" hint="Необов'язково" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Річна прибутковість</label>
        <RateSelector value={input.rate} onChange={(v) => set("rate")(v)} />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((p) => !p)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronDown className={["h-3.5 w-3.5 transition-transform", showAdvanced ? "rotate-180" : ""].join(" ")} />
        Початковий депозит
      </button>

      {showAdvanced && (
        <NumInput label="Початковий депозит" placeholder="0" value={input.initialDeposit} onChange={set("initialDeposit")} suffix="€" hint="Вже маєте заощадження?" />
      )}

      {modeHint && (
        <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">{modeHint}</p>
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
      >
        <Target className="h-4 w-4" />
        Розрахувати
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}