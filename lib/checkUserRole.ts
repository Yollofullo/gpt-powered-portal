"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Production-grade user role check for Next.js App Router (Server Component or Middleware).
 * - Uses anon key only (never service role key)
 * - Handles all errors gracefully and logs them to the console
 * - Returns { role } if found, or { redirect: "/login" } if not authenticated/authorized
 */
export async function checkUserRole() {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: async () => {
            const cookieStore = await cookies();
            console.log('🔍 [checkUserRole.ts] const cookieStore = await cookies();');
            return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
            console.log('🔍 [checkUserRole.ts] return cookieStore.getAll().map(({ name, value }) => ({ name, value }));');
          },
          setAll: async () => {}, // No-op for stateless
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔍 [checkUserRole.ts] const { data: { session }, error: sessionError } = await supabase.auth.getSession();');
    if (sessionError) {
      console.error("[checkUserRole] Supabase session error:", sessionError);
      return { redirect: "/login" };
    }
    if (!session) {
      console.warn("[checkUserRole] No session found. Redirecting to /login.");
      return { redirect: "/login" };
    }

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();
    if (userError) {
      console.error("[checkUserRole] Supabase DB error:", userError);
      return { redirect: "/login" };
    }
    if (!user?.role) {
      console.warn("[checkUserRole] No role found for user. Redirecting to /login.");
      return { redirect: "/login" };
    }

    return { role: user.role };
  } catch (err) {
    console.error("[checkUserRole] Unexpected error:", err);
    return { redirect: "/login" };
  }
}
