"use client"

import { useState } from "react"
import Link from "next/link"
import { PenTool, ArrowLeft } from "lucide-react"

export default function WritingTestPage() {
  const [currentTask, setCurrentTask] = useState(0)
  const [responses, setResponses] = useState(["", ""])
  const [submitted, setSubmitted] = useState(false)

  const tasks = [
    {
      id: 1,
      type: "Task 1",
      prompt: "Write a letter requesting information about a course. Write at least 150 words.",
      timeLimit: 20,
      minWords: 150,
    },
    {
      id: 2,
      type: "Task 2",
      prompt:
        "Write an essay discussing the impact of technology on education. Write at least 250 words. Provide reasons and examples.",
      timeLimit: 40,
      minWords: 250,
    },
  ]

  const handleTextChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentTask] = value
    setResponses(newResponses)
  }

  const wordCount = responses[currentTask]
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  const handleSubmitTest = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Writing Test Submitted</h1>
            <p className="text-slate-600 mb-8">
              Your essays have been received. An expert instructor will review and provide detailed feedback.
            </p>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Expected feedback time:</strong> 48 hours. You'll receive band scores and detailed comments on
                grammar, vocabulary, and coherence.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 md:px-12 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Writing Test</h1>

        {/* Task Tabs */}
        <div className="flex gap-3 mb-8">
          {tasks.map((task, idx) => (
            <button
              key={task.id}
              onClick={() => setCurrentTask(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentTask === idx
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              {task.type}
            </button>
          ))}
        </div>

        {/* Task Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <span className="text-sm font-semibold text-blue-600 uppercase">{tasks[currentTask].type}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-6">{tasks[currentTask].prompt}</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Time limit:</strong> {tasks[currentTask].timeLimit} minutes
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Minimum words:</strong> {tasks[currentTask].minWords} words
                </p>
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-900">Your Response</label>
              <span
                className={`text-sm font-medium ${
                  wordCount >= tasks[currentTask].minWords ? "text-green-600" : "text-orange-600"
                }`}
              >
                {wordCount} / {tasks[currentTask].minWords} words
              </span>
            </div>
            <textarea
              value={responses[currentTask]}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your response here..."
              className="w-full h-96 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Info Box */}
          {wordCount < tasks[currentTask].minWords && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-orange-700">
                You need at least {tasks[currentTask].minWords - wordCount} more words to meet the minimum requirement.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
            disabled={currentTask === 0}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition disabled:opacity-50"
          >
            Previous
          </button>

          {currentTask === tasks.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              disabled={responses.some((r) => r.trim().length === 0)}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentTask(Math.min(tasks.length - 1, currentTask + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
