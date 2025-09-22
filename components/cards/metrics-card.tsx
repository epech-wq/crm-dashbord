"use client"

import { MetricsGrid } from "@/components/metrics-system"
import { type UserView } from "@/types/views"

interface MetricsCardProps {
  period: string
  visibleMetrics: string[]
  hideFinancials?: boolean
}

export const MetricsCard = ({
  period,
  visibleMetrics,
  hideFinancials = false
}: MetricsCardProps) => {
  return (
    <MetricsGrid
      period={period}
      visibleMetrics={visibleMetrics}
      hideFinancials={hideFinancials}
    />
  )
}