"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Target, DollarSign } from "lucide-react"
import { mockPromotions } from "@/components/mock-data"

export function PromotionPerformance() {
  const activePromotions = mockPromotions.filter(p => p.status === "active" || p.status === "expired")
    .sort((a, b) => b.salesBoostPercentage - a.salesBoostPercentage)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getBoostColor = (percentage: number) => {
    if (percentage >= 60) return "text-green-600"
    if (percentage >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Rendimiento de Promociones
        </CardTitle>
        <CardDescription>
          Comparación de ventas antes y después de aplicar promociones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activePromotions.map((promotion) => (
            <div key={promotion.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{promotion.name}</h3>
                    <Badge className={getStatusColor(promotion.status)}>
                      {promotion.status === "active" ? "Activa" : "Finalizada"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {promotion.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {promotion.usageCount} usos
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getBoostColor(promotion.salesBoostPercentage)}`}>
                    +{promotion.salesBoostPercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Boost de ventas</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Ventas Antes</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-600">
                    {formatCurrency(promotion.salesBefore)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Ventas Después</span>
                  </div>
                  <div className="text-xl font-semibold text-green-600">
                    {formatCurrency(promotion.salesAfter)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Incremento</span>
                  </div>
                  <div className="text-xl font-semibold text-blue-600">
                    {formatCurrency(promotion.salesAfter - promotion.salesBefore)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso de ventas</span>
                  <span className="font-medium">
                    {((promotion.salesAfter / (promotion.salesBefore + promotion.salesAfter)) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={(promotion.salesAfter / (promotion.salesBefore + promotion.salesAfter)) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Antes: {formatCurrency(promotion.salesBefore)}</span>
                  <span>Después: {formatCurrency(promotion.salesAfter)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}