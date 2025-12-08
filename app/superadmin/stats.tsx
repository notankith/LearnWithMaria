"use client"

import React, { useEffect, useState } from "react"

export default function SuperAdminStats() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/superadmin/users")
        if (!res.ok) return
        setUsers(await res.json())
      } catch {
        // ignore
      }
    })()
  }, [])

  const students = users.filter((u) => u.role === "student").length
  const teachers = users.filter((u) => u.role === "teacher").length

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Students & Teachers</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded shadow-sm border text-center">
          <div className="text-sm text-slate-500">Students</div>
          <div className="text-2xl font-bold">{students}</div>
        </div>
        <div className="p-4 bg-white rounded shadow-sm border text-center">
          <div className="text-sm text-slate-500">Teachers</div>
          <div className="text-2xl font-bold">{teachers}</div>
        </div>
      </div>
    </div>
  )
}
