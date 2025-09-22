"use client"

import { TrendingUp, TrendingDown, Eye, Users, Clock, MousePointer } from "lucide-react"

interface TrafficStatsChartProps {
  data?: any
}

export const TrafficStatsChart = ({ data }: TrafficStatsChartProps) => {
  const trafficStats = [
    {
      label: "Visitantes Únicos",
      value: "12,543",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      label: "Páginas Vistas",
      value: "45,231",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-green-600"
    },
    {
      label: "Tiempo Promedio",
      value: "3:24",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      label: "Tasa de Rebote",
      value: "34.2%",
      change: "-5.3%",
      trend: "up",
      icon: MousePointer,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="space-y-4">
      {trafficStats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600"

        return (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-background ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {stat.change}
            </div>
          </div>
        )
      })}

      <div className="text-center pt-2">
        <button className="text-xs text-primary hover:underline">
          Ver análisis completo →
        </button>
      </div>
    </div>
  )
}