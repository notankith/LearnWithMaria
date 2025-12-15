import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, moduleId } = await params
    const updates = await request.json()
    const db = await getDb()

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id), "modules.id": moduleId },
      {
        $set: {
          "modules.$.title": updates.title,
          "modules.$.order": updates.order,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course or module not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update module error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; moduleId: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, moduleId } = await params
    const db = await getDb()

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { modules: { id: moduleId } },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete module error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
