"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Progress } from "@/components/ui/progress"

interface EstimatedRevenueChartProps {
  data: any
  hideFinancials?: boolean
  period?: string
}

export const EstimatedRevenueChart = ({ data, hideFinancials = false, period = "month" }: EstimatedRevenueChartProps) => {
  if (hideFinancials) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Datos financieros no disponibles en esta vista</p>
      </div>
    )
  }

  // Calculate period-based revenue data from the provided data
  const salesData = data.salesData || []
  const currentRevenue = salesData.reduce((sum: number, item: any) => sum + item.ventas, 0)

  // Set goals based on period - different targets for different time frames
  const periodGoals = {
    day: { revenue: 2000, marketing: 800, ventas: 1200 },
    week: { revenue: 12000, marketing: 5000, ventas: 7000 },
    month: { revenue: 60000, marketing: 25000, ventas: 35000 },
    quarter: { revenue: 180000, marketing: 75000, ventas: 105000 },
    year: { revenue: 720000, marketing: 300000, ventas: 420000 }
  }

  const goals = periodGoals[period as keyof typeof periodGoals] || periodGoals.month
  const revenueGoal = goals.revenue
  const revenueProgress = Math.min((currentRevenue / revenueGoal) * 100, 100)

  // Calculate marketing and sales data based on period and actual data
  const marketingGoal = goals.marketing
  const marketingCurrent = Math.floor(currentRevenue * 0.4) // 40% of revenue typically from marketing
  const marketingProgress = Math.min((marketingCurrent / marketingGoal) * 100, 100)
  // Calculate previous period data from salesData
  const previousRevenue = salesData.reduce((sum: number, item: any) => sum + (item.ventasAnterior || 0), 0)
  const marketingPrevious = Math.floor(previousRevenue * 0.4)
  const marketingDifference = marketingCurrent - marketingPrevious
  const marketingDifferencePercent = marketingPrevious > 0 ? ((marketingDifference / marketingPrevious) * 100).toFixed(1) : "0.0"

  const ventasGoal = goals.ventas
  const ventasCurrent = Math.floor(currentRevenue * 0.6) // 60% of revenue from direct sales
  const ventasProgress = Math.min((ventasCurrent / ventasGoal) * 100, 100)
  const ventasPrevious = Math.floor(previousRevenue * 0.6)
  const ventasDifference = ventasCurrent - ventasPrevious
  const ventasDifferencePercent = ventasPrevious > 0 ? ((ventasDifference / ventasPrevious) * 100).toFixed(1) : "0.0"

  // Data for semi-circular chart
  const chartData = [
    { name: "Achieved", value: revenueProgress, fill: "#3b82f6" },
    { name: "Remaining", value: 100 - revenueProgress, fill: "#e2e8f0" }
  ]

  return (
    <div className="space-y-6">
      {/* Semi-circular chart for revenue goal */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={135}
              outerRadius={150}
              paddingAngle={1}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
          <div className="text-2xl font-bold text-foreground">
            ${(currentRevenue / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-muted-foreground">
            {revenueProgress.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Progress bars for Marketing and Ventas */}
      <div className="space-y-4">
        {/* Marketing Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Marketing</span>
            <span className={`text-sm font-medium ${marketingDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketingDifference >= 0 ? '+' : ''}${marketingDifference.toLocaleString()} ({marketingDifferencePercent}%)
            </span>
          </div>
          <Progress
            value={marketingProgress}
            className="h-2 [&>div]:bg-[#3b82f6]"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              ${marketingCurrent.toLocaleString()} / ${marketingGoal.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {marketingProgress.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Ventas Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Ventas</span>
            <span className={`text-sm font-medium ${ventasDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ventasDifference >= 0 ? '+' : ''}${ventasDifference.toLocaleString()} ({ventasDifferencePercent}%)
            </span>
          </div>
          <Progress
            value={ventasProgress}
            className="h-2 [&>div]:bg-[#3b82f6]"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              ${ventasCurrent.toLocaleString()} / ${ventasGoal.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {ventasProgress.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}