import { NextResponse } from "next/server"

type Settings = {
  moduleNames: string[]
}

// In-memory settings stub. Replace with DB-backed settings in production.
let SETTINGS: Settings = {
  moduleNames: ["Foundations", "Speaking", "Grammar & Vocabulary"],
}

export async function GET() {
  return NextResponse.json(SETTINGS)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.moduleNames && Array.isArray(body.moduleNames)) {
      SETTINGS.moduleNames = body.moduleNames.map((s: any) => String(s))
      return NextResponse.json(SETTINGS)
    }
    return new NextResponse(JSON.stringify({ error: "moduleNames array required" }), { status: 400 })
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Invalid request" }), { status: 400 })
  }
}
