import React from "react"
import Link from "next/link"

type Course = {
  id: string
  title: string
  description?: string
}

export default async function CourseIndexPage() {
  let courses: Course[] = []
  try {
    // When running on the server, fetch requires an absolute URL. Build one
    // from environment vars when available, otherwise fall back to localhost.
    const base = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`)
      .replace(/\/$/, "")
    const res = await fetch(`${base}/api/superadmin/courses`, { cache: "no-store" })
    if (res.ok) courses = (await res.json()) as Course[]
  } catch (err) {
    // swallow - we'll show empty state
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Failed to fetch courses:", msg)
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-sm text-slate-600">Browse all available courses</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <p className="text-slate-600">No courses available yet.</p>
            <p className="mt-4">
              If you are an instructor, create courses from <Link href="/superadmin" className="text-blue-600">Super Admin</Link>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <article key={c.id} className="bg-white rounded-lg p-5 shadow-sm border">
                <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
                {c.description && <p className="text-sm text-slate-600 mb-3">{c.description}</p>}
                <div className="flex items-center justify-between">
                  <Link href={`/dashboard/courses/${c.id}`} className="text-sm text-blue-600">View Course</Link>
                  <span className="text-xs text-slate-500">ID: {c.id}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
