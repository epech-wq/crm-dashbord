"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MetricsCard, RecentOrdersCard, ChartsCard, OrdersManagementCard, MapCard } from "@/components/cards"
import { defaultFilters, applyFilters, type FilterState } from "@/components/filters-system"
import { WidgetWrapper, filterDataByView, hideFinancialData } from "@/components/widget-wrapper"
import { mockOrders } from "@/components/mock-data"
import { viewConfigs, type UserView } from "@/types/views"

interface DashboardLayoutProps {
  initialView: UserView
}

// Simplified layout configurations for each view
const getLayoutForView = (view: UserView) => {
  switch (view) {
    case "direccion-general":
      return {
        name: "Dirección General",
        widgets: {
          metrics: { visible: true, position: 1, size: "large" as const, rowsPerPage: 5 },
          charts: { visible: true, position: 2, size: "medium" as const, rowsPerPage: 5 },
          recentOrders: { visible: false, position: 3, size: "large" as const, rowsPerPage: 5 },
          orders: { visible: false, position: 4, size: "large" as const, rowsPerPage: 10 },
          map: { visible: false, position: 5, size: "medium" as const, rowsPerPage: 5 },
        },
        visibleMetrics: [
          "totalRevenue", "totalOrders", "avgOrderValue", "conversionRate", "missingSales"
        ],
        visibleCharts: ["statistics", "estimatedRevenue", "salesCategory", "trafficStats"],
      }
    case "torre-control":
      return {
        name: "Torre de Control",
        widgets: {
          metrics: { visible: true, position: 1, size: "medium" as const, rowsPerPage: 8 },
          charts: { visible: false, position: 2, size: "small" as const, rowsPerPage: 8 },
          recentOrders: { visible: true, position: 3, size: "medium" as const, rowsPerPage: 8 },
          orders: { visible: true, position: 4, size: "large" as const, rowsPerPage: 15 },
          map: { visible: true, position: 5, size: "large" as const, rowsPerPage: 8 },
        },
        visibleMetrics: ["totalOrders", "activeCustomers", "avgOrderValue", "orderFulfillmentTime", "customerSatisfaction"],
        visibleCharts: ["salesTrend", "salesCategory", "ordersComparison", "customerSegments"],
      }
    case "vista-cliente":
      return {
        name: "Vista Cliente",
        widgets: {
          metrics: { visible: false, position: 1, size: "small" as const, rowsPerPage: 10 },
          charts: { visible: false, position: 2, size: "large" as const, rowsPerPage: 10 },
          recentOrders: { visible: true, position: 3, size: "large" as const, rowsPerPage: 10 },
          orders: { visible: false, position: 4, size: "small" as const, rowsPerPage: 8 },
          map: { visible: true, position: 5, size: "medium" as const, rowsPerPage: 10 },
        },
        visibleMetrics: ["totalOrders", "avgOrderValue", "orderFulfillmentTime"],
        visibleCharts: ["salesTrend", "salesCategory"],
      }
    default:
      return getLayoutForView("direccion-general")
  }
}

export default function DashboardLayout({ initialView }: DashboardLayoutProps) {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [currentView, setCurrentView] = useState<UserView>(initialView)
  const [mounted, setMounted] = useState(false)

  // Simulated user email for client view filtering
  const [userEmail] = useState("cliente@ejemplo.com")

  useEffect(() => {
    setMounted(true)
  }, [])

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





  const filteredOrders = applyFilters(mockOrders, filters)
  const viewFilteredOrders = filterDataByView(filteredOrders, currentView, userEmail)
  const shouldHideFinancials = hideFinancialData(currentView)
  const currentLayout = getLayoutForView(currentView)

  const sortedWidgets = Object.entries(currentLayout.widgets)
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
              visibleMetrics={currentLayout.visibleMetrics}
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
              visibleCharts={currentLayout.visibleCharts}
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
        dashboardName={currentLayout.name}
        currentView={currentView}
        onViewChange={handleViewChange}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <main className="p-8 space-y-6">
        {/* Dynamic Widget Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedWidgets.map(([widgetKey, widget]) => renderWidget(widgetKey, widget))}
        </div>
      </main>
    </div>
  )
}