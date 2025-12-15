import bcrypt from "bcryptjs"
import { getDb } from "./mongodb"
import type { User, UserRole } from "./types"
import { ObjectId } from "mongodb"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, fullName: string, role: UserRole): Promise<User> {
  const db = await getDb()
  const hashedPassword = await hashPassword(password)

  const user: User = {
    email,
    password: hashedPassword,
    fullName,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<User>("users").insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb()
  return db.collection<User>("users").findOne({ email })
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb()
  return db.collection<User>("users").findOne({ _id: new ObjectId(id) })
}
