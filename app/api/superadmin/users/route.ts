import { NextResponse } from "next/server"

type User = { id: string; email: string; role: string; name?: string }

let USERS: User[] = [
  { id: "u1", email: "student1@example.com", role: "student", name: "Student One" },
  { id: "u2", email: "teacher1@example.com", role: "teacher", name: "Teacher One" },
]

export async function GET() {
  return NextResponse.json(USERS)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = `u-${Date.now()}`
    const user: User = { id, email: String(body.email || ""), role: String(body.role || "student"), name: body.name }
    USERS = [user, ...USERS]
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Invalid" }), { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return new NextResponse(JSON.stringify({ error: "id required" }), { status: 400 })
  const prevLen = USERS.length
  USERS = USERS.filter((u) => u.id !== id)
  if (USERS.length === prevLen) return new NextResponse(JSON.stringify({ error: "not found" }), { status: 404 })
  return NextResponse.json({ ok: true })
}
