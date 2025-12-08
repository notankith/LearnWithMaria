"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, Lock, Play } from "lucide-react"

type ID = string | number

interface Lesson {
  id: ID
  title?: string
  duration?: number
  type?: string
  completed?: boolean
}

interface Course {
  id: string
  title?: string
  progress?: number
  lessons?: Lesson[]
  modules?: Lesson[]
}

interface CourseContentProps {
  course: Course | null | undefined
  currentLessonId: ID | null | undefined
  setCurrentLessonId: (id: ID) => void
}

export default function CourseContent({ course, currentLessonId, setCurrentLessonId }: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<ID[]>([0])

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const lessons = course?.lessons ?? course?.modules ?? []

  const [moduleNames, setModuleNames] = useState<string[] | null>(null)

  // Load site settings for module names
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/superadmin/settings")
        if (res.ok) {
          const json = await res.json()
          if (mounted && json.moduleNames) setModuleNames(json.moduleNames)
        }
      } catch (err) {
        // ignore - fall back to defaults
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const names = moduleNames ?? ["Module 1: Foundations", "Module 2: Speaking", "Module 3: Grammar & Vocabulary"]

  const sections = [
    { title: names[0] ?? "Module 1: Foundations", lessons: lessons.slice(0, 2) },
    { title: names[1] ?? "Module 2: Speaking", lessons: lessons.slice(2, 4) },
    { title: names[2] ?? "Module 3: Grammar & Vocabulary", lessons: lessons.slice(4, 6) },
  ]

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-24">
      {/* Progress Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Course Progress</h3>
          <span className="text-lg font-bold text-blue-600">{course.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      {/* Lessons */}
      <div className="divide-y divide-slate-200">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <button
              onClick={() => toggleSection(sectionIdx)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <h4 className="font-semibold text-slate-900">{section.title}</h4>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition ${
                  expandedSections.includes(sectionIdx) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.includes(sectionIdx) && (
              <div className="divide-y divide-slate-100 bg-slate-50">
                {section.lessons.map((lesson) => (
                  <button
                    key={String(lesson.id)}
                    onClick={() => setCurrentLessonId(lesson.id as ID)}
                    className={`w-full px-6 py-4 flex items-center gap-3 text-left transition ${
                      String(currentLessonId) === String(lesson.id) ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-slate-100"
                    }`}
                  >
                    <div className="shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : String(currentLessonId) === String(lesson.id) ? (
                        <Play className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${String(currentLessonId) === String(lesson.id) ? "text-blue-600" : "text-slate-900"}`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500">{lesson.duration ?? ""} min</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
