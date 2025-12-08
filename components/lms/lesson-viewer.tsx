"use client"

import { useState } from "react"
import { PlayCircle, BookOpen, CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"

interface Lesson {
  id: number
  title: string
  duration: number
  type: string
  completed: boolean
  videoUrl?: string
  content?: string
  description?: string
}

interface Course {
  id: string
  lessons: Lesson[]
}

interface LessonViewerProps {
  lesson: Lesson
  course: Course
}

export default function LessonViewer({ lesson, course }: LessonViewerProps) {
  const [isWatching, setIsWatching] = useState(false)
  const [isCompleted, setIsCompleted] = useState(lesson.completed)

  const nextLessonId = course.lessons[course.lessons.findIndex((l) => l.id === lesson.id) + 1]?.id

  const handleMarkComplete = () => {
    setIsCompleted(true)
  }

  return (
    <div className="space-y-6">
      {/* Video/Content Area */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="relative w-full bg-black">
          {lesson.type === "video" ? (
            <>
              <div className="relative w-full pt-[56.25%]">
                <Image
                  src={lesson.videoUrl || "/placeholder.svg?height=720&width=1280&query=video-placeholder"}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                />
              </div>
              {!isWatching && (
                <button
                  onClick={() => setIsWatching(true)}
                  className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition"
                >
                  <PlayCircle className="w-20 h-20 text-white" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full pt-[56.25%] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{lesson.title}</h1>
              <p className="text-slate-600">Duration: {lesson.duration} minutes</p>
            </div>
            {isCompleted && <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />}
          </div>

          {/* Content */}
          {lesson.type === "text" && lesson.content && (
            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-slate-700 leading-relaxed">{lesson.content}</p>
            </div>
          )}

          {lesson.type === "interactive" && lesson.description && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-slate-700">{lesson.description}</p>
            </div>
          )}

          {/* Mark Complete */}
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      {/* Next Lesson CTA */}
      {isCompleted && nextLessonId && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Next lesson ready</p>
          <h3 className="text-lg font-bold mb-4">{course.lessons.find((l) => l.id === nextLessonId)?.title}</h3>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition">
            Continue Learning
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
