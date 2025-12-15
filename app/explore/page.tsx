import Link from "next/link"
import { BookOpen, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

export default async function ExplorePage() {
  const db = await getDb()
  const session = await getSession()

  const courses = await db.collection("courses").find({}).sort({ createdAt: -1 }).toArray()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b bg-white/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">LinguaFlow</span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href={session.role === "student" ? "/dashboard" : "/admin"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Courses</h1>
          <p className="text-lg text-slate-600">Browse our comprehensive collection of IELTS and OET courses</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 mb-4">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseData = JSON.parse(JSON.stringify(course))
              const studentEmail = session?.email || ""
              const message = encodeURIComponent(
                `Hi! I'm interested in the course: ${courseData.title}.${studentEmail ? ` My email is: ${studentEmail}` : ""} Can you provide more information?`,
              )
              const whatsappUrl = `https://wa.me/?text=${message}`

              return (
                <Card key={courseData._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="aspect-video w-full bg-slate-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={courseData.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                        alt={courseData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle>{courseData.title}</CardTitle>
                    <CardDescription>Course by {courseData.createdByName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 line-clamp-3">{courseData.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Admin
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
