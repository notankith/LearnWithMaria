"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Users, BookOpen, UserCog, BarChart3, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function SuperadminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [stats, setStats] = useState<any>(null)
  const [admins, setAdmins] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // New admin form
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", fullName: "" })
  const [createAdminOpen, setCreateAdminOpen] = useState(false)

  // Enrollment form
  const [enrollForm, setEnrollForm] = useState({ studentEmail: "", courseId: "" })
  const [enrollOpen, setEnrollOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeSection])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeSection === "overview") {
        const res = await fetch("/api/superadmin/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } else if (activeSection === "admins") {
        const res = await fetch("/api/superadmin/admins")
        if (res.ok) {
          const data = await res.json()
          setAdmins(data.admins)
        }
      } else if (activeSection === "enrollments") {
        const [enrollRes, coursesRes] = await Promise.all([fetch("/api/superadmin/enrollments"), fetch("/api/courses")])
        if (enrollRes.ok) {
          const data = await enrollRes.json()
          setEnrollments(data.enrollments)
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data.courses)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      })

      if (res.ok) {
        toast.success("Admin created successfully")
        setCreateAdminOpen(false)
        setNewAdmin({ email: "", password: "", fullName: "" })
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create admin")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/superadmin/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollForm),
      })

      if (res.ok) {
        toast.success("Student enrolled successfully")
        setEnrollOpen(false)
        setEnrollForm({ studentEmail: "", courseId: "" })
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to enroll student")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleRevoke = async (enrollmentId: string) => {
    if (!confirm("Are you sure you want to revoke this enrollment?")) return

    try {
      const res = await fetch("/api/superadmin/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId }),
      })

      if (res.ok) {
        toast.success("Enrollment revoked")
        fetchData()
      } else {
        toast.error("Failed to revoke enrollment")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-white">Superadmin Panel</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeSection === "overview"
                  ? "bg-red-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveSection("admins")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeSection === "admins"
                  ? "bg-red-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <UserCog className="w-5 h-5" />
              <span className="font-medium">Admins</span>
            </button>

            <button
              onClick={() => setActiveSection("enrollments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeSection === "enrollments"
                  ? "bg-red-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Enrollments</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-12">
          {activeSection === "overview" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white mb-8">Platform Overview</h1>

              {loading ? (
                <p className="text-slate-400">Loading...</p>
              ) : stats ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Students
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <UserCog className="w-5 h-5" />
                          Admins
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-400">{stats.totalAdmins}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Courses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-400">{stats.totalCourses}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Active Enrollments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-400">{stats.totalEnrollments}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Quiz Attempts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-pink-400">{stats.totalQuizAttempts}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Total Reviews</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-400">{stats.totalReviews}</div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">No data available</p>
              )}
            </div>
          )}

          {activeSection === "admins" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Manage Admins</h1>
                <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle>Create New Admin</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newAdmin.fullName}
                          onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                        Create Admin
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <p className="text-slate-400">Loading...</p>
              ) : (
                <div className="grid gap-4">
                  {admins.map((admin) => (
                    <Card key={admin._id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">{admin.fullName}</CardTitle>
                        <CardDescription className="text-slate-400">{admin.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-400">
                          Created: {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "enrollments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Manage Enrollments</h1>
                <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Assign Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle>Assign Course to Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEnroll} className="space-y-4">
                      <div>
                        <Label htmlFor="studentEmail">Student Email</Label>
                        <Input
                          id="studentEmail"
                          type="email"
                          value={enrollForm.studentEmail}
                          onChange={(e) => setEnrollForm({ ...enrollForm, studentEmail: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseId">Course</Label>
                        <select
                          id="courseId"
                          value={enrollForm.courseId}
                          onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-md"
                          required
                        >
                          <option value="">Select a course</option>
                          {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                        Assign Course
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <p className="text-slate-400">Loading...</p>
              ) : (
                <div className="grid gap-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment._id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">{enrollment.courseName}</CardTitle>
                        <CardDescription className="text-slate-400">Student: {enrollment.studentName}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Email: {enrollment.studentEmail}</p>
                          <p className="text-sm text-slate-400">
                            Assigned: {new Date(enrollment.assignedAt).toLocaleDateString()}
                          </p>
                          {enrollment.revoked && <p className="text-sm text-red-400 font-semibold">Revoked</p>}
                        </div>
                        {!enrollment.revoked && (
                          <Button variant="destructive" size="sm" onClick={() => handleRevoke(enrollment._id)}>
                            Revoke
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
