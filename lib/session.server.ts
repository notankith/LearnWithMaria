import { cookies } from "next/headers"
import type { SessionData } from "./types"

const SESSION_COOKIE_NAME = "session"

// Simple base64 encoding for session data (in production, use proper encryption)
function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64")
}

function decodeSession(token: string): SessionData | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return JSON.parse(decoded) as SessionData
  } catch {
    return null
  }
}

export async function createSession(data: SessionData) {
  const cookieStore = await cookies()
  const sessionToken = encodeSession(data)

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionToken) {
    return null
  }

  return decodeSession(sessionToken.value)
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
