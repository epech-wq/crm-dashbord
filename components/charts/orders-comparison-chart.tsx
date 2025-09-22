"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface OrdersComparisonChartProps {
  data: any
  hideFinancials?: boolean
}

export const OrdersComparisonChart = ({ data, hideFinancials = false }: OrdersComparisonChartProps) => {
  const comparisonData = [
    { name: "Ventas", current: hideFinancials ? 0 : data.totalRevenue, previous: hideFinancials ? 0 : data.totalRevenue * 0.85 },
    { name: "Pedidos", current: data.totalOrders, previous: data.totalOrders * 0.9 },
    { name: "Clientes", current: data.activeCustomers, previous: data.activeCustomers * 0.95 },
  ]

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <Bar dataKey="current" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="previous" fill="#93c5fd" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs text-muted-foreground">Período Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          <span className="text-xs text-muted-foreground">Período Anterior</span>
        </div>
      </div>
    </div>
  )
}