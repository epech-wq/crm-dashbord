"use client"

import { RecentOrdersTable } from "@/components/metrics-system"
import { type Order } from "@/components/mock-data"

interface RecentOrdersCardProps {
  orders: Order[]
  hideFinancials?: boolean
}

export const RecentOrdersCard = ({
  orders,
  hideFinancials = false
}: RecentOrdersCardProps) => {
  return (
    <RecentOrdersTable
      orders={orders}
      hideFinancials={hideFinancials}
    />
  )
}