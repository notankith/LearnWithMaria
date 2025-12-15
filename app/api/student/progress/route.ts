import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    // Get completion stats
    const completedLessons = await db.collection("lesson_progress").countDocuments({
      userId: new ObjectId(session.userId),
      completed: true,
    })

    const quizAttempts = await db.collection("quiz_attempts").countDocuments({ userId: new ObjectId(session.userId) })

    const enrollments = await db.collection("enrollments").countDocuments({
      studentId: new ObjectId(session.userId),
      revoked: false,
    })

    // Calculate minutes learned (estimate: 10 min per completed lesson)
    const minutesLearned = completedLessons * 10

    return NextResponse.json({
      stats: {
        enrolledCourses: enrollments,
        completedLessons,
        minutesLearned,
        quizAttempts,
      },
    })
  } catch (error) {
    console.error("[v0] Get student progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
