import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function VistaClientePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout initialView="vista-cliente" />
    </ProtectedRoute>
  )
}