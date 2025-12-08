"use client"

import { useState } from "react"
import { BookOpen, LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"
import AdminNav from "./admin-nav"
import CoursesManagement from "./courses-management"
import SubmissionsManagement from "./submissions-management"
import AnalyticsOverview from "./analytics-overview"

export default function AdminDashboard({ user }: { user: any }) {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900"><LearnWithMaria></LearnWithMaria> Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={async () => await signOut()}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <AdminNav activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-12">
          {activeSection === "overview" && <AnalyticsOverview />}
          {activeSection === "courses" && <CoursesManagement />}
          {activeSection === "submissions" && <SubmissionsManagement />}
        </main>
      </div>
    </div>
  )
}
