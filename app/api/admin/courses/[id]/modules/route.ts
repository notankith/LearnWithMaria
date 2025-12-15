import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { Module } from "@/lib/types"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, order } = await request.json()
    const db = await getDb()

    const newModule: Module = {
      id: new ObjectId().toString(),
      title,
      order,
      lessons: [],
      quizzes: [],
    }

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { modules: newModule },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, module: newModule })
  } catch (error) {
    console.error("[v0] Create module error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
