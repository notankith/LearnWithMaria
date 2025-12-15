import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import SuperadminDashboard from "@/components/superadmin/superadmin-dashboard"

export default async function SuperadminDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "superadmin") {
    redirect("/superadmin")
  }

  return <SuperadminDashboard />
}
