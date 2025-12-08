"use client"

import { useState } from "react"
import { CheckCircle2, Clock, MessageSquare } from "lucide-react"

export default function SubmissionsManagement() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: "John Doe",
      testType: "Writing",
      submittedDate: "Dec 5, 2025",
      status: "pending",
      score: null,
    },
    {
      id: 2,
      studentName: "Jane Smith",
      testType: "Speaking",
      submittedDate: "Dec 4, 2025",
      status: "in_review",
      score: null,
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      testType: "Reading",
      submittedDate: "Dec 3, 2025",
      status: "graded",
      score: 7.5,
    },
    {
      id: 4,
      studentName: "Sarah Williams",
      testType: "Listening",
      submittedDate: "Dec 2, 2025",
      status: "graded",
      score: 7.0,
    },
  ])

  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")

  const handleSubmitFeedback = () => {
    // Update submission status
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === selectedSubmission ? { ...sub, status: "graded", score: 7.2 } : sub)),
    )
    setFeedback("")
    setSelectedSubmission(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-slate-400" />
      case "in_review":
        return <MessageSquare className="w-5 h-5 text-orange-500" />
      case "graded":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review"
      case "in_review":
        return "In Review"
      case "graded":
        return "Graded"
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Review Submissions</h1>
        <p className="text-slate-600">Grade and provide feedback on student submissions</p>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{submission.studentName}</td>
                  <td className="px-6 py-4 text-slate-900">{submission.testType}</td>
                  <td className="px-6 py-4 text-slate-600">{submission.submittedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className="text-sm font-medium text-slate-900">{getStatusLabel(submission.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {submission.score ? (
                      <span className="font-bold text-slate-900">{submission.score}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedSubmission(submission.id)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Review Submission</h2>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Student Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Student Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-900">
                    <strong>Name:</strong> {submissions.find((s) => s.id === selectedSubmission)?.studentName}
                  </p>
                  <p className="text-slate-900 mt-2">
                    <strong>Test:</strong> {submissions.find((s) => s.id === selectedSubmission)?.testType}
                  </p>
                  <p className="text-slate-900 mt-2">
                    <strong>Submitted:</strong> {submissions.find((s) => s.id === selectedSubmission)?.submittedDate}
                  </p>
                </div>
              </div>

              {/* Submission Content */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Submission Content</h3>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. [Student submission content would display here]
                  </p>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-lg font-bold text-slate-900 mb-4">Your Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback and suggestions..."
                  className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Score Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Band Score (0-9)</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  placeholder="7.5"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Submit Feedback & Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
