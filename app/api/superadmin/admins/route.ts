import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { createUser } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()

    // Check if user already exists
    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create admin user
    const admin = await createUser(email, password, fullName, "admin")

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("[v0] Create admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const admins = await db.collection("users").find({ role: "admin" }).project({ password: 0 }).toArray()

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("[v0] Get admins error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
