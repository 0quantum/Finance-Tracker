"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TrendingUp,
  Target,
  Clock,
  Wallet,
  ChevronDown,
  Info,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "find_monthly" | "find_time" | "validate";

interface SimulationInput {
  goal: string;
  monthly: string;
  years: string;
  rate: number;
  initialDeposit: string;
}

interface SimulationResult {
  mode: Mode;
  monthlyRequired?: number;
  monthsRequired?: number;
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  isRealistic: boolean;
  warning?: string;
  chartData: ChartPoint[];
}

interface ChartPoint {
  label: string;
  balance: number;
  contributions: number;
  interest: number;
}

// ─── Math Engine ─────────────────────────────────────────────────────────────

function simulateGrowth(
  goal: number,
  monthly: number,
  months: number,
  annualRate: number,
  initial: number
): ChartPoint[] {
  const r = annualRate / 100 / 12;
  const points: ChartPoint[] = [];
  let balance = initial;
  let contributions = initial;

  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      balance = balance * (1 + r) + monthly;
      contributions += monthly;
    }
    const interest = balance - contributions;
    if (m % Math.max(1, Math.floor(months / 24)) === 0 || m === months) {
      const yr = m / 12;
      points.push({
        label: yr < 1 ? `${m}м` : `${yr % 1 === 0 ? yr : yr.toFixed(1)}р`,
        balance: Math.round(balance),
        contributions: Math.round(contributions),
        interest: Math.round(Math.max(0, interest)),
      });
    }
  }
  return points;
}

function calcMonthlyRequired(
  goal: number,
  months: number,
  annualRate: number,
  initial: number
): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.max(0, (goal - initial) / months);
  const fv = initial * Math.pow(1 + r, months);
  const remaining = goal - fv;
  if (remaining <= 0) return 0;
  return (remaining * r) / (Math.pow(1 + r, months) - 1);
}

function calcMonthsRequired(
  goal: number,
  monthly: number,
  annualRate: number,
  initial: number
): number {
  const r = annualRate / 100 / 12;
  if (initial >= goal) return 0;
  if (r === 0) {
    if (monthly <= 0) return Infinity;
    return Math.ceil((goal - initial) / monthly);
  }
  const num = Math.log((goal * r + monthly) / (initial * r + monthly));
  const den = Math.log(1 + r);
  return Math.ceil(num / den);
}

function runSimulation(input: SimulationInput): SimulationResult | null {
  const goal = parseFloat(input.goal.replace(/\s/g, ""));
  const monthly = parseFloat(input.monthly.replace(/\s/g, "")) || 0;
  const years = parseFloat(input.years) || 0;
  const initial = parseFloat(input.initialDeposit.replace(/\s/g, "")) || 0;
  const rate = input.rate;

  if (!goal || goal <= 0) return null;

  const hasMonthly = !!input.monthly && monthly > 0;
  const hasYears = !!input.years && years > 0;

  let mode: Mode;
  let monthlyRequired: number | undefined;
  let monthsRequired: number | undefined;
  let finalBalance: number;
  let totalMonths: number;
  let warning: string | undefined;

  if (!hasMonthly && hasYears) {
    // Calculate required monthly
    mode = "find_monthly";
    totalMonths = Math.round(years * 12);
    monthlyRequired = calcMonthlyRequired(goal, totalMonths, rate, initial);
    finalBalance = goal;
    if (monthlyRequired > goal * 0.5) warning = "Дуже великий внесок відносно цілі. Перевірте параметри.";
  } else if (hasMonthly && !hasYears) {
    // Calculate time
    mode = "find_time";
    monthsRequired = calcMonthsRequired(goal, monthly, rate, initial);
    if (!isFinite(monthsRequired) || monthsRequired > 600) {
      return {
        mode: "find_time",
        finalBalance: 0,
        totalContributions: 0,
        totalInterest: 0,
        isRealistic: false,
        warning: "З такими параметрами цілі не досягти за розумний час. Збільште внесок або зменшіть ціль.",
        chartData: [],
      };
    }
    totalMonths = monthsRequired;
    finalBalance = goal;
  } else if (hasMonthly && hasYears) {
    // Validate
    mode = "validate";
    totalMonths = Math.round(years * 12);
    const r = rate / 100 / 12;
    let bal = initial;
    for (let m = 1; m <= totalMonths; m++) bal = bal * (1 + r) + monthly;
    finalBalance = Math.round(bal);
    if (finalBalance < goal) warning = `Не вистачає ${formatN(goal - finalBalance)} до цілі.`;
  } else {
    return null;
  }

  const chartData = simulateGrowth(goal, mode === "find_monthly" ? monthlyRequired! : monthly, totalMonths, rate, initial);
  const totalContributions = initial + (mode === "find_monthly" ? monthlyRequired! : monthly) * totalMonths;
  const totalInterest = Math.max(0, (mode === "validate" ? finalBalance : goal) - totalContributions);

  return {
    mode,
    monthlyRequired,
    monthsRequired,
    finalBalance: mode === "validate" ? finalBalance : goal,
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    isRealistic: !warning || mode === "validate" ? finalBalance >= goal : true,
    warning,
    chartData,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatN(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "М";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.?0+$/, "") + "К";
  return n.toFixed(0);
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function monthsToText(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  const parts = [];
  if (y > 0) parts.push(`${y} ${y === 1 ? "рік" : y < 5 ? "роки" : "років"}`);
  if (mo > 0) parts.push(`${mo} ${mo === 1 ? "місяць" : mo < 5 ? "місяці" : "місяців"}`);
  return parts.join(" і ");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const RATES = [3, 5, 7, 10, 12, 15];

function RateSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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

function NumInput({
  label,
  placeholder,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[16px] leading-tight outline-none focus:ring-2 focus:ring-foreground/10 pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 flex flex-col gap-1">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={["text-xl font-bold tabular-nums leading-tight", color ?? ""].join(" ")}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
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
};

function ResultChart({ data, goal }: { data: ChartPoint[]; goal: number }) {
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
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatN(v)}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={goal}
            stroke="hsl(var(--foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.3}
            label={{ value: "Ціль", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="contributions"
            name="Внески"
            stroke="#6366f1"
            strokeWidth={1.5}
            fill="url(#gradContrib)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Баланс"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            fill="url(#gradBalance)"
            dot={false}
          />
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InvestmentSimulatorPage() {
  const [input, setInput] = useState<SimulationInput>({
    goal: "",
    monthly: "",
    years: "",
    rate: 7,
    initialDeposit: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = useCallback(
    (field: keyof SimulationInput) => (value: string | number) =>
      setInput((prev) => ({ ...prev, [field]: value })),
    []
  );

  const result = useMemo(() => {
    if (!submitted) return null;
    return runSimulation(input);
  }, [input, submitted]);

  const hasGoal = !!input.goal;
  const hasMonthly = !!input.monthly;
  const hasYears = !!input.years;

  let modeHint = "";
  if (hasGoal && !hasMonthly && !hasYears) modeHint = "Вкажіть термін або місячний внесок";
  else if (hasGoal && !hasMonthly && hasYears) modeHint = "Розрахує необхідний місячний внесок";
  else if (hasGoal && hasMonthly && !hasYears) modeHint = "Розрахує скільки часу потрібно";
  else if (hasGoal && hasMonthly && hasYears) modeHint = "Перевірить чи досягнете цілі";

  const canSubmit = hasGoal && (hasMonthly || hasYears);

  const handleReset = () => {
    setInput({ goal: "", monthly: "", years: "", rate: 7, initialDeposit: "" });
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 md:p-8 h-full overflow-y-auto scrollbar-none max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Симулятор інвестицій</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Розрахуйте, як досягти фінансової цілі
          </p>
        </div>
        {submitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Скинути
          </button>
        )}
      </div>

      {/* Mode explanation */}
      <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 flex gap-3">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          Заповніть <strong className="text-foreground">ціль</strong> та одне з двох:{" "}
          <strong className="text-foreground">термін</strong> або{" "}
          <strong className="text-foreground">місячний внесок</strong> — або обидва для перевірки.
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-border bg-background p-5 flex flex-col gap-4">

        <NumInput
          label="Фінансова ціль"
          placeholder="200 000"
          value={input.goal}
          onChange={set("goal")}
          suffix="€"
          hint="Скільки хочете накопичити?"
        />

        <div className="grid grid-cols-2 gap-3">
          <NumInput
            label="Термін"
            placeholder="10"
            value={input.years}
            onChange={set("years")}
            suffix="р."
            hint="Необов'язково"
          />
          <NumInput
            label="Місячний внесок"
            placeholder="500"
            value={input.monthly}
            onChange={set("monthly")}
            suffix="€"
            hint="Необов'язково"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Річна прибутковість
          </label>
          <RateSelector value={input.rate} onChange={(v) => set("rate")(v)} />
        </div>

        {/* Advanced */}
        <button
          type="button"
          onClick={() => setShowAdvanced((p) => !p)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronDown className={["h-3.5 w-3.5 transition-transform", showAdvanced ? "rotate-180" : ""].join(" ")} />
          Початковий депозит
        </button>

        {showAdvanced && (
          <NumInput
            label="Початковий депозит"
            placeholder="0"
            value={input.initialDeposit}
            onChange={set("initialDeposit")}
            suffix="€"
            hint="Вже маєте заощадження?"
          />
        )}

        {/* Mode hint */}
        {modeHint && (
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">{modeHint}</p>
          </div>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
        >
          <Target className="h-4 w-4" />
          Розрахувати
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Results */}
      {result === null && submitted && (
        <div className="rounded-2xl border border-dashed border-border/60 py-8 flex flex-col items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Недостатньо даних для розрахунку</p>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-4">

          {/* Warning or success banner */}
          {result.warning ? (
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 flex gap-3 items-start">
              <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-500/90">{result.warning}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3 flex gap-3 items-start">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-green-500/90">
                {result.mode === "find_monthly" && `Щомісяця потрібно відкладати ${formatCurrency(result.monthlyRequired!)} €`}
                {result.mode === "find_time" && `Ціль досягнете за ${monthsToText(result.monthsRequired!)}`}
                {result.mode === "validate" && `Накопичите ${formatCurrency(result.finalBalance)} € — ціль досягнута!`}
              </p>
            </div>
          )}

          {/* Key metric */}
          {result.mode === "find_monthly" && result.monthlyRequired !== undefined && (
            <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
              <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Потрібен щомісячний внесок</p>
              <p className="text-4xl font-bold tabular-nums mt-1">
                {formatCurrency(result.monthlyRequired)}
                <span className="text-lg font-normal text-muted-foreground ml-1">€/міс</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                при прибутковості {input.rate}% річних протягом {input.years} років
              </p>
            </div>
          )}

          {result.mode === "find_time" && result.monthsRequired !== undefined && (
            <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
              <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Час до цілі</p>
              <p className="text-4xl font-bold mt-1">
                {monthsToText(result.monthsRequired)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                при внеску {formatCurrency(parseFloat(input.monthly))} €/міс і прибутковості {input.rate}%
              </p>
            </div>
          )}

          {result.mode === "validate" && (
            <div className="rounded-2xl border border-border bg-muted/10 p-5 flex flex-col gap-1 items-center text-center">
              <div className="h-10 w-10 rounded-2xl bg-foreground/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Підсумковий баланс</p>
              <p className={["text-4xl font-bold tabular-nums mt-1", result.isRealistic ? "text-green-500" : "text-orange-500"].join(" ")}>
                {formatCurrency(result.finalBalance)}
                <span className="text-lg font-normal text-muted-foreground ml-1">€</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                через {input.years} {Number(input.years) === 1 ? "рік" : "років"} при {input.rate}% річних
              </p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Всього внесків"
              value={`${formatCurrency(result.totalContributions)} €`}
              sub="Ваші гроші"
            />
            <StatCard
              label="Прибуток від %"
              value={`${formatCurrency(result.totalInterest)} €`}
              sub="Гроші роблять гроші"
              color="text-green-500"
            />
          </div>

          {/* Efficiency bar */}
          {result.totalContributions > 0 && (
            <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-2">
                <span>Ваші внески</span>
                <span>Складний відсоток</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (result.totalContributions / (result.totalContributions + result.totalInterest)) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] mt-1.5">
                <span className="font-medium tabular-nums">
                  {((result.totalContributions / (result.totalContributions + result.totalInterest)) * 100).toFixed(0)}%
                </span>
                <span className="font-medium tabular-nums text-green-500">
                  {((result.totalInterest / (result.totalContributions + result.totalInterest)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* Chart */}
          <ResultChart data={result.chartData} goal={parseFloat(input.goal.replace(/\s/g, "")) || 0} />

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/50 text-center pb-2">
            Розрахунок є орієнтовним. Реальна прибутковість може відрізнятись через ринкові умови, інфляцію та інші фактори.
          </p>
        </div>
      )}
    </div>
  );
}