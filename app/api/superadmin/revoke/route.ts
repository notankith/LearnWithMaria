import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enrollmentId } = await request.json()
    const db = await getDb()

    const result = await db
      .collection("enrollments")
      .updateOne({ _id: new ObjectId(enrollmentId) }, { $set: { revoked: true } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Revoke course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
