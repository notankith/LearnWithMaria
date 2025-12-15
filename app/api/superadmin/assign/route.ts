import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import type { Enrollment } from "@/lib/types"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentEmail, courseId } = await request.json()
    const db = await getDb()

    // Find student
    const student = await db.collection("users").findOne({ email: studentEmail, role: "student" })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if already enrolled
    const existing = await db.collection("enrollments").findOne({
      studentId: student._id,
      courseId: new ObjectId(courseId),
    })

    if (existing) {
      // If revoked, un-revoke it
      if (existing.revoked) {
        await db.collection("enrollments").updateOne({ _id: existing._id }, { $set: { revoked: false } })
        return NextResponse.json({ success: true, message: "Course access restored" })
      }
      return NextResponse.json({ error: "Student already enrolled" }, { status: 400 })
    }

    // Create enrollment
    const enrollment: Enrollment = {
      studentId: student._id!,
      studentEmail: student.email,
      courseId: new ObjectId(courseId),
      assignedAt: new Date(),
      revoked: false,
    }

    await db.collection<Enrollment>("enrollments").insertOne(enrollment)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Assign course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
