"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { ChartPoint } from "@/src/types/investment";
import { formatN, formatCurrency } from "../utils/formatters";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-background/95 backdrop-blur-sm px-3 py-2.5 text-xs shadow-xl">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold tabular-nums">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultChart({ data, goal }: { data: ChartPoint[]; goal: number }) {
  if (!data.length) return null;
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4 font-medium">
        Зростання капіталу
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradContrib" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => formatN(v)} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={goal}
            stroke="hsl(var(--foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.3}
            label={{ value: "Ціль", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <Area type="monotone" dataKey="contributions" name="Внески" stroke="#6366f1" strokeWidth={1.5} fill="url(#gradContrib)" dot={false} />
          <Area type="monotone" dataKey="balance" name="Баланс" stroke="hsl(var(--foreground))" strokeWidth={2} fill="url(#gradBalance)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        {[
          { color: "hsl(var(--foreground))", label: "Баланс" },
          { color: "#6366f1", label: "Внески" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="h-1.5 w-4 rounded-full" style={{ background: l.color }} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}