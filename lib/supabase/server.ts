import { createServerClient } from "@supabase/ssr"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

let serverClient: ReturnType<typeof createServerClient> | null = null

export async function getSupabaseServer() {
  if (serverClient) {
    return serverClient
  }

  const cookieStore = await cookies()

  serverClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting errors
          }
        },
      },
    },
  )

  return serverClient
}

let adminClient: SupabaseClient | null = null

/**
 * Returns a Supabase client instantiated with the service role key.
 * Only call this from server-side code. Requires `SUPABASE_SERVICE_ROLE_KEY` env var.
 */
export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment")
  }

  adminClient = createClient(url, serviceKey)
  return adminClient
}
