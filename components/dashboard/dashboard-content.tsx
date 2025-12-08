"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Mic, PenTool, LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"
import DashboardNav from "./dashboard-nav"
import EnrolledCourses from "./enrolled-courses"
import RecentTests from "./recent-tests"
import ProgressOverview from "./progress-overview"

export default function DashboardContent({ user }: { user: any }) {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">LinguaFlow</span>
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
        <DashboardNav activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-12">
          {activeSection === "overview" && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back, {user.full_name}!</h1>
                <p className="text-lg text-slate-600">Continue your learning journey</p>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                  <p className="text-slate-600">Active Courses</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">42%</div>
                  <p className="text-slate-600">Overall Progress</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                  <p className="text-slate-600">Tests Completed</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">7.2</div>
                  <p className="text-slate-600">Band Score</p>
                </div>
              </div>

              {/* Progress Overview */}
              <ProgressOverview />

              {/* Enrolled Courses */}
              <EnrolledCourses />

              {/* Recent Tests */}
              <RecentTests />
            </div>
          )}

          {activeSection === "courses" && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-8">My Courses</h1>
              <EnrolledCourses />
            </div>
          )}

          {activeSection === "tests" && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-8">Practice Tests</h1>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/dashboard/tests/speaking">
                  <div className="bg-white rounded-lg p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer">
                    <Mic className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Speaking Tests</h3>
                    <p className="text-slate-600 mb-4">Practice and improve your speaking skills</p>
                    <div className="text-sm text-blue-600 font-semibold">Start Test →</div>
                  </div>
                </Link>

                <Link href="/dashboard/tests/writing">
                  <div className="bg-white rounded-lg p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer">
                    <PenTool className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Writing Tests</h3>
                    <p className="text-slate-600 mb-4">Develop and refine your writing abilities</p>
                    <div className="text-sm text-blue-600 font-semibold">Start Test →</div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {activeSection === "progress" && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-8">Learning Progress</h1>
              <ProgressOverview />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
