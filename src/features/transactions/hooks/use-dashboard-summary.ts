"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { DashboardSummary } from "@/src/types/dashboard";

function normalizeSummary(raw: unknown): DashboardSummary {
  const data = raw as Partial<DashboardSummary> | null;
  return {
    balance: Number(data?.balance ?? 0),
    income: Number(data?.income ?? 0),
    expenses: Number(data?.expenses ?? 0),
  };
}

export function useDashboardSummary(initialSummary: DashboardSummary) {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);

    const { data, error } = await supabase.rpc("get_dashboard_summary");

    if (!error) {
      setSummary(normalizeSummary(data));
    }

    setRefreshing(false);
  }, []);

  return { summary, refresh, refreshing };
}
