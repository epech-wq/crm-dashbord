"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface SalesCategoryChartProps {
  data: any
  hideFinancials?: boolean
}

export const SalesCategoryChart = ({ data, hideFinancials = false }: SalesCategoryChartProps) => {
  return (
    <div>
      {/* Category stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {data.salesCategoryData.map((category: any, index: number) => (
          <div key={category.name} className="text-center">
            <div className="text-lg font-bold text-foreground">{category.percentage}%</div>
            <div className="text-xs text-muted-foreground">{category.name}</div>
            <div className="text-xs text-muted-foreground">
              {hideFinancials ? `${category.value} pedidos` : `${category.products} productos`}
            </div>
          </div>
        ))}
      </div>

      {/* Pie chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data.salesCategoryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.salesCategoryData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {data.salesCategoryData.map((category: any) => (
          <div key={category.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            ></div>
            <span className="text-xs text-muted-foreground">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}