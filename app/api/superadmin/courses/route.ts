import { NextResponse } from "next/server"

type Course = {
  id: string
  title: string
  thumbnail?: string
  description?: string
  modules?: Array<{ id: string; title: string; type?: string; videoUrl?: string }>
}

// NOTE: This is an in-memory stub for demonstration. Replace with DB logic (Supabase)
let COURSES: Course[] = [
  {
    id: "intro-to-ielts",
    title: "Intro to IELTS",
    description: "Beginner friendly course",
    thumbnail: "/ielts-introduction.jpg",
    modules: [
      { id: "m1", title: "Introduction to IELTS", type: "video", videoUrl: "/ielts-introduction.jpg" },
    ],
  },
]

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (id) {
    const found = COURSES.find((c) => c.id === id)
    if (!found) return new NextResponse(JSON.stringify({ error: "not found" }), { status: 404 })
    return NextResponse.json(found)
  }
  return NextResponse.json(COURSES)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = String(body.title || "").trim()
    const description = body.description ? String(body.description) : undefined
    const thumbnail = body.thumbnail ? String(body.thumbnail) : undefined
    const modules = Array.isArray(body.modules) ? body.modules.map((m: any, i: number) => ({ id: String(m.id || `mod-${Date.now()}-${i}`), title: String(m.title || "Untitled"), type: String(m.type || "video"), videoUrl: m.videoUrl ? String(m.videoUrl) : undefined })) : []
    if (!title) return new NextResponse(JSON.stringify({ error: "Title required" }), { status: 400 })
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now()
    const course: Course = { id, title, description, thumbnail, modules }
    COURSES = [course, ...COURSES]
    return NextResponse.json(course, { status: 201 })
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Invalid request" }), { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return new NextResponse(JSON.stringify({ error: "id required" }), { status: 400 })
  const prevLen = COURSES.length
  COURSES = COURSES.filter((c) => c.id !== id)
  if (COURSES.length === prevLen) return new NextResponse(JSON.stringify({ error: "not found" }), { status: 404 })
  return NextResponse.json({ ok: true })
}
