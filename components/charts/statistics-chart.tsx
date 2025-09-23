"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Line, ComposedChart } from "recharts"

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

  // Calculate sales metrics
  const currentYearSales = data.totalRevenue || 0
  const previousYearSales = currentYearSales * 0.87 // Simulate previous year data
  const ytdSales = currentYearSales * 0.15 // Year to date (assuming we're in early year)
  const previousYtdSales = previousYearSales * 0.15
  const yearlyGoal = currentYearSales * 6.5 // Annual projection/goal
  const monthlyGoal = yearlyGoal / 12

  // Calculate percentage changes
  const ytyChange = previousYearSales > 0 ? ((currentYearSales - previousYearSales) / previousYearSales) * 100 : 0
  const ytdChange = previousYtdSales > 0 ? ((ytdSales - previousYtdSales) / previousYtdSales) * 100 : 0
  const goalProgress = (ytdSales / yearlyGoal) * 100

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Generate YTY monthly data (always 12 months regardless of selected period)
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const currentMonth = new Date().getMonth() // 0-based index

  const ytyChartData = monthNames.map((month, index) => {
    // Base sales amount with seasonal variation
    const baseSales = currentYearSales / 12
    const seasonalMultiplier = 0.8 + Math.sin((index / 12) * 2 * Math.PI) * 0.3 + Math.random() * 0.2
    const currentSales = baseSales * seasonalMultiplier

    // Previous year sales (slightly lower with different seasonal pattern)
    const previousSeasonalMultiplier = 0.75 + Math.sin(((index + 1) / 12) * 2 * Math.PI) * 0.25 + Math.random() * 0.15
    const previousSales = (previousYearSales / 12) * previousSeasonalMultiplier

    // Projection (optimistic growth)
    const projectionSales = currentSales * (1.1 + Math.random() * 0.2)

    return {
      period: month,
      ventasActuales: Math.round(currentSales),
      añoAnterior: Math.round(previousSales),
      proyeccion: Math.round(projectionSales),
      // Add opacity for future months (after current month)
      isFuture: index > currentMonth
    }
  })

  return (
    <div>
      {/* Sales Statistics - 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* YTY (Year to Year) */}
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatCurrency(currentYearSales)}</div>
          <div className={`text-sm font-medium ${ytyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {ytyChange >= 0 ? '+' : ''}{ytyChange.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Ventas YTY</div>
        </div>

        {/* YTD (Year to Date) */}
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatCurrency(ytdSales)}</div>
          <div className={`text-sm font-medium ${ytdChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {ytdChange >= 0 ? '+' : ''}{ytdChange.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Ventas YTD</div>
        </div>

        {/* Goal Progress */}
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{formatCurrency(yearlyGoal)}</div>
          <div className={`text-sm font-medium ${goalProgress >= 15 ? 'text-green-600' : 'text-orange-600'}`}>
            {goalProgress.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Meta Anual</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-muted-foreground">Ventas Actuales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600"></div>
          <span className="text-muted-foreground">Año Anterior</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
          <span className="text-muted-foreground">Proyección</span>
        </div>
      </div>

      {/* YTY Sales Chart - Always shows 12 months */}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={ytyChartData}>
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

          {/* Previous year sales area */}
          <Area
            type="monotone"
            dataKey="añoAnterior"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#statsGradientPrevious)"
          />

          {/* Current year sales area */}
          <Area
            type="monotone"
            dataKey="ventasActuales"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#statsGradientCurrent)"
          />

          {/* Projection line */}
          <Line
            type="monotone"
            dataKey="proyeccion"
            stroke="#ea580c"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}