"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, MessageCircle, PlayCircle, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function CourseDetailView({
  course,
  isLoggedIn,
  studentEmail,
}: {
  course: any
  isLoggedIn: boolean
  studentEmail?: string
}) {
  const router = useRouter()
  const [activeModule, setActiveModule] = useState<string | null>(null)

  const handleContactAdmin = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the course: ${course.title}.${studentEmail ? ` My email is: ${studentEmail}` : ""} Can you provide more information?`,
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const handleAccessCourse = () => {
    if (course.isAssigned) {
      router.push(`/dashboard/courses/${course._id}`)
    } else {
      handleContactAdmin()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <Link href="/explore" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{course.title}</h1>
              <p className="text-lg text-slate-600 mb-6">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>By {course.createdByName}</span>
                <span>•</span>
                <span>{course.modules?.length || 0} Modules</span>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <div className="aspect-video w-full bg-slate-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={course.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.isAssigned ? (
                    <>
                      <Button onClick={handleAccessCourse} className="w-full bg-green-600 hover:bg-green-700">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Access Course
                      </Button>
                      <p className="text-sm text-center text-slate-600">You have full access to this course</p>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleContactAdmin} className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Admin to Unlock
                      </Button>
                      <p className="text-sm text-center text-slate-600">Contact the admin to get enrolled</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Preview */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>

        {!course.modules || course.modules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">Course content is being prepared. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module: any, index: number) => (
              <Card key={module.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-slate-50 transition"
                  onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      {course.isAssigned ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <span>
                        Module {index + 1}: {module.title}
                      </span>
                    </span>
                    <span className="text-sm text-slate-500 font-normal">
                      {module.lessons?.length || 0} lessons • {module.quizzes?.length || 0} quizzes
                    </span>
                  </CardTitle>
                </CardHeader>

                {activeModule === module.id && (
                  <CardContent className="space-y-3 border-t pt-4">
                    {/* Lessons */}
                    {module.lessons && module.lessons.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 mb-2">Lessons</h4>
                        <div className="space-y-2">
                          {module.lessons.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-3 p-3 rounded-lg ${course.isAssigned ? "bg-slate-50" : "bg-slate-100"}`}
                            >
                              {lesson.type === "video" && <PlayCircle className="w-4 h-4 text-blue-600" />}
                              {lesson.type === "pdf" && <FileText className="w-4 h-4 text-red-600" />}
                              <span className="text-sm font-medium">{lesson.title}</span>
                              {!course.isAssigned && <Lock className="w-3 h-3 text-slate-400 ml-auto" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quizzes */}
                    {module.quizzes && module.quizzes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 mb-2">Quizzes</h4>
                        <div className="space-y-2">
                          {module.quizzes.map((quiz: any) => (
                            <div
                              key={quiz.id}
                              onClick={() =>
                                course.isAssigned
                                  ? router.push(`/dashboard/courses/${course._id}/modules/${module.id}/quizzes/${quiz.id}`)
                                  : null
                              }
                              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg ${course.isAssigned ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-100"}`}
                            >
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium">{quiz.title}</span>
                              <span className="text-xs text-slate-500">({quiz.questions?.length || 0} questions)</span>
                              {!course.isAssigned && <Lock className="w-3 h-3 text-slate-400 ml-auto" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!module.lessons || module.lessons.length === 0) &&
                      (!module.quizzes || module.quizzes.length === 0) && (
                        <p className="text-sm text-slate-500 text-center py-4">No content available yet</p>
                      )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
