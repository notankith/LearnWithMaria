import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardContent user={user} />
}
