"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface TrafficStatsChartProps {
  data?: any
  period?: string
}

// Generate sample sparkline data for each metric
const generateSparklineData = (trend: 'up' | 'down' | 'stable') => {
  const baseData = Array.from({ length: 12 }, (_, i) => ({ value: 50 + Math.random() * 20 }))

  if (trend === 'up') {
    return baseData.map((item, i) => ({ value: item.value + (i * 2) }))
  } else if (trend === 'down') {
    return baseData.map((item, i) => ({ value: item.value - (i * 1.5) }))
  }
  return baseData
}

const SparklineChart = ({ data, color }: { data: any[], color: string }) => (
  <div className="w-20 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          fill={`${color}20`}
          fillOpacity={0.3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export const TrafficStatsChart = ({ data, period = "month" }: TrafficStatsChartProps) => {
  // Generate period-specific data based on the selected timeframe
  const getPeriodData = (period: string) => {
    const periodMultipliers = {
      day: { stock: 0.1, outOfStock: 0.05, rotation: 0.2 },
      week: { stock: 0.7, outOfStock: 0.3, rotation: 1.4 },
      month: { stock: 1, outOfStock: 1, rotation: 4.2 },
      quarter: { stock: 3, outOfStock: 2.5, rotation: 12.6 },
      year: { stock: 12, outOfStock: 8, rotation: 50.4 }
    }

    const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || periodMultipliers.month

    // Base values that scale with period
    const baseStock = 1247
    const baseOutOfStock = 89
    const baseRotation = multiplier.rotation

    // Calculate period-appropriate values
    const stockValue = Math.floor(baseStock * multiplier.stock)
    const outOfStockValue = Math.floor(baseOutOfStock * multiplier.outOfStock)

    // Generate realistic changes based on period
    const stockChange = (Math.random() * 20 - 5).toFixed(1) // -5% to +15%
    const outOfStockChange = (Math.random() * -15 - 5).toFixed(1) // -20% to -5% (negative is good)
    const rotationChange = (Math.random() * 25 + 5).toFixed(1) // +5% to +30%

    return {
      stock: stockValue,
      outOfStock: outOfStockValue,
      rotation: baseRotation,
      stockChange: parseFloat(stockChange),
      outOfStockChange: parseFloat(outOfStockChange),
      rotationChange: parseFloat(rotationChange)
    }
  }

  const periodData = getPeriodData(period)

  // Get period-specific comparison text
  const getComparisonText = (period: string) => {
    switch (period) {
      case "day": return "vs día anterior"
      case "week": return "vs semana anterior"
      case "month": return "vs mes anterior"
      case "quarter": return "vs trimestre anterior"
      case "year": return "vs año anterior"
      default: return "vs período anterior"
    }
  }

  const comparisonText = getComparisonText(period)

  const trafficStats = [
    {
      label: "Productos en Stock",
      value: periodData.stock.toLocaleString(),
      change: `${periodData.stockChange >= 0 ? '+' : ''}${periodData.stockChange}%`,
      changeText: comparisonText,
      trend: periodData.stockChange >= 0 ? "up" as const : "down" as const,
      sparklineData: generateSparklineData(periodData.stockChange >= 0 ? 'up' : 'down'),
      color: "#10b981"
    },
    {
      label: "Productos Agotados",
      value: periodData.outOfStock.toString(),
      change: `${periodData.outOfStockChange >= 0 ? '+' : ''}${periodData.outOfStockChange}%`,
      changeText: comparisonText,
      trend: periodData.outOfStockChange < 0 ? "down" as const : "up" as const,
      sparklineData: generateSparklineData(periodData.outOfStockChange < 0 ? 'down' : 'up'),
      color: "#ef4444"
    },
    {
      label: "Rotación de Inventario",
      value: `${periodData.rotation.toFixed(1)}x`,
      change: `${periodData.rotationChange >= 0 ? '+' : ''}${periodData.rotationChange}%`,
      changeText: comparisonText,
      trend: periodData.rotationChange >= 0 ? "up" as const : "down" as const,
      sparklineData: generateSparklineData(periodData.rotationChange >= 0 ? 'up' : 'down'),
      color: "#3b82f6"
    }
  ]

  return (
    <div className="space-y-6">
      {trafficStats.map((stat, index) => {
        const isPositive = stat.change.startsWith('+')
        // For "Productos Agotados", decreasing is good (green), increasing is bad (red)
        // For other metrics, increasing is generally good
        const changeColor = stat.label === "Productos Agotados"
          ? (isPositive ? "text-red-600" : "text-green-600")
          : (isPositive ? "text-green-600" : "text-red-600")

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  <span className={`font-medium ${changeColor}`}>{stat.change}</span>
                  <span className="text-muted-foreground">{stat.changeText}</span>
                </div>
              </div>
              <div className="flex items-center">
                <SparklineChart data={stat.sparklineData} color={stat.color} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}