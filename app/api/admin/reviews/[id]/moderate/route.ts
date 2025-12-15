import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { approved } = await request.json()
    const db = await getDb()

    const result = await db.collection("reviews").updateOne({ _id: new ObjectId(id) }, { $set: { approved } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Moderate review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
