"use client"

import React, { useState } from "react"

type ModuleInput = { title: string; type?: string; videoUrl?: string }

type Props = {
  onCreated?: (course: { id: string; title: string; description?: string; thumbnail?: string; modules?: any[] }) => void
}

export default function CreateCourseForm({ onCreated }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [modules, setModules] = useState<ModuleInput[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return alert("Title is required")
    setLoading(true)
    try {
      const res = await fetch("/api/superadmin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), thumbnail: thumbnail.trim(), modules }),
      })
      if (!res.ok) throw new Error("Create failed")
      const data = await res.json()
      setTitle("")
      setDescription("")
      setThumbnail("")
      setModules([])
      onCreated?.(data)
    } catch (err) {
      console.error(err)
      alert("Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-slate-700 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Course title"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Short description (optional)"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Thumbnail URL</label>
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="/path/to/thumbnail.jpg or https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-2">Modules</label>
        <div className="space-y-2">
          {modules.map((m, idx) => (
            <div key={idx} className="p-2 border rounded-md bg-slate-50">
              <div className="flex gap-2">
                <input value={m.title} onChange={(e) => { const copy = [...modules]; copy[idx].title = e.target.value; setModules(copy) }} placeholder="Module title" className="flex-1 px-2 py-1 border rounded-md" />
                <input value={m.videoUrl || ""} onChange={(e) => { const copy = [...modules]; copy[idx].videoUrl = e.target.value; setModules(copy) }} placeholder="Video URL (optional)" className="w-48 px-2 py-1 border rounded-md" />
                <select value={m.type || "video"} onChange={(e) => { const copy = [...modules]; copy[idx].type = e.target.value; setModules(copy) }} className="w-32 px-2 py-1 border rounded-md">
                  <option value="video">video</option>
                  <option value="text">text</option>
                  <option value="interactive">interactive</option>
                </select>
                <button type="button" onClick={() => setModules((s) => s.filter((_, i) => i !== idx))} className="text-red-600">Remove</button>
              </div>
            </div>
          ))}

          <button type="button" onClick={() => setModules((s) => [...s, { title: "", type: "video", videoUrl: "" }])} className="text-sm text-blue-600">+ Add module</button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Course"}
        </button>
      </div>
    </form>
  )
}
