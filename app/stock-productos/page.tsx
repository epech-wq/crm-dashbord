import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function StockProductosPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout initialView="stock-productos" />
    </ProtectedRoute>
  )
}