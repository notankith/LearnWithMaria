"use client"

import { useState } from "react"
import Link from "next/link"
import { Headphones, ArrowLeft, Play } from "lucide-react"

export default function ListeningTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(8).fill(""))
  const [submitted, setSubmitted] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)

  const questions = [
    {
      id: 1,
      section: "Section 1",
      type: "Multiple Choice",
      audio: "Conversation about booking a hotel",
      text: "What type of room does the customer book?",
      options: ["Single room", "Double room", "Suite", "Twin room"],
      correct: 1,
    },
    {
      id: 2,
      section: "Section 1",
      type: "Multiple Choice",
      audio: "Conversation about booking a hotel",
      text: "What is the total cost?",
      options: ["$150", "$200", "$250", "$300"],
      correct: 2,
    },
    {
      id: 3,
      section: "Section 2",
      type: "Short Answer",
      audio: "Lecture about climate change",
      text: "What is the main cause mentioned?",
      options: ["Deforestation", "Industrial emissions", "Ocean pollution", "Solar activity"],
      correct: 1,
    },
    {
      id: 4,
      section: "Section 2",
      type: "Short Answer",
      audio: "Lecture about climate change",
      text: "What percentage increase is mentioned?",
      options: ["1.5%", "2.5%", "3.5%", "4.5%"],
      correct: 2,
    },
    {
      id: 5,
      section: "Section 3",
      type: "Multiple Choice",
      audio: "Academic discussion",
      text: "What is the main topic of discussion?",
      options: ["Research methods", "Statistical analysis", "Data interpretation", "Report writing"],
      correct: 0,
    },
    {
      id: 6,
      section: "Section 3",
      type: "Multiple Choice",
      audio: "Academic discussion",
      text: "What recommendation is made?",
      options: ["Use more samples", "Conduct interviews", "Both A and B", "Neither A nor B"],
      correct: 2,
    },
    {
      id: 7,
      section: "Section 4",
      type: "Completion",
      audio: "Scientific presentation",
      text: "The research shows _____ development.",
      options: ["Rapid", "Slow", "Steady", "Irregular"],
      correct: 2,
    },
    {
      id: 8,
      section: "Section 4",
      type: "Completion",
      audio: "Scientific presentation",
      text: "Future applications include _____.",
      options: ["Medicine", "Agriculture", "Technology", "All of the above"],
      correct: 3,
    },
  ]

  const handleAnswerChange = (index: number, option: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = option
    setAnswers(newAnswers)
  }

  const handlePlayAudio = (index: number) => {
    setPlayingAudio(playingAudio === index ? null : index)
    // In a real app, this would actually play audio
  }

  const handleSubmitTest = () => {
    setSubmitted(true)
  }

  if (submitted) {
    const correctCount = answers.filter((ans, idx) => ans === questions[idx].correct).length
    const percentage = Math.round((correctCount / questions.length) * 100)
    const bandScore = (correctCount / questions.length) * 9

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 md:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Listening Test Completed</h1>
            <p className="text-slate-600 mb-8">Your test has been submitted and automatically graded.</p>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">{correctCount}/8</div>
              <div className="text-xl font-semibold text-slate-900">Correct Answers</div>
              <div className="text-lg text-slate-600 mt-2">
                {percentage}% - Band Score: {bandScore.toFixed(1)}
              </div>
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

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Listening Test</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Audio Player */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
              <div className="mb-6">
                <span className="text-sm font-semibold text-blue-600 uppercase">
                  {questions[currentQuestion].section}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-3">{questions[currentQuestion].type}</h2>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white text-center mb-6">
                <Headphones className="w-12 h-12 mx-auto mb-4" />
                <p className="mb-4 font-medium">{questions[currentQuestion].audio}</p>
                <button
                  onClick={() => handlePlayAudio(currentQuestion)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition"
                >
                  <Play className="w-4 h-4" />
                  {playingAudio === currentQuestion ? "Stop Audio" : "Play Audio"}
                </button>
              </div>

              <div className="bg-slate-100 p-4 rounded-lg text-center text-sm text-slate-600 mb-8">
                <p>You can replay the audio as many times as needed.</p>
              </div>

              {/* Question */}
              <h3 className="text-xl font-bold text-slate-900 mb-6">{questions[currentQuestion].text}</h3>

              {/* Options */}
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

          {/* Progress Sidebar */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
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
