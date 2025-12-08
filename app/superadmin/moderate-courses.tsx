"use client"

import React from "react"
import Link from "next/link"

export default function ModerateCourses({ courses, onDelete }: { courses: any[]; onDelete: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Moderate Courses</h3>

      {courses.length === 0 ? (
        <div className="text-sm text-slate-500">No courses</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-slate-600 border-b">
                <th className="py-2">Title</th>
                <th className="py-2">Description</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 align-top w-1/3">
                    <div className="font-medium">{c.title}</div>
                  </td>
                  <td className="py-3 align-top text-sm text-slate-500">{c.description || "—"}</td>
                  <td className="py-3 align-top">
                    <div className="flex items-center gap-3">
                      <Link href={`/superadmin/courses/${c.id}/edit`} className="text-sm text-blue-600">Edit</Link>
                      <button onClick={() => onDelete(c.id)} className="text-sm text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
