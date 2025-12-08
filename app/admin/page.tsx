import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard")
  }

  return <AdminDashboard user={user} />
}
