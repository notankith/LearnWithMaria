import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> },
) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, moduleId, lessonId } = await params
    const updates = await request.json()
    const db = await getDb()

    const course = await db.collection("courses").findOne({ _id: new ObjectId(id) })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const modules = course.modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.map((lesson: any) => (lesson.id === lessonId ? { ...lesson, ...updates } : lesson)),
        }
      }
      return module
    })

    await db.collection("courses").updateOne({ _id: new ObjectId(id) }, { $set: { modules, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update lesson error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> },
) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, moduleId, lessonId } = await params
    const db = await getDb()

    const course = await db.collection("courses").findOne({ _id: new ObjectId(id) })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const modules = course.modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId),
        }
      }
      return module
    })

    await db.collection("courses").updateOne({ _id: new ObjectId(id) }, { $set: { modules, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete lesson error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
