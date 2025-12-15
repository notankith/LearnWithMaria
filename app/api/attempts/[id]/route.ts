import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const attempt = await db.collection("quiz_attempts").findOne({ _id: new ObjectId(params.id) })
    if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Only owners or admins can fetch
    if (String(attempt.userId) !== session.userId && session.role !== "admin" && session.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ success: true, attempt })
  } catch (err) {
    console.error("[v0] get attempt error:", err)
    return NextResponse.json({ error: "Internal" }, { status: 500 })
  }
}
