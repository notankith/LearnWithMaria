"use client"

import React, { useEffect, useState } from "react"

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [q, setQ] = useState("")

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

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false
    if (q && !(u.email || "").toLowerCase().includes(q.toLowerCase()) && !(u.name || "").toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Manage Users</h3>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="px-3 py-2 border rounded-md" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-2 py-1 border rounded-md">
            <option value="all">All roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={fetchUsers} className="px-3 py-2 bg-slate-100 rounded-md">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow-sm border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-slate-600 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 align-top">{u.name || "—"}</td>
                  <td className="py-3 align-top text-sm text-slate-500">{u.email}</td>
                  <td className="py-3 align-top">{u.role}</td>
                  <td className="py-3 align-top">
                    <div className="flex items-center gap-3">
                      <button className="text-sm text-blue-600">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-sm text-red-600">Delete</button>
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
