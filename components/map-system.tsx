"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Layers } from "lucide-react"
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
    const newMap = leaflet.map(mapContainer).setView([19.4326, -99.1332], 5)

    // Agregar capa de OpenStreetMap
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      })
      .addTo(newMap)

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
          <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 12px 0; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">${order.id}</h3>
            <div style="display: grid; gap: 6px;">
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Cliente:</strong> 
                <span>${order.customer}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Email:</strong> 
                <span style="font-size: 12px; color: #6b7280;">${order.customerEmail}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Monto:</strong> 
                <span style="font-weight: bold; color: #059669;">$${order.amount.toLocaleString()}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Margen:</strong> 
                <span style="color: ${order.margin > 70 ? "#059669" : order.margin > 50 ? "#d97706" : "#dc2626"};">${order.margin.toFixed(1)}%</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Estado:</strong> 
                <span style="color: ${statusColor}; font-weight: 500;">${order.status}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Canal:</strong> 
                <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${order.channel}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Categoría:</strong> 
                <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${order.category}</span>
              </p>
              <p style="margin: 0; display: flex; justify-content: space-between;">
                <strong>Representante:</strong> 
                <span>${order.salesRep}</span>
              </p>
              <p style="margin: 6px 0 0 0; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                <strong>Productos:</strong><br>
                ${order.products
                  .slice(0, 3)
                  .map((product) => `• ${product}`)
                  .join("<br>")}
                ${order.products.length > 3 ? `<br><em style="color: #6b7280; font-size: 12px;">+${order.products.length - 3} productos más</em>` : ""}
              </p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #6b7280;">
                <strong>Fecha:</strong> ${order.date}<br>
                <strong>Dirección:</strong> ${order.address}
              </p>
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

export const MapSystem = ({ orders = mockOrders }: MapSystemProps) => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [mapView, setMapView] = useState("satellite")

  // Obtener ciudades únicas
  const uniqueCities = Array.from(new Set(orders.map((order) => order.location.city)))

  // Estadísticas de pedidos por estado
  const statusStats = {
    total: orders.length,
    completado: orders.filter((o) => o.status === "Completado").length,
    pendiente: orders.filter((o) => o.status === "Pendiente").length,
    proceso: orders.filter((o) => o.status === "En proceso").length,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa de Pedidos
            </CardTitle>
            <CardDescription>Ubicaciones geográficas de los pedidos realizados</CardDescription>
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

            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-sm">
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

        {/* Mapa */}
        <InteractiveMap orders={orders} selectedStatus={selectedStatus} selectedCity={selectedCity} />

        {/* Lista de pedidos filtrados */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">
            Pedidos mostrados en el mapa (
            {
              orders.filter((order) => {
                const statusMatch = selectedStatus === "all" || order.status === selectedStatus
                const cityMatch = selectedCity === "all" || order.location.city === selectedCity
                return statusMatch && cityMatch
              }).length
            }
            )
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {orders
              .filter((order) => {
                const statusMatch = selectedStatus === "all" || order.status === selectedStatus
                const cityMatch = selectedCity === "all" || order.location.city === selectedCity
                return statusMatch && cityMatch
              })
              .map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        order.status === "Completado"
                          ? "bg-green-500"
                          : order.status === "Pendiente"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <span className="font-mono">{order.id}</span>
                    <span>{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {order.location.city}
                    </Badge>
                    <span className="font-semibold">${order.amount}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
