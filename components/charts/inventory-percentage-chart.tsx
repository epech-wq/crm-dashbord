"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown, Package } from "lucide-react"

interface InventoryData {
  period: string
  percentage: number
  stockLevel: number
  maxCapacity: number
  trend: "up" | "down" | "stable"
}

interface InventoryPercentageChartProps {
  data: InventoryData[]
  period: string
}

// Generate mock inventory data based on period
const generateInventoryData = (period: string): InventoryData[] => {
  const now = new Date()
  const data: InventoryData[] = []

  let periods: string[] = []
  let basePercentage = 75 // Base inventory percentage

  switch (period) {
    case "day":
      // Generate hourly data for today
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
        periods.push(hour.getHours().toString().padStart(2, '0') + ':00')
      }
      break
    case "week":
      // Generate daily data for the week
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        periods.push(day.toLocaleDateString('es-ES', { weekday: 'short' }))
      }
      break
    case "month":
      // Generate daily data for the month (last 30 days)
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        periods.push(day.getDate().toString())
      }
      break
    case "year":
      // Generate monthly data for the year
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (now.getMonth() - i + 12) % 12
        periods.push(months[monthIndex])
      }
      break
    default:
      periods = ['Actual']
  }

  periods.forEach((periodLabel, index) => {
    // Simulate realistic inventory fluctuations
    const variation = (Math.random() - 0.5) * 20 // ±10% variation
    const percentage = Math.max(20, Math.min(95, basePercentage + variation))
    const maxCapacity = 1000
    const stockLevel = Math.floor((percentage / 100) * maxCapacity)

    // Determine trend based on previous value
    let trend: "up" | "down" | "stable" = "stable"
    if (index > 0) {
      const prevPercentage = data[index - 1]?.percentage || percentage
      if (percentage > prevPercentage + 2) trend = "up"
      else if (percentage < prevPercentage - 2) trend = "down"
    }

    data.push({
      period: periodLabel,
      percentage: Math.round(percentage * 10) / 10,
      stockLevel,
      maxCapacity,
      trend
    })

    // Slight trend for next period
    basePercentage = percentage + (Math.random() - 0.5) * 5
  })

  return data
}

export const InventoryPercentageChart = ({ period }: { period: string }) => {
  const data = generateInventoryData(period)
  const currentPercentage = data[data.length - 1]?.percentage || 0
  const previousPercentage = data[data.length - 2]?.percentage || currentPercentage
  const percentageChange = currentPercentage - previousPercentage
  const isPositive = percentageChange >= 0

  const getStatusColor = (percentage: number) => {
    if (percentage >= 70) return "#10b981" // Green - Good stock
    if (percentage >= 40) return "#f59e0b" // Yellow - Medium stock
    return "#ef4444" // Red - Low stock
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 70) return "Stock Óptimo"
    if (percentage >= 40) return "Stock Medio"
    return "Stock Bajo"
  }

  return (
    <div className="space-y-4">
      {/* Header with current status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{currentPercentage}%</p>
            <p className="text-sm text-muted-foreground">{getStatusText(currentPercentage)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{percentageChange.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">vs período anterior</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as InventoryData
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{label}</p>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Porcentaje:</span>
                          <span className="font-medium" style={{ color: getStatusColor(data.percentage) }}>
                            {data.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Stock:</span>
                          <span className="font-medium">{data.stockLevel} unidades</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Capacidad:</span>
                          <span className="font-medium">{data.maxCapacity} unidades</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Estado:</span>
                          <span className="font-medium" style={{ color: getStatusColor(data.percentage) }}>
                            {getStatusText(data.percentage)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke={getStatusColor(currentPercentage)}
              strokeWidth={3}
              dot={{ fill: getStatusColor(currentPercentage), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getStatusColor(currentPercentage), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and additional info */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
        <div className="text-center">
          <p className="text-sm font-medium text-green-600">≥70%</p>
          <p className="text-xs text-muted-foreground">Stock Óptimo</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-yellow-600">40-69%</p>
          <p className="text-xs text-muted-foreground">Stock Medio</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-red-600">&lt;40%</p>
          <p className="text-xs text-muted-foreground">Stock Bajo</p>
        </div>
      </div>
    </div>
  )
}