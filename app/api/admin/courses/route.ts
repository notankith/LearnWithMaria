import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import type { Course } from "@/lib/types"
import { ObjectId } from "mongodb"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, thumbnailUrl } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const slug = generateSlug(title)

    // Check if slug already exists
    const existing = await db.collection("courses").findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "A course with this title already exists" }, { status: 400 })
    }

    // Get creator info
    let createdByName = "Admin"
    let createdBy: ObjectId | null = null

    if (session.role === "admin" && session.userId) {
      const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
      if (user) {
        createdByName = user.fullName
        createdBy = user._id
      }
    }

    const course: Course = {
      title,
      slug,
      description,
      thumbnailUrl: thumbnailUrl || "/placeholder.svg?height=200&width=400",
      createdBy: createdBy || new ObjectId(),
      createdByName,
      modules: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Course>("courses").insertOne(course)

    return NextResponse.json({
      success: true,
      course: { ...course, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error("[v0] Create course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    // If admin, only get their courses
    let query = {}
    if (session.role === "admin" && session.userId) {
      query = { createdBy: new ObjectId(session.userId) }
    }

    const courses = await db
      .collection<Course>("courses")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    // Serialize ObjectId to string for client-side usage
    const serialized = courses.map((c) => ({
      ...c,
      _id: c._id?.toString?.() ?? c._id,
      createdBy: (c as any).createdBy?._bsontype ? String((c as any).createdBy) : (c as any).createdBy,
    }))

    return NextResponse.json({ courses: serialized })
  } catch (error) {
    console.error("[v0] Get admin courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
