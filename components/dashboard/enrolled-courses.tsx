"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function EnrolledCourses() {
  const courses = [
    {
      id: 1,
      title: "IELTS General Training",
      category: "IELTS",
      progress: 65,
      lessons: "24/40",
      instructor: "Sarah Johnson",
    },
    {
      id: 2,
      title: "OET for Nursing",
      category: "OET",
      progress: 42,
      lessons: "16/40",
      instructor: "Dr. Michael Chen",
    },
    {
      id: 3,
      title: "Advanced Writing Techniques",
      category: "Writing",
      progress: 78,
      lessons: "31/40",
      instructor: "Emma Wilson",
    },
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase">{course.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">by {course.instructor}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-3">Lessons: {course.lessons}</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-2">{course.progress}% Complete</p>
                </div>

                <div className="flex items-center text-blue-600 font-semibold mt-4 text-sm">
                  Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
