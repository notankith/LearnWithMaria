import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const db = await getDb()

    const course = await db.collection("courses").findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("[v0] Get course by slug error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
