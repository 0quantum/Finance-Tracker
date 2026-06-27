import { supabase } from "@/lib/supabase/supabase";

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });
}
