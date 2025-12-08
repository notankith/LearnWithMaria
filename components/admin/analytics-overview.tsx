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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, BookOpen, CheckCircle2 } from "lucide-react"

export default function AnalyticsOverview() {
  const courseData = [
    { name: "IELTS General", students: 156, revenue: 4680 },
    { name: "IELTS Academic", students: 98, revenue: 2940 },
    { name: "OET Medical", students: 72, revenue: 2880 },
    { name: "TOEFL Prep", students: 45, revenue: 1350 },
  ]

  const submissionStatus = [
    { name: "Graded", value: 234, fill: "#10b981" },
    { name: "Pending", value: 87, fill: "#f59e0b" },
    { name: "In Progress", value: 45, fill: "#3b82f6" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
        <p className="text-lg text-slate-600">Platform performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Total Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">371</div>
          <p className="text-sm text-green-600 mt-2">+12% this month</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Active Courses</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <p className="text-sm text-slate-600 mt-2">Across 4 programs</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Submissions</span>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">366</div>
          <p className="text-sm text-slate-600 mt-2">23 pending review</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 font-medium">Revenue</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">$11,850</div>
          <p className="text-sm text-green-600 mt-2">+8% this month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Performance */}
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

        {/* Submission Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Submission Status</h3>
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

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by Course</h3>
        <div className="space-y-4">
          {courseData.map((course, idx) => (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0">
              <div>
                <p className="font-semibold text-slate-900">{course.name}</p>
                <p className="text-sm text-slate-600">{course.students} students</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">${course.revenue.toLocaleString()}</p>
                <p className="text-sm text-slate-600">${(course.revenue / course.students).toFixed(2)}/student</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
