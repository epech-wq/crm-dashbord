"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Palette, Layout, Download, Upload, RotateCcw, Grid3X3 } from "lucide-react"

export interface DashboardLayout {
  id: string
  name: string
  description: string
  widgets: {
    metrics: {
      visible: boolean
      position: number
      size: "small" | "medium" | "large"
      columns: number
    }
    recentOrders: {
      visible: boolean
      position: number
      size: "small" | "medium" | "large"
      rowsPerPage: number
    }
    charts: {
      visible: boolean
      position: number
      size: "small" | "medium" | "large"
      layout: "grid" | "stack"
    }
    orders: {
      visible: boolean
      position: number
      size: "small" | "medium" | "large"
      rowsPerPage: number
    }
    map: {
      visible: boolean
      position: number
      size: "small" | "medium" | "large"
      height: number
    }
  }
  theme: {
    colorScheme: "default" | "blue" | "green" | "purple" | "orange"
    density: "compact" | "comfortable" | "spacious"
    borderRadius: number
    showBorders: boolean
  }
  visibleMetrics: string[]
  visibleCharts: string[]
}

export const defaultLayouts: DashboardLayout[] = [
  {
    id: "executive",
    name: "Dashboard",
    description: "Dashboard enfocado en métricas clave y resúmenes de alto nivel",
    widgets: {
      metrics: { visible: true, position: 1, size: "large", columns: 4 },
      charts: { visible: true, position: 2, size: "medium", layout: "grid" },
      recentOrders: { visible: true, position: 3, size: "large", rowsPerPage: 5 },
      orders: { visible: true, position: 4, size: "large", rowsPerPage: 10 },
      map: { visible: true, position: 5, size: "medium", height: 300 },
    },
    theme: {
      colorScheme: "blue",
      density: "comfortable",
      borderRadius: 8,
      showBorders: true,
    },
    visibleMetrics: [
      "totalRevenue",
      "totalOrders",
      "activeCustomers",
      "avgOrderValue",
      "conversionRate",
      "customerLifetimeValue",
      "orderFulfillmentTime",
      "customerSatisfaction"
    ],
    visibleCharts: [
      "statistics",
      "estimatedRevenue",
      "salesCategory",
      "upcomingSchedule",
      "trafficStats"
    ],
  },
  {
    id: "operational",
    name: "Vista Operacional",
    description: "Dashboard detallado para operaciones diarias y seguimiento de pedidos",
    widgets: {
      metrics: { visible: true, position: 1, size: "medium", columns: 6 },
      charts: { visible: true, position: 2, size: "small", layout: "stack" },
      recentOrders: { visible: true, position: 3, size: "medium", rowsPerPage: 8 },
      orders: { visible: true, position: 4, size: "large", rowsPerPage: 15 },
      map: { visible: true, position: 5, size: "large", height: 500 },
    },
    theme: {
      colorScheme: "green",
      density: "compact",
      borderRadius: 4,
      showBorders: false,
    },
    visibleMetrics: [
      "totalRevenue",
      "totalOrders",
      "activeCustomers",
      "avgOrderValue",
      "conversionRate",
      "customerLifetimeValue",
      "orderFulfillmentTime",
      "customerSatisfaction",
    ],
    visibleCharts: [
      "salesTrend",
      "salesCategory",
      "ordersComparison",
      "customerSegments",
      "categoryPerformance",
      "channelAnalysis"
    ],
  },
  {
    id: "analytics",
    name: "Vista Analítica",
    description: "Dashboard centrado en análisis profundo y visualizaciones avanzadas",
    widgets: {
      metrics: { visible: true, position: 1, size: "small", columns: 8 },
      charts: { visible: true, position: 2, size: "large", layout: "grid" },
      recentOrders: { visible: true, position: 3, size: "medium", rowsPerPage: 6 },
      orders: { visible: true, position: 4, size: "small", rowsPerPage: 8 },
      map: { visible: true, position: 5, size: "medium", height: 400 },
    },
    theme: {
      colorScheme: "purple",
      density: "spacious",
      borderRadius: 12,
      showBorders: true,
    },
    visibleMetrics: [
      "totalRevenue",
      "conversionRate",
      "customerLifetimeValue",
      "avgOrderValue",
      "customerSatisfaction",
      "orderFulfillmentTime",
      "activeCustomers",
      "totalOrders",
    ],
    visibleCharts: [
      "salesTrend",
      "salesCategory",
      "ordersComparison",
      "customerSegments",
      "categoryPerformance",
      "channelAnalysis",
    ],
  },
]

interface CustomizationSystemProps {
  currentLayout: DashboardLayout
  onLayoutChange: (layout: DashboardLayout) => void
  className?: string
}

export const CustomizationSystem = ({ currentLayout, onLayoutChange, className = "" }: CustomizationSystemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"layout" | "theme" | "presets">("layout")

  const updateWidget = (widgetKey: keyof DashboardLayout["widgets"], updates: Partial<any>) => {
    onLayoutChange({
      ...currentLayout,
      widgets: {
        ...currentLayout.widgets,
        [widgetKey]: {
          ...currentLayout.widgets[widgetKey],
          ...updates,
        },
      },
    })
  }

  const updateTheme = (updates: Partial<DashboardLayout["theme"]>) => {
    onLayoutChange({
      ...currentLayout,
      theme: {
        ...currentLayout.theme,
        ...updates,
      },
    })
  }

  const applyPreset = (preset: DashboardLayout) => {
    onLayoutChange({
      ...preset,
      id: currentLayout.id, // Mantener el ID actual
    })
  }

  const exportLayout = () => {
    const dataStr = JSON.stringify(currentLayout, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `dashboard-layout-${currentLayout.name.toLowerCase().replace(/\s+/g, "-")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedLayout = JSON.parse(e.target?.result as string)
          onLayoutChange(importedLayout)
        } catch (error) {
          console.error("Error importing layout:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefault = () => {
    applyPreset(defaultLayouts[0])
  }

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Personalización</h4>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                ×
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-4 bg-muted p-1 rounded-lg">
              <Button
                variant={activeTab === "layout" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("layout")}
                className="flex-1"
              >
                <Layout className="h-3 w-3 mr-1" />
                Layout
              </Button>
              <Button
                variant={activeTab === "theme" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("theme")}
                className="flex-1"
              >
                <Palette className="h-3 w-3 mr-1" />
                Tema
              </Button>
              <Button
                variant={activeTab === "presets" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("presets")}
                className="flex-1"
              >
                <Grid3X3 className="h-3 w-3 mr-1" />
                Presets
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Layout Tab */}
              {activeTab === "layout" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Información del Layout</Label>
                    <Input
                      placeholder="Nombre del layout"
                      value={currentLayout.name}
                      onChange={(e) =>
                        onLayoutChange({
                          ...currentLayout,
                          name: e.target.value,
                        })
                      }
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="Descripción del layout"
                      value={currentLayout.description}
                      onChange={(e) =>
                        onLayoutChange({
                          ...currentLayout,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>

                  <Separator />

                  {/* Widget Controls */}
                  {Object.entries(currentLayout.widgets).map(([key, widget]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium capitalize">{key}</Label>
                        <Switch
                          checked={widget.visible}
                          onCheckedChange={(checked) => updateWidget(key as any, { visible: checked })}
                        />
                      </div>

                      {widget.visible && (
                        <div className="pl-4 space-y-2 border-l-2 border-muted">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">Posición</Label>
                              <Select
                                value={widget.position.toString()}
                                onValueChange={(value) =>
                                  updateWidget(key as any, { position: Number.parseInt(value) })
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1° (Arriba)</SelectItem>
                                  <SelectItem value="2">2°</SelectItem>
                                  <SelectItem value="3">3°</SelectItem>
                                  <SelectItem value="4">4°</SelectItem>
                                  <SelectItem value="5">5° (Abajo)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground">Tamaño</Label>
                              <Select
                                value={widget.size}
                                onValueChange={(value) => updateWidget(key as any, { size: value })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Pequeño</SelectItem>
                                  <SelectItem value="medium">Mediano</SelectItem>
                                  <SelectItem value="large">Grande</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Widget-specific options */}
                          {key === "metrics" && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Columnas</Label>
                              <Slider
                                value={[widget.columns]}
                                onValueChange={([value]) => updateWidget(key as any, { columns: value })}
                                max={8}
                                min={2}
                                step={1}
                                className="mt-1"
                              />
                              <div className="text-xs text-muted-foreground mt-1">{widget.columns} columnas</div>
                            </div>
                          )}

                          {(key === "orders" || key === "recentOrders") && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Filas por página</Label>
                              <Select
                                value={widget.rowsPerPage.toString()}
                                onValueChange={(value) =>
                                  updateWidget(key as any, { rowsPerPage: Number.parseInt(value) })
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 filas</SelectItem>
                                  <SelectItem value="10">10 filas</SelectItem>
                                  <SelectItem value="15">15 filas</SelectItem>
                                  <SelectItem value="20">20 filas</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {key === "map" && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Altura del mapa</Label>
                              <Slider
                                value={[widget.height]}
                                onValueChange={([value]) => updateWidget(key as any, { height: value })}
                                max={600}
                                min={200}
                                step={50}
                                className="mt-1"
                              />
                              <div className="text-xs text-muted-foreground mt-1">{widget.height}px</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Theme Tab */}
              {activeTab === "theme" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Esquema de Color</Label>
                    <Select
                      value={currentLayout.theme.colorScheme}
                      onValueChange={(value: any) => updateTheme({ colorScheme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Por Defecto</SelectItem>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="purple">Morado</SelectItem>
                        <SelectItem value="orange">Naranja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Densidad</Label>
                    <Select
                      value={currentLayout.theme.density}
                      onValueChange={(value: any) => updateTheme({ density: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacto</SelectItem>
                        <SelectItem value="comfortable">Cómodo</SelectItem>
                        <SelectItem value="spacious">Espacioso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Radio de Bordes</Label>
                    <Slider
                      value={[currentLayout.theme.borderRadius]}
                      onValueChange={([value]) => updateTheme({ borderRadius: value })}
                      max={20}
                      min={0}
                      step={2}
                    />
                    <div className="text-xs text-muted-foreground mt-1">{currentLayout.theme.borderRadius}px</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Mostrar Bordes</Label>
                    <Switch
                      checked={currentLayout.theme.showBorders}
                      onCheckedChange={(checked) => updateTheme({ showBorders: checked })}
                    />
                  </div>
                </div>
              )}

              {/* Presets Tab */}
              {activeTab === "presets" && (
                <div className="space-y-3">
                  {defaultLayouts.map((preset) => (
                    <div key={preset.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-sm">{preset.name}</h5>
                          <p className="text-xs text-muted-foreground">{preset.description}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => applyPreset(preset)}>
                          Aplicar
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {preset.theme.colorScheme}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {preset.theme.density}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {Object.values(preset.widgets).filter((w) => w.visible).length} widgets
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={exportLayout}>
                <Download className="h-3 w-3 mr-1" />
                Exportar
              </Button>
              <Button size="sm" variant="outline" onClick={() => document.getElementById("import-layout")?.click()}>
                <Upload className="h-3 w-3 mr-1" />
                Importar
              </Button>
              <Button size="sm" variant="outline" onClick={resetToDefault}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <input
                id="import-layout"
                type="file"
                accept=".json"
                onChange={importLayout}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const getLayoutStyles = (layout: DashboardLayout) => {
  const { theme } = layout
  const densitySpacing = {
    compact: "space-y-3",
    comfortable: "space-y-6",
    spacious: "space-y-8",
  }

  const colorSchemes = {
    default: "",
    blue: "hue-rotate-[210deg] saturate-110",
    green: "hue-rotate-[90deg] saturate-120",
    purple: "hue-rotate-[270deg] saturate-130",
    orange: "hue-rotate-[30deg] saturate-125",
  }

  return {
    spacing: densitySpacing[theme.density],
    colorFilter: colorSchemes[theme.colorScheme],
    borderRadius: `${theme.borderRadius}px`,
    showBorders: theme.showBorders,
  }
}
