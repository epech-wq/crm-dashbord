"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  AlertTriangle,
  Package,
  Users,
  Tag,
  Star,
  Sparkles,
  Filter,
  ChevronDown,
  X
} from "lucide-react"
import { mockProducts, mockOrders } from "@/components/mock-data"

interface ExtendedProduct {
  id: string
  name: string
  category: "Software" | "Hardware" | "Servicios" | "Consultoría"
  price: number
  brand: string
  salesTrend: "up" | "down" | "stable"
  activePromotion: boolean
  promotionDiscount?: number
  customersCount: number
  outOfStockPercentage: number
  isNewProduct: boolean
  stockStatus: "critical" | "low" | "medium" | "good"
}

// Alert interface for stock alerts
interface StockAlert {
  id: string
  type: "stock_critico" | "stock_bajo" | "demanda_alta" | "reposicion_urgente" | "producto_descontinuado" | "proveedor_retraso"
  priority: "alta" | "media" | "baja"
  product: string
  productId: string
  message: string
  timestamp: Date
  status: "activa" | "en_proceso" | "resuelta"
  affectedQuantity?: number
  estimatedResolution?: Date
  assignedTo?: string
}

// Generate stock alerts
const generateStockAlerts = (): StockAlert[] => {
  const alertTypes = [
    {
      type: "stock_critico" as const, priority: "alta" as const, messages: [
        "Stock crítico: Solo quedan 2 unidades disponibles",
        "Inventario agotándose: Menos de 5 unidades en stock",
        "Alerta crítica: Stock por debajo del mínimo establecido"
      ]
    },
    {
      type: "stock_bajo" as const, priority: "media" as const, messages: [
        "Stock bajo: Se recomienda reposición en los próximos 7 días",
        "Inventario reducido: 15% del stock mínimo disponible",
        "Nivel de stock por debajo del punto de reorden"
      ]
    },
    {
      type: "demanda_alta" as const, priority: "alta" as const, messages: [
        "Demanda inesperada: Ventas 300% por encima del promedio",
        "Pico de demanda detectado: Stock insuficiente para demanda actual",
        "Alta rotación: Producto vendido 5 veces más rápido que lo usual"
      ]
    },
    {
      type: "reposicion_urgente" as const, priority: "alta" as const, messages: [
        "Reposición urgente requerida: Tiempo de entrega crítico",
        "Stock agotado: Necesaria reposición inmediata",
        "Pedido de emergencia necesario para evitar ruptura de stock"
      ]
    },
    {
      type: "producto_descontinuado" as const, priority: "baja" as const, messages: [
        "Producto descontinuado: Liquidar stock restante",
        "Fin de línea: Últimas unidades disponibles",
        "Producto fuera de catálogo: Gestionar inventario remanente"
      ]
    },
    {
      type: "proveedor_retraso" as const, priority: "media" as const, messages: [
        "Retraso del proveedor: Entrega pospuesta 2 semanas",
        "Problema logístico: Demora en la cadena de suministro",
        "Proveedor reporta retraso: Nueva fecha estimada de entrega"
      ]
    }
  ]

  const products = [...generateExtendedProducts(), ...generateAdditionalProducts()]
  const alerts: StockAlert[] = []

  // Generate 15-20 alerts
  for (let i = 0; i < 18; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const message = alertType.messages[Math.floor(Math.random() * alertType.messages.length)]

    const daysAgo = Math.floor(Math.random() * 7)
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - daysAgo)

    const statuses: ("activa" | "en_proceso" | "resuelta")[] = ["activa", "en_proceso", "resuelta"]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const assignees = ["Ana García", "Carlos López", "María Rodríguez", "Juan Pérez", "Laura Martín"]

    alerts.push({
      id: `ALERT${String(i + 1).padStart(3, '0')}`,
      type: alertType.type,
      priority: alertType.priority,
      product: product.name,
      productId: product.id,
      message,
      timestamp,
      status,
      affectedQuantity: alertType.type.includes('stock') ? Math.floor(Math.random() * 50) + 1 : undefined,
      estimatedResolution: status !== "resuelta" ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
      assignedTo: status === "en_proceso" ? assignees[Math.floor(Math.random() * assignees.length)] : undefined
    })
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Generate extended product data with out-of-stock information
const generateExtendedProducts = (): ExtendedProduct[] => {
  const brands = ["TechCorp", "InnovaLabs", "DataSoft", "CloudTech", "SystemPro", "DevTools"]

  return mockProducts.map((product, index) => {
    // Calculate customers buying this product
    const customersCount = mockOrders.filter(order =>
      order.productIds.includes(product.id)
    ).length

    // Generate realistic out-of-stock percentages (higher for popular products)
    const baseOutOfStock = Math.random() * 100
    const outOfStockPercentage = Math.round(baseOutOfStock * 10) / 10

    // Determine stock status based on percentage
    let stockStatus: "critical" | "low" | "medium" | "good"
    if (outOfStockPercentage >= 80) stockStatus = "critical"
    else if (outOfStockPercentage >= 60) stockStatus = "low"
    else if (outOfStockPercentage >= 30) stockStatus = "medium"
    else stockStatus = "good"

    // Generate sales trends (more likely to be down if out of stock is high)
    const trendOptions: ("up" | "down" | "stable")[] = ["up", "down", "stable"]
    const salesTrend = outOfStockPercentage > 70
      ? (Math.random() > 0.7 ? "down" : "stable")
      : trendOptions[Math.floor(Math.random() * trendOptions.length)]

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      brand: brands[index % brands.length],
      salesTrend,
      activePromotion: Math.random() > 0.6, // 40% chance of active promotion
      promotionDiscount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 5 : undefined,
      customersCount,
      outOfStockPercentage,
      isNewProduct: Math.random() > 0.8, // 20% chance of being new
      stockStatus
    }
  })
}

// Add more products for a more comprehensive table
const generateAdditionalProducts = (): ExtendedProduct[] => {
  const additionalProducts = [
    { name: "Mobile App Builder", category: "Software" as const, price: 9500 },
    { name: "Security Suite Pro", category: "Software" as const, price: 18000 },
    { name: "Cloud Storage 1TB", category: "Servicios" as const, price: 3600 },
    { name: "Laptop Workstation", category: "Hardware" as const, price: 35000 },
    { name: "Training Workshop", category: "Consultoría" as const, price: 8000 },
    { name: "API Gateway", category: "Software" as const, price: 12500 },
    { name: "Backup Solution", category: "Servicios" as const, price: 4800 },
    { name: "Network Switch", category: "Hardware" as const, price: 15000 },
  ]

  const brands = ["TechCorp", "InnovaLabs", "DataSoft", "CloudTech", "SystemPro", "DevTools"]

  return additionalProducts.map((product, index) => {
    const outOfStockPercentage = Math.round(Math.random() * 100 * 10) / 10
    let stockStatus: "critical" | "low" | "medium" | "good"
    if (outOfStockPercentage >= 80) stockStatus = "critical"
    else if (outOfStockPercentage >= 60) stockStatus = "low"
    else if (outOfStockPercentage >= 30) stockStatus = "medium"
    else stockStatus = "good"

    const trendOptions: ("up" | "down" | "stable")[] = ["up", "down", "stable"]
    const salesTrend = outOfStockPercentage > 70
      ? (Math.random() > 0.7 ? "down" : "stable")
      : trendOptions[Math.floor(Math.random() * trendOptions.length)]

    return {
      id: `PROD${String(index + 10).padStart(3, '0')}`,
      name: product.name,
      category: product.category,
      price: product.price,
      brand: brands[index % brands.length],
      salesTrend,
      activePromotion: Math.random() > 0.6,
      promotionDiscount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 5 : undefined,
      customersCount: Math.floor(Math.random() * 15) + 1,
      outOfStockPercentage,
      isNewProduct: Math.random() > 0.8,
      stockStatus
    }
  })
}

export const OutOfStockTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"outOfStock" | "customers" | "price">("outOfStock")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("all")

  // Filter states
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])

  // Alert filter states
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([])
  const [selectedAlertPriorities, setSelectedAlertPriorities] = useState<string[]>([])
  const [selectedAlertStatuses, setSelectedAlertStatuses] = useState<string[]>([])

  // Combine original and additional products
  const allProducts = [...generateExtendedProducts(), ...generateAdditionalProducts()]
  const allAlerts = generateStockAlerts()

  // Get unique values for filters
  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand))).sort()
  const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category))).sort()
  const uniqueStates = ["critical", "low", "medium", "good"]
  const promotionOptions = ["Con Promoción", "Sin Promoción"]

  // Filter products by tab and search term
  const getFilteredProductsByTab = (products: ExtendedProduct[]) => {
    let tabFiltered = products

    switch (activeTab) {
      case "growth":
        // Growth Drivers: Products with good sales trends, high customer count, or active promotions
        tabFiltered = products.filter(product =>
          product.salesTrend === "up" ||
          product.customersCount >= 8 ||
          product.activePromotion ||
          product.isNewProduct
        )
        break
      case "alerts":
        // Alerts: Products with critical or low stock, or declining sales
        tabFiltered = products.filter(product =>
          product.stockStatus === "critical" ||
          product.stockStatus === "low" ||
          product.salesTrend === "down" ||
          product.outOfStockPercentage >= 60
        )
        break
      case "all":
      default:
        // All products
        tabFiltered = products
        break
    }

    return tabFiltered
  }

  // Apply additional filters
  const applyFilters = (products: ExtendedProduct[]) => {
    return products.filter(product => {
      // Promotion filter
      if (selectedPromotions.length > 0) {
        const hasPromotion = product.activePromotion
        const promotionMatch = selectedPromotions.some(filter =>
          (filter === "Con Promoción" && hasPromotion) ||
          (filter === "Sin Promoción" && !hasPromotion)
        )
        if (!promotionMatch) return false
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }

      // State filter
      if (selectedStates.length > 0 && !selectedStates.includes(product.stockStatus)) {
        return false
      }

      return true
    })
  }

  // Filter and sort products
  const filteredProducts = applyFilters(getFilteredProductsByTab(allProducts))
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: number, bValue: number
      switch (sortBy) {
        case "outOfStock":
          aValue = a.outOfStockPercentage
          bValue = b.outOfStockPercentage
          break
        case "customers":
          aValue = a.customersCount
          bValue = b.customersCount
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        default:
          return 0
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getStockStatusBadge = (status: "critical" | "low" | "medium" | "good", percentage: number) => {
    const badgeStyles = {
      critical: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      low: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      good: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    }

    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`font-semibold ${badgeStyles[status]}`}>
          {percentage}%
        </Badge>
        {status === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
      </div>
    )
  }

  const handleSort = (column: "outOfStock" | "customers" | "price") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  // Filter helper functions
  const toggleFilter = (filterType: 'promotions' | 'brands' | 'categories' | 'states' | 'alertTypes' | 'alertPriorities' | 'alertStatuses', value: string) => {
    const setters = {
      promotions: setSelectedPromotions,
      brands: setSelectedBrands,
      categories: setSelectedCategories,
      states: setSelectedStates,
      alertTypes: setSelectedAlertTypes,
      alertPriorities: setSelectedAlertPriorities,
      alertStatuses: setSelectedAlertStatuses
    }

    const getters = {
      promotions: selectedPromotions,
      brands: selectedBrands,
      categories: selectedCategories,
      states: selectedStates,
      alertTypes: selectedAlertTypes,
      alertPriorities: selectedAlertPriorities,
      alertStatuses: selectedAlertStatuses
    }

    const currentValues = getters[filterType]
    const setter = setters[filterType]

    if (currentValues.includes(value)) {
      setter(currentValues.filter(item => item !== value))
    } else {
      setter([...currentValues, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedPromotions([])
    setSelectedBrands([])
    setSelectedCategories([])
    setSelectedStates([])
    setSelectedAlertTypes([])
    setSelectedAlertPriorities([])
    setSelectedAlertStatuses([])
  }

  const getActiveFiltersCount = () => {
    return selectedPromotions.length + selectedBrands.length + selectedCategories.length + selectedStates.length +
      selectedAlertTypes.length + selectedAlertPriorities.length + selectedAlertStatuses.length
  }

  const getStateLabel = (state: string) => {
    const labels = {
      critical: "Crítico",
      low: "Bajo",
      medium: "Medio",
      good: "Bueno"
    }
    return labels[state as keyof typeof labels] || state
  }

  // Alert helper functions
  const getAlertTypeLabel = (type: string) => {
    const labels = {
      stock_critico: "Stock Crítico",
      stock_bajo: "Stock Bajo",
      demanda_alta: "Demanda Alta",
      reposicion_urgente: "Reposición Urgente",
      producto_descontinuado: "Producto Descontinuado",
      proveedor_retraso: "Retraso Proveedor"
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPriorityBadge = (priority: "alta" | "media" | "baja") => {
    const styles = {
      alta: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      media: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      baja: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    }

    const labels = {
      alta: "Alta",
      media: "Media",
      baja: "Baja"
    }

    return (
      <Badge variant="outline" className={`font-semibold ${styles[priority]}`}>
        {labels[priority]}
      </Badge>
    )
  }

  const getStatusBadge = (status: "activa" | "en_proceso" | "resuelta") => {
    const styles = {
      activa: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      en_proceso: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      resuelta: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    }

    const labels = {
      activa: "Activa",
      en_proceso: "En Proceso",
      resuelta: "Resuelta"
    }

    return (
      <Badge variant="outline" className={`font-semibold ${styles[status]}`}>
        {labels[status]}
      </Badge>
    )
  }

  // Filter alerts
  const getFilteredAlerts = () => {
    return allAlerts.filter(alert => {
      // Search filter
      if (searchTerm && !alert.product.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Type filter
      if (selectedAlertTypes.length > 0 && !selectedAlertTypes.includes(alert.type)) {
        return false
      }

      // Priority filter
      if (selectedAlertPriorities.length > 0 && !selectedAlertPriorities.includes(alert.priority)) {
        return false
      }

      // Status filter
      if (selectedAlertStatuses.length > 0 && !selectedAlertStatuses.includes(alert.status)) {
        return false
      }

      return true
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Fuera de Stock
            </CardTitle>
            <CardDescription>
              Análisis detallado de productos con problemas de inventario
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtros:
          </div>

          {activeTab === "alerts" ? (
            <>
              {/* Alert Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Tipo de Alerta
                    {selectedAlertTypes.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedAlertTypes.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["stock_critico", "stock_bajo", "demanda_alta", "reposicion_urgente", "producto_descontinuado", "proveedor_retraso"].map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedAlertTypes.includes(type)}
                      onCheckedChange={() => toggleFilter('alertTypes', type)}
                    >
                      {getAlertTypeLabel(type)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Alert Priority Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Prioridad
                    {selectedAlertPriorities.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedAlertPriorities.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por prioridad</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["alta", "media", "baja"].map((priority) => (
                    <DropdownMenuCheckboxItem
                      key={priority}
                      checked={selectedAlertPriorities.includes(priority)}
                      onCheckedChange={() => toggleFilter('alertPriorities', priority)}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Alert Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Estado
                    {selectedAlertStatuses.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedAlertStatuses.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["activa", "en_proceso", "resuelta"].map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedAlertStatuses.includes(status)}
                      onCheckedChange={() => toggleFilter('alertStatuses', status)}
                    >
                      {status === "activa" ? "Activa" : status === "en_proceso" ? "En Proceso" : "Resuelta"}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Promotions Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Promociones
                    {selectedPromotions.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedPromotions.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por promociones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {promotionOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option}
                      checked={selectedPromotions.includes(option)}
                      onCheckedChange={() => toggleFilter('promotions', option)}
                    >
                      {option}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Brands Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Marcas
                    {selectedBrands.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedBrands.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por marca</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueBrands.map((brand) => (
                    <DropdownMenuCheckboxItem
                      key={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleFilter('brands', brand)}
                    >
                      {brand}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Categories Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Categorías
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleFilter('categories', category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* States Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Estado
                    {selectedStates.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {selectedStates.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueStates.map((state) => (
                    <DropdownMenuCheckboxItem
                      key={state}
                      checked={selectedStates.includes(state)}
                      onCheckedChange={() => toggleFilter('states', state)}
                    >
                      {getStateLabel(state)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Clear Filters Button */}
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar ({getActiveFiltersCount()})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Todos los Productos</TabsTrigger>
            {/* <TabsTrigger value="growth">Growth Drivers</TabsTrigger> */}
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderTableContent()}
          </TabsContent>

          {/* <TabsContent value="growth" className="mt-6">
            {renderTableContent()}
          </TabsContent> */}

          <TabsContent value="alerts" className="mt-6">
            {renderAlertsContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card >
  )

  function renderTableContent() {
    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Tendencia</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("price")}
                >
                  Precio {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Promoción</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("customers")}
                >
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Clientes {sortBy === "customers" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("outOfStock")}
                >
                  Out of Stock {sortBy === "outOfStock" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      {product.isNewProduct && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Nuevo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(product.salesTrend)}
                      <span className="text-sm capitalize">{product.salesTrend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${product.price.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.activePromotion ? (
                      <Badge variant="secondary" className="text-green-600">
                        <Tag className="h-3 w-3 mr-1" />
                        {product.promotionDiscount}% OFF
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin promoción</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{product.customersCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{product.brand}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStockStatusBadge(product.stockStatus, product.outOfStockPercentage)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.stockStatus === "critical" ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 font-semibold" :
                          product.stockStatus === "low" ? "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800 font-semibold" :
                            product.stockStatus === "medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 font-semibold" :
                              "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 font-semibold"
                      }
                    >
                      {product.stockStatus === "critical" ? "Crítico" :
                        product.stockStatus === "low" ? "Bajo" :
                          product.stockStatus === "medium" ? "Medio" : "Bueno"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )
  }

  function renderAlertsContent() {
    const filteredAlerts = getFilteredAlerts()

    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Alerta</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cantidad Afectada</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Resolución Estimada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{getAlertTypeLabel(alert.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{alert.product}</span>
                      <span className="text-xs text-muted-foreground">ID: {alert.productId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-wrap">{alert.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(alert.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(alert.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{alert.timestamp.toLocaleDateString('es-ES')}</span>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alert.affectedQuantity ? (
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{alert.affectedQuantity}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {alert.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{alert.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {alert.estimatedResolution ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{alert.estimatedResolution.toLocaleDateString('es-ES')}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.ceil((alert.estimatedResolution.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Completada</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No se encontraron alertas</p>
            <p className="text-sm">No hay alertas que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </>
    )
  }
}