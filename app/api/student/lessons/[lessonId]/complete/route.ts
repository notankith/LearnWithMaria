import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { LessonProgress } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { lessonId } = await params
    const { courseId } = await request.json()
    const db = await getDb()

    // Check if already completed
    const existing = await db.collection("lesson_progress").findOne({
      userId: new ObjectId(session.userId),
      courseId: new ObjectId(courseId),
      lessonId,
    })

    if (existing) {
      return NextResponse.json({ success: true, message: "Already completed" })
    }

    const progress: LessonProgress = {
      userId: new ObjectId(session.userId),
      courseId: new ObjectId(courseId),
      lessonId,
      completed: true,
      completedAt: new Date(),
    }

    await db.collection<LessonProgress>("lesson_progress").insertOne(progress)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Complete lesson error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
