"use client";

const RATES = [3, 5, 7, 10, 12, 15];

export function RateSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {RATES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={[
            "rounded-xl border px-3 py-1.5 text-sm font-medium transition-all",
            value === r
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          {r}%
        </button>
      ))}
    </div>
  );
}