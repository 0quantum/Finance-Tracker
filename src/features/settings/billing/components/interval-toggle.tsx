// src/features/billing/components/interval-toggle.tsx
"use client";

export function IntervalToggle({
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