import type { SessionData } from "./types"

async function ensureServer() {
  if (typeof window !== "undefined") {
    throw new Error(
      "Session helpers are server-only. Call session endpoints from client code or use server components."
    )
  }
}

export async function createSession(data: SessionData) {
  await ensureServer()
  const mod = await import("./session.server")
  return mod.createSession(data)
}

export async function getSession(): Promise<SessionData | null> {
  await ensureServer()
  const mod = await import("./session.server")
  return mod.getSession()
}

export async function destroySession() {
  await ensureServer()
  const mod = await import("./session.server")
  return mod.destroySession()
}
