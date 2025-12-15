"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, MessageSquare } from "lucide-react"

export default function SubmissionsManagement() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/submissions")
        if (res.ok) {
          const json = await res.json()
          setSubmissions(json.submissions || [])
        } else {
          console.error("Failed to load submissions")
        }
      } catch (err) {
        console.error("Load error", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSubmitFeedback = async () => {
    // This can be expanded to POST feedback to an API route; for now update locally
    if (!selectedSubmission) return
    setSubmissions((prev) => prev.map((s) => (s._id === selectedSubmission ? { ...s, reviewed: true } : s)))
    setFeedback("")
    setSelectedSubmission(null)
  }

  const getStatusIcon = (s: any) => {
    if (s.reviewed || s.totalScore != null) return <CheckCircle2 className="w-5 h-5 text-green-600" />
    return <Clock className="w-5 h-5 text-slate-400" />
  }

  const getStatusLabel = (s: any) => (s.reviewed || s.totalScore != null ? "Graded" : "Pending Review")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Review Submissions</h1>
        <p className="text-slate-600">Grade and provide feedback on student quiz attempts</p>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading submissions...</p>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{submission.studentName || submission.studentEmail}</td>
                    <td className="px-6 py-4 text-slate-900">{submission.courseId}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(submission.submittedAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission)}
                        <span className="text-sm font-medium text-slate-900">{getStatusLabel(submission)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {submission.totalScore != null ? (
                        <span className="font-bold text-slate-900">{submission.totalScore}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedSubmission(submission._id)}
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
      )}

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
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Student Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-900">
                    <strong>Name:</strong> {submissions.find((s) => s._id === selectedSubmission)?.studentName}
                  </p>
                  <p className="text-slate-900 mt-2">
                    <strong>Course:</strong> {submissions.find((s) => s._id === selectedSubmission)?.courseId}
                  </p>
                  <p className="text-slate-900 mt-2">
                    <strong>Submitted:</strong>{" "}
                    {new Date(submissions.find((s) => s._id === selectedSubmission)?.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Submission Content</h3>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700">{JSON.stringify(submissions.find((s) => s._id === selectedSubmission)?.answers, null, 2)}</pre>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-slate-900 mb-4">Your Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback and suggestions..."
                  className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Score</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 85"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

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
