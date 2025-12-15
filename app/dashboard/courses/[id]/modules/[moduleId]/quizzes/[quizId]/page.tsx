import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import QuizPageClient from "@/components/lms/quiz-page-client"
import { ObjectId } from "mongodb"

export default async function QuizPage({ params }: { params: Promise<{ id: string; moduleId: string; quizId: string }> }) {
  const session = await getSession()
  const { id, moduleId, quizId } = await params

  if (!session || session.role !== "student") {
    redirect("/login")
  }

  const db = await getDb()

  const enrollment = await db.collection("enrollments").findOne({
    studentId: new ObjectId(session.userId!),
    courseId: new ObjectId(id),
    revoked: false,
  })

  if (!enrollment) {
    redirect("/dashboard")
  }

  const course = await db.collection("courses").findOne({ _id: new ObjectId(id) })
  if (!course) redirect("/dashboard")

  const module = (course.modules || []).find((m: any) => m.id === moduleId)
  if (!module) redirect(`/dashboard/courses/${id}`)

  const quiz = (module.quizzes || []).find((q: any) => q.id === quizId)
  if (!quiz) redirect(`/dashboard/courses/${id}`)

  // Pass minimal data into client
  const quizData = {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions || [],
  }

  const courseId = course._id?.toString?.() ?? id

  return <QuizPageClient courseId={courseId} moduleId={moduleId} quiz={quizData} />
}
