// src/features/accounts/hooks/use-accounts.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/browser";
import type { Account, NewAccountInput } from "@/src/types/accounts";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) setError(error.message);
    else setAccounts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addAccount = async (input: NewAccountInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "not authenticated";
    const { error } = await supabase
      .from("accounts")
      .insert({ ...input, user_id: user.id });
    if (error) return error.message;
    await fetch();
    return null;
  };

  const updateAccount = async (id: string, input: Partial<NewAccountInput>) => {
    const { error } = await supabase
      .from("accounts")
      .update(input)
      .eq("id", id);
    if (error) return error.message;
    await fetch();
    return null;
  };

  const deleteAccount = async (id: string) => {
    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("id", id);
    if (error) return error.message;
    await fetch();
    return null;
  };

  return { accounts, loading, error, addAccount, updateAccount, deleteAccount, refresh: fetch };
}