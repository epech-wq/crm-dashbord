"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateChartData, mockOrders, mockCustomers, mockProducts } from "@/components/mock-data"
import {
  StatisticsChart,
  EstimatedRevenueChart,
  SalesTrendChart,
  SalesCategoryChart,
  OrdersComparisonChart,
  UpcomingScheduleChart,
  CustomerSegmentsChart,
  CategoryPerformanceChart,
  ChannelAnalysisChart,
  TrafficStatsChart,
} from "@/components/charts"

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

  // Sales Category distribution based on orders
  const salesCategoryData = [
    {
      name: "Affiliate Program",
      value: mockOrders.filter(order => order.channel === "Partner").length,
      percentage: Math.round((mockOrders.filter(order => order.channel === "Partner").length / mockOrders.length) * 100),
      color: "#4f46e5", // Indigo
      products: mockOrders.filter(order => order.channel === "Partner").reduce((sum, order) => sum + order.productIds.length, 0)
    },
    {
      name: "Direct Buy",
      value: mockOrders.filter(order => order.channel === "Online" || order.channel === "Presencial").length,
      percentage: Math.round((mockOrders.filter(order => order.channel === "Online" || order.channel === "Presencial").length / mockOrders.length) * 100),
      color: "#3b82f6", // Blue
      products: mockOrders.filter(order => order.channel === "Online" || order.channel === "Presencial").reduce((sum, order) => sum + order.productIds.length, 0)
    },
    {
      name: "Adsense",
      value: mockOrders.filter(order => order.channel === "Telefónico").length,
      percentage: Math.round((mockOrders.filter(order => order.channel === "Telefónico").length / mockOrders.length) * 100),
      color: "#93c5fd", // Light Blue
      products: mockOrders.filter(order => order.channel === "Telefónico").reduce((sum, order) => sum + order.productIds.length, 0)
    }
  ]

  const totalSalesProducts = salesCategoryData.reduce((sum, category) => sum + category.products, 0)

  // Ventas por categoría basadas en productos reales
  const categoryData = mockProducts
    .reduce((acc: any[], product) => {
      const existingCategory = acc.find(item => item.name === product.category)
      if (existingCategory) {
        existingCategory.sales += product.price
        existingCategory.orders += 1
      } else {
        acc.push({
          name: product.category,
          sales: product.price,
          orders: 1,
          margin: Math.floor(Math.random() * 30) + 50 // Margen entre 50% y 80%
        })
      }
      return acc
    }, [])

  const activeCustomers = mockCustomers.filter(customer => customer.status === "active").length

  return {
    salesData: chartDataWithPrevious,
    totalRevenue,
    totalOrders,
    activeCustomers,
    avgOrderValue,
    percentageChange,
    customerSegments,
    salesCategoryData,
    categoryData,
  }
}

interface ChartsGridProps {
  period: string
  visibleCharts: string[]
  hideFinancials?: boolean
}

export const ChartsGrid = ({ period, visibleCharts, hideFinancials = false }: ChartsGridProps) => {
  const chartData = generateChartsData(period)

  const chartConfigs = [
    {
      key: "statistics",
      title: "Estadísticas de Ventas",
      description: "Análisis YTY, YTD y metas de ventas con proyecciones",
      component: <StatisticsChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "estimatedRevenue",
      title: "Ingresos Estimados",
      component: <EstimatedRevenueChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "salesTrend",
      title: "Tendencia de Ventas",
      description: `Evolución de ventas por ${period === "day" ? "hora" : period === "week" ? "día" : period === "month" ? "día" : "mes"}`,
      component: <SalesTrendChart data={chartData} period={period} hideFinancials={hideFinancials} />,
    },
    {
      key: "salesCategory",
      title: "Categoría de Ventas",
      description: "Distribución de ventas por categoría y canal",
      component: <SalesCategoryChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "ordersComparison",
      title: "Comparación de Métricas",
      description: "Ventas, pedidos y clientes en el período actual",
      component: <OrdersComparisonChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "upcomingSchedule",
      title: "Próximas Citas",
      description: "Tus reuniones y eventos programados",
      component: <UpcomingScheduleChart data={chartData} />,
    },
    {
      key: "customerSegments",
      title: "Segmentación de Clientes",
      description: "Distribución de clientes por segmento empresarial",
      component: <CustomerSegmentsChart data={chartData} />,
    },
    {
      key: "categoryPerformance",
      title: "Rendimiento por Categoría",
      description: "Ventas y márgenes por categoría de producto",
      component: <CategoryPerformanceChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "channelAnalysis",
      title: "Análisis por Canal",
      description: "Rendimiento de ventas y conversión por canal",
      component: <ChannelAnalysisChart data={chartData} hideFinancials={hideFinancials} />,
    },
    {
      key: "trafficStats",
      title: "Traffic Stats",
      description: "Estadísticas de tráfico y rendimiento del sitio web",
      component: <TrafficStatsChart data={chartData} />,
    },
  ]

  // Filter out financial charts if hideFinancials is true
  const financialCharts = ["statistics", "estimatedRevenue", "salesTrend"]

  const filteredCharts = chartConfigs.filter((chart) => {
    const isVisible = visibleCharts.includes(chart.key)
    const isFinancial = financialCharts.includes(chart.key)
    return isVisible && (!hideFinancials || !isFinancial)
  })

  return (
    <div className="grid gap-4 md:grid-cols-6">
      {filteredCharts.map((chart) => {
        // Define column spans: Estadísticas=4 cols, Ingresos Estimados=2 cols, Sales Category=3 cols (half), Próximas Citas=3 cols, others=2 cols
        const colSpan = chart.key === "trafficStats" ? "md:col-span-2" :
          chart.key === "statistics" ? "md:col-span-4" :
            chart.key === "estimatedRevenue" ? "md:col-span-2" :
              chart.key === "salesCategory" ? "md:col-span-3" :
                chart.key === "upcomingSchedule" ? "md:col-span-3" :
                  "md:col-span-2"

        return (
          <Card key={chart.key} className={`${colSpan}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{chart.title}</CardTitle>
              <CardDescription className="text-sm">{chart.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {chart.component}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export const availableCharts = [
  { key: "statistics", label: "Estadísticas de Ventas" },
  { key: "estimatedRevenue", label: "Ingresos Estimados" },
  { key: "salesCategory", label: "Categoría de Ventas" },
  { key: "upcomingSchedule", label: "Próximas Citas" },
  { key: "salesTrend", label: "Tendencia de Ventas" },
  { key: "ordersComparison", label: "Comparación Métricas" },
  { key: "customerSegments", label: "Segmentación Clientes" },
  { key: "categoryPerformance", label: "Rendimiento Categorías" },
  { key: "channelAnalysis", label: "Análisis por Canal" },
  { key: "trafficStats", label: "Traffic Stats" },
]