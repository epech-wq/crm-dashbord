"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, DollarSign, Percent, Users } from "lucide-react"
import { mockPromotions } from "@/components/mock-data"

export function PromotionMetrics() {
  const activePromotions = mockPromotions.filter(p => p.status === "active")
  const totalPromotions = mockPromotions.length

  const totalSalesBoost = activePromotions.reduce((sum, promo) => {
    return sum + (promo.salesAfter - promo.salesBefore)
  }, 0)

  const averageBoostPercentage = activePromotions.length > 0
    ? activePromotions.reduce((sum, promo) => sum + promo.salesBoostPercentage, 0) / activePromotions.length
    : 0

  const totalDiscountGiven = activePromotions.reduce((sum, promo) => {
    if (promo.type === "percentage") {
      return sum + (promo.salesAfter * promo.value / 100)
    } else if (promo.type === "fixed") {
      return sum + (promo.value * promo.usageCount)
    }
    return sum + (promo.salesAfter * 0.1) // Estimación para otros tipos
  }, 0)

  const promotionROI = totalDiscountGiven > 0 ? (totalSalesBoost / totalDiscountGiven) * 100 : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const metrics = [
    {
      title: "Promociones Activas",
      value: activePromotions.length,
      total: totalPromotions,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Boost Total de Ventas",
      value: formatCurrency(totalSalesBoost),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+15.2%",
      changeType: "positive" as const,
    },
    {
      title: "Boost Promedio",
      value: `${averageBoostPercentage.toFixed(1)}%`,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3.1%",
      changeType: "positive" as const,
    },
    {
      title: "Descuentos Otorgados",
      value: formatCurrency(totalDiscountGiven),
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+8.7%",
      changeType: "positive" as const,
    },
    {
      title: "ROI de Promociones",
      value: `${promotionROI.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+12.3%",
      changeType: "positive" as const,
    },
    {
      title: "Clientes Impactados",
      value: "156",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+23",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.total && (
                      <span className="text-sm text-muted-foreground ml-1">
                        / {metric.total}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.changeType === "positive" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}>
                      {metric.change} vs mes anterior
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}