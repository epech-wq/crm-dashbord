"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockProducts, type Promotion } from "@/components/mock-data"

interface NewPromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (promotion: Omit<Promotion, "id" | "usageCount" | "salesBefore" | "salesAfter" | "salesBoostPercentage" | "createdDate" | "lastModified">) => void
}

const promotionTypes = [
  { value: "percentage", label: "Porcentaje" },
  { value: "fixed", label: "Descuento Fijo" },
  { value: "bogo", label: "Compra y Obtén" },
  { value: "bundle", label: "Paquete" },
]

const customerSegments = [
  { value: "Enterprise", label: "Enterprise" },
  { value: "SMB", label: "SMB" },
  { value: "Startup", label: "Startup" },
]

export function NewPromotionModal({ open, onOpenChange, onSave }: NewPromotionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "" as "percentage" | "fixed" | "bogo" | "bundle",
    value: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "scheduled" as "active" | "inactive" | "scheduled" | "expired",
    targetProducts: [] as string[],
    targetCustomerSegments: [] as ("Enterprise" | "SMB" | "Startup")[],
    minOrderValue: undefined as number | undefined,
    maxDiscount: undefined as number | undefined,
    usageLimit: undefined as number | undefined,
    createdBy: "Usuario Actual", // In a real app, this would come from auth context
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.startDate || !formData.endDate) {
      return
    }

    onSave({
      ...formData,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate, "yyyy-MM-dd"),
    })

    // Reset form
    setFormData({
      name: "",
      description: "",
      type: "" as any,
      value: 0,
      startDate: undefined,
      endDate: undefined,
      status: "scheduled",
      targetProducts: [],
      targetCustomerSegments: [],
      minOrderValue: undefined,
      maxDiscount: undefined,
      usageLimit: undefined,
      createdBy: "Usuario Actual",
    })

    onOpenChange(false)
  }

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      targetProducts: prev.targetProducts.includes(productId)
        ? prev.targetProducts.filter(id => id !== productId)
        : [...prev.targetProducts, productId]
    }))
  }

  const handleSegmentToggle = (segment: "Enterprise" | "SMB" | "Startup") => {
    setFormData(prev => ({
      ...prev,
      targetCustomerSegments: prev.targetCustomerSegments.includes(segment)
        ? prev.targetCustomerSegments.filter(s => s !== segment)
        : [...prev.targetCustomerSegments, segment]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Promoción</DialogTitle>
          <DialogDescription>
            Crea una nueva promoción para impulsar las ventas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la promoción *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Descuento Primavera 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de promoción *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {promotionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe los detalles de la promoción..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                Valor {formData.type === "percentage" ? "(%)" : formData.type === "fixed" ? "($)" : ""}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                placeholder={formData.type === "percentage" ? "15" : "1000"}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado inicial</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: es })
                    ) : (
                      "Selecciona fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de fin *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP", { locale: es })
                    ) : (
                      "Selecciona fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Productos objetivo</Label>
            <div className="grid grid-cols-2 gap-2">
              {mockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={product.id}
                    checked={formData.targetProducts.includes(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                  />
                  <Label htmlFor={product.id} className="text-sm">
                    {product.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Segmentos de clientes objetivo</Label>
            <div className="flex gap-4">
              {customerSegments.map((segment) => (
                <div key={segment.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={segment.value}
                    checked={formData.targetCustomerSegments.includes(segment.value as any)}
                    onCheckedChange={() => handleSegmentToggle(segment.value as any)}
                  />
                  <Label htmlFor={segment.value} className="text-sm">
                    {segment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Pedido mínimo ($)</Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  minOrderValue: e.target.value ? Number(e.target.value) : undefined
                }))}
                placeholder="5000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Descuento máximo ($)</Label>
              <Input
                id="maxDiscount"
                type="number"
                value={formData.maxDiscount || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  maxDiscount: e.target.value ? Number(e.target.value) : undefined
                }))}
                placeholder="2000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Límite de uso</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  usageLimit: e.target.value ? Number(e.target.value) : undefined
                }))}
                placeholder="100"
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Promoción
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}