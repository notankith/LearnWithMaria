"use client"

import Link from "next/link"
import { BarChart3, BookOpen, CheckCircle2 } from "lucide-react"

interface AdminNavProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function AdminNav({ activeSection, setActiveSection }: AdminNavProps) {
  const navItems = [
    { id: "overview", label: "Analytics", icon: BarChart3 },
    { id: "courses", label: "Manage Courses", icon: BookOpen },
    { id: "submissions", label: "Review Submissions", icon: CheckCircle2 },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-20 h-[calc(100vh-80px)]">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                activeSection === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer Links */}
      <div className="space-y-2 border-t border-slate-200 pt-6">
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 text-sm">
          Settings
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 text-sm">
          Help
        </Link>
      </div>
    </aside>
  )
}
