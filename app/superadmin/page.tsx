"use client"

import React, { useEffect, useState } from "react"
import CreateCourseForm from "./create-course-form"
import Link from "next/link"
import ModerateCourses from "./moderate-courses"
import ManageUsers from "./manage-users"
import SuperAdminStats from "./stats"
import SuperadminSettings from "./settings"

type Course = {
  id: string
  title: string
  description?: string
}

export default function SuperAdminPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/superadmin/courses")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setCourses(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreated = (course: Course) => {
    setCourses((s) => [course, ...s])
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/superadmin/courses?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")
      setCourses((s) => s.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete course")
    }
  }
  const [active, setActive] = useState("create")

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border sticky top-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Super Admin</h2>
              <p className="text-sm text-slate-600">Manage courses, users and site settings</p>
            </div>

            <nav className="flex flex-col space-y-2">
              <button onClick={() => setActive("create")} className={`text-left px-3 py-2 rounded-md ${active === "create" ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}>Create Course</button>
              <button onClick={() => setActive("moderate")} className={`text-left px-3 py-2 rounded-md ${active === "moderate" ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}>Moderate Content</button>
              <button onClick={() => setActive("users")} className={`text-left px-3 py-2 rounded-md ${active === "users" ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}>Manage Users</button>
              <button onClick={() => setActive("stats")} className={`text-left px-3 py-2 rounded-md ${active === "stats" ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}>Stats</button>
              <button onClick={() => setActive("settings")} className={`text-left px-3 py-2 rounded-md ${active === "settings" ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}>Site Settings</button>
            </nav>

            <div className="mt-4 border-t pt-3">
              <Link href="/" className="text-sm text-slate-600">View Site</Link>
            </div>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            {active === "create" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Courses</h2>
                    <button onClick={fetchCourses} className="text-sm text-slate-600">Refresh</button>
                  </div>

                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <ul className="space-y-3">
                      {courses.length === 0 && <li className="text-sm text-slate-500">No courses yet.</li>}
                      {courses.map((c) => (
                        <li key={c.id} className="p-3 bg-slate-50 rounded-md flex items-start justify-between">
                          <div>
                            <div className="font-medium">{c.title}</div>
                            {c.description && <div className="text-sm text-slate-500">{c.description}</div>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/courses/${c.id}`} className="text-sm text-blue-600">Open</Link>
                            <button className="text-sm text-red-600" onClick={() => handleDelete(c.id)}>Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <aside className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-3">Create Course</h3>
                  <CreateCourseForm onCreated={handleCreated} />
                </aside>
              </div>
            )}

            {active === "moderate" && <ModerateCourses courses={courses} onDelete={handleDelete} />}

            {active === "users" && <ManageUsers />}

            {active === "stats" && <SuperAdminStats />}

            {active === "settings" && <SuperadminSettings />}
          </div>
        </main>
      </div>
    </div>
  )
}
