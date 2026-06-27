import { supabase } from "@/lib/supabase/supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  window.location.href = "/dashboard"; // 🔥 важливо
}