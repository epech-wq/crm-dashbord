"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
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
  Sparkles
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

  // Combine original and additional products
  const allProducts = [...generateExtendedProducts(), ...generateAdditionalProducts()]

  // Filter and sort products
  const filteredProducts = allProducts
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
      </CardHeader>
      <CardContent>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {filteredProducts.filter(p => p.stockStatus === "critical").length}
            </p>
            <p className="text-sm text-muted-foreground">Productos Críticos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {filteredProducts.filter(p => p.stockStatus === "low").length}
            </p>
            <p className="text-sm text-muted-foreground">Stock Bajo</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {filteredProducts.filter(p => p.activePromotion).length}
            </p>
            <p className="text-sm text-muted-foreground">Con Promoción</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredProducts.filter(p => p.isNewProduct).length}
            </p>
            <p className="text-sm text-muted-foreground">Productos Nuevos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}