"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { RecurringTransaction, NewRecurringInput } from "@/src/types/recurring";

export function useRecurring() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("recurring_transactions")
      .select("*")
      .order("next_run", { ascending: true });

    if (error) setError("Не вдалось завантажити");
    else setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (input: NewRecurringInput): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "Не авторизовано";
    const { error } = await supabase
      .from("recurring_transactions")
      .insert({ ...input, user_id: user.id });
    if (error) return "Помилка створення";
    await load();
    return null;
  };

  const update = async (id: string, input: Partial<NewRecurringInput>): Promise<string | null> => {
    const { error } = await supabase
      .from("recurring_transactions")
      .update(input)
      .eq("id", id);
    if (error) return "Помилка оновлення";
    await load();
    return null;
  };

  const remove = async (id: string) => {
    await supabase.from("recurring_transactions").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase
      .from("recurring_transactions")
      .update({ active })
      .eq("id", id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, active } : i));
  };

  return { items, loading, error, create, update, remove, toggle };
}