"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { NewTransactionInput, Transaction } from "@/src/types/database";

async function loadTransactions(): Promise<{
  data: Transaction[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  return { data, error: error?.message ?? null };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true); // початково true — без додаткового setLoading(true) в ефекті
  const [error, setError] = useState<string | null>(null);

  // Початкове завантаження. Жодного setState ДО await —
  // тіло ефекту лише запускає проміс, все інше відбувається в .then()
  useEffect(() => {
    let active = true;

    loadTransactions().then(({ data, error }) => {
      if (!active) return;
      if (error) setError(error);
      else setTransactions(data ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Ручний refetch — викликається з click-хендлерів, а не з ефекту,
  // тож синхронний setLoading(true) тут не проблема
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await loadTransactions();

    if (error) setError(error);
    else setTransactions(data ?? []);
    setLoading(false);
  }, []);

  const addTransaction = useCallback(
    async (input: NewTransactionInput): Promise<Transaction | null> => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setError("Не авторизовано");
        return null;
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: authData.user.id,
          amount: input.amount,
          type: input.type,
          description: input.description ?? null,
          account_id: input.account_id ?? null,
          category_id: input.category_id ?? null,
          ...(input.date ? { date: input.date } : {}),
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      setTransactions((prev) => [data, ...prev]);
      return data;
    },
    [],
  );

  return { transactions, loading, error, addTransaction, refetch };
}
