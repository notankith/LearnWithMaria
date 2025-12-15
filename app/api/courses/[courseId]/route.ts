import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    const db = await getDb()
    const session = await getSession()

    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    let isAssigned = false
    if (session?.role === "student" && session.userId) {
      const enrollment = await db.collection("enrollments").findOne({
        studentId: new ObjectId(session.userId),
        courseId: new ObjectId(courseId),
        revoked: false,
      })
      isAssigned = !!enrollment
    }

    return NextResponse.json({ course: { ...course, isAssigned } })
  } catch (error) {
    console.error("[v0] Get course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
