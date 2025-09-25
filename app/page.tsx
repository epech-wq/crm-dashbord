"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the default view (Dirección General)
    router.push("/direccion-general")
  }, [router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando Dashboard...</h1>
          <p className="text-muted-foreground">Redirigiendo a la vista principal</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}