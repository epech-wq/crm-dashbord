"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"

interface StatisticsChartProps {
  data: any
  hideFinancials?: boolean
}

export const StatisticsChart = ({ data, hideFinancials = false }: StatisticsChartProps) => {
  if (hideFinancials) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Datos financieros no disponibles en esta vista</p>
      </div>
    )
  }

  return (
    <div>
      {/* Statistics values */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <div className="text-2xl font-bold text-foreground">$212,142.12</div>
          <div className="text-sm text-green-600 font-medium">+23.2%</div>
          <div className="text-xs text-muted-foreground">Ganancia Anual Promedio</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">$30,321.23</div>
          <div className="text-sm text-red-600 font-medium">-12.3%</div>
          <div className="text-xs text-muted-foreground">Ganancia Anual Promedio</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-sm text-muted-foreground">Período Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600"></div>
          <span className="text-sm text-muted-foreground">Período Anterior</span>
        </div>
      </div>

      {/* Area chart with two lines */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data.salesData.slice(0, 8)}>
          <defs>
            <linearGradient id="statsGradientCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="statsGradientPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="period" axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" />
          <YAxis axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" />
          <Area
            type="monotone"
            dataKey="ventas"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#statsGradientCurrent)"
          />
          <Area
            type="monotone"
            dataKey="ventasAnterior"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#statsGradientPrevious)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}