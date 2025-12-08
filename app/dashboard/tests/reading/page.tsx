"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function ReadingTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(10).fill(""))
  const [submitted, setSubmitted] = useState(false)

  const passage = `Technology has fundamentally transformed the way we communicate, work, and learn. The internet, once a novelty, has become an essential part of daily life for billions of people worldwide. From instant messaging to video conferencing, digital communication tools have made it possible to connect with others across vast distances instantaneously.

In the workplace, digital transformation has led to increased productivity and efficiency. Remote work, powered by cloud computing and collaboration software, has become increasingly common. However, this shift has also raised concerns about work-life balance and the psychological impact of constant connectivity.

Education, too, has been revolutionized by technology. Online learning platforms provide access to quality education regardless of geographic location. Yet, educators continue to debate whether digital learning can fully replace traditional classroom experiences.`

  const questions = [
    {
      id: 1,
      text: "According to the passage, what has the internet become?",
      options: ["A novelty", "An essential part of daily life", "A workplace tool", "An educational platform"],
      correct: 1,
    },
    {
      id: 2,
      text: "Which of the following is mentioned as a benefit of digital transformation in the workplace?",
      options: [
        "Improved social skills",
        "Increased productivity and efficiency",
        "Better job security",
        "Higher salaries",
      ],
      correct: 1,
    },
    {
      id: 3,
      text: "What is a concern mentioned about remote work?",
      options: [
        "It reduces productivity",
        "It causes work-life balance issues",
        "It requires more meetings",
        "It is not available worldwide",
      ],
      correct: 1,
    },
    {
      id: 4,
      text: "What advantage do online learning platforms provide?",
      options: [
        "Lower costs only",
        "Access to education regardless of location",
        "Better teaching methods",
        "No exams required",
      ],
      correct: 1,
    },
    {
      id: 5,
      text: "According to the passage, educators are debating about:",
      options: [
        "The cost of technology",
        "Whether digital learning can replace traditional classrooms",
        "Internet speed",
        "Student motivation",
      ],
      correct: 1,
    },
    {
      id: 6,
      text: "What is mentioned as a tool that enables remote work?",
      options: ["Television", "Radio", "Cloud computing", "Newspapers"],
      correct: 2,
    },
    {
      id: 7,
      text: "The passage suggests that digital communication tools have made it possible to:",
      options: [
        "Eliminate all travel",
        "Connect instantly across distances",
        "Replace face-to-face meetings entirely",
        "Reduce the need for writing",
      ],
      correct: 1,
    },
    {
      id: 8,
      text: "Which area has NOT been mentioned as transformed by technology in the passage?",
      options: ["Communication", "Healthcare", "Work", "Education"],
      correct: 1,
    },
    {
      id: 9,
      text: "The psychological impact mentioned relates to:",
      options: ["Screen time addiction", "Constant connectivity from remote work", "Social media bullying", "Job loss"],
      correct: 1,
    },
    {
      id: 10,
      text: "What is the author's overall tone about technology?",
      options: ["Completely negative", "Entirely positive", "Balanced and analytical", "Uncertain"],
      correct: 2,
    },
  ]

  const handleAnswerChange = (index: number, option: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = option
    setAnswers(newAnswers)
  }

  const handleSubmitTest = () => {
    setSubmitted(true)
  }

  if (submitted) {
    const correctCount = answers.filter((ans, idx) => ans === questions[idx].correct).length
    const percentage = Math.round((correctCount / questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reading Test Completed</h1>
            <p className="text-slate-600 mb-8">Your test has been submitted and automatically graded.</p>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">{correctCount}/10</div>
              <div className="text-xl font-semibold text-slate-900">Correct Answers</div>
              <div className="text-lg text-slate-600 mt-2">{percentage}% Score</div>
            </div>

            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
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

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Reading Comprehension Test</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Passage */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Passage</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{passage}</p>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Question {currentQuestion + 1}: {questions[currentQuestion].text}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerChange(currentQuestion, idx)}
                      className={`w-full p-4 text-left rounded-lg border-2 font-medium transition ${
                        answers[currentQuestion] === idx
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full aspect-square rounded-lg font-semibold transition flex items-center justify-center ${
                    currentQuestion === idx
                      ? "bg-blue-600 text-white"
                      : answers[idx] !== ""
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600">
              <p>
                Answered: <strong>{answers.filter((a) => a !== "").length}</strong> / {questions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
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
