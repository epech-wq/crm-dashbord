export interface Promotion {
  id: string
  name: string
  description: string
  type: "percentage" | "fixed" | "bogo" | "bundle"
  value: number
  startDate: string
  endDate: string
  status: "active" | "inactive" | "scheduled" | "expired"
  targetProducts: string[]
  targetCustomerSegments: ("Enterprise" | "SMB" | "Startup")[]
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  salesBefore: number
  salesAfter: number
  salesBoostPercentage: number
  createdBy: string
  createdDate: string
  lastModified: string
}

export interface PromotionMetrics {
  totalPromotions: number
  activePromotions: number
  totalSalesBoost: number
  averageBoostPercentage: number
  totalDiscountGiven: number
  promotionROI: number
}