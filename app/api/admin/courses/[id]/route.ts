import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()
    const db = await getDb()

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()

    const course = await db.collection("courses").findOne({ _id: new ObjectId(id) })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Serialize ObjectId to string for client
    const serialized = JSON.parse(JSON.stringify({ ...course, _id: course._id?.toString?.() }))

    return NextResponse.json({ course: serialized })
  } catch (error) {
    console.error("[v0] Get course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()

    const courseObjectId = new ObjectId(id)

    const result = await db.collection("courses").deleteOne({ _id: courseObjectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Cascade delete related records
    try {
      await Promise.all([
        db.collection("enrollments").deleteMany({ courseId: courseObjectId }),
        db.collection("quiz_attempts").deleteMany({ courseId: courseObjectId }),
        db.collection("reviews").deleteMany({ courseId: courseObjectId }),
      ])
    } catch (cascadeErr) {
      console.error("[v0] Cascade delete error:", cascadeErr)
      // don't fail the whole request if cascade cleanup had issues
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
