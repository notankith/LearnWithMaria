"use client"

import React, { useEffect, useState } from "react"

export default function SuperadminSettings() {
  const [moduleNames, setModuleNames] = useState<string[]>(["Foundations", "Speaking", "Grammar & Vocabulary"])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/superadmin/settings")
        if (res.ok) {
          const json = await res.json()
          if (mounted && json.moduleNames) setModuleNames(json.moduleNames)
        }
      } catch (err) {
        console.error("Failed to load settings:", err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleChange = (idx: number, val: string) => {
    setModuleNames((s) => s.map((v, i) => (i === idx ? val : v)))
  }

  const addModule = () => setModuleNames((s) => [...s, "New Module"])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/superadmin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleNames }),
      })
      if (!res.ok) throw new Error("Save failed")
      alert("Settings saved")
    } catch (err) {
      console.error(err)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading settings…</div>

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Site Settings</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Module Names</label>
        <div className="space-y-2">
          {moduleNames.map((name, idx) => (
            <div key={idx} className="flex gap-2">
              <input value={name} onChange={(e) => handleChange(idx, e.target.value)} className="flex-1 px-2 py-1 border rounded-md" />
              <button type="button" onClick={() => setModuleNames((s) => s.filter((_, i) => i !== idx))} className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addModule} className="text-sm text-blue-600">+ Add module name</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md">{saving ? "Saving…" : "Save Settings"}</button>
      </div>
    </div>
  )
}
