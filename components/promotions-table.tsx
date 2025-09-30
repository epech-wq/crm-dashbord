"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, TrendingUp } from "lucide-react"
import { mockPromotions, type Promotion } from "@/components/mock-data"
import { NewPromotionModal } from "@/components/new-promotion-modal"
import { formatCurrency, formatDate, statusColors, statusLabels, promotionTypeLabels } from "@/lib/format-utils"

export function PromotionsTable() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || promotion.status === statusFilter
    return matchesSearch && matchesStatus
  })



  const handleSavePromotion = (newPromotion: Omit<Promotion, "id" | "usageCount" | "salesBefore" | "salesAfter" | "salesBoostPercentage" | "createdDate" | "lastModified">) => {
    const promotion: Promotion = {
      ...newPromotion,
      id: `PROMO${String(promotions.length + 1).padStart(3, '0')}`,
      usageCount: 0,
      salesBefore: 0,
      salesAfter: 0,
      salesBoostPercentage: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    }

    setPromotions(prev => [...prev, promotion])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Promociones</CardTitle>
            <CardDescription>
              Administra y monitorea todas las promociones activas
            </CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar promociones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="scheduled">Programadas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
              <SelectItem value="expired">Expiradas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promoción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Boost de Ventas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{promotion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {promotion.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {promotionTypeLabels[promotion.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {promotion.type === "percentage" ? `${promotion.value}%` :
                      promotion.type === "fixed" ? formatCurrency(promotion.value) :
                        promotion.type === "bogo" ? "Gratis" :
                          `${promotion.value}%`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(promotion.startDate)}</div>
                      <div className="text-muted-foreground">
                        {formatDate(promotion.endDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors.promotion[promotion.status]}>
                      {statusLabels.promotion[promotion.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{promotion.usageCount}</div>
                      {promotion.usageLimit && (
                        <div className="text-muted-foreground">
                          de {promotion.usageLimit}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        +{promotion.salesBoostPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <NewPromotionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSavePromotion}
      />
    </Card>
  )
}