"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface CustomerSegmentsChartProps {
  data: any
}

export const CustomerSegmentsChart = ({ data }: CustomerSegmentsChartProps) => {
  return (
    <div>
      {/* Segment stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {data.customerSegments.map((segment: any) => (
          <div key={segment.name} className="text-center">
            <div className="text-lg font-bold text-foreground">{segment.value}</div>
            <div className="text-xs text-muted-foreground">{segment.name}</div>
            <div className="text-xs text-muted-foreground">{segment.percentage}%</div>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data.customerSegments}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.customerSegments.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {data.customerSegments.map((segment: any) => (
          <div key={segment.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="text-xs text-muted-foreground">{segment.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}