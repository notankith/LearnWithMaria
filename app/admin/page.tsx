import { getSession } from "@/lib/session"
import AdminDashboard from "@/components/admin/admin-dashboard"
import AdminLoginForm from "@/components/admin/admin-login-form"

export default async function AdminPage() {
  const session = await getSession()

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return <AdminLoginForm />
  }

  return <AdminDashboard role={session.role} userId={session.userId} />
}
