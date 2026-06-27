import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const path = req.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),

        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    path.startsWith("/login") || path.startsWith("/register");

  const isProtected =
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/settings");

  const isCallback =
    path.startsWith("/auth/callback") || path.startsWith("/api/auth");

  // ⚠️ callback НЕ чіпаємо
  if (isCallback) return res;

  // 🔐 неавторизований → login
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 авторизований → не пускаємо на login/register
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};