"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, DollarSign, Percent, Users, TrendingUp } from "lucide-react"
import { mockPromotions } from "@/components/mock-data"
import { formatCurrency, formatPercentage } from "@/lib/format-utils"

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



  const getBadgeVariant = (changeType: "positive" | "negative") => {
    return changeType === "positive"
      ? { variant: "secondary" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" }
      : { variant: "secondary" as const, className: "bg-red-100 text-red-700 hover:bg-red-100" }
  }

  const metrics = [
    {
      title: "Promociones Activas",
      value: `${activePromotions.length}`,
      change: "+2.0%",
      changeType: "positive" as const,
    },
    {
      title: "Boost Total de Ventas",
      value: formatCurrency(totalSalesBoost),
      change: "+15.2%",
      changeType: "positive" as const,
    },
    {
      title: "Boost Promedio",
      value: formatPercentage(averageBoostPercentage),
      change: "+3.1%",
      changeType: "positive" as const,
    },
    {
      title: "Descuentos Otorgados",
      value: formatCurrency(totalDiscountGiven),
      change: "+8.7%",
      changeType: "positive" as const,
    },
    {
      title: "ROI de Promociones",
      value: formatPercentage(promotionROI),
      change: "+12.3%",
      changeType: "positive" as const,
    },
    {
      title: "Clientes Impactados",
      value: "156",
      change: "+14.7%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const badgeConfig = getBadgeVariant(metric.changeType)

        return (
          <Card key={index} className="p-6">
            <div className="grid gap-4">
              <p className="text-3xl font-bold text-foreground">
                {metric.value}
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{metric.title}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={badgeConfig.variant}
                    className={`text-xs font-medium ${badgeConfig.className}`}
                  >
                    {metric.change}
                  </Badge>
                  {/* <p className="text-xs">vs mes anterior</p> */}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}