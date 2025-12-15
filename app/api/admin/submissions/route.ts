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

    // Join quiz_attempts with users to get student info
    const attempts = await db
      .collection("quiz_attempts")
      .aggregate([
        { $sort: { submittedAt: -1 } },
        { $limit: 200 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            userId: 1,
            courseId: 1,
            moduleId: 1,
            quizId: 1,
            totalScore: 1,
            maxScore: 1,
            submittedAt: 1,
            answers: 1,
            studentName: { $ifNull: ["$user.name", "$user.email"] },
            studentEmail: "$user.email",
          },
        },
      ])
      .toArray()

    return NextResponse.json({ submissions: attempts })
  } catch (error) {
    console.error("[v0] Get admin submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
