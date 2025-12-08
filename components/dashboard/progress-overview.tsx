"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

export default function ProgressOverview() {
  const skillData = [
    { name: "Speaking", current: 6.8, target: 8 },
    { name: "Writing", current: 6.5, target: 8 },
    { name: "Reading", current: 7.2, target: 8 },
    { name: "Listening", current: 7.0, target: 8 },
  ]

  const timeSeriesData = [
    { date: "Nov 24", score: 6.2 },
    { date: "Nov 27", score: 6.4 },
    { date: "Dec 1", score: 6.6 },
    { date: "Dec 4", score: 6.8 },
    { date: "Dec 5", score: 7.0 },
  ]

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skill Comparison */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Skill Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 9]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current" />
              <Bar dataKey="target" fill="#e0e7ff" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Overall Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 9]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
