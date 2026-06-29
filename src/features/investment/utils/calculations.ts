import type { Mode, SimulationInput, SimulationResult, ChartPoint } from "@/src/types/investment";
import { formatN } from "./formatters";

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

function calcMonthlyRequired(goal: number, months: number, annualRate: number, initial: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.max(0, (goal - initial) / months);
  const fv = initial * Math.pow(1 + r, months);
  const remaining = goal - fv;
  if (remaining <= 0) return 0;
  return (remaining * r) / (Math.pow(1 + r, months) - 1);
}

function calcMonthsRequired(goal: number, monthly: number, annualRate: number, initial: number): number {
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

export function runSimulation(input: SimulationInput): SimulationResult | null {
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
    mode = "find_monthly";
    totalMonths = Math.round(years * 12);
    monthlyRequired = calcMonthlyRequired(goal, totalMonths, rate, initial);
    finalBalance = goal;
    if (monthlyRequired > goal * 0.5) warning = "Дуже великий внесок відносно цілі. Перевірте параметри.";
  } else if (hasMonthly && !hasYears) {
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