import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    const [totalUsers, totalAdmins, totalCourses, totalEnrollments, totalQuizAttempts, totalReviews] =
      await Promise.all([
        db.collection("users").countDocuments({ role: "student" }),
        db.collection("users").countDocuments({ role: "admin" }),
        db.collection("courses").countDocuments(),
        db.collection("enrollments").countDocuments({ revoked: false }),
        db.collection("quiz_attempts").countDocuments(),
        db.collection("reviews").countDocuments(),
      ])

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalCourses,
        totalEnrollments,
        totalQuizAttempts,
        totalReviews,
      },
    })
  } catch (error) {
    console.error("[v0] Get superadmin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
