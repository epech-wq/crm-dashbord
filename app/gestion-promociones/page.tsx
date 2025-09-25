import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function GestionPromocionesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout initialView="gestion-promociones" />
    </ProtectedRoute>
  )
}