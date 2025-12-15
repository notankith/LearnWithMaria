import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/session"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const superadminPassword = process.env.SUPERADMIN_PASSWORD

    if (!superadminPassword) {
      return NextResponse.json({ error: "Superadmin not configured" }, { status: 500 })
    }

    if (password !== superadminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Create superadmin session
    await createSession({
      role: "superadmin",
    })

    return NextResponse.json({
      success: true,
      redirectTo: "/superadmin/dashboard",
    })
  } catch (error) {
    console.error("[v0] Superadmin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
