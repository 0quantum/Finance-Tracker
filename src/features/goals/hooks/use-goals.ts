"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { GoalWithContributions, NewGoalInput } from "@/src/types/goals";

export function useGoals() {
  const [goals, setGoals]   = useState<GoalWithContributions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*, contributions:goal_contributions(*)")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) setError("Не вдалось завантажити");
    else setGoals((data ?? []) as GoalWithContributions[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (input: NewGoalInput): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "Не авторизовано";
    const { error } = await supabase
      .from("goals")
      .insert({ ...input, user_id: user.id });
    if (error) return "Помилка створення";
    await load();
    return null;
  };

  const update = async (id: string, input: Partial<NewGoalInput>): Promise<string | null> => {
    const { error } = await supabase.from("goals").update(input).eq("id", id);
    if (error) return "Помилка оновлення";
    await load();
    return null;
  };

  const remove = async (id: string) => {
    await supabase.from("goal_contributions").delete().eq("goal_id", id);
    await supabase.from("goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const complete = async (id: string, is_completed: boolean) => {
    await supabase.from("goals").update({ is_completed }).eq("id", id);
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, is_completed } : g));
  };

  const addContribution = async (
    goalId: string,
    amount: number,
    note: string | null
  ): Promise<string | null> => {
    const { error } = await supabase
      .from("goal_contributions")
      .insert({ goal_id: goalId, amount, note });
    if (error) return "Помилка внеску";

    const { error: e2 } = await supabase.rpc("increment_goal_saved", {
      goal_id: goalId,
      delta: amount,
    });
    // fallback якщо RPC немає — просто reload
    await load();
    return null;
  };

  const deleteContribution = async (
    contributionId: string,
    goalId: string,
    amount: number
  ) => {
    await supabase.from("goal_contributions").delete().eq("id", contributionId);
    await load();
  };

  return { goals, loading, error, create, update, remove, complete, addContribution, deleteContribution };
}