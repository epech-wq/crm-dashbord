"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

  LabelList,
} from "recharts"
import { generateChartData, mockOrders, mockCustomers, mockProducts } from "@/components/mock-data"

export const generateChartsData = (period: string) => {
  const chartData = generateChartData(period)

  // Generar datos del período anterior con variaciones realistas
  const chartDataWithPrevious = chartData.map(item => ({
    ...item,
    ventasAnterior: Math.floor(item.ventas * (0.85 + Math.random() * 0.3)), // Variación entre 85% y 115%
    pedidosAnterior: Math.floor(item.pedidos * (0.9 + Math.random() * 0.2)), // Variación entre 90% y 110%
  }))

  const currentTotal = chartDataWithPrevious.reduce((sum, item) => sum + item.ventas, 0)
  const previousTotal = chartDataWithPrevious.reduce((sum, item) => sum + item.ventasAnterior, 0)
  const percentageChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  // Calcular datos reales basados en los pedidos mock
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0)
  const totalOrders = mockOrders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Distribución de clientes por segmento basada en datos reales
  const customerSegments = [
    {
      name: "Enterprise",
      value: mockCustomers.filter((c) => c.segment === "Enterprise").length,
      percentage: Math.round(
        (mockCustomers.filter((c) => c.segment === "Enterprise").length / mockCustomers.length) * 100,
      ),
      color: "#3b82f6", // Azul
    },
    {
      name: "SMB",
      value: mockCustomers.filter((c) => c.segment === "SMB").length,
      percentage: Math.round((mockCustomers.filter((c) => c.segment === "SMB").length / mockCustomers.length) * 100),
      color: "#10b981", // Verde
    },
    {
      name: "Startup",
      value: mockCustomers.filter((c) => c.segment === "Startup").length,
      percentage: Math.round(
        (mockCustomers.filter((c) => c.segment === "Startup").length / mockCustomers.length) * 100,
      ),
      color: "#f59e0b", // Amarillo/Naranja
    },
  ]



  // Ventas por categoría basadas en productos reales
  const categoryData = mockProducts
    .map((product) => {
      const ordersForProduct = mockOrders.filter((order) => order.productIds.includes(product.id))
      const revenue = ordersForProduct.reduce(
        (sum, order) => sum + order.amount * (order.productIds.includes(product.id) ? 1 : 0),
        0,
      )

      return {
        categoria: product.category,
        ventas: Math.round(revenue / ordersForProduct.length) || 0,
        pedidos: ordersForProduct.length,
        margen: product.margin,
      }
    })
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.categoria === curr.categoria)
      if (existing) {
        existing.ventas += curr.ventas
        existing.pedidos += curr.pedidos
        existing.margen = Math.round((existing.margen + curr.margen) / 2)
      } else {
        acc.push(curr)
      }
      return acc
    }, [] as any[])

  // Rendimiento por canal basado en datos reales
  const channelData = ["Online", "Telefónico", "Presencial", "Partner"].map((channel) => {
    const ordersForChannel = mockOrders.filter((order) => order.channel === channel)
    const revenue = ordersForChannel.reduce((sum, order) => sum + order.amount, 0)
    const avgConversion =
      ordersForChannel.length > 0
        ? ordersForChannel.reduce((sum, order) => sum + order.margin, 0) / ordersForChannel.length
        : 0

    return {
      canal: channel,
      ventas: revenue,
      pedidos: ordersForChannel.length,
      conversion: Math.round(avgConversion * 10) / 10,
    }
  })

  return {
    salesData: chartDataWithPrevious,
    salesComparison: {
      currentTotal,
      previousTotal,
      percentageChange,
      period,
    },
    customerSegments,

    categoryData,
    channelData,
    avgOrderValue,
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-card-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

const ChartCard = ({ title, description, children, className = "" }: ChartCardProps) => (
  <Card className={`${className} hover:shadow-md transition-shadow duration-200`}>
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
      <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
)

interface ChartsGridProps {
  period: string
  visibleCharts: string[]
}

export const ChartsGrid = ({ period, visibleCharts }: ChartsGridProps) => {
  const chartData = generateChartsData(period)

  const chartConfigs = [
    {
      key: "salesTrend",
      title: "Tendencia de Ventas",
      description: `Evolución de ventas por ${period === "day" ? "hora" : period === "week" ? "día" : period === "month" ? "día" : "mes"}`,
      component: (
        <div>
          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: "#3b82f6" }}>
                  ${chartData.salesComparison.currentTotal.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Período Actual</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: "#10b981" }}>
                  ${chartData.salesComparison.previousTotal.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Período Anterior</div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${chartData.salesComparison.percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {chartData.salesComparison.percentageChange >= 0 ? "+" : ""}
                  {chartData.salesComparison.percentageChange.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Diferencia</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.salesData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorVentasAnterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentas)"
                name="Ventas Actuales"
              />
              <Area
                type="monotone"
                dataKey="ventasAnterior"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorVentasAnterior)"
                fillOpacity={0.3}
                name="Período Anterior"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      key: "ordersComparison",
      title: "Comparación de Métricas",
      description: "Ventas, pedidos y clientes en el período actual",
      component: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.salesData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="period" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="pedidos" fill="#3b82f6" name="Pedidos" radius={[2, 2, 0, 0]} />
            <Bar dataKey="clientes" fill="#10b981" name="Clientes" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      key: "customerSegments",
      title: "Segmentación de Clientes",
      description: "Distribución de clientes por segmento empresarial",
      component: (
        <div>
          {/* Información estadística */}
          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {chartData.customerSegments.reduce((sum, segment) => sum + segment.value, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Clientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ${chartData.avgOrderValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Valor Promedio por Pedido</div>
              </div>
            </div>
          </div>

          {/* Leyenda de colores */}
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            {chartData.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {segment.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({segment.percentage}%)
                </span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.customerSegments}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.customerSegments.map((segment, index) => (
                  <Cell key={`cell-${index}`} fill={segment.color} />
                ))}
                <LabelList
                  dataKey={(segment: any) => `${segment.value}`}
                  position="center"
                  className="fill-white text-sm font-bold"
                />
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-card-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} clientes ({data.percentage}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ),
    },

    {
      key: "categoryPerformance",
      title: "Rendimiento por Categoría",
      description: "Ventas y márgenes por categoría de producto",
      component: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.categoryData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs fill-muted-foreground" />
            <YAxis dataKey="categoria" type="category" className="text-xs fill-muted-foreground" width={80} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-card-foreground">{label}</p>
                      <p className="text-sm">Ventas: ${data.ventas.toLocaleString()}</p>
                      <p className="text-sm">Pedidos: {data.pedidos}</p>
                      <p className="text-sm">Margen: {data.margen}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="ventas" name="Ventas" radius={[0, 2, 2, 0]}>
              {chartData.categoryData.map((entry, index) => {
                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      key: "channelAnalysis",
      title: "Análisis por Canal",
      description: "Rendimiento de ventas y conversión por canal",
      component: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.channelData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="canal" className="text-xs fill-muted-foreground" />
            <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
            <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-card-foreground">{label}</p>
                      <p className="text-sm">Ventas: ${data.ventas.toLocaleString()}</p>
                      <p className="text-sm">Pedidos: {data.pedidos}</p>
                      <p className="text-sm">Margen Promedio: {data.conversion}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="ventas" name="Ventas ($)" radius={[2, 2, 0, 0]}>
              {chartData.channelData.map((entry, index) => {
                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              })}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="conversion"
              fill="#8b5cf6"
              name="Margen Promedio (%)"
              radius={[2, 2, 0, 0]}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ]

  const filteredCharts = chartConfigs.filter((chart) => visibleCharts.includes(chart.key))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filteredCharts.map((chart) => (
        <ChartCard
          key={chart.key}
          title={chart.title}
          description={chart.description}
          className=""
        >
          {chart.component}
        </ChartCard>
      ))}
    </div>
  )
}

export const availableCharts = [
  { key: "salesTrend", label: "Tendencia de Ventas" },
  { key: "ordersComparison", label: "Comparación Métricas" },
  { key: "customerSegments", label: "Segmentación Clientes" },

  { key: "categoryPerformance", label: "Rendimiento Categorías" },
  { key: "channelAnalysis", label: "Análisis por Canal" },
]
