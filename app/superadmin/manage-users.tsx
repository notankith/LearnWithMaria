"use client"

import React, { useEffect, useState } from "react"

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/superadmin/users")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete user?")) return
    try {
      const res = await fetch(`/api/superadmin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setUsers((s) => s.filter((u) => u.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete user")
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Manage Users</h3>
      {loading && <div className="text-sm text-slate-500">Loading…</div>}
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="p-3 bg-slate-50 rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-xs text-slate-500">{u.email} • {u.role}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(u.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
