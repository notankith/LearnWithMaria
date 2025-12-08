"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function CoursesManagement() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "IELTS General Training",
      category: "IELTS",
      level: "All Levels",
      instructor: "Maria",
      students: 156,
      lessons: 40,
      published: true,
      price: 29,
    },
    {
      id: 2,
      title: "IELTS Academic",
      category: "IELTS",
      level: "Intermediate",
      instructor: "Maria",
      students: 98,
      lessons: 35,
      published: true,
      price: 39,
    },
    {
      id: 3,
      title: "OET Medical Preparation",
      category: "OET",
      level: "Advanced",
      instructor: "Maria",
      students: 72,
      lessons: 45,
      published: true,
      price: 49,
    },
  ])

  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Courses</h1>
          <p className="text-slate-600">Create, edit, and manage all courses</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Instructor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Students</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Lessons</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{course.title}</p>
                      <p className="text-sm text-slate-500">{course.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{course.instructor}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">{course.students}</td>
                  <td className="px-6 py-4 text-slate-900">{course.lessons}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${course.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
