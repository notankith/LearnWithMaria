import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { QuizAttempt } from "@/lib/types"
import crypto from "crypto"

export const runtime = "nodejs"

const OPENAI_URL = "https://api.openai.com/v1/responses"
const AI_TIMEOUT_MS = 25_000

/* ---------- utils ---------- */

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

function fallbackScore(expected: string | undefined, answer: string) {
  const a = (answer || "").toLowerCase().split(/\W+/).filter(Boolean)
  const e = (expected || "").toLowerCase().split(/\W+/).filter(Boolean)
  if (!e.length) return 50
  const setE = new Set(e)
  const match = a.filter((t) => setE.has(t)).length
  return Math.round((match / Math.max(1, e.length)) * 100)
}

// in-memory rate limit (dev only)
const buckets = new Map<string, { tokens: number; last: number }>()
function consume(userId: string, need = 1) {
  const now = Date.now()
  const b = buckets.get(userId) || { tokens: 5, last: now }
  const elapsed = Math.max(0, now - b.last)
  const refill = Math.floor(elapsed / 1000)
  b.tokens = Math.min(10, b.tokens + refill)
  b.last += refill * 1000
  if (b.tokens < need) {
    buckets.set(userId, b)
    return false
  }
  b.tokens -= need
  buckets.set(userId, b)
  return true
}

/* ---------- AI (Responses API) ---------- */

async function callOpenAIBatch(items: {
  id: string
  question: string
  expected?: string
  answer: string
  strictness: string
}[]) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAIAPIKEY || ""
  if (!apiKey) throw new Error("Missing OpenAI API key (OPENAI_API_KEY or OPENAIAPIKEY)")

  // We'll call the Responses API per-item using the same prompt structure as your Python example.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)
  try {
    const results: any[] = []
    for (const it of items) {
      const prompt = `You are an evaluator.\n\nQuestion:\n${it.question}\n\nStudent Answer:\n${it.answer}\n\nEvaluate the answer.\nReturn ONLY valid JSON in this format:\n\n{\n  "score": <number from 0 to 10>,\n  "suggestion": "<clear suggestion on how to improve>"\n}`

      const res = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "gpt-4.1-mini", input: prompt, temperature: 0, max_output_tokens: 800 }),
        signal: controller.signal as any,
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(`OpenAI error ${res.status}: ${txt}`)
      }

      const data = await res.json().catch(() => ({} as any))
      clearTimeout(timer)

      // Responses SDK exposes .output_text or structured output; try both
      let outText = ""
      if (typeof data.output_text === "string" && data.output_text.trim()) outText = data.output_text
      else if (Array.isArray(data.output) && data.output.length) {
        outText = data.output
          .map((o: any) => {
            if (o.content && Array.isArray(o.content)) return o.content.map((c: any) => c.text || "").join("")
            return o.text || ""
          })
          .join("\n")
      }

      if (!outText) throw new Error("Empty AI response")

      // Parse the JSON object expected by python example
      let parsedObj: any = null
      try {
        parsedObj = JSON.parse(outText)
      } catch (e) {
        const start = outText.indexOf("{")
        const end = outText.lastIndexOf("}")
        if (start !== -1 && end !== -1 && end > start) {
          const sub = outText.substring(start, end + 1)
          parsedObj = JSON.parse(sub)
        } else {
          throw new Error("Failed to parse AI JSON object")
        }
      }

      // python returns score 0-10 and suggestion string
      const score10 = Number(parsedObj.score ?? 0)
      const suggestion = String(parsedObj.suggestion || "")

      // map into existing expected shape: score scaled 0-maxScore, aiScore 0-100
      const aiScore = Math.round(Math.max(0, Math.min(10, score10)) * 10)
      results.push({ id: it.id, score: aiScore, feedback: suggestion, strengths: [], improvements: [suggestion], rawScore10: score10 })
    }

    return results
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

/* ---------- route ---------- */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; quizId: string }> },
) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, moduleId, quizId } = await params
    const { answers } = await request.json()
    const db = await getDb()

    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const module = course.modules.find((m: any) => m.id === moduleId)
    if (!module) return NextResponse.json({ error: "Module not found" }, { status: 404 })

    const quiz = module.quizzes.find((q: any) => q.id === quizId)
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 })

    const aiColl = db.collection("ai_evaluations")
    const graded: any[] = []

    for (const a of answers) {
      const q = quiz.questions.find((x: any) => x.id === a.questionId)
      if (!q) continue

      if (q.type === "mcq") {
        const correct = a.answer === q.correctAnswer
        graded.push({
          questionId: a.questionId,
          answer: a.answer,
          score: correct ? q.maxScore ?? 10 : 0,
          maxScore: q.maxScore ?? 10,
          correct,
          explanation: correct ? "Correct!" : `Correct answer: ${q.correctAnswer}`,
        })
        continue
      }

      // free-text
      const strictness = q.evalStrictness ?? "normal"
      const key = sha256(`${quizId}::${a.questionId}::${session.userId}::${a.answer}::${strictness}`)

      const cachedDoc = await aiColl.findOne({ key })
      let result = cachedDoc?.result

      if (!result) {
        // Always attempt AI evaluation for free-text. Rate limiter will only log a warning.
        let aiResult: any = null
        try {
          if (!consume(session.userId)) {
            console.warn(`[submit] user ${session.userId} rate-limited; proceeding to call AI`)
          }

          const [r] = await callOpenAIBatch([
            {
              id: a.questionId,
              question: q.question,
              expected: q.expected,
              answer: a.answer,
              strictness,
            },
          ])

          aiResult = {
            aiScore: Number(r.score ?? 0),
            strengths: Array.isArray(r.strengths) ? r.strengths : [],
            improvements: Array.isArray(r.improvements) ? r.improvements : [],
            feedback: r.feedback || "",
          }
        } catch (err) {
          console.error("[submit] AI call failed for question", a.questionId, err)
          // fallback deterministic scoring only when AI fails
          aiResult = {
            aiScore: fallbackScore(q.expected, a.answer),
            strengths: [],
            improvements: [],
            feedback: "Fallback evaluation due to AI error",
          }
        }

        const scaled = Math.round((aiResult.aiScore / 100) * (q.maxScore ?? 10))
        result = {
          questionId: a.questionId,
          answer: a.answer,
          aiScore: aiResult.aiScore,
          score: scaled,
          maxScore: q.maxScore ?? 10,
          correct: aiResult.aiScore >= 80,
          feedback: aiResult.feedback,
          strengths: aiResult.strengths,
          improvements: aiResult.improvements,
        }

        await aiColl.updateOne({ key }, { $set: { key, result } }, { upsert: true })
      }

      graded.push(result)
    }

    const totalScore = graded.reduce((s, a) => s + a.score, 0)
    const maxScore = graded.reduce((s, a) => s + a.maxScore, 0)

    const attempt: QuizAttempt = {
      userId: new ObjectId(session.userId),
      courseId: new ObjectId(courseId),
      moduleId,
      quizId,
      answers: graded,
      totalScore,
      maxScore,
      submittedAt: new Date(),
    }

    const inserted = await db.collection("quiz_attempts").insertOne(attempt)

    return NextResponse.json({
      success: true,
      attemptId: inserted.insertedId,
      results: { answers: graded, totalScore, maxScore },
    })
  } catch (err) {
    console.error("[submit route]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
