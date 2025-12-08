"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CourseContent from "@/components/lms/course-content"
import LessonViewer from "@/components/lms/lesson-viewer"

export default function CoursePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [currentLessonId, setCurrentLessonId] = useState<string | number | null>(null)

  // `params` may be a Promise in client components — unwrap it with `use`.
  const resolvedParams = use(params as Promise<{ id: string }>)

  const [course, setCourse] = useState<any | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)

  useEffect(() => {
    const id = resolvedParams.id
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/superadmin/courses?id=${encodeURIComponent(id)}`)
        if (!res.ok) {
          setCourse(null)
        } else {
          const json = await res.json()
          if (!cancelled) {
            setCourse(json)
            // initialize currentLessonId to first module/lesson if not set
            if (currentLessonId == null) {
              const firstId = (json.modules && json.modules[0]?.id) ?? (json.lessons && json.lessons[0]?.id) ?? null
              setCurrentLessonId(firstId)
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course:", err instanceof Error ? err.message : String(err))
        setCourse(null)
      } finally {
        if (!cancelled) setLoadingCourse(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [resolvedParams])

  const currentLesson = (course?.modules || []).find((l: any) => l.id === currentLessonId) || (course?.modules || [])[0]

  if (loadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading course…</div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Course not found</h2>
          <p className="text-sm text-slate-500">This course may have been removed or the ID is incorrect.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-bold text-slate-900">{course.title}</h1>
            <p className="text-sm text-slate-500">by {course.instructor}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 px-6 md:px-12 py-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <LessonViewer lesson={currentLesson} course={course} />
        </div>

        {/* Sidebar */}
        <div>
          <CourseContent course={course} currentLessonId={currentLessonId} setCurrentLessonId={setCurrentLessonId} />
        </div>
      </div>
    </div>
  )
}
