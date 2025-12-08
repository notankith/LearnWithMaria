"use client"

import { useState } from "react"
import Link from "next/link"
import { Mic, ArrowLeft, Play, Square } from "lucide-react"

export default function SpeakingTestPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const questions = [
    {
      id: 1,
      part: "Part 1",
      prompt: "Tell me about your hometown.",
      timeLimit: 60,
    },
    {
      id: 2,
      part: "Part 2",
      prompt: "Describe a memorable journey you've taken.",
      timeLimit: 120,
    },
    {
      id: 3,
      part: "Part 3",
      prompt: "How has travel changed in the last decade?",
      timeLimit: 90,
    },
  ]

  const handleSubmitTest = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Speaking Test Submitted</h1>
            <p className="text-slate-600 mb-8">
              Your responses have been recorded. Our AI will evaluate your pronunciation and fluency.
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
                <strong>Expected feedback time:</strong> 24 hours. You'll receive detailed feedback on pronunciation,
                fluency, and grammar.
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

        {/* Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Speaking Test</h1>
          <div className="flex gap-3 mb-6">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentQuestion === idx
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                {q.part}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
          <div className="mb-8">
            <span className="text-sm font-semibold text-blue-600 uppercase">{questions[currentQuestion].part}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-6">{questions[currentQuestion].prompt}</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-600">
                <strong>Time limit:</strong> {questions[currentQuestion].timeLimit} seconds
              </p>
            </div>
          </div>

          {/* Recording Interface */}
          <div className="flex flex-col items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition ${
                isRecording ? "bg-red-100" : "bg-slate-100"
              }`}
            >
              <Mic className={`w-12 h-12 ${isRecording ? "text-red-600 animate-pulse" : "text-slate-400"}`} />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition ${
                  isRecording ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-600 text-sm">Click the button to start recording your response</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
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
