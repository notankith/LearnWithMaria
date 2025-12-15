import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import CourseDetailView from "@/components/courses/course-detail-view"
import { ObjectId } from "mongodb"

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const db = await getDb()
  const session = await getSession()

  const course = await db.collection("courses").findOne({ slug })

  if (!course) {
    redirect("/explore")
  }

  let isAssigned = false
  if (session?.role === "student" && session.userId) {
    const enrollment = await db.collection("enrollments").findOne({
      studentId: new ObjectId(session.userId),
      courseId: course._id,
      revoked: false,
    })
    isAssigned = !!enrollment
  }

  const courseData = JSON.parse(JSON.stringify({ ...course, isAssigned }))

  return <CourseDetailView course={courseData} isLoggedIn={!!session} studentEmail={session?.email} />
}
