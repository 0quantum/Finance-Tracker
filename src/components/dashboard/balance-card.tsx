import { Card } from "@/src/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BackgroundGradient } from "@/src/components/ui/background-gradient";

interface BalanceCardProps {
  title: string;
  value: string;
  change: number;
  subtitle?: string;
}

export function BalanceCard({
  title,
  value,
  change,
  subtitle,
}: BalanceCardProps) {
  const isPositive = change >= 0;

  return (
    <BackgroundGradient className="rounded-2xl">
      <Card className="p-5 rounded-2xl border bg-white dark:bg-muted 50 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>

          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-2xl font-semibold tracking-tight">{value}</h2>

          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </Card>
    </BackgroundGradient>
  );
}
