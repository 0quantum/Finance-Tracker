import { supabase } from "@/src/lib/supabase/browser";

export async function signInWithApple() {
  await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });
}