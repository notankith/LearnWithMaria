import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import CourseEditor from "@/components/admin/course-editor"

export default async function AdminCourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const { id } = await params

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/admin")
  }

  const db = await getDb()
  const course = await db.collection("courses").findOne({ _id: new ObjectId(id) })

  if (!course) {
    redirect("/admin")
  }

  return <CourseEditor course={JSON.parse(JSON.stringify(course))} />
}
