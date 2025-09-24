"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Eye, Users, Building, Shield, Package } from "lucide-react"
import { viewConfigs, type UserView } from "@/types/views"

interface ViewSelectorProps {
  currentView: UserView
  onViewChange?: (view: UserView) => void
  className?: string
}

export const ViewSelector = ({ currentView, onViewChange, className = "" }: ViewSelectorProps) => {
  const router = useRouter()
  const currentConfig = viewConfigs[currentView]

  const handleViewChange = (newView: UserView) => {
    // Use callback if provided, otherwise navigate directly
    if (onViewChange) {
      onViewChange(newView)
    } else {
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
        case "stock-productos":
          router.push("/stock-productos")
          break
        default:
          router.push("/")
      }
    }
  }

  const getViewIcon = (viewId: UserView) => {
    switch (viewId) {
      case "direccion-general":
        return <Building className="h-4 w-4" />
      case "torre-control":
        return <Shield className="h-4 w-4" />
      case "vista-cliente":
        return <Users className="h-4 w-4" />
      case "stock-productos":
        return <Package className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getViewColor = (viewId: UserView) => {
    switch (viewId) {
      case "direccion-general":
        return "bg-blue-500 hover:bg-blue-600"
      case "torre-control":
        return "bg-green-500 hover:bg-green-600"
      case "vista-cliente":
        return "bg-gray-500 hover:bg-gray-600"
      case "stock-productos":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-primary hover:bg-primary/90"
    }
  }

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${getViewColor(currentView)} text-white border-0 hover:text-white`}
          >
            {getViewIcon(currentView)}
            <span className="ml-2 hidden sm:inline">{currentConfig.name}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Cambiar Vista
              </h4>
            </div>

            <div className="space-y-3">
              {Object.values(viewConfigs).map((config) => (
                <div
                  key={config.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${currentView === config.id ? "border-primary bg-primary/5" : ""
                    }`}
                  onClick={() => handleViewChange(config.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getViewIcon(config.id)}
                      <h5 className="font-medium text-sm">{config.name}</h5>
                    </div>
                    {currentView === config.id && (
                      <Badge variant="default" className="text-xs">
                        Activa
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{config.description}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {config.allowedWidgets.map((widget) => (
                      <Badge key={widget} variant="secondary" className="text-xs">
                        {widget === "metrics" ? "Métricas" :
                          widget === "charts" ? "Gráficos" :
                            widget === "recentOrders" ? "Pedidos Recientes" :
                              widget === "orders" ? "Todos los Pedidos" :
                                widget === "map" ? "Mapa" : widget}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {config.permissions.canViewFinancials && (
                      <Badge variant="outline" className="text-xs">💰 Financiero</Badge>
                    )}
                    {config.permissions.canViewAnalytics && (
                      <Badge variant="outline" className="text-xs">📊 Analytics</Badge>
                    )}
                    {config.permissions.canEditOrders && (
                      <Badge variant="outline" className="text-xs">✏️ Editar</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <h6 className="text-xs font-medium mb-1">Vista Actual: {currentConfig.name}</h6>
              <p className="text-xs text-muted-foreground">{currentConfig.description}</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}