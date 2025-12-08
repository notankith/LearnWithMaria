"use client"

import { Calendar, CheckCircle } from "lucide-react"

export default function RecentTests() {
  const tests = [
    {
      id: 1,
      name: "Speaking Practice - Part 1",
      type: "Speaking",
      date: "Dec 5, 2025",
      score: 7.2,
      status: "graded",
    },
    {
      id: 2,
      name: "Writing Task 1 - Letter",
      type: "Writing",
      date: "Dec 4, 2025",
      score: 6.8,
      status: "graded",
    },
    {
      id: 3,
      name: "Reading Comprehension",
      type: "Reading",
      date: "Dec 3, 2025",
      score: 7.5,
      status: "graded",
    },
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Tests</h2>
      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-lg border border-slate-200 p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{test.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                    {test.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {test.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{test.score}</div>
                <div className="text-xs text-slate-500">Band Score</div>
              </div>
              {test.status === "graded" && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
