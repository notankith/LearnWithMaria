"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import CourseContent from "@/components/lms/course-content"
import LessonViewer from "@/components/lms/lesson-viewer"
import dynamic from "next/dynamic"

const QuizPlayer = dynamic(() => import("@/components/lms/quiz-player"), { ssr: false })

interface Lesson {
  id: number
  title: string
  duration: number
  type: string
  completed: boolean
  url?: string | null
  content?: string | null
  description?: string | null
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  _id?: string
  id?: string
  title: string
  instructor?: string
  modules?: Module[]
  progress?: number
}

interface Props {
  course: Course
  initialLessonId?: number
}

export default function CoursePageClient({ course, initialLessonId }: Props) {
  const modules = Array.isArray(course?.modules)
    ? course.modules
    : [{ id: "m-1", title: "Lessons", lessons: (course as any).lessons || [], quizzes: (course as any).quizzes || [] }]

  const hasAnyContent = Array.isArray(modules) && modules.some((m) => (m.lessons && m.lessons.length > 0) || (m.quizzes && m.quizzes.length > 0))

  if (!hasAnyContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No lessons or quizzes available for this course.</p>
      </div>
    )
  }

  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(0)
  const activeModule = modules[activeModuleIdx]

  const [currentLessonId, setCurrentLessonId] = useState<number | null>(
    initialLessonId ?? (activeModule?.lessons?.[0]?.id ?? null),
  )

  const currentLesson = (currentLessonId && activeModule?.lessons?.find((l) => l.id === currentLessonId)) || activeModule?.lessons?.[0] || null
  const [selectedQuiz, setSelectedQuiz] = useState<{ moduleIdx: number; moduleId: string; quizId: string } | null>(null)
  const router = useRouter()

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
          {currentLesson ? (
            <LessonViewer lesson={currentLesson} course={{ modules }} />
          ) : selectedQuiz ? (
            (() => {
              const mod = modules[selectedQuiz.moduleIdx]
              const quiz = mod?.quizzes?.find((q: any) => q.id === selectedQuiz.quizId) || null
              return quiz ? (
                <QuizPlayer
                  courseId={course.id ?? (course as any)._id}
                  moduleId={selectedQuiz.moduleId}
                  quiz={quiz}
                  onClose={() => setSelectedQuiz(null)}
                />
              ) : (
                <div className="p-6 bg-white rounded border">Quiz not found</div>
              )
            })()
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-2">No lesson selected</h3>
              <p className="text-slate-600 mb-4">This module has no lessons. Choose a quiz from the sidebar to get started.</p>
              <div className="w-full max-w-md">
                {activeModule?.quizzes?.length ? (
                  <div className="space-y-2">
                    {activeModule.quizzes.map((q: any) => (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="font-medium">{q.title}</p>
                        <p className="text-xs text-slate-500">{(q.questions || []).length} questions</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No quizzes available in this module.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <CourseContent
            modules={modules}
            activeModuleIdx={activeModuleIdx}
            setActiveModuleIdx={setActiveModuleIdx}
            currentLessonId={currentLessonId}
            setCurrentLessonId={setCurrentLessonId}
            onSelectQuiz={(moduleIdx, moduleId, quizId) =>
              router.push(`/dashboard/courses/${course.id ?? (course as any)._id}/modules/${moduleId}/quizzes/${quizId}`)
            }
          />
        </div>
      </div>
    </div>
  )
}
