import { supabase } from "@/lib/supabase/browser";

export type LoginError =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "too_many_requests"
  | "unknown";

export async function login(
  email: string,
  password: string
): Promise<{ error: LoginError | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (!error) {
    window.location.href = "/dashboard";
    return { error: null };
  }

  const msg = error.message.toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return { error: "invalid_credentials" };
  }
  if (msg.includes("email not confirmed")) {
    return { error: "email_not_confirmed" };
  }
  if (msg.includes("too many")) {
    return { error: "too_many_requests" };
  }
  return { error: "unknown" };
}