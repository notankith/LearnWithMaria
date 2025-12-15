"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, PenTool, LogOut, Mic } from "lucide-react"
import { signOut } from "@/app/actions/auth"
import DashboardNav from "./dashboard-nav"
import EnrolledCourses from "./enrolled-courses"
import ProgressOverview from "./progress-overview"

export default function DashboardContent({ userId, email }: { userId: string; email: string }) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [stats, setStats] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [coursesLoaded, setCoursesLoaded] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    // prefetch explore courses when dashboard mounts
    if (!coursesLoaded) loadExploreCourses()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/student/progress")
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const loadExploreCourses = async () => {
    setLoadingCourses(true)
    try {
      const res = await fetch("/api/courses")
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses || data.courses || [])
      }
    } catch (err) {
      console.error("[v0] Error loading courses:", err)
    } finally {
      setLoadingCourses(false)
      setCoursesLoaded(true)
    }
  }

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
                <p className="text-sm font-semibold text-slate-900">{email}</p>
                <p className="text-xs text-slate-500">Student</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
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
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back!</h1>
                <p className="text-lg text-slate-600">Continue your learning journey</p>
              </div>

              {/* Quick Stats */}
              {stats && (
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.enrolledCourses}</div>
                    <p className="text-slate-600">Enrolled Courses</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedLessons}</div>
                    <p className="text-slate-600">Lessons Completed</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.quizAttempts}</div>
                    <p className="text-slate-600">Tests Attempted</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{stats.minutesLearned}</div>
                    <p className="text-slate-600">Minutes Learned</p>
                  </div>
                </div>
              )}

              {/* Progress Overview */}
              <ProgressOverview userId={userId} />

              {/* Enrolled Courses */}
              <EnrolledCourses userId={userId} />

              {/* Recent Tests component removed (was undefined) */}
            </div>
          )}

          {activeSection === "courses" && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-8">My Courses</h1>
              <EnrolledCourses userId={userId} />
            </div>
          )}

          {activeSection === "explore" && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-8">Explore Courses</h1>
              <p className="text-slate-600 mb-4">Browse all available courses</p>

              {loadingCourses ? (
                <p className="text-slate-600">Loading courses...</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {courses.map((c: any) => (
                    <div key={c._id ?? c.slug} className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="aspect-video w-full bg-slate-200 mb-4 overflow-hidden rounded">
                        <img src={c.thumbnailUrl || "/placeholder.svg?height=200&width=400"} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">{c.title}</h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{c.description}</p>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/courses/${c.slug}`}
                          className="text-sm text-blue-600 font-medium hover:underline"
                        >
                          View Course
                        </Link>
                        <span className="text-sm text-slate-500">{(c.modules || []).length} modules</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <ProgressOverview userId={userId} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
