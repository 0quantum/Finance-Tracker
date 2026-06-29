export type Mode = "find_monthly" | "find_time" | "validate";

export interface SimulationInput {
  goal: string;
  monthly: string;
  years: string;
  rate: number;
  initialDeposit: string;
}

export interface ChartPoint {
  label: string;
  balance: number;
  contributions: number;
  interest: number;
}

export interface SimulationResult {
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