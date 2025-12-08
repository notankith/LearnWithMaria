"use server"

import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, fullName: string, role: "student" | "instructor") {
  // If a service role key is available, create the user via the admin API
  // so we can mark their email as confirmed immediately.
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = getSupabaseAdmin()

      // Use the admin REST endpoint to create the user and mark email as confirmed.
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!serviceKey) {
        return { error: "SUPABASE_SERVICE_ROLE_KEY is not set at runtime. Restart the dev server after updating .env." }
      }

      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({ email, password, email_confirm: true }),
      })

      const created = await resp.json().catch(() => null)
      if (!resp.ok) {
        const msg = (created && (created?.message || JSON.stringify(created))) || `HTTP ${resp.status}`
        return { error: `Failed to create user: ${msg}` }
      }

      const userId = (created as any)?.id ?? (created as any)?.user?.id

      if (!userId) {
        return { error: "Failed to determine created user ID" }
      }

        // Ensure the user's email is marked confirmed via admin PATCH (defensive)
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ email_confirm: true, email_confirmed_at: new Date().toISOString() }),
          })
        } catch {
          // ignore - best-effort
        }

      // Create user profile in users table using the admin client
      const { error: profileError } = await admin.from("users").insert({
        id: userId,
        email,
        full_name: fullName,
        role,
      })

      if (profileError) return { error: profileError.message }

      // Sign the user in (server client handles cookies)
      const supabase = await getSupabaseServer()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) return { error: signInError.message }

      revalidatePath("/", "layout")
      return { redirect: "/dashboard" }
    } catch (e: any) {
      return { error: e?.message ?? String(e) }
    }
  }

  // Fallback: regular signup flow (will require email confirmation)
  const supabase = await getSupabaseServer()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create user" }
  }

  // Create user profile in users table
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath("/", "layout")
  return { redirect: "/login?message=Check your email to confirm your account" }
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { redirect: "/dashboard" }
}

export async function signOut() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  return { redirect: "/" }
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile with role
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return { ...user, ...profile }
}
