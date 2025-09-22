"use client"

import { ChartsGrid } from "@/components/charts-system"

interface ChartsCardProps {
  period: string
  visibleCharts: string[]
  hideFinancials?: boolean
}

export const ChartsCard = ({
  period,
  visibleCharts,
  hideFinancials = false
}: ChartsCardProps) => {
  return (
    <ChartsGrid
      period={period}
      visibleCharts={visibleCharts}
      hideFinancials={hideFinancials}
    />
  )
}