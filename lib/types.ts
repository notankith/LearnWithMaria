import type { ObjectId } from "mongodb"

export type UserRole = "student" | "admin" | "superadmin"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  fullName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  type: "video" | "pdf" | "audio"
  url: string
  order: number
}

export interface Question {
  id: string
  type: "mcq" | "free-text"
  question: string
  options?: string[] // For MCQ
  correctAnswer?: string // For MCQ
  order: number
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
}

export interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
  quizzes: Quiz[]
}

export interface Course {
  _id?: ObjectId
  title: string
  slug: string
  description: string
  thumbnailUrl: string
  createdBy: ObjectId
  createdByName: string
  modules: Module[]
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  _id?: ObjectId
  studentId: ObjectId
  studentEmail: string
  courseId: ObjectId
  assignedAt: Date
  revoked: boolean
}

export interface LessonProgress {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
  lessonId: string
  completed: boolean
  completedAt?: Date
}

export interface QuizAttempt {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
  moduleId: string
  quizId: string
  answers: {
    questionId: string
    answer: string
    score: number
    maxScore: number
    correct: boolean
    explanation?: string
  }[]
  totalScore: number
  maxScore: number
  submittedAt: Date
}

export interface Review {
  _id?: ObjectId
  userId: ObjectId
  userName: string
  courseId: ObjectId
  rating: number
  comment: string
  approved: boolean
  createdAt: Date
}

export interface SessionData {
  userId?: string
  role: UserRole
  email?: string
}
