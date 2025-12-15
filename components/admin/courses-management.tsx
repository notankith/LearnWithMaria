"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CoursesManagement() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/courses")
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error("[v0] Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      })

      if (res.ok) {
        toast.success("Course created successfully")
        setCreateOpen(false)
        setNewCourse({ title: "", description: "", thumbnailUrl: "" })
        fetchCourses()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create course")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    setDeletingId(courseId)
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Course deleted successfully")
        await fetchCourses()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error || "Failed to delete course")
      }
    } catch (error) {
      console.error("[v0] Delete course error:", error)
      toast.error("An error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Courses</h1>
          <p className="text-slate-600">Create, edit, and manage all courses</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g., IELTS Academic Writing"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnailUrl"
                  value={newCourse.thumbnailUrl}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Create Course
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <p className="text-slate-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600 mb-4">No courses yet. Create your first course to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-video w-full bg-slate-200">
                <img
                  src={course.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/admin/courses/${course._id}`)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Course
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(course._id)}
                    disabled={deletingId === course._id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {/** disable while deleting */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
