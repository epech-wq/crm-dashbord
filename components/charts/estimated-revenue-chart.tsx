"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Progress } from "@/components/ui/progress"

interface EstimatedRevenueChartProps {
  data: any
  hideFinancials?: boolean
}

export const EstimatedRevenueChart = ({ data, hideFinancials = false }: EstimatedRevenueChartProps) => {
  if (hideFinancials) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Datos financieros no disponibles en esta vista</p>
      </div>
    )
  }

  // Mock goals data - in a real app this would come from props or API
  const currentRevenue = 45231.89
  const revenueGoal = 60000
  const revenueProgress = (currentRevenue / revenueGoal) * 100

  const marketingGoal = 25000
  const marketingCurrent = 18500
  const marketingProgress = (marketingCurrent / marketingGoal) * 100
  const marketingDifference = marketingCurrent - 16200 // Previous period
  const marketingDifferencePercent = ((marketingDifference / 16200) * 100).toFixed(1)

  const ventasGoal = 35000
  const ventasCurrent = 26731.89
  const ventasProgress = (ventasCurrent / ventasGoal) * 100
  const ventasDifference = ventasCurrent - 22800 // Previous period
  const ventasDifferencePercent = ((ventasDifference / 22800) * 100).toFixed(1)

  // Data for semi-circular chart
  const chartData = [
    { name: "Achieved", value: revenueProgress, fill: "#3b82f6" },
    { name: "Remaining", value: 100 - revenueProgress, fill: "#e2e8f0" }
  ]

  return (
    <div className="space-y-6">
      {/* Semi-circular chart for revenue goal */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
          <div className="text-2xl font-bold text-foreground">
            ${(currentRevenue / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-muted-foreground">
            {revenueProgress.toFixed(1)}%
          </div>
        </div>
      </div>

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