import { redirect } from "next/navigation"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/session"
import CoursePageClient from "@/components/lms/course-page-client"

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const { id } = await params

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

  if (!course) {
    redirect("/dashboard")
  }

  // Build modules array from course.modules or fallback to single module from course.lessons
  const rawModules: any[] = Array.isArray(course.modules)
    ? course.modules
    : [{ title: "Lessons", lessons: course.lessons ?? [] }]

  const normalizedModules = (rawModules || []).map((m: any, mIdx: number) => {
    const lessons = (m.lessons || []).map((l: any, idx: number) => {
      let idNum: number
      if (typeof l.id === "number") idNum = l.id
      else if (typeof l.id === "string" && /^\d+$/.test(l.id)) idNum = parseInt(l.id, 10)
      else idNum = idx + 1

      return {
        id: idNum,
        title: l.title ?? `Lesson ${idNum}`,
        duration: l.duration ?? 5,
        type: l.type ?? (l.url ? "video" : "text"),
        completed: !!l.completed,
        url: l.url ?? l.videoUrl ?? null,
        content: l.content ?? null,
        description: l.description ?? null,
      }
    })

    const quizzes = (m.quizzes || []).map((q: any, qIdx: number) => ({
      id: q.id ?? q._id?.toString?.() ?? `q-${mIdx + 1}-${qIdx + 1}`,
      title: q.title ?? `Quiz ${qIdx + 1}`,
      questions: q.questions ?? [],
    }))

    return {
      id: m.id ?? `m-${mIdx + 1}`,
      title: m.title ?? `Module ${mIdx + 1}`,
      lessons,
      quizzes,
    }
  })

  const clientCourse = {
    id: course._id?.toString?.() ?? id,
    title: course.title ?? "Untitled Course",
    instructor: course.createdByName ?? course.instructor ?? "Unknown",
    modules: normalizedModules,
    progress: course.progress ?? 0,
  }

  const initialLessonId = normalizedModules[0]?.lessons?.[0]?.id ?? 1

  return <CoursePageClient course={clientCourse} initialLessonId={initialLessonId} />
}
