import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getUserById } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    if (session.role === "superadmin") {
      return NextResponse.json({
        user: {
          role: "superadmin",
        },
      })
    }

    const user = await getUserById(session.userId!)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
