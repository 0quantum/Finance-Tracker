"use client";

import { useState, useMemo, useCallback } from "react";
import { runSimulation } from "../utils/calculations";
import type { SimulationInput } from "@/src/types/investment";

const INITIAL_INPUT: SimulationInput = {
  goal: "",
  monthly: "",
  years: "",
  rate: 7,
  initialDeposit: "",
};

export function useInvestmentSimulator() {
  const [input, setInput] = useState<SimulationInput>(INITIAL_INPUT);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = useCallback(() => setSubmitted(true), []);

  const handleReset = useCallback(() => {
    setInput(INITIAL_INPUT);
    setSubmitted(false);
  }, []);

  return { input, set, submitted, result, modeHint, canSubmit, handleSubmit, handleReset };
}