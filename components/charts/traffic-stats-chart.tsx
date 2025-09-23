"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface TrafficStatsChartProps {
  data?: any
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

export const TrafficStatsChart = ({ data }: TrafficStatsChartProps) => {
  const trafficStats = [
    {
      label: "New Subscribers",
      value: "567K",
      change: "+3.85%",
      changeText: "then last Week",
      trend: "up" as const,
      sparklineData: generateSparklineData('up'),
      color: "#10b981"
    },
    {
      label: "Conversion Rate",
      value: "276K",
      change: "-5.39%",
      changeText: "then last Week",
      trend: "down" as const,
      sparklineData: generateSparklineData('down'),
      color: "#10b981"
    },
    {
      label: "Page Bounce Rate",
      value: "285",
      change: "+12.74%",
      changeText: "then last Week",
      trend: "up" as const,
      sparklineData: generateSparklineData('up'),
      color: "#10b981"
    }
  ]

  return (
    <div className="space-y-6">
      {trafficStats.map((stat, index) => {
        const isPositive = stat.change.startsWith('+')
        const changeColor = stat.trend === 'up' && isPositive ? "text-green-600" :
          stat.trend === 'down' && !isPositive ? "text-red-600" :
            isPositive ? "text-green-600" : "text-red-600"

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