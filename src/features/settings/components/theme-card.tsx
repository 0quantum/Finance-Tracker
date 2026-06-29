"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

type Theme = "light" | "dark" | "system";

// client-only mounted flag без setState в ефекті
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const options: { value: Theme; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      <p className="text-sm font-medium mb-0.5">Appearance</p>
      <p className="text-xs text-muted-foreground mb-4">
        Choose how FinanceApp looks for you
      </p>

      <div className="flex rounded-lg border overflow-hidden text-sm">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex-1 py-2 font-medium transition-colors whitespace-nowrap",
              mounted && theme === o.value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Card>
  );
}