"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, Clock, Percent, Minus, Filter, Trash2 } from "lucide-react"
import { generateHistoricalData, mockOrders, type Order } from "@/components/mock-data"

export interface MetricData {
  current: number
  previous: number
  target?: number
  format: "currency" | "number" | "percentage"
}

export interface MetricsData {
  totalRevenue: MetricData
  totalOrders: MetricData
  activeCustomers: MetricData
  avgOrderValue: MetricData
  conversionRate: MetricData
  customerLifetimeValue: MetricData
  orderFulfillmentTime: MetricData
  customerSatisfaction: MetricData
}

export const generateMetricsData = (period: string): MetricsData => {
  const historicalData = generateHistoricalData(period)

  return {
    totalRevenue: {
      current: historicalData.current.totalRevenue,
      previous: historicalData.previous.totalRevenue,
      target: Math.round(historicalData.current.totalRevenue * 1.15), // Meta 15% superior
      format: "currency",
    },
    totalOrders: {
      current: historicalData.current.totalOrders,
      previous: historicalData.previous.totalOrders,
      target: Math.round(historicalData.current.totalOrders * 1.2), // Meta 20% superior
      format: "number",
    },
    activeCustomers: {
      current: historicalData.current.activeCustomers,
      previous: historicalData.previous.activeCustomers,
      target: Math.round(historicalData.current.activeCustomers * 1.25), // Meta 25% superior
      format: "number",
    },
    avgOrderValue: {
      current: historicalData.current.avgOrderValue,
      previous: historicalData.previous.avgOrderValue,
      target: Math.round(historicalData.current.avgOrderValue * 1.1), // Meta 10% superior
      format: "currency",
    },
    conversionRate: {
      current: historicalData.current.conversionRate,
      previous: historicalData.previous.conversionRate,
      target: Math.round(historicalData.current.conversionRate * 1.15 * 10) / 10, // Meta 15% superior
      format: "percentage",
    },
    customerLifetimeValue: {
      current: historicalData.current.customerLifetimeValue,
      previous: historicalData.previous.customerLifetimeValue,
      target: Math.round(historicalData.current.customerLifetimeValue * 1.2), // Meta 20% superior
      format: "currency",
    },
    orderFulfillmentTime: {
      current: historicalData.current.orderFulfillmentTime,
      previous: historicalData.previous.orderFulfillmentTime,
      target: Math.round(historicalData.current.orderFulfillmentTime * 0.85 * 10) / 10, // Meta 15% menor (mejor)
      format: "number",
    },
    customerSatisfaction: {
      current: historicalData.current.customerSatisfaction,
      previous: historicalData.previous.customerSatisfaction,
      target: Math.min(5.0, Math.round(historicalData.current.customerSatisfaction * 1.05 * 10) / 10), // Meta 5% superior, máximo 5.0
      format: "number",
    },
  }
}

export const formatMetricValue = (value: number, format: MetricData["format"]): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value)
    case "percentage":
      return `${value.toFixed(1)}%`
    case "number":
      if (value >= 1000) {
        return new Intl.NumberFormat("es-MX", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(value)
      }
      return value.toFixed(1)
    default:
      return value.toString()
  }
}

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const getMetricStatus = (
  current: number,
  target?: number,
  isLowerBetter = false,
): "success" | "warning" | "danger" | "neutral" => {
  if (!target) return "neutral"

  const percentage = (current / target) * 100

  if (isLowerBetter) {
    if (percentage <= 80) return "success"
    if (percentage <= 100) return "warning"
    return "danger"
  } else {
    if (percentage >= 100) return "success"
    if (percentage >= 80) return "warning"
    return "danger"
  }
}

interface MetricCardProps {
  title: string
  data: MetricData
  icon: React.ComponentType<{ className?: string }>
  period: string
  isLowerBetter?: boolean
}

export const MetricCard = ({ title, data, icon: Icon, period, isLowerBetter = false }: MetricCardProps) => {
  const change = calculatePercentageChange(data.current, data.previous)

  const getBadgeVariant = (change: number, isLowerBetter: boolean) => {
    if (change === 0) return { variant: "secondary" as const, className: "bg-gray-100 text-gray-600 hover:bg-gray-100" }

    if (isLowerBetter) {
      return change < 0
        ? { variant: "secondary" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" }
        : { variant: "secondary" as const, className: "bg-red-100 text-red-700 hover:bg-red-100" }
    } else {
      return change > 0
        ? { variant: "secondary" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" }
        : { variant: "secondary" as const, className: "bg-red-100 text-red-700 hover:bg-red-100" }
    }
  }

  const getPeriodText = (period: string) => {
    switch (period) {
      case "day":
        return "vs día anterior"
      case "week":
        return "vs semana anterior"
      case "month":
        return "vs mes anterior"
      case "year":
        return "vs año anterior"
      default:
        return "vs anterior"
    }
  }

  const badgeConfig = getBadgeVariant(change, isLowerBetter)

  return (
    <Card className="p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
          {formatMetricValue(data.current, data.format)}
        </div>
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="flex items-center gap-2 text-sm">
          <Badge
            variant={badgeConfig.variant}
            className={`text-xs font-medium ${badgeConfig.className}`}
          >
            {change > 0 ? "+" : ""}{change.toFixed(1)}%
          </Badge>
          <span className="text-muted-foreground">{getPeriodText(period)}</span>
        </div>
      </div>
    </Card>
  )
}

interface MetricsGridProps {
  period: string
  visibleMetrics: string[]
  hideFinancials?: boolean
}

export const MetricsGrid = ({ period, visibleMetrics, hideFinancials = false }: MetricsGridProps) => {
  const metricsData = generateMetricsData(period)

  const metricConfigs = [
    {
      key: "totalRevenue",
      title: "Ingresos Totales",
      data: metricsData.totalRevenue,
      icon: DollarSign,
    },
    {
      key: "totalOrders",
      title: "Pedidos Totales",
      data: metricsData.totalOrders,
      icon: ShoppingCart,
    },
    {
      key: "activeCustomers",
      title: "Clientes Activos",
      data: metricsData.activeCustomers,
      icon: Users,
    },
    {
      key: "avgOrderValue",
      title: "Valor Promedio Pedido",
      data: metricsData.avgOrderValue,
      icon: Target,
    },
    {
      key: "conversionRate",
      title: "Tasa de Conversión",
      data: metricsData.conversionRate,
      icon: Percent,
    },
    {
      key: "customerLifetimeValue",
      title: "Valor de Vida Cliente",
      data: metricsData.customerLifetimeValue,
      icon: TrendingUp,
    },
    {
      key: "orderFulfillmentTime",
      title: "Tiempo Entrega (días)",
      data: metricsData.orderFulfillmentTime,
      icon: Clock,
      isLowerBetter: true,
    },
    {
      key: "customerSatisfaction",
      title: "Satisfacción Cliente",
      data: metricsData.customerSatisfaction,
      icon: Target,
    },
  ]

  // Filter out financial metrics if hideFinancials is true
  const financialMetrics = ["totalRevenue", "avgOrderValue", "customerLifetimeValue"]

  const filteredMetrics = metricConfigs.filter((metric) => {
    const isVisible = visibleMetrics.includes(metric.key)
    const isFinancial = financialMetrics.includes(metric.key)
    return isVisible && (!hideFinancials || !isFinancial)
  })

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {filteredMetrics.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.title}
          data={metric.data}
          icon={metric.icon}
          period={period}
          isLowerBetter={metric.isLowerBetter}
        />
      ))}
    </div>
  )
}

// Recent Orders Table Component
interface RecentOrdersTableProps {
  orders?: Order[]
  showFilter?: boolean
  hideFinancials?: boolean
}

export const RecentOrdersTable = ({ orders = mockOrders.slice(0, 5), showFilter = true, hideFinancials = false }: RecentOrdersTableProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "En proceso":
        return "bg-blue-100 text-blue-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitialsColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600"
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pedidos Recientes</CardTitle>
          <div className="flex items-center gap-2">
            {showFilter && (
              <Button variant="outline" size="sm" className="h-8 px-3">
                <Filter className="h-4 w-4 mr-1" />
                Filtrar
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
              Ver todos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                  <Checkbox className="mr-3" />
                  ID Pedido
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Producto/Servicio</th>
                {!hideFinancials && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Valor Pedido</th>
                )}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fecha Cierre</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Acción</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Checkbox className="mr-3" />
                      <span className="font-medium text-sm">{order.id.replace('#ORD-', 'DE124')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${getInitialsColor(order.customer)}`}>
                        {getInitials(order.customer)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{order.customer}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">{order.products[0]}</div>
                  </td>
                  {!hideFinancials && (
                    <td className="py-4 px-4">
                      <div className="font-medium text-sm">${order.amount.toLocaleString()}</div>
                    </td>
                  )}
                  <td className="py-4 px-4">
                    <div className="text-sm">{order.date}</div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={`text-xs font-medium ${getStatusColor(order.status)}`} variant="secondary">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
