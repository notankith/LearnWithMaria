"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Video, FileText, Music } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function CourseEditor({ course: initialCourse }: { course: any }) {
  const router = useRouter()
  const [course, setCourse] = useState(initialCourse)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null)
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)

  // Module dialog
  const [moduleDialog, setModuleDialog] = useState(false)
  const [moduleForm, setModuleForm] = useState({ title: "" })
  const [isCreatingModule, setIsCreatingModule] = useState(false)

  // Lesson dialog
  const [lessonDialog, setLessonDialog] = useState(false)
  const [lessonModuleId, setLessonModuleId] = useState<string | null>(null)
  const [lessonForm, setLessonForm] = useState({ title: "", type: "video", url: "" })
  const [isCreatingLesson, setIsCreatingLesson] = useState(false)

  // Quiz dialog
  const [quizDialog, setQuizDialog] = useState(false)
  const [quizModuleId, setQuizModuleId] = useState<string | null>(null)
  const [quizForm, setQuizForm] = useState({ title: "", questions: [] as any[] })
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false)

  // Question dialog
  const [questionDialog, setQuestionDialog] = useState(false)
  const [questionForm, setQuestionForm] = useState({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  })

  const refreshCourse = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data.course)
      }
    } catch (error) {
      console.error("[v0] Error refreshing course:", error)
    }
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCreatingModule) return
    setIsCreatingModule(true)
    try {
      const res = await fetch(`/api/admin/courses/${course._id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: moduleForm.title, order: course.modules.length }),
      })

      const data = await res.json()

      if (res.ok && data.module) {
        // Use backend response as single source of truth
        setCourse((prev: any) => ({ ...prev, modules: [...(prev.modules || []), data.module] }))
        toast.success("Module created")
        setModuleDialog(false)
        setModuleForm({ title: "" })
      } else {
        toast.error(data.error || "Failed to create module")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsCreatingModule(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its content?")) return
    setDeletingModuleId(moduleId)
    try {
      const res = await fetch(`/api/admin/courses/${course._id}/modules/${moduleId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Module deleted")
        await refreshCourse()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error || "Failed to delete module")
      }
    } catch (error) {
      console.error("[v0] Delete module error:", error)
      toast.error("An error occurred")
    } finally {
      setDeletingModuleId(null)
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lessonModuleId) return
    if (isCreatingLesson) return
    setIsCreatingLesson(true)
    try {
      const module = course.modules.find((m: any) => m.id === lessonModuleId)
      const res = await fetch(`/api/admin/courses/${course._id}/modules/${lessonModuleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lessonForm, order: (module?.lessons?.length ?? 0) }),
      })

      const data = await res.json()

      if (res.ok && data.lesson) {
        // merge server lesson into the correct module immutably
        setCourse((prev: any) => ({
          ...prev,
          modules: (prev.modules || []).map((m: any) =>
            m.id === lessonModuleId ? { ...m, lessons: [...(m.lessons || []), data.lesson] } : m,
          ),
        }))
        toast.success("Lesson created")
        setLessonDialog(false)
        setLessonForm({ title: "", type: "video", url: "" })
      } else {
        toast.error(data.error || "Failed to create lesson")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsCreatingLesson(false)
    }
  }

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return
    setDeletingLessonId(lessonId)
    try {
      const res = await fetch(`/api/admin/courses/${course._id}/modules/${moduleId}/lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Lesson deleted")
        await refreshCourse()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error || "Failed to delete lesson")
      }
    } catch (error) {
      console.error("[v0] Delete lesson error:", error)
      toast.error("An error occurred")
    } finally {
      setDeletingLessonId(null)
    }
  }

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          id: Date.now().toString(),
          ...questionForm,
          order: quizForm.questions.length,
        },
      ],
    })
    setQuestionDialog(false)
    setQuestionForm({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    })
  }

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizModuleId || quizForm.questions.length === 0) {
      toast.error("Add at least one question")
      return
    }
    if (isCreatingQuiz) return
    setIsCreatingQuiz(true)
    try {
      const res = await fetch(`/api/admin/courses/${course._id}/modules/${quizModuleId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizForm),
      })

      const data = await res.json()

      if (res.ok && data.quiz) {
        setCourse((prev: any) => ({
          ...prev,
          modules: (prev.modules || []).map((m: any) => (m.id === quizModuleId ? { ...m, quizzes: [...(m.quizzes || []), data.quiz] } : m)),
        }))
        toast.success("Quiz created")
        setQuizDialog(false)
        setQuizForm({ title: "", questions: [] })
      } else {
        toast.error(data.error || "Failed to create quiz")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsCreatingQuiz(false)
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "pdf":
        return <FileText className="w-4 h-4" />
      case "audio":
        return <Music className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-12 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-600 mt-2">{course.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Course Structure</h2>
          <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <Label>Module Title</Label>
                  <Input
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ title: e.target.value })}
                    placeholder="e.g., Introduction to IELTS"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isCreatingModule}>
                  {isCreatingModule ? "Creating..." : "Create Module"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {course.modules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-slate-600">No modules yet. Add your first module to start building the course.</p>
              </CardContent>
            </Card>
          ) : (
            course.modules.map((module: any, index: number) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">Module {index + 1}:</span>
                      {module.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveModule(activeModule === module.id ? null : module.id)
                        }}
                      >
                        {activeModule === module.id ? "Collapse" : "Expand"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteModule(module.id)} disabled={deletingModuleId === module.id}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {activeModule === module.id && (
                  <CardContent className="space-y-4">
                    {/* Lessons */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">Lessons</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setLessonModuleId(module.id)
                            setLessonDialog(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                      {module.lessons.length === 0 ? (
                        <p className="text-sm text-slate-500">No lessons yet</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getLessonIcon(lesson.type)}
                                <div>
                                  <p className="font-medium text-sm">{lesson.title}</p>
                                  <p className="text-xs text-slate-500 capitalize">{lesson.type}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                disabled={deletingLessonId === lesson.id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quizzes */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">Quizzes</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setQuizModuleId(module.id)
                            setQuizDialog(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Quiz
                        </Button>
                      </div>
                      {module.quizzes.length === 0 ? (
                        <p className="text-sm text-slate-500">No quizzes yet</p>
                      ) : (
                        <div className="space-y-2">
                          {module.quizzes.map((quiz: any) => (
                            <div key={quiz.id} className="p-3 bg-slate-50 rounded-lg">
                              <p className="font-medium text-sm">{quiz.title}</p>
                              <p className="text-xs text-slate-500">{quiz.questions.length} questions</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Lesson Dialog */}
        <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
            </DialogHeader>
              <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <Label>Lesson Title</Label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g., Introduction Video"
                  required
                />
              </div>
              <div>
                <Label>Lesson Type</Label>
                <select
                  value={lessonForm.type}
                  onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <Label>Content URL</Label>
                <Input
                  value={lessonForm.url}
                  onChange={(e) => setLessonForm({ ...lessonForm, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isCreatingLesson}>
                {isCreatingLesson ? "Adding..." : "Add Lesson"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Quiz Dialog */}
        <Dialog open={quizDialog} onOpenChange={setQuizDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <Label>Quiz Title</Label>
                <Input
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g., Module 1 Assessment"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Questions ({quizForm.questions.length})</Label>
                  <Dialog open={questionDialog} onOpenChange={setQuestionDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Question Type</Label>
                          <select
                            value={questionForm.type}
                            onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md"
                          >
                            <option value="mcq">Multiple Choice</option>
                            <option value="free-text">Text Response</option>
                          </select>
                        </div>
                        <div>
                          <Label>Question</Label>
                          <Textarea
                            value={questionForm.question}
                            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                            placeholder="Enter your question..."
                            rows={3}
                          />
                        </div>
                        {questionForm.type === "mcq" && (
                          <>
                            <div>
                              <Label>Options</Label>
                              {questionForm.options.map((opt, i) => (
                                <Input
                                  key={i}
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...questionForm.options]
                                    newOptions[i] = e.target.value
                                    setQuestionForm({ ...questionForm, options: newOptions })
                                  }}
                                  placeholder={`Option ${i + 1}`}
                                  className="mb-2"
                                />
                              ))}
                            </div>
                            <div>
                              <Label>Correct Answer</Label>
                              <select
                                value={questionForm.correctAnswer}
                                onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                              >
                                <option value="">Select correct answer</option>
                                {questionForm.options.map(
                                  (opt, i) =>
                                    opt && (
                                      <option key={i} value={opt}>
                                        {opt}
                                      </option>
                                    ),
                                )}
                              </select>
                            </div>
                          </>
                        )}
                        <Button type="button" onClick={handleAddQuestion} className="w-full">
                          Add Question
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {quizForm.questions.length > 0 && (
                  <div className="space-y-2">
                    {quizForm.questions.map((q: any, i: number) => (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-sm">
                          Q{i + 1}: {q.question}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{q.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={quizForm.questions.length === 0 || isCreatingQuiz}>
                {isCreatingQuiz ? "Creating..." : "Create Quiz"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
