"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Check, Eye, Edit } from "lucide-react"
import { type Order } from "@/components/mock-data"
import { viewConfigs, type UserView } from "@/types/views"

interface OrdersManagementCardProps {
  orders: Order[]
  currentView: UserView
  hideFinancials?: boolean
}

export const OrdersManagementCard = ({
  orders,
  currentView,
  hideFinancials = false
}: OrdersManagementCardProps) => {
  const currentViewConfig = viewConfigs[currentView]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Pedidos Filtrados ({orders.length})
          <Badge variant="outline" className="ml-2 text-sm">
            {currentViewConfig.name}
          </Badge>
        </CardTitle>
        <CardDescription className="text-base">
          Pedidos que coinciden con los filtros aplicados
          {!hideFinancials && (
            <>
              • Total: ${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
              • Margen promedio: {orders.length > 0 ? (orders.reduce((sum, order) => sum + order.margin, 0) / orders.length).toFixed(1) : 0}%
            </>
          )}
        </CardDescription>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {orders.filter(o => o.status === "Completado").length}
            </div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "Pendiente").length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === "En proceso").length}
            </div>
            <div className="text-sm text-muted-foreground">En Proceso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.status === "Cancelado").length}
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
                {!hideFinancials && (
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
              {orders.map((order) => (
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
                  {!hideFinancials && (
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
                      {!hideFinancials && (
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
  )
}