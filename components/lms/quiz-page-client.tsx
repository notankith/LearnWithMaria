"use client"

import QuizPlayer from "@/components/lms/quiz-player"

export default function QuizPageClient({ courseId, moduleId, quiz }: { courseId: string; moduleId: string; quiz: any }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <QuizPlayer courseId={courseId} moduleId={moduleId} quiz={quiz} onClose={() => window.history.back()} />
      </div>
    </div>
  )
}
