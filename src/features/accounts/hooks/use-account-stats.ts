// src/features/accounts/hooks/use-account-stats.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/browser";

export interface DailyBalance {
  date: string;
  balance: number;
}

export interface MonthlyFlow {
  month: string;
  income: number;
  expense: number;
}

export interface AccountTransaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  category?: { name: string; color: string; icon: string | null } | null;
}

export interface AccountStats {
  incomeThisMonth: number;
  expenseThisMonth: number;
  dailyBalances: DailyBalance[];
  monthlyFlow: MonthlyFlow[];
  recentTransactions: AccountTransaction[];
}

export function useAccountStats(accountId: string | null) {
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

    const [monthlyRes, allRes, recentRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("account_id", accountId)
        .gte("date", startOfMonth),
      supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("account_id", accountId)
        .gte("date", sixMonthsAgo)
        .order("date", { ascending: true }),
      supabase
        .from("transactions")
        .select("id, amount, type, description, date, categories(name, color, icon)")
        .eq("account_id", accountId)
        .order("date", { ascending: false })
        .limit(5),
    ]);

    const monthly = monthlyRes.data ?? [];
    const incomeThisMonth = monthly
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenseThisMonth = monthly
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    // monthly flow grouped by month
    const flowMap: Record<string, { income: number; expense: number }> = {};
    for (const t of allRes.data ?? []) {
      const key = t.date.slice(0, 7); // "YYYY-MM"
      if (!flowMap[key]) flowMap[key] = { income: 0, expense: 0 };
      if (t.type === "income") flowMap[key].income += Number(t.amount);
      else flowMap[key].expense += Number(t.amount);
    }
    const monthlyFlow: MonthlyFlow[] = Object.entries(flowMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, ...v }));

    // daily balance (running from account start — simplified: last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const dailyMap: Record<string, number> = {};
    for (const t of allRes.data ?? []) {
      const day = t.date.slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = 0;
      dailyMap[day] += t.type === "income" ? Number(t.amount) : -Number(t.amount);
    }
    // fill last 30 days
    const days: DailyBalance[] = [];
    let running = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      running += dailyMap[key] ?? 0;
      days.push({ date: key, balance: running });
    }

    const recentTransactions: AccountTransaction[] = (recentRes.data ?? []).map((t: any) => ({
      id: t.id,
      amount: Number(t.amount),
      type: t.type,
      description: t.description,
      date: t.date,
      category: t.categories ?? null,
    }));

    setStats({ incomeThisMonth, expenseThisMonth, dailyBalances: days, monthlyFlow, recentTransactions });
    setLoading(false);
  }, [accountId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading };
}