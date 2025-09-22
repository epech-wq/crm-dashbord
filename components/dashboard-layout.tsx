"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { useTheme } from "next-themes"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MetricsCard, RecentOrdersCard, ChartsCard, OrdersManagementCard, MapCard } from "@/components/cards"
import { FiltersSystem, defaultFilters, applyFilters, type FilterState } from "@/components/filters-system"
import {
  defaultLayouts,
  getLayoutStyles,
  type DashboardLayout,
} from "@/components/customization-system"
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
            <MetricsCard
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
            <RecentOrdersCard
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
            <ChartsCard
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
            <OrdersManagementCard
              orders={viewFilteredOrders}
              currentView={currentView}
              hideFinancials={shouldHideFinancials}
            />
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
            <MapCard orders={viewFilteredOrders} />
          </WidgetWrapper>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar
        dashboardLayout={dashboardLayout}
        currentView={currentView}
        onViewChange={handleViewChange}
        filters={filters}
        onFiltersChange={setFilters}
        onLayoutChange={setDashboardLayout}
        onToggleWidget={toggleWidget}
        onToggleMetric={toggleMetric}
        onToggleChart={toggleChart}
        isQuickControlOpen={isQuickControlOpen}
        onQuickControlOpenChange={setIsQuickControlOpen}
        viewFilteredOrdersLength={viewFilteredOrders.length}
        totalOrdersLength={mockOrders.length}
      />

      <main className={`p-8 ${layoutStyles.spacing}`} style={{ filter: layoutStyles.colorFilter }}>
        {/* Dynamic Widget Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedWidgets.map(([widgetKey, widget]) => renderWidget(widgetKey, widget))}
        </div>
      </main>
    </div>
  )
}