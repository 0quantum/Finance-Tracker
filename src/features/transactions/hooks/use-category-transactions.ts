"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { Transaction } from "@/src/types/database";

export function useCategoryTransactions(categoryId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("category_id", id)
      .order("date", { ascending: false });

    setTransactions(data ?? []);
    setError(error?.message ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (categoryId) fetch(categoryId);
    else setTransactions([]);
  }, [categoryId, fetch]);

  return { transactions, setTransactions, loading, error };
}
