import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { Lesson } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, moduleId } = await params
    const { title, type, url, order } = await request.json()
    const db = await getDb()

    const newLesson: Lesson = {
      id: new ObjectId().toString(),
      title,
      type,
      url,
      order,
    }

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id), "modules.id": moduleId },
      {
        $push: { "modules.$.lessons": newLesson },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course or module not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, lesson: newLesson })
  } catch (error) {
    console.error("[v0] Create lesson error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
