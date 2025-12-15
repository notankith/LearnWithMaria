"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, Lock, Play } from "lucide-react"

interface Lesson {
  id: number
  title: string
  duration: number
  type: string
  completed: boolean
  url?: string | null
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  quizzes?: { id: string; title: string; questions?: any[] }[]
}

interface CourseContentProps {
  modules: Module[]
  activeModuleIdx: number
  setActiveModuleIdx: (i: number) => void
  currentLessonId: number | null
  setCurrentLessonId: (id: number | null) => void
  onSelectQuiz?: (moduleIdx: number, moduleId: string, quizId: string) => void
}

export default function CourseContent({ modules, activeModuleIdx, setActiveModuleIdx, currentLessonId, setCurrentLessonId, onSelectQuiz }: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([activeModuleIdx])

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    setActiveModuleIdx(index)
  }

  const progress = 0 // keep placeholder; course progress can be passed separately if needed

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-24">
      {/* Progress Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Course Progress</h3>
          <span className="text-lg font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Modules */}
      <div className="divide-y divide-slate-200">
        {modules.map((module, moduleIdx) => (
          <div key={module.id}>
            <button
              onClick={() => toggleSection(moduleIdx)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <h4 className="font-semibold text-slate-900">{module.title}</h4>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition ${expandedSections.includes(moduleIdx) ? "rotate-180" : ""}`}
              />
            </button>

            {expandedSections.includes(moduleIdx) && (
              <div className="divide-y divide-slate-100 bg-slate-50">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonId(lesson.id)}
                    className={`w-full px-6 py-4 flex items-center gap-3 text-left transition ${
                      currentLessonId === lesson.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : currentLessonId === lesson.id ? (
                        <Play className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${currentLessonId === lesson.id ? "text-blue-600" : "text-slate-900"}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500">{lesson.duration} min</p>
                    </div>
                  </button>
                ))}

                {module.quizzes && module.quizzes.length > 0 && (
                  <div className="p-4">
                    <h5 className="text-sm font-semibold text-slate-700 mb-2">Quizzes</h5>
                    <div className="space-y-2">
                      {module.quizzes.map((quiz) => (
                        <button
                          key={quiz.id}
                          type="button"
                          onClick={() => onSelectQuiz?.(moduleIdx, module.id, quiz.id)}
                          className="w-full text-left p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50"
                        >
                          <p className="text-sm font-medium">{quiz.title}</p>
                          <p className="text-xs text-slate-500">{(quiz.questions || []).length} questions</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
