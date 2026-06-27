import { Card } from "@/src/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface NetCardProps {
  income: number;
  expenses: number;
  title?: string;
  subtitle?: string;
}

export function NetCard({
  income,
  expenses,
  title = "Net",
  subtitle,
}: NetCardProps) {
  const net = income - expenses;
  const isPositive = net >= 0;

  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {Math.abs(net)}$
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {isPositive ? "+" : "-"}{Math.abs(net)}$
        </h2>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

    </Card>
  );
}