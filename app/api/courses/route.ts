import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import type { Course } from "@/lib/types"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const session = await getSession()

    const courses = await db.collection<Course>("courses").find({}).sort({ createdAt: -1 }).toArray()

    let coursesWithAssignment = courses
    if (session?.role === "student" && session.userId) {
      const enrollments = await db
        .collection("enrollments")
        .find({
          studentId: new ObjectId(session.userId),
          revoked: false,
        })
        .toArray()

      const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId.toString()))

      coursesWithAssignment = courses.map((course) => ({
        ...course,
        isAssigned: enrolledCourseIds.has(course._id!.toString()),
      }))
    } else {
      coursesWithAssignment = courses.map((course) => ({
        ...course,
        isAssigned: false,
      }))
    }

    return NextResponse.json({ courses: coursesWithAssignment })
  } catch (error) {
    console.error("[v0] Get courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
