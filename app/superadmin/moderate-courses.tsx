"use client"

import React from "react"
import Link from "next/link"

export default function ModerateCourses({ courses, onDelete }: { courses: any[]; onDelete: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Moderate Courses</h3>
      <div className="space-y-3">
        {courses.length === 0 && <div className="text-sm text-slate-500">No courses</div>}
        {courses.map((c) => (
          <div key={c.id} className="p-3 bg-slate-50 rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-slate-500">{c.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/superadmin/courses/${c.id}/edit`} className="text-sm text-blue-600">Edit</Link>
              <button onClick={() => onDelete(c.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
