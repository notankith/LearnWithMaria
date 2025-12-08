"use client"

import { useState, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CourseContent from "@/components/lms/course-content"
import LessonViewer from "@/components/lms/lesson-viewer"

export default function CoursePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [currentLessonId, setCurrentLessonId] = useState(1)

  // `params` may be a Promise in client components — unwrap it with `use`.
  const resolvedParams = use(params as Promise<{ id: string }>)

  // Mock course data
  const course = {
    id: resolvedParams.id,
    title: "IELTS General Training",
    instructor: "Sarah Johnson",
    description: "Complete preparation for IELTS General Training with all four modules.",
    progress: 65,
    lessons: [
      {
        id: 1,
        title: "Introduction to IELTS",
        duration: 15,
        type: "video",
        completed: true,
        videoUrl: "/ielts-introduction.jpg",
      },
      {
        id: 2,
        title: "Speaking Module Overview",
        duration: 20,
        type: "video",
        completed: true,
        videoUrl: "/speaking-module.jpg",
      },
      {
        id: 3,
        title: "Speaking Part 1 Techniques",
        duration: 25,
        type: "video",
        completed: false,
        videoUrl: "/speaking-part1.jpg",
      },
      {
        id: 4,
        title: "Vocabulary Building",
        duration: 18,
        type: "text",
        completed: false,
        content: "Common IELTS vocabulary across different topics...",
      },
      {
        id: 5,
        title: "Grammar Essentials",
        duration: 22,
        type: "video",
        completed: false,
        videoUrl: "/grammar-rules.png",
      },
      {
        id: 6,
        title: "Practice: Speaking Part 1",
        duration: 30,
        type: "interactive",
        completed: false,
        description: "Practice 5 questions with AI feedback",
      },
    ],
  }

  const currentLesson = course.lessons.find((l) => l.id === currentLessonId) || course.lessons[0]

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
