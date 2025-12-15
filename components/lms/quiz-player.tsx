"use client"

import { useState, useEffect } from "react"

interface Question {
  id: string
  question: string
  type?: string
  options?: string[]
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
}

interface Props {
  courseId: string
  moduleId: string
  quiz: Quiz
  onClose?: () => void
}

export default function QuizPlayer({ courseId, moduleId, quiz, onClose }: Props) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)

  const handleChange = (qId: string, value: any) => {
    setAnswers((s) => ({ ...s, [qId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        answers: quiz.questions.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? "" })),
      }

      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.results) {
        setResult(data.results)
        setAttemptId(data.attemptId || null)
        // If any answers are pending, start polling
        const anyPending = (data.results.answers || []).some((a: any) => a.ai?.pending || a.pending)
        if (anyPending) {
          setEvaluating(true)
        }
      } else {
        setResult({ error: data.error || "Failed to submit" })
      }
    } catch (err) {
      setResult({ error: "Network error" })
    } finally {
      setSubmitting(false)
    }
  }

  // Poll attempt if evaluating
  useEffect(() => {
    if (!evaluating || !attemptId) return
    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const r = await fetch(`/api/attempts/${attemptId}`)
        const d = await r.json()
        if (r.ok && d.attempt) {
          const at = d.attempt
          const anyPending = (at.answers || []).some((a: any) => a.ai?.pending)
          if (!anyPending) {
            if (!cancelled) {
              setResult({ answers: at.answers, totalScore: at.totalScore, maxScore: at.maxScore })
              setEvaluating(false)
            }
          }
        }
      } catch (err) {
        // ignore network errors while polling
      }
    }, 4000)

    // stop polling after 2 minutes
    const stopTimeout = setTimeout(() => {
      clearInterval(interval)
      setEvaluating(false)
    }, 120_000)

    return () => {
      cancelled = true
      clearInterval(interval)
      clearTimeout(stopTimeout)
    }
  }, [evaluating, attemptId])

  if (result) {
    // compute MCQ correctness only
    const mcqAnswers = (result.answers || []).filter((a: any) => {
      const q = quiz.questions.find((qq) => qq.id === a.questionId)
      return q?.type === "mcq"
    })
    const correctCount = mcqAnswers.filter((a: any) => a.correct).length
    const wrongCount = mcqAnswers.length - correctCount
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        {result.error ? (
          <p className="text-sm text-red-600">{result.error}</p>
        ) : (
          <div>
            <p className="mb-2">Score: <strong>{result.totalScore}</strong> / {result.maxScore}</p>
            {evaluating && <p className="text-sm text-yellow-600">Evaluating answers — results will update shortly.</p>}
            <p className="mb-4">Correct: <strong>{correctCount}</strong> • Wrong: <strong>{wrongCount}</strong></p>

            <div className="space-y-4">
              {result.answers.map((a: any, i: number) => {
                const q = quiz.questions.find((q) => q.id === a.questionId)
                const isFreeText = q?.type !== "mcq"
                // aiScore might be at top-level or nested under `ai`.
                const aiScore = a.aiScore ?? a.ai?.aiScore ?? (typeof a.ai === "number" ? a.ai : undefined)
                const scoreOutOf10 = typeof aiScore === "number" ? Math.round(aiScore / 10) : Math.round((a.score || 0) / (a.maxScore || 10) * 10)
                const suggestion = (a.improvements && a.improvements[0]) || a.ai?.improvements?.[0] || a.explanation || (a.ai && a.ai.feedback) || ""

                return (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium">Question: {q?.question}</p>
                    <p className="text-sm">Your answer: {String(a.answer)}</p>
                    {isFreeText ? (
                      <div className="mt-2">
                        <p className="text-sm font-medium">AI Score: <strong>{scoreOutOf10}</strong> / 10</p>
                        {suggestion && <p className="text-sm mt-1">Suggestion: {suggestion}</p>}
                      </div>
                    ) : (
                      <p className={`text-sm mt-1 ${a.correct ? "text-green-600" : "text-red-600"}`}>
                        {a.correct ? "Correct" : `Incorrect — ${a.explanation || ""}`}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button onClick={() => setResult(null)} className="px-4 py-2 bg-blue-600 text-white rounded">Review Answers</button>
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h2 className="text-2xl font-bold">{quiz.title}</h2>

      {quiz.questions.map((q) => {
        const hasValidOptions =
          q.type === "mcq" && Array.isArray(q.options) && q.options.some((o: any) => String(o ?? "").trim().length > 0)

        return (
          <div key={q.id} className="p-3 bg-slate-50 rounded-lg">
            <p className="font-medium mb-2">{q.question}</p>
            {hasValidOptions ? (
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleChange(q.id, opt)}
                      disabled={submitting || !!result}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full p-2 border rounded"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                disabled={submitting || !!result}
                placeholder="Type your answer here"
              />
            )}
          </div>
        )
      })}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </form>
  )
}
