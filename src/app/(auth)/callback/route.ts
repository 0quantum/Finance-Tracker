import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  console.log("🔥 CALLBACK HIT");
  console.log("CODE:", code);

  if (!code) {
    console.log("❌ NO CODE");
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const cookieStore = await cookies();

  const response = NextResponse.redirect(new URL("/dashboard", url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          console.log("🍪 SET COOKIES:", cookiesToSet);

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return response;
}