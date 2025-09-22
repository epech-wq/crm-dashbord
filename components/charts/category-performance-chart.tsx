"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"

interface CategoryPerformanceChartProps {
  data: any
  hideFinancials?: boolean
}

export const CategoryPerformanceChart = ({ data, hideFinancials = false }: CategoryPerformanceChartProps) => {
  const categoryData = [
    { name: "Software", sales: hideFinancials ? 0 : 45000, orders: 120, margin: hideFinancials ? 0 : 68 },
    { name: "Hardware", sales: hideFinancials ? 0 : 32000, orders: 85, margin: hideFinancials ? 0 : 45 },
    { name: "Servicios", sales: hideFinancials ? 0 : 28000, orders: 95, margin: hideFinancials ? 0 : 72 },
    { name: "Consultoría", sales: hideFinancials ? 0 : 38000, orders: 65, margin: hideFinancials ? 0 : 85 },
  ]

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar
            dataKey={hideFinancials ? "orders" : "sales"}
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey={hideFinancials ? "orders" : "margin"}
              position="top"
              className="text-xs fill-muted-foreground"
              formatter={(value: number) => hideFinancials ? `${value}` : `${value}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Category summary */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {hideFinancials ? categoryData.reduce((sum, cat) => sum + cat.orders, 0) : `$${(categoryData.reduce((sum, cat) => sum + cat.sales, 0) / 1000).toFixed(0)}K`}
          </div>
          <div className="text-xs text-muted-foreground">
            {hideFinancials ? "Total Pedidos" : "Ventas Totales"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {hideFinancials ? "N/A" : `${(categoryData.reduce((sum, cat) => sum + cat.margin, 0) / categoryData.length).toFixed(0)}%`}
          </div>
          <div className="text-xs text-muted-foreground">
            {hideFinancials ? "Margen" : "Margen Promedio"}
          </div>
        </div>
      </div>
    </div>
  )
}