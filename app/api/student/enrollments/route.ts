import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !session.userId || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    const enrollments = await db
      .collection("enrollments")
      .find({
        studentId: new ObjectId(session.userId),
        revoked: false,
      })
      .toArray()

    // Get course details
    const courses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await db.collection("courses").findOne({ _id: enrollment.courseId })
        return course
      }),
    )

    return NextResponse.json({ courses: courses.filter(Boolean) })
  } catch (error) {
    console.error("[v0] Get student enrollments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
