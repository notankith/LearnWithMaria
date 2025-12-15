import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    const db = await getDb()
    const query = courseId ? { courseId } : {}

    const enrollments = await db.collection("enrollments").find(query).sort({ assignedAt: -1 }).toArray()

    // Populate with course and student info
    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await db.collection("courses").findOne({ _id: enrollment.courseId })
        const student = await db.collection("users").findOne({ _id: enrollment.studentId })
        return {
          ...enrollment,
          courseName: course?.title,
          studentName: student?.fullName,
        }
      }),
    )

    return NextResponse.json({ enrollments: enriched })
  } catch (error) {
    console.error("[v0] Get enrollments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
