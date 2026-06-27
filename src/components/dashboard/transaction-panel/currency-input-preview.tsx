"use client";

import { useMemo, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";

/* ---------------------------------- */
/* Shared formatter + helper          */
/* ---------------------------------- */

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number | string): string {
  const num = Number(value);
  if (value === "" || value === null || value === undefined || isNaN(num)) {
    return "—";
  }
  return currencyFormatter.format(num);
}

/* ---------------------------------- */
/* Reusable CurrencyInput             */
/* ---------------------------------- */

type CurrencyInputSize = "sm" | "lg";

type SizeConfig = {
  wrapper: string;
  text: string;
};

function getSizeClasses(size: CurrencyInputSize): SizeConfig {
  switch (size) {
    case "sm":
      return { wrapper: "px-3 py-2", text: "text-sm" };
    case "lg":
    default:
      return { wrapper: "px-3 py-4", text: "text-3xl" };
  }
}

type CurrencyInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: CurrencyInputSize;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
  size = "lg",
  className = "",
  onKeyDown,
}: CurrencyInputProps) {
  const s = getSizeClasses(size);

  return (
    <div
      className={`flex items-end gap-2 rounded-lg border bg-muted/30 ${s.wrapper} ${className}`}
    >
      <span className={`${s.text} font-thin text-muted-foreground select-none`}>
        $
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type="text"
        inputMode="decimal"
        className={`
          w-full
          bg-transparent
          border-0
          outline-none
          ${s.text}
          font-thin
          tracking-tight
          font-mono
          placeholder:text-muted-foreground/40
          caret-transparent
        `}
      />
    </div>
  );
}

/* ---------------------------------- */
/* Demo / preview card                */
/* ---------------------------------- */

export function CurrencyInputPreview() {
  const [value, setValue] = useState<string>("");
  const formatted = useMemo(() => formatCurrency(value), [value]);

  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Currency Display
          </h3>
        </div>
        <Label>Amount</Label>

        <CurrencyInput value={value} onChange={setValue} size="lg" />

        <div className="rounded-lg border border-muted bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Preview</p>
          <p className="text-lg font-thin tracking-tight font-mono">
            {formatted}
          </p>
        </div>
      </div>
    </Card>
  );
}