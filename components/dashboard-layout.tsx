"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Calendar, Moon, Sun, Plus, Minus, Sliders, Check, Eye, Edit } from "lucide-react"
import { useTheme } from "next-themes"
import { MetricsGrid, RecentOrdersTable } from "@/components/metrics-system"
import { ChartsGrid, availableCharts } from "@/components/charts-system"
import { MapSystemEnhanced } from "@/components/map-system-enhanced"
import { FiltersSystem, defaultFilters, applyFilters, type FilterState } from "@/components/filters-system"
import {
  CustomizationSystem,
  defaultLayouts,
  getLayoutStyles,
  type DashboardLayout,
} from "@/components/customization-system"
import { ViewSelector } from "@/components/view-selector"
import { WidgetWrapper, filterDataByView, hideFinancialData } from "@/components/widget-wrapper"
import { mockOrders } from "@/components/mock-data"
import { viewConfigs, type UserView } from "@/types/views"

interface DashboardLayoutProps {
  initialView: UserView
}

export default function DashboardLayout({ initialView }: DashboardLayoutProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [currentView, setCurrentView] = useState<UserView>(initialView)
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>(defaultLayouts[0])
  const [mounted, setMounted] = useState(false)
  const [isQuickControlOpen, setIsQuickControlOpen] = useState(false)

  // Simulated user email for client view filtering
  const [userEmail] = useState("cliente@ejemplo.com")

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update layout when view changes
  useEffect(() => {
    const viewConfig = viewConfigs[currentView]
    const newLayout = defaultLayouts.find(layout => layout.id === viewConfig.defaultLayout) || defaultLayouts[0]
    setDashboardLayout(newLayout)
  }, [currentView])

  // Handle view changes with navigation
  const handleViewChange = (newView: UserView) => {
    setCurrentView(newView)

    // Navigate to the appropriate route
    switch (newView) {
      case "direccion-general":
        router.push("/direccion-general")
        break
      case "torre-control":
        router.push("/torre-control")
        break
      case "vista-cliente":
        router.push("/vista-cliente")
        break
      default:
        router.push("/")
    }
  }

  if (!mounted) {
    return null
  }

  const toggleWidget = (widget: keyof DashboardLayout["widgets"]) => {
    setDashboardLayout((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widget]: {
          ...prev.widgets[widget],
          visible: !prev.widgets[widget].visible,
        },
      },
    }))
  }

  const toggleMetric = (metricKey: string) => {
    setDashboardLayout((prev) => ({
      ...prev,
      visibleMetrics: prev.visibleMetrics.includes(metricKey)
        ? prev.visibleMetrics.filter((key) => key !== metricKey)
        : [...prev.visibleMetrics, metricKey],
    }))
  }

  const toggleChart = (chartKey: string) => {
    setDashboardLayout((prev) => ({
      ...prev,
      visibleCharts: prev.visibleCharts.includes(chartKey)
        ? prev.visibleCharts.filter((key) => key !== chartKey)
        : [...prev.visibleCharts, chartKey],
    }))
  }

  const availableMetrics = [
    { key: "totalRevenue", label: "Ingresos Totales" },
    { key: "totalOrders", label: "Pedidos Totales" },
    { key: "activeCustomers", label: "Clientes Activos" },
    { key: "avgOrderValue", label: "Valor Promedio" },
    { key: "conversionRate", label: "Tasa Conversión" },
    { key: "customerLifetimeValue", label: "Valor de Vida" },
    { key: "orderFulfillmentTime", label: "Tiempo Entrega" },
    { key: "customerSatisfaction", label: "Satisfacción" },
  ]

  const filteredOrders = applyFilters(mockOrders, filters)
  const viewFilteredOrders = filterDataByView(filteredOrders, currentView, userEmail)
  const shouldHideFinancials = hideFinancialData(currentView)
  const layoutStyles = getLayoutStyles(dashboardLayout)
  const currentViewConfig = viewConfigs[currentView]

  const sortedWidgets = Object.entries(dashboardLayout.widgets)
    .filter(([_, widget]) => widget.visible)
    .sort(([_, a], [__, b]) => a.position - b.position)

  const renderWidget = (widgetKey: string, widget: any) => {
    const sizeClasses: Record<string, string> = {
      small: "col-span-1",
      medium: "col-span-2",
      large: "col-span-full",
    }

    switch (widgetKey) {
      case "metrics":
        return (
          <WidgetWrapper
            key={widgetKey}
            widgetType="metrics"
            currentView={currentView}
            title="Métricas del Sistema"
            requiresAnalytics={true}
            className={sizeClasses[widget.size]}
          >
            <MetricsGrid
              period={filters.period}
              visibleMetrics={dashboardLayout.visibleMetrics}
              hideFinancials={shouldHideFinancials}
            />
          </WidgetWrapper>
        )
      case "recentOrders":
        return (
          <WidgetWrapper
            key={widgetKey}
            widgetType="recentOrders"
            currentView={currentView}
            title="Pedidos Recientes"
            className={sizeClasses[widget.size]}
          >
            <RecentOrdersTable
              orders={viewFilteredOrders.slice(0, widget.rowsPerPage)}
              hideFinancials={shouldHideFinancials}
            />
          </WidgetWrapper>
        )
      case "charts":
        return (
          <WidgetWrapper
            key={widgetKey}
            widgetType="charts"
            currentView={currentView}
            title="Gráficos y Analytics"
            requiresAnalytics={true}
            className={sizeClasses[widget.size]}
          >
            <ChartsGrid
              period={filters.period}
              visibleCharts={dashboardLayout.visibleCharts}
              hideFinancials={shouldHideFinancials}
            />
          </WidgetWrapper>
        )
      case "orders":
        return (
          <WidgetWrapper
            key={widgetKey}
            widgetType="orders"
            currentView={currentView}
            title="Gestión de Pedidos"
            requiresAllOrders={true}
            className="col-span-full"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Pedidos Filtrados ({viewFilteredOrders.length})
                  <Badge variant="outline" className="ml-2 text-sm">
                    {currentViewConfig.name}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  Pedidos que coinciden con los filtros aplicados
                  {!shouldHideFinancials && (
                    <>
                      • Total: ${viewFilteredOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                      • Margen promedio: {viewFilteredOrders.length > 0 ? (viewFilteredOrders.reduce((sum, order) => sum + order.margin, 0) / viewFilteredOrders.length).toFixed(1) : 0}%
                    </>
                  )}
                </CardDescription>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {viewFilteredOrders.filter(o => o.status === "Completado").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {viewFilteredOrders.filter(o => o.status === "Pendiente").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {viewFilteredOrders.filter(o => o.status === "En proceso").length}
                    </div>
                    <div className="text-sm text-muted-foreground">En Proceso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {viewFilteredOrders.filter(o => o.status === "Cancelado").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Cancelados</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-muted">
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">ID Pedido</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Cliente</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Productos</th>
                        {!shouldHideFinancials && (
                          <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Financiero</th>
                        )}
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Estado</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Detalles</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Entrega</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Ubicación</th>
                        <th className="text-left p-3 font-semibold text-sm text-muted-foreground uppercase tracking-wide">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewFilteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div>
                              <div className="font-mono text-sm font-medium">{order.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {Math.floor((new Date().getTime() - new Date(order.date).getTime()) / (1000 * 60 * 60 * 24))} días
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-semibold text-sm">{order.customer}</div>
                              <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {order.customerSegment}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm space-y-1">
                              {order.products.slice(0, 2).map((product: string, idx: number) => (
                                <div key={idx} className="truncate max-w-32 bg-muted px-2 py-1 rounded font-medium text-xs">
                                  {product}
                                </div>
                              ))}
                              {order.products.length > 2 && (
                                <div className="text-xs text-muted-foreground font-medium">+{order.products.length - 2} más</div>
                              )}
                              <Badge variant="secondary" className="text-xs mt-1">
                                {order.category}
                              </Badge>
                            </div>
                          </td>
                          {!shouldHideFinancials && (
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="font-bold text-base">${order.amount.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">
                                  Neto: ${order.netAmount.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={order.margin > 70 ? "default" : order.margin > 50 ? "secondary" : "outline"}
                                    className="text-xs font-semibold"
                                  >
                                    {order.margin.toFixed(1)}%
                                  </Badge>
                                  {order.discount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      -{order.discount}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="p-3">
                            <div className="space-y-1">
                              <Badge
                                variant={
                                  order.status === "Completado"
                                    ? "default"
                                    : order.status === "Pendiente"
                                      ? "secondary"
                                      : order.status === "En proceso"
                                        ? "outline"
                                        : "destructive"
                                }
                                className="font-medium"
                              >
                                {order.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {order.paymentMethod}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs font-medium">
                                  {order.channel}
                                </Badge>
                                <Badge
                                  variant={
                                    order.priority === "Alta" ? "destructive" :
                                      order.priority === "Media" ? "secondary" : "outline"
                                  }
                                  className="text-xs font-medium"
                                >
                                  {order.priority}
                                </Badge>
                              </div>
                              <div className="text-xs font-medium">{order.salesRep}</div>
                              {!shouldHideFinancials && (
                                <div className="text-xs text-muted-foreground">
                                  ${(order.amount * order.margin / 100).toLocaleString()} ganancia
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{order.date}</div>
                              {order.deliveryDate && (
                                <div className="text-xs text-muted-foreground">
                                  Entrega: {order.deliveryDate}
                                </div>
                              )}
                              {order.notes && (
                                <div className="text-xs text-blue-600 truncate max-w-32" title={order.notes}>
                                  📝 {order.notes}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="flex items-center text-sm font-medium">
                                <MapPin className="h-3 w-3 mr-1" />
                                {order.location.city}
                              </div>
                              <div className="text-xs text-muted-foreground">{order.location.state}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-32">
                                {order.address}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver detalles">
                                <Eye />
                              </Button>
                              {currentViewConfig.permissions.canEditOrders && (
                                <>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Editar">
                                    <Edit />
                                  </Button>
                                  {order.status === "Pendiente" && (
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Aprobar">
                                      <Check />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </WidgetWrapper>
        )
      case "map":
        return (
          <WidgetWrapper
            key={widgetKey}
            widgetType="map"
            currentView={currentView}
            title="Mapa de Pedidos"
            className={sizeClasses[widget.size]}
          >
            <MapSystemEnhanced orders={viewFilteredOrders} />
          </WidgetWrapper>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex h-18 items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-foreground">{dashboardLayout.name}</h1>
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
              {currentViewConfig.name}
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Selector */}
            <ViewSelector
              currentView={currentView}
              onViewChange={handleViewChange}
            />
            {/* Period Filter - Icon with period label */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Select value={filters.period} onValueChange={(value) => setFilters({ ...filters, period: value })}>
                  <SelectTrigger className="w-10 h-10 p-0">
                    <Calendar className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Día</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mes</SelectItem>
                    <SelectItem value="year">Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-sm font-medium">
                {filters.period === "day" ? "Hoy" :
                  filters.period === "week" ? "Esta semana" :
                    filters.period === "month" ? "Este mes" :
                      filters.period === "year" ? "Este año" : "Personalizado"}
              </Badge>
            </div>

            {/* Advanced Filters - Icon only */}
            <FiltersSystem filters={filters} onFiltersChange={setFilters} />

            {/* Quick Control Panel - New sidebar button */}
            <div className="relative">
              <Sheet open={isQuickControlOpen} onOpenChange={setIsQuickControlOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                    <Sliders className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-96">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Sliders className="h-5 w-5" />
                      Panel de Control Rápido
                    </SheetTitle>
                    <SheetDescription>
                      {dashboardLayout.description} • Vista: {currentViewConfig.name} • Mostrando {viewFilteredOrders.length} de {mockOrders.length} pedidos
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 p-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Secciones Visibles</h4>
                      <div className="space-y-2">
                        {Object.entries(dashboardLayout.widgets).map(([key, widget]) => (
                          <Button
                            key={key}
                            variant={widget.visible ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleWidget(key as keyof DashboardLayout["widgets"])}
                            className="w-full justify-start"
                          >
                            {widget.visible ? <Minus className="mr-2 h-3 w-3" /> : <Plus className="mr-2 h-3 w-3" />}
                            {key === "metrics"
                              ? "Métricas"
                              : key === "recentOrders"
                                ? "Pedidos Recientes"
                                : key === "charts"
                                  ? "Gráficos"
                                  : key === "orders"
                                    ? "Pedidos"
                                    : "Mapa"}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {dashboardLayout.widgets.metrics.visible && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">Métricas Visibles</h4>
                        <div className="space-y-2">
                          {availableMetrics.map((metric) => (
                            <div key={metric.key} className="flex items-center space-x-2">
                              <Checkbox
                                id={metric.key}
                                checked={dashboardLayout.visibleMetrics.includes(metric.key)}
                                onCheckedChange={() => toggleMetric(metric.key)}
                              />
                              <label
                                htmlFor={metric.key}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {metric.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {dashboardLayout.widgets.charts.visible && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">Gráficos Visibles</h4>
                        <div className="space-y-2">
                          {availableCharts.map((chart) => (
                            <div key={chart.key} className="flex items-center space-x-2">
                              <Checkbox
                                id={chart.key}
                                checked={dashboardLayout.visibleCharts.includes(chart.key)}
                                onCheckedChange={() => toggleChart(chart.key)}
                              />
                              <label
                                htmlFor={chart.key}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {chart.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Customization - Icon only */}
            <div className="relative">
              <CustomizationSystem currentLayout={dashboardLayout} onLayoutChange={setDashboardLayout} />
            </div>

            {/* Theme Toggle - Icon only */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-transparent"
                onClick={() => {
                  console.log("[v0] Current theme:", theme)
                  const newTheme = theme === "dark" ? "light" : "dark"
                  console.log("[v0] Setting theme to:", newTheme)
                  setTheme(newTheme)
                  setTimeout(() => {
                    console.log("[v0] Theme after change:", theme)
                  }, 100)
                }}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={`p-8 ${layoutStyles.spacing}`} style={{ filter: layoutStyles.colorFilter }}>
        {/* Dynamic Widget Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedWidgets.map(([widgetKey, widget]) => renderWidget(widgetKey, widget))}
        </div>
      </main>
    </div>
  )
}