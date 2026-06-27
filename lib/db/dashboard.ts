import { createSupabaseServer } from "@/lib/supabase/server";

export async function getDashboardSummary() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user");

  const { data, error } = await supabase.rpc("get_dashboard_summary");

  if (error) throw error;

  return data;
}