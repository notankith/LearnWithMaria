"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

function resolveId(course: any) {
  if (!course) return ""
  if (typeof course._id === "string") return course._id
  if (course._id && typeof course._id === "object") {
    // handle MongoDB ObjectId serialized shapes
    if (typeof course._id.toString === "function") return course._id.toString()
    if (course._id.$oid) return course._id.$oid
    if (course._id.id) return course._id.id
  }
  return String(course._id || course.id || "")
}

export default function EnrolledCourses() {
  const [courses, setCourses] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/student/enrollments")
        if (!res.ok) {
          setCourses([])
          return
        }
        const data = await res.json()
        if (!mounted) return
        setCourses(data.courses || [])
      } catch (e) {
        console.error("Failed to load enrollments:", e)
        setCourses([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <p className="text-sm text-slate-600">Loading your courses...</p>

  if (!courses || courses.length === 0)
    return <p className="text-sm text-slate-600">You have no enrolled courses yet.</p>

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => {
          const id = resolveId(course)
          return (
            <Link key={id} href={`/dashboard/courses/${id}`}>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase">{course.category || "Course"}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">by {course.instructor || course.createdByName || "Instructor"}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-3">Lessons: {course.modules ? course.modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) : "-"}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `10%` }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-2">Continue Learning</p>
                  </div>

                  <div className="flex items-center text-blue-600 font-semibold mt-4 text-sm">
                    Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
