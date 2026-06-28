"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type {
  DailyBalance,
  MonthlyFlow,
} from "@/src/features/accounts/hooks/use-account-stats";
import { formatCurrency } from "@/src/features/transactions/components/form/currency-input-preview";

function formatDay(str: string) {
  return new Date(str).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });
}

function formatMonth(str: string) {
  const [y, m] = str.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("uk-UA", {
    month: "short",
  });
}

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
  padding: "8px 12px",
};

const cursorStyle = { fill: "hsl(var(--muted))", opacity: 0.5 };

export function BalanceChart({ data }: { data: DailyBalance[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
        Баланс · 30 днів
      </p>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0.12}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              interval={9}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={60}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              formatter={(value) => [
                formatCurrency(Number(value) || 0),
                "Баланс",
              ]}
              labelFormatter={(label) => formatDay(String(label))}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              fill="url(#balGrad)"
              dot={false}
              activeDot={{
                r: 3,
                fill: "hsl(var(--foreground))",
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FlowChart({ data }: { data: MonthlyFlow[] }) {
  if (!data.length) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
          Доходи vs Витрати
        </p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-sm bg-green-500/70" />{" "}
            Дохід
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-sm bg-red-400/70" />{" "}
            Витрати
          </span>
        </div>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
            barCategoryGap="35%"
            barGap={3}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={60}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={cursorStyle}
              formatter={(value, name) => [
                formatCurrency(Number(value) || 0),
                name === "income" ? "Дохід" : "Витрати",
              ]}
              labelFormatter={(label) => formatMonth(String(label))}
            />
            <Bar
              dataKey="income"
              fill="hsl(142 71% 45% / 0.75)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="hsl(0 84% 60% / 0.75)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
