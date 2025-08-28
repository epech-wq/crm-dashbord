"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, Clock, Percent, Minus } from "lucide-react"
import { generateHistoricalData } from "@/components/mock-data"

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
  const status = getMetricStatus(data.current, data.target, isLowerBetter)

  const periodLabels = {
    day: "vs ayer",
    week: "vs semana anterior",
    month: "vs mes anterior",
    year: "vs año anterior",
  }

  const getTrendColor = (change: number, isLowerBetter: boolean) => {
    if (change === 0) return "text-muted-foreground"

    if (isLowerBetter) {
      return change < 0 ? "text-green-600" : "text-red-500"
    } else {
      return change > 0 ? "text-green-600" : "text-red-500"
    }
  }

  const getValueColor = (change: number, isLowerBetter: boolean) => {
    if (change === 0) return "text-foreground"

    if (isLowerBetter) {
      return change < 0 ? "text-green-600" : "text-red-500"
    } else {
      return change > 0 ? "text-green-600" : "text-red-500"
    }
  }

  const getTrendIcon = (change: number, isLowerBetter: boolean) => {
    if (change === 0) {
      return <Minus className="mr-1 h-4 w-4 text-muted-foreground" />
    }

    if (isLowerBetter) {
      return change < 0 ? (
        <TrendingDown className="mr-1 h-4 w-4 text-green-600" />
      ) : (
        <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
      )
    } else {
      return change > 0 ? (
        <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
      )
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {data.target && (
            <Badge
              variant={status === "success" ? "default" : status === "warning" ? "secondary" : "destructive"}
              className="text-xs font-medium"
            >
              {status === "success" ? "✓ Meta" : status === "warning" ? "⚠ Cerca" : "✗ Bajo"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-3xl font-bold ${getValueColor(change, isLowerBetter)}`}>
          {formatMetricValue(data.current, data.format)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getTrendIcon(change, isLowerBetter)}
              <span className={`text-lg font-bold ${getTrendColor(change, isLowerBetter)}`}>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              <div className="text-sm ml-1 text-muted-foreground">{periodLabels[period as keyof typeof periodLabels]}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">Anterior</div>
              <div className="text-base font-semibold">{formatMetricValue(data.previous, data.format)}</div>
            </div>
          </div>
        </div>

        {data.target && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Meta:</span>
              <span className="text-sm font-medium">{formatMetricValue(data.target, data.format)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${status === "success" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                style={{
                  width: `${Math.min(100, Math.max(5, (data.current / data.target) * 100))}%`,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {((data.current / data.target) * 100).toFixed(0)}% de la meta
            </div>
          </div>
        )}


      </CardContent>
    </Card>
  )
}

interface MetricsGridProps {
  period: string
  visibleMetrics: string[]
}

export const MetricsGrid = ({ period, visibleMetrics }: MetricsGridProps) => {
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

  const filteredMetrics = metricConfigs.filter((metric) => visibleMetrics.includes(metric.key))

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
