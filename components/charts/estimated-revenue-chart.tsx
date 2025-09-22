"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

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

  return (
    <div>
      {/* Revenue summary */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">$45,231.89</div>
        <div className="text-sm text-green-600 font-medium">+20.1% desde el mes pasado</div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.salesData.slice(0, 6)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <Bar
            dataKey="ventas"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}