"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface SalesTrendChartProps {
  data: any
  period: string
  hideFinancials?: boolean
}

export const SalesTrendChart = ({ data, period, hideFinancials = false }: SalesTrendChartProps) => {
  const description = `Evolución de ventas por ${period === "day" ? "hora" : period === "week" ? "día" : period === "month" ? "día" : "mes"}`

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data.salesData}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey={hideFinancials ? "pedidos" : "ventas"}
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}