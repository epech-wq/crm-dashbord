import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TorreControlPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout initialView="torre-control" />
    </ProtectedRoute>
  )
}