import { Card } from "@/src/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface IncomeCardProps {
  title?: string;
  value: string;
  change?: number;
  subtitle?: string;
}

export function IncomeCard({
  title = "Income",
  value,
  change,
  subtitle,
}: IncomeCardProps) {
  return (
    <Card className="p-5 rounded-2xl border bg-white dark:bg-muted shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-500">
            <ArrowUpRight className="h-4 w-4" />
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-semibold tracking-tight">{value}</h2>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
