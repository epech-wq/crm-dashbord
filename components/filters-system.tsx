"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, CalendarIcon, X, RotateCcw, Search, MapPin, ShoppingCart, Tag } from "lucide-react"
import { format, subWeeks, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { mockOrders, mockProducts, type Order } from "@/components/mock-data"

export interface FilterState {
  period: string
  dateRange: {
    from: Date
    to: Date
  }
  customDateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  status: string[]
  cities: string[]
  customers: string[]
  categories: string[]
  channels: string[]
  amountRange: {
    min: number
    max: number
  }
  searchTerm: string
}

export const defaultFilters: FilterState = {
  period: "month",
  dateRange: {
    from: subMonths(new Date(), 1),
    to: new Date(),
  },
  customDateRange: {
    from: undefined,
    to: undefined,
  },
  status: [],
  cities: [],
  customers: [],
  categories: [],
  channels: [],
  amountRange: {
    min: 0,
    max: 100000,
  },
  searchTerm: "",
}

export const getFilterOptions = () => {
  const uniqueCities = Array.from(new Set(mockOrders.map((order) => order.location.city)))
  const uniqueCustomers = Array.from(new Set(mockOrders.map((order) => order.customer)))
  const uniqueCategories = Array.from(new Set(mockProducts.map((product) => product.category)))
  const uniqueChannels = Array.from(new Set(mockOrders.map((order) => order.channel)))
  const uniqueStatus = Array.from(new Set(mockOrders.map((order) => order.status)))

  return {
    periods: [
      { value: "day", label: "Hoy", days: 1 },
      { value: "week", label: "Esta semana", days: 7 },
      { value: "month", label: "Este mes", days: 30 },
      { value: "quarter", label: "Este trimestre", days: 90 },
      { value: "year", label: "Este año", days: 365 },
      { value: "custom", label: "Personalizado", days: 0 },
    ],
    status: uniqueStatus,
    cities: uniqueCities,
    customers: uniqueCustomers,
    categories: uniqueCategories,
    channels: uniqueChannels,
  }
}

interface FiltersSystemProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

export const FiltersSystem = ({ filters, onFiltersChange, className = "" }: FiltersSystemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const filterOptions = getFilterOptions()

  const updatePeriod = (period: string) => {
    const now = new Date()
    let from: Date
    let to: Date = now

    switch (period) {
      case "day":
        from = startOfDay(now)
        to = endOfDay(now)
        break
      case "week":
        from = subWeeks(now, 1)
        break
      case "month":
        from = subMonths(now, 1)
        break
      case "quarter":
        from = subMonths(now, 3)
        break
      case "year":
        from = subYears(now, 1)
        break
      case "custom":
        from = filters.customDateRange.from || subMonths(now, 1)
        to = filters.customDateRange.to || now
        break
      default:
        from = subMonths(now, 1)
    }

    onFiltersChange({
      ...filters,
      period,
      dateRange: { from, to },
    })
  }

  const updateCustomDateRange = (from: Date | undefined, to: Date | undefined) => {
    onFiltersChange({
      ...filters,
      customDateRange: { from, to },
      dateRange: {
        from: from || filters.dateRange.from,
        to: to || filters.dateRange.to,
      },
    })
  }

  const toggleMultiFilter = (filterType: keyof FilterState, value: string) => {
    const currentValues = filters[filterType] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onFiltersChange({
      ...filters,
      [filterType]: newValues,
    })
  }

  const resetFilters = () => {
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount =
    filters.status.length +
    filters.cities.length +
    filters.customers.length +
    filters.categories.length +
    filters.channels.length +
    (filters.searchTerm ? 1 : 0) +
    (filters.period === "custom" ? 1 : 0)

  return (
    <div className={`${className} relative`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div className="relative group">
            <Button
              variant="outline"
              className={`h-10 px-4 transition-all duration-200 shadow-sm hover:shadow-md ${activeFiltersCount > 0
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50'
                : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-200 dark:border-gray-800 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`h-4 w-4 ${activeFiltersCount > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400'
                  }`} />
                <span className={`font-medium text-sm ${activeFiltersCount > 0
                  ? 'text-emerald-900 dark:text-emerald-100'
                  : 'text-gray-900 dark:text-gray-100'
                  }`}>
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 text-xs">({activeFiltersCount})</span>
                  )}
                </span>
              </div>
            </Button>

            {/* Active filters indicator */}
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            )}

            {/* Global effect indicator */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              <div className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} activo${activeFiltersCount !== 1 ? 's' : ''} - Afecta toda la página`
                  : 'Configurar filtros globales'
                }
              </div>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[450px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avanzados
            </SheetTitle>
            <SheetDescription>
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} activo${activeFiltersCount !== 1 ? 's' : ''}`
                : 'Configura los filtros para personalizar la vista de datos'
              }
            </SheetDescription>
          </SheetHeader>

          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={resetFilters} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              )}
            </div>

            <Separator />

            {/* Período */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                Período
              </Label>
              <Select value={filters.period} onValueChange={updatePeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.period === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        {filters.customDateRange.from
                          ? format(filters.customDateRange.from, "dd/MM/yyyy", { locale: es })
                          : "Desde"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.customDateRange.from}
                        onSelect={(date) => updateCustomDateRange(date, filters.customDateRange.to)}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        {filters.customDateRange.to
                          ? format(filters.customDateRange.to, "dd/MM/yyyy", { locale: es })
                          : "Hasta"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.customDateRange.to}
                        onSelect={(date) => updateCustomDateRange(filters.customDateRange.from, date)}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <Separator />

            {/* Búsqueda */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Search className="h-3 w-3" />
                Búsqueda
              </Label>
              <Input
                placeholder="Buscar por cliente, ID pedido, email..."
                value={filters.searchTerm}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    searchTerm: e.target.value,
                  })
                }
              />
            </div>

            <Separator />

            {/* Estados */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-3 w-3" />
                Estados
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.status.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => toggleMultiFilter("status", status)}
                    />
                    <Label htmlFor={`status-${status}`} className="text-xs">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Ciudades */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Ciudades
              </Label>
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {filterOptions.cities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={filters.cities.includes(city)}
                      onCheckedChange={() => toggleMultiFilter("cities", city)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-xs">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Categorías */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Categorías
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleMultiFilter("categories", category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-xs">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Canales */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Canales de Venta</Label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.channels.map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${channel}`}
                      checked={filters.channels.includes(channel)}
                      onCheckedChange={() => toggleMultiFilter("channels", channel)}
                    />
                    <Label htmlFor={`channel-${channel}`} className="text-xs">
                      {channel}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rango de montos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rango de Montos</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-amount" className="text-xs text-muted-foreground">
                    Mínimo
                  </Label>
                  <Input
                    id="min-amount"
                    type="number"
                    placeholder="0"
                    value={filters.amountRange.min}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        amountRange: {
                          ...filters.amountRange,
                          min: Number(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="max-amount" className="text-xs text-muted-foreground">
                    Máximo
                  </Label>
                  <Input
                    id="max-amount"
                    type="number"
                    placeholder="100000"
                    value={filters.amountRange.max}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        amountRange: {
                          ...filters.amountRange,
                          max: Number(e.target.value) || 100000,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Filtros activos */}
            {activeFiltersCount > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Filtros Activos ({activeFiltersCount})</Label>
                  <div className="space-y-2">
                    {filters.status.map((status) => (
                      <div key={`status-${status}`} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Estado: {status}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => toggleMultiFilter("status", status)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {filters.cities.map((city) => (
                      <div key={`city-${city}`} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Ciudad: {city}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => toggleMultiFilter("cities", city)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {filters.categories.map((category) => (
                      <div key={`category-${category}`} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Categoría: {category}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => toggleMultiFilter("categories", category)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {filters.channels.map((channel) => (
                      <div key={`channel-${channel}`} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Canal: {channel}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => toggleMultiFilter("channels", channel)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {filters.searchTerm && (
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Búsqueda: {filters.searchTerm.length > 30 ? filters.searchTerm.substring(0, 30) + "..." : filters.searchTerm}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() =>
                            onFiltersChange({
                              ...filters,
                              searchTerm: "",
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {filters.period === "custom" && (
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-sm">Período personalizado</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => updatePeriod("month")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Componente para mostrar un resumen compacto de filtros activos
export const ActiveFiltersDisplay = ({ filters, onFiltersChange, className = "" }: FiltersSystemProps) => {
  const filterOptions = getFilterOptions()

  const toggleMultiFilter = (filterType: keyof FilterState, value: string) => {
    const currentValues = filters[filterType] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onFiltersChange({
      ...filters,
      [filterType]: newValues,
    })
  }

  const activeFiltersCount =
    filters.status.length +
    filters.cities.length +
    filters.customers.length +
    filters.categories.length +
    filters.channels.length +
    (filters.searchTerm ? 1 : 0) +
    (filters.period === "custom" ? 1 : 0)

  if (activeFiltersCount === 0) return null

  const allActiveFilters = [
    ...filters.status.map(status => ({ type: 'status', value: status, label: `Estado: ${status}` })),
    ...filters.cities.map(city => ({ type: 'cities', value: city, label: `Ciudad: ${city}` })),
    ...filters.categories.map(category => ({ type: 'categories', value: category, label: `Categoría: ${category}` })),
    ...filters.channels.map(channel => ({ type: 'channels', value: channel, label: `Canal: ${channel}` })),
    ...(filters.searchTerm ? [{ type: 'searchTerm', value: filters.searchTerm, label: `Búsqueda: ${filters.searchTerm}` }] : []),
    ...(filters.period === "custom" ? [{ type: 'period', value: 'custom', label: 'Período personalizado' }] : [])
  ]

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {allActiveFilters.slice(0, 3).map((filter, index) => (
        <Badge key={`${filter.type}-${filter.value}-${index}`} variant="secondary" className="text-xs max-w-32">
          <span className="truncate">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => {
              if (filter.type === 'searchTerm') {
                onFiltersChange({ ...filters, searchTerm: "" })
              } else if (filter.type === 'period') {
                onFiltersChange({ ...filters, period: "month" })
              } else {
                toggleMultiFilter(filter.type as keyof FilterState, filter.value)
              }
            }}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      {allActiveFilters.length > 3 && (
        <Badge variant="outline" className="text-xs">
          +{allActiveFilters.length - 3} más
        </Badge>
      )}
    </div>
  )
}

export const applyFilters = (data: Order[], filters: FilterState): Order[] => {
  // Verificar si hay filtros activos (excluyendo el período por defecto)
  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.cities.length > 0 ||
    filters.customers.length > 0 ||
    filters.categories.length > 0 ||
    filters.channels.length > 0 ||
    filters.searchTerm.trim() !== "" ||
    filters.period === "custom" ||
    filters.amountRange.min > 0 ||
    filters.amountRange.max < 100000

  // Si no hay filtros activos, devolver todos los datos
  if (!hasActiveFilters) {
    return data
  }

  return data.filter((item) => {
    // Filtro por fecha
    const itemDate = new Date(item.date)
    if (itemDate < filters.dateRange.from || itemDate > filters.dateRange.to) {
      return false
    }

    // Filtro por estado
    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false
    }

    // Filtro por ciudad
    if (filters.cities.length > 0 && !filters.cities.includes(item.location.city)) {
      return false
    }

    // Filtro por canal
    if (filters.channels.length > 0 && !filters.channels.includes(item.channel)) {
      return false
    }

    // Filtro por categoría (basado en productos del pedido)
    if (filters.categories.length > 0) {
      const hasMatchingCategory = item.productIds.some((productId) => {
        const product = mockProducts.find((p) => p.id === productId)
        return product && filters.categories.includes(product.category)
      })
      if (!hasMatchingCategory) {
        return false
      }
    }

    // Filtro por cliente
    if (filters.customers.length > 0 && !filters.customers.includes(item.customer)) {
      return false
    }

    // Filtro por monto
    if (item.amount < filters.amountRange.min || item.amount > filters.amountRange.max) {
      return false
    }

    // Filtro por búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch =
        item.customer.toLowerCase().includes(searchLower) ||
        item.customerEmail.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        item.address.toLowerCase().includes(searchLower) ||
        item.products.some((product) => product.toLowerCase().includes(searchLower)) ||
        item.salesRep.toLowerCase().includes(searchLower)

      if (!matchesSearch) {
        return false
      }
    }

    return true
  })
}
