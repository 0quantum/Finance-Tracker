"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";

export type CategorySummary = {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string | null;
  total: number;
};

export function useCategorySummary() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const { data: cats, error: catErr } = await supabase
      .from("categories")
      .select("id, name, type, color, icon")
      .order("type")
      .order("name");

    if (catErr) { setError(catErr.message); setLoading(false); return; }

    const { data: txs, error: txErr } = await supabase
      .from("transactions")
      .select("category_id, amount, type")
      .gte("date", from)
      .lte("date", to);

    if (txErr) { setError(txErr.message); setLoading(false); return; }

    const totals: Record<string, number> = {};
    for (const tx of txs ?? []) {
      if (!tx.category_id) continue;
      totals[tx.category_id] = (totals[tx.category_id] ?? 0) + Number(tx.amount);
    }

    setCategories(
      (cats ?? []).map((c) => ({
        ...c,
        type: c.type as "income" | "expense",
        total: totals[c.id] ?? 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  return { categories, loading, error, refresh: fetch };
}