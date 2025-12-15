"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, BookOpen, CheckCircle2 } from "lucide-react"

export default function AnalyticsOverview() {
  const [stats, setStats] = useState<any | null>(null)
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          fetch("/api/superadmin/stats"),
          fetch("/api/admin/course-stats"),
        ])

        if (sRes.ok) {
          const sJson = await sRes.json()
          setStats(sJson.stats)
        }

        if (cRes.ok) {
          const cJson = await cRes.json()
          setCourses(cJson.courses || [])
        }
      } catch (err) {
        console.error("Failed to load analytics:", err)
      }
    }

    load()
  }, [])

  const courseData = courses.map((c) => ({ name: c.title, students: c.students || 0 }))

  const submissionStatus = stats
    ? [
        { name: "Total Attempts", value: stats.totalQuizAttempts, fill: "#3b82f6" },
        { name: "Enrollments", value: stats.totalEnrollments, fill: "#10b981" },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
        <p className="text-lg text-slate-600">Platform performance and insights</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Total Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats ? stats.totalUsers : "—"}</div>
          <p className="text-sm text-slate-600 mt-2">Students on platform</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Active Courses</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats ? stats.totalCourses : "—"}</div>
          <p className="text-sm text-slate-600 mt-2">Courses available</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Submissions</span>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats ? stats.totalQuizAttempts : "—"}</div>
          <p className="text-sm text-slate-600 mt-2">Total quiz attempts</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Enrollments</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats ? stats.totalEnrollments : "—"}</div>
          <p className="text-sm text-slate-600 mt-2">Active enrollments</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Students by Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="students" fill="#3b82f6" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Submission / Enrollment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={submissionStatus} cx="50%" cy="50%" labelLine={false} label outerRadius={100} dataKey="value">
                {submissionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Students per Course</h3>
        <div className="space-y-4">
          {courses.map((course, idx) => (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0">
              <div>
                <p className="font-semibold text-slate-900">{course.title}</p>
                <p className="text-sm text-slate-600">{course.students} students</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">—</p>
                <p className="text-sm text-slate-600">no revenue data</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
