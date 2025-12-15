import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { Review } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await getSession()

    if (!session || !session.userId || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await params
    const { rating, comment } = await request.json()
    const db = await getDb()

    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const review: Review = {
      userId: new ObjectId(session.userId),
      userName: user.fullName,
      courseId: new ObjectId(courseId),
      rating,
      comment,
      approved: false,
      createdAt: new Date(),
    }

    await db.collection<Review>("reviews").insertOne(review)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    const db = await getDb()

    const reviews = await db
      .collection("reviews")
      .find({
        courseId: new ObjectId(courseId),
        approved: true,
      })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("[v0] Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
