"use server"

import { destroySession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function signOut() {
  await destroySession()
  redirect("/")
}
