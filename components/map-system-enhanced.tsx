"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Layers, TrendingUp, TrendingDown } from "lucide-react"
import { mockOrders, type Order } from "@/components/mock-data"

const InteractiveMap = ({
  orders,
  selectedStatus,
  selectedCity,
}: {
  orders: Order[]
  selectedStatus: string
  selectedCity: string
}) => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
  const [map, setMap] = useState<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)

  // Filtrar pedidos según los filtros seleccionados
  const filteredOrders = orders.filter((order) => {
    const statusMatch = selectedStatus === "all" || order.status === selectedStatus
    const cityMatch = selectedCity === "all" || order.location.city === selectedCity
    return statusMatch && cityMatch
  })

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet")

        // Configurar iconos por defecto
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        setLeaflet(L)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!mapContainer || !leaflet || map) return

    // Crear el mapa
    const newMap = leaflet.map(mapContainer, {
      zoomControl: true,
      attributionControl: true,
    }).setView([19.4326, -99.1332], 5)

    // Agregar capa de OpenStreetMap
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      })
      .addTo(newMap)

    // Asegurar que el contenedor del mapa tenga z-index bajo
    if (mapContainer) {
      mapContainer.style.zIndex = "10"
      const leafletContainer = mapContainer.querySelector('.leaflet-container')
      if (leafletContainer) {
        (leafletContainer as HTMLElement).style.zIndex = "10"
      }
    }

    setMap(newMap)

    return () => {
      newMap.remove()
    }
  }, [mapContainer, leaflet])

  useEffect(() => {
    if (!map || !leaflet) return

    // Limpiar marcadores existentes
    map.eachLayer((layer: any) => {
      if (layer instanceof leaflet.Marker) {
        map.removeLayer(layer)
      }
    })

    // Agregar marcadores para pedidos filtrados
    filteredOrders.forEach((order) => {
      const statusColor = order.status === "Completado" ? "green" : order.status === "Pendiente" ? "orange" : "blue"

      const customIcon = leaflet.divIcon({
        html: `<div style="background-color: ${statusColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: "custom-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = leaflet
        .marker([order.location.lat, order.location.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 12px 0; font-weight: bold; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              ${order.id}
              <span style="background: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 500;">${order.status}</span>
            </h3>
            
            <!-- Cliente Info -->
            <div style="background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="font-weight: 600; color: #1f2937;">${order.customer}</div>
              <div style="font-size: 12px; color: #6b7280;">${order.customerEmail}</div>
              <div style="display: flex; gap: 4px; margin-top: 4px;">
                <span style="background: #e0e7ff; color: #3730a3; padding: 1px 6px; border-radius: 8px; font-size: 10px;">${order.customerSegment}</span>
                <span style="background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 8px; font-size: 10px;">${order.priority}</span>
              </div>
            </div>

            <!-- Financial Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
              <div style="background: #ecfdf5; padding: 6px; border-radius: 4px; text-align: center;">
                <div style="font-weight: bold; color: #059669; font-size: 14px;">$${order.amount.toLocaleString()}</div>
                <div style="font-size: 10px; color: #6b7280;">Monto Total</div>
              </div>
              <div style="background: #fef7ff; padding: 6px; border-radius: 4px; text-align: center;">
                <div style="font-weight: bold; color: ${order.margin > 70 ? "#059669" : order.margin > 50 ? "#d97706" : "#dc2626"}; font-size: 14px;">${order.margin.toFixed(1)}%</div>
                <div style="font-size: 10px; color: #6b7280;">Margen</div>
              </div>
            </div>

            <!-- Additional Details -->
            <div style="display: grid; gap: 4px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <strong>Neto:</strong> 
                <span style="color: #059669;">$${order.netAmount.toLocaleString()}</span>
              </div>
              ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between;">
                <strong>Descuento:</strong> 
                <span style="color: #dc2626;">-${order.discount}%</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between;">
                <strong>Canal:</strong> 
                <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${order.channel}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>Categoría:</strong> 
                <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${order.category}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>Pago:</strong> 
                <span>${order.paymentMethod}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>Representante:</strong> 
                <span style="font-weight: 500;">${order.salesRep}</span>
              </div>
            </div>

            <!-- Products -->
            <div style="margin: 8px 0; padding: 6px; background: #f1f5f9; border-radius: 4px;">
              <strong style="font-size: 12px;">Productos:</strong><br>
              ${order.products
            .slice(0, 2)
            .map((product) => `<span style="font-size: 11px;">• ${product}</span>`)
            .join("<br>")}
              ${order.products.length > 2 ? `<br><em style="color: #6b7280; font-size: 10px;">+${order.products.length - 2} productos más</em>` : ""}
            </div>

            <!-- Dates & Notes -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; font-size: 11px; color: #6b7280;">
              <div><strong>Fecha pedido:</strong> ${order.date}</div>
              ${order.deliveryDate ? `<div><strong>Fecha entrega:</strong> ${order.deliveryDate}</div>` : ''}
              ${order.notes ? `<div style="margin-top: 4px; font-style: italic; color: #3730a3;">📝 ${order.notes}</div>` : ''}
              <div style="margin-top: 4px;"><strong>Dirección:</strong> ${order.address}</div>
            </div>
          </div>
        `)
    })

    // Ajustar vista si hay pedidos
    if (filteredOrders.length > 0) {
      const group = new leaflet.featureGroup(
        filteredOrders.map((order) => leaflet.marker([order.location.lat, order.location.lng])),
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [map, leaflet, filteredOrders])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div
        ref={setMapContainer}
        className="w-full h-96 rounded-lg border border-border"
        style={{ minHeight: "400px" }}
      />
    </>
  )
}

interface MapSystemProps {
  orders?: Order[]
}

export const MapSystemEnhanced = ({ orders = mockOrders }: MapSystemProps) => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedSegment, setSelectedSegment] = useState("all")

  // Obtener ciudades únicas
  const uniqueCities = Array.from(new Set(orders.map((order) => order.location.city)))
  const uniqueSegments = Array.from(new Set(orders.map((order) => order.customerSegment)))

  // Filtrar pedidos según todos los filtros
  const filteredOrders = orders.filter((order) => {
    const statusMatch = selectedStatus === "all" || order.status === selectedStatus
    const cityMatch = selectedCity === "all" || order.location.city === selectedCity
    const segmentMatch = selectedSegment === "all" || order.customerSegment === selectedSegment
    return statusMatch && cityMatch && segmentMatch
  })

  // Estadísticas de pedidos por estado
  const statusStats = {
    total: filteredOrders.length,
    completado: filteredOrders.filter((o) => o.status === "Completado").length,
    pendiente: filteredOrders.filter((o) => o.status === "Pendiente").length,
    proceso: filteredOrders.filter((o) => o.status === "En proceso").length,
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.amount, 0),
    avgMargin: filteredOrders.length > 0 ? filteredOrders.reduce((sum, order) => sum + order.margin, 0) / filteredOrders.length : 0,
  }

  // Estadísticas por segmento
  const segmentStats = uniqueSegments.map(segment => {
    const segmentOrders = filteredOrders.filter(o => o.customerSegment === segment)
    return {
      segment,
      count: segmentOrders.length,
      revenue: segmentOrders.reduce((sum, order) => sum + order.amount, 0),
      avgOrder: segmentOrders.length > 0 ? segmentOrders.reduce((sum, order) => sum + order.amount, 0) / segmentOrders.length : 0
    }
  })

  return (
    <Card className="relative z-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa de Pedidos Mejorado
            </CardTitle>
            <CardDescription>
              Ubicaciones geográficas con información detallada de pedidos •
              {filteredOrders.length} de {orders.length} pedidos mostrados
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En proceso">En proceso</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueSegments.map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{statusStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Pedidos</div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{statusStats.completado}</div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </div>
          <div className="text-center p-3 bg-orange-500/10 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{statusStats.pendiente}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{statusStats.proceso}</div>
            <div className="text-sm text-muted-foreground">En Proceso</div>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-lg font-bold text-purple-600">${statusStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Ingresos</div>
          </div>
        </div>

        {/* Estadísticas por segmento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {segmentStats.map((stat) => (
            <div key={stat.segment} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{stat.segment}</h4>
                <Badge variant="outline" className="text-xs">{stat.count} pedidos</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Ingresos:</span>
                  <span className="font-semibold">${stat.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Promedio:</span>
                  <span className="font-semibold">${stat.avgOrder.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda mejorada */}
        <div className="flex items-center justify-between text-sm bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>En Proceso</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Margen promedio:</span>
            <span className="font-semibold">{statusStats.avgMargin.toFixed(1)}%</span>
            {statusStats.avgMargin > 65 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Mapa */}
        <InteractiveMap orders={orders} selectedStatus={selectedStatus} selectedCity={selectedCity} />

        {/* Lista de pedidos filtrados mejorada */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center justify-between">
            <span>Pedidos mostrados en el mapa ({filteredOrders.length})</span>
            <Badge variant="secondary" className="text-xs">
              ${statusStats.totalRevenue.toLocaleString()} total
            </Badge>
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded text-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${order.status === "Completado"
                      ? "bg-green-500"
                      : order.status === "Pendiente"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                      }`}
                  ></div>
                  <div>
                    <div className="font-mono font-medium">{order.id}</div>
                    <div className="text-xs text-muted-foreground">{order.customer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">${order.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{order.margin.toFixed(1)}% margen</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {order.location.city}
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      {order.customerSegment}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}