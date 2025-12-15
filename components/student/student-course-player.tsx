"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, PlayCircle, FileText, Music, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentCoursePlayer({ course, userId }: { course: any; userId: string }) {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    course.modules.length > 0 ? course.modules[0].id : null,
  )
  const [activeLesson, setActiveLesson] = useState<any>(null)

  const activeModule = course.modules.find((m: any) => m.id === activeModuleId)

  const renderLessonViewer = () => {
    if (!activeLesson) {
      return (
        <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
          <p className="text-slate-600">Select a lesson to start learning</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
          {activeLesson.type === "video" && (
            <iframe
              src={activeLesson.url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {activeLesson.type === "pdf" && (
            <iframe src={activeLesson.url} className="w-full h-full" title={activeLesson.title} />
          )}
          {activeLesson.type === "audio" && (
            <div className="flex items-center justify-center h-full">
              <audio src={activeLesson.url} controls className="w-full max-w-lg" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 md:px-12 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">{course.title}</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 px-6 md:px-12 py-8">
        {/* Main Content */}
        <div className="md:col-span-2">{renderLessonViewer()}</div>

        {/* Sidebar - Course Structure */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {course.modules.map((module: any, index: number) => (
                <div key={module.id}>
                  <button
                    onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                    className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                  >
                    Module {index + 1}: {module.title}
                  </button>

                  {activeModuleId === module.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {module.lessons?.map((lesson: any) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm transition ${
                            activeLesson?.id === lesson.id
                              ? "bg-blue-100 text-blue-900 font-medium"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          {lesson.type === "video" && <PlayCircle className="w-4 h-4" />}
                          {lesson.type === "pdf" && <FileText className="w-4 h-4" />}
                          {lesson.type === "audio" && <Music className="w-4 h-4" />}
                          <span className="flex-1">{lesson.title}</span>
                        </button>
                      ))}

                      {module.quizzes?.map((quiz: any) => (
                        <button
                          key={quiz.id}
                          className="w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-50 transition"
                        >
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span className="flex-1">{quiz.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
