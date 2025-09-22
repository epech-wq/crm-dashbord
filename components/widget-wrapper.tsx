"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Eye, EyeOff } from "lucide-react"
import { viewConfigs, type UserView } from "@/types/views"

interface WidgetWrapperProps {
  children: ReactNode
  widgetType: string
  currentView: UserView
  title?: string
  description?: string
  requiresFinancials?: boolean
  requiresAnalytics?: boolean
  requiresAllOrders?: boolean
  className?: string
}

export const WidgetWrapper = ({
  children,
  widgetType,
  currentView,
  title,
  description,
  requiresFinancials = false,
  requiresAnalytics = false,
  requiresAllOrders = false,
  className = ""
}: WidgetWrapperProps) => {
  const viewConfig = viewConfigs[currentView]

  // Check if widget is allowed in current view
  const isWidgetAllowed = viewConfig.allowedWidgets.includes(widgetType)

  // Check permissions
  const hasFinancialAccess = !requiresFinancials || viewConfig.permissions.canViewFinancials
  const hasAnalyticsAccess = !requiresAnalytics || viewConfig.permissions.canViewAnalytics
  const hasAllOrdersAccess = !requiresAllOrders || viewConfig.permissions.canViewAllOrders

  const hasPermission = hasFinancialAccess && hasAnalyticsAccess && hasAllOrdersAccess

  // If widget is not allowed or no permission, don't render
  if (!isWidgetAllowed || !hasPermission) {
    return (
      <Card className={`${className} opacity-50`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4" />
            {title || "Widget Restringido"}
          </CardTitle>
          <CardDescription>
            {!isWidgetAllowed
              ? `Este widget no está disponible en la vista ${viewConfig.name}`
              : "No tienes permisos para ver este contenido"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <EyeOff className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Helper function to filter data based on view permissions
export const filterDataByView = (data: any[], currentView: UserView, userEmail?: string) => {
  const viewConfig = viewConfigs[currentView]

  if (currentView === "vista-cliente" && userEmail) {
    // For client view, only show orders for the current user
    return data.filter(item => item.customerEmail === userEmail)
  }

  if (!viewConfig.permissions.canViewAllOrders) {
    // Limit data if user can't view all orders
    return data.slice(0, 10)
  }

  return data
}

// Helper function to hide financial data based on permissions
export const hideFinancialData = (currentView: UserView) => {
  const viewConfig = viewConfigs[currentView]
  return !viewConfig.permissions.canViewFinancials
}