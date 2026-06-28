"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { DebtWithPayments, NewDebtInput, NewPaymentInput } from "@/src/types/debts";

export function useDebts() {
  const [debts, setDebts] = useState<DebtWithPayments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Не авторизовано"); setLoading(false); return; }

    const { data, error: err } = await supabase
      .from("debts")
      .select(`*, debt_payments(*)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (err) { setError(err.message); setLoading(false); return; }

    const enriched: DebtWithPayments[] = (data ?? []).map((d) => {
      const payments = d.debt_payments ?? [];
      const paid_total = payments.reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0);
      return {
        ...d,
        amount: Number(d.amount),
        payments,
        paid_total,
        remaining: Number(d.amount) - paid_total,
      };
    });

    setDebts(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDebts(); }, [fetchDebts]);

  const addDebt = async (input: NewDebtInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: err } = await supabase.from("debts").insert({ ...input, user_id: user.id });
    if (!err) await fetchDebts();
    return err;
  };

  const updateDebt = async (id: string, input: NewDebtInput) => {
    const { error: err } = await supabase
      .from("debts")
      .update({
        person_name: input.person_name,
        amount: input.amount,
        direction: input.direction,
        description: input.description,
        due_date: input.due_date,
      })
      .eq("id", id);
    if (!err) await fetchDebts();
    return err;
  };

  const addPayment = async (input: NewPaymentInput) => {
    const { error: err } = await supabase.from("debt_payments").insert(input);
    if (!err) await fetchDebts();
    return err;
  };

  const settleDebt = async (id: string) => {
    const { error: err } = await supabase.from("debts").update({ is_settled: true }).eq("id", id);
    if (!err) await fetchDebts();
    return err;
  };

  const reopenDebt = async (id: string) => {
    const { error: err } = await supabase.from("debts").update({ is_settled: false }).eq("id", id);
    if (!err) await fetchDebts();
    return err;
  };

  const deleteDebt = async (id: string) => {
    const { error: err } = await supabase.from("debts").delete().eq("id", id);
    if (!err) await fetchDebts();
    return err;
  };

  return { debts, loading, error, addDebt, updateDebt, addPayment, settleDebt, reopenDebt, deleteDebt, refresh: fetchDebts };
}