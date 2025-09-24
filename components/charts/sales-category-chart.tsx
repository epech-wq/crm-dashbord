"use client"

import { useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrders } from "@/components/mock-data"

interface SalesCategoryChartProps {
  data: any
  hideFinancials?: boolean
}

type AggregationType = "vista-cliente" | "tipo-producto" | "lugar-ventas" | "marca"

export const SalesCategoryChart = ({ data, hideFinancials = false }: SalesCategoryChartProps) => {
  const [selectedAggregation, setSelectedAggregation] = useState<AggregationType>("vista-cliente")

  const getAggregatedData = (aggregationType: AggregationType) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]

    switch (aggregationType) {
      case "vista-cliente":
        return mockOrders.reduce((acc: any[], order) => {
          const existing = acc.find(item => item.name === order.customerSegment)
          if (existing) {
            existing.ventas += order.amount
            existing.pedidos += 1
          } else {
            acc.push({
              name: order.customerSegment,
              ventas: order.amount,
              pedidos: 1,
              color: colors[acc.length % colors.length]
            })
          }
          return acc
        }, [])

      case "tipo-producto":
        return mockOrders.reduce((acc: any[], order) => {
          const existing = acc.find(item => item.name === order.category)
          if (existing) {
            existing.ventas += order.amount
            existing.pedidos += 1
          } else {
            acc.push({
              name: order.category,
              ventas: order.amount,
              pedidos: 1,
              color: colors[acc.length % colors.length]
            })
          }
          return acc
        }, [])

      case "lugar-ventas":
        return mockOrders.reduce((acc: any[], order) => {
          const location = `${order.location.city}, ${order.location.state}`
          const existing = acc.find(item => item.name === location)
          if (existing) {
            existing.ventas += order.amount
            existing.pedidos += 1
          } else {
            acc.push({
              name: location,
              ventas: order.amount,
              pedidos: 1,
              color: colors[acc.length % colors.length]
            })
          }
          return acc
        }, [])

      case "marca":
        return mockOrders.reduce((acc: any[], order) => {
          const existing = acc.find(item => item.name === order.channel)
          if (existing) {
            existing.ventas += order.amount
            existing.pedidos += 1
          } else {
            acc.push({
              name: order.channel,
              ventas: order.amount,
              pedidos: 1,
              color: colors[acc.length % colors.length]
            })
          }
          return acc
        }, [])

      default:
        return []
    }
  }

  const chartData = getAggregatedData(selectedAggregation)
  const totalVentas = chartData.reduce((sum, item) => sum + item.ventas, 0)

  const aggregationLabels = {
    "vista-cliente": "Vista Cliente",
    "tipo-producto": "Tipo Producto",
    "lugar-ventas": "Lugar Ventas",
    "marca": "Canal/Marca"
  }

  return (
    <div>
      {/* Filter selector */}
      <div className="mb-4">
        <Select value={selectedAggregation} onValueChange={(value: AggregationType) => setSelectedAggregation(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar agrupación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vista-cliente">Vista Cliente</SelectItem>
            <SelectItem value="tipo-producto">Tipo Producto</SelectItem>
            <SelectItem value="lugar-ventas">Lugar Ventas</SelectItem>
            <SelectItem value="marca">Canal/Marca</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {hideFinancials ? chartData.reduce((sum, item) => sum + item.pedidos, 0) : `$${(totalVentas / 1000).toFixed(0)}K`}
          </div>
          <div className="text-xs text-muted-foreground">
            {hideFinancials ? "Total Pedidos" : "Total Ventas"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{chartData.length}</div>
          <div className="text-xs text-muted-foreground">Categorías</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {hideFinancials ?
              Math.round(chartData.reduce((sum, item) => sum + item.pedidos, 0) / chartData.length) :
              `$${Math.round(totalVentas / chartData.length / 1000)}K`
            }
          </div>
          <div className="text-xs text-muted-foreground">Promedio</div>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => hideFinancials ? value.toString() : `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              hideFinancials ? value : `$${value.toLocaleString()}`,
              name === "ventas" ? (hideFinancials ? "Pedidos" : "Ventas") : "Pedidos"
            ]}
            labelFormatter={(label) => `${aggregationLabels[selectedAggregation]}: ${label}`}
          />
          <Bar
            dataKey={hideFinancials ? "pedidos" : "ventas"}
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4">
        <div className="text-xs text-muted-foreground mb-2">
          Agrupado por: {aggregationLabels[selectedAggregation]}
        </div>
        <div className="flex flex-wrap gap-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}