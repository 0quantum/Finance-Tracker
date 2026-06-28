import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { siteConfig } from "@/src/config/site";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL(siteConfig.routes.login, url.origin));
  }

  const response = NextResponse.redirect(new URL(siteConfig.redirects.afterLogin, url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get("cookie")
            ?.split("; ")
            .map((cookie) => {
              const [name, ...rest] = cookie.split("=");
              return { name, value: rest.join("=") };
            }) ?? [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              path: "/",
              secure: true,
              sameSite: "lax",
            });
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("AUTH ERROR:", error);
    return NextResponse.redirect(new URL(siteConfig.routes.login, url.origin));
  }

  return response;
}