import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    // Aggregate enrollments per course (only non-revoked)
    const pipeline = [
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrs",
        },
      },
      {
        $addFields: {
          students: {
            $size: {
              $filter: {
                input: "$enrs",
                as: "e",
                cond: { $eq: ["$$e.revoked", false] },
              },
            },
          },
        },
      },
      { $project: { title: 1, students: 1 } },
      { $sort: { students: -1 } },
    ]

    const courses = await db.collection("courses").aggregate(pipeline).toArray()

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("[v0] Get course stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
