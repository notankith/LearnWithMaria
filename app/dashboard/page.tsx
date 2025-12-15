import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session || !session.userId || session.role !== "student") {
    redirect("/login")
  }

  return <DashboardContent userId={session.userId} email={session.email!} />
}
