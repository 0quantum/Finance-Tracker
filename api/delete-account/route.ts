import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  const res = NextResponse.next();

  // звичайний серверний клієнт — щоб отримати поточного юзера
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          request.headers
            .get("cookie")
            ?.split("; ")
            .map((c) => {
              const [name, ...rest] = c.split("=");
              return { name, value: rest.join("=") };
            }) ?? [],
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
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin клієнт — тільки на сервері, SERVICE_ROLE_KEY ніколи не йде на клієнт
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // видаляємо юзера (каскадно видалить profiles через FK)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("DELETE USER ERROR:", deleteError);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }

  // розлогінюємо
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}