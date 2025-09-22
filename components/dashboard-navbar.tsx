"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, Moon, Sun, Plus, Minus, Sliders } from "lucide-react"
import { useTheme } from "next-themes"
import { availableCharts } from "@/components/charts-system"
import { FiltersSystem, type FilterState } from "@/components/filters-system"
import { CustomizationSystem, type DashboardLayout } from "@/components/customization-system"
import { ViewSelector } from "@/components/view-selector"
import { viewConfigs, type UserView } from "@/types/views"

interface DashboardNavbarProps {
  // Layout and view state
  dashboardLayout: DashboardLayout
  currentView: UserView
  onViewChange: (view: UserView) => void

  // Filters state
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void

  // Layout controls
  onLayoutChange: (layout: DashboardLayout) => void

  // Widget controls
  onToggleWidget: (widget: keyof DashboardLayout["widgets"]) => void
  onToggleMetric: (metricKey: string) => void
  onToggleChart: (chartKey: string) => void

  // Quick control panel
  isQuickControlOpen: boolean
  onQuickControlOpenChange: (open: boolean) => void

  // Data for display
  viewFilteredOrdersLength: number
  totalOrdersLength: number
}

export const DashboardNavbar = ({
  dashboardLayout,
  currentView,
  onViewChange,
  filters,
  onFiltersChange,
  onLayoutChange,
  onToggleWidget,
  onToggleMetric,
  onToggleChart,
  isQuickControlOpen,
  onQuickControlOpenChange,
  viewFilteredOrdersLength,
  totalOrdersLength,
}: DashboardNavbarProps) => {
  const { theme, setTheme } = useTheme()
  const currentViewConfig = viewConfigs[currentView]

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

  const handleThemeToggle = () => {
    console.log("[v0] Current theme:", theme)
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log("[v0] Setting theme to:", newTheme)
    setTheme(newTheme)
    setTimeout(() => {
      console.log("[v0] Theme after change:", theme)
    }, 100)
  }

  return (
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
            onViewChange={onViewChange}
          />

          {/* Period Filter - Icon with period label */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Select
                value={filters.period}
                onValueChange={(value) => onFiltersChange({ ...filters, period: value })}
              >
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
          <FiltersSystem filters={filters} onFiltersChange={onFiltersChange} />

          {/* Quick Control Panel - New sidebar button */}
          <div className="relative">
            <Sheet open={isQuickControlOpen} onOpenChange={onQuickControlOpenChange}>
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
                    {dashboardLayout.description} • Vista: {currentViewConfig.name} • Mostrando {viewFilteredOrdersLength} de {totalOrdersLength} pedidos
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
                          onClick={() => onToggleWidget(key as keyof DashboardLayout["widgets"])}
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
                              onCheckedChange={() => onToggleMetric(metric.key)}
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
                              onCheckedChange={() => onToggleChart(chart.key)}
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
            <CustomizationSystem
              currentLayout={dashboardLayout}
              onLayoutChange={onLayoutChange}
            />
          </div>

          {/* Theme Toggle - Icon only */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-transparent"
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}