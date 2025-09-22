"use client"

import { MapSystemEnhanced } from "@/components/map-system-enhanced"
import { type Order } from "@/components/mock-data"

interface MapCardProps {
  orders: Order[]
}

export const MapCard = ({ orders }: MapCardProps) => {
  return <MapSystemEnhanced orders={orders} />
}