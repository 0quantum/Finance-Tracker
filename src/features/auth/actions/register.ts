import { supabase } from "@/src/lib/supabase/browser";

export type RegisterError =
  | "email_taken"
  | "weak_password"
  | "unknown";

export async function register(
  email: string,
  password: string,
  fullName?: string
): Promise<{ error: RegisterError | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName ?? "" },
      emailRedirectTo: `${window.location.origin}/callback`,
    },
  });

  if (!error) {
    window.location.href = "/dashboard";
    return { error: null };
  }

  const msg = error.message.toLowerCase();
  if (msg.includes("already registered") || msg.includes("already exists")) {
    return { error: "email_taken" };
  }
  if (msg.includes("password")) {
    return { error: "weak_password" };
  }
  return { error: "unknown" };
}