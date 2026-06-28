import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];
const AUTH_ROUTES = ["/login", "/register"];
const SKIP_ROUTES = ["/_next", "/favicon.ico", "/api/auth", "/callback"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // статика і колбеки — не чіпаємо
  if (SKIP_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

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
    error,
  } = await supabase.auth.getUser();

  const isAuthed = !!user && !error;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // неавторизований → login, зберігаємо куди хотів потрапити
  if (!isAuthed && isProtected) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // авторизований → не пускаємо на login/register
  if (isAuthed && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // корінь "/" → редірект залежно від стану
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthed ? "/dashboard" : "/login", req.url)
    );
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};