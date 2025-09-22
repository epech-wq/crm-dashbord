"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Calendar, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { FiltersSystem, type FilterState } from "@/components/filters-system"
import { ViewSelector } from "@/components/view-selector"
import { viewConfigs, type UserView } from "@/types/views"

interface DashboardNavbarProps {
  // Layout and view state
  dashboardName: string
  currentView: UserView
  onViewChange: (view: UserView) => void

  // Filters state
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export const DashboardNavbar = ({
  dashboardName,
  currentView,
  onViewChange,
  filters,
  onFiltersChange,
}: DashboardNavbarProps) => {
  const { theme, setTheme } = useTheme()
  const currentViewConfig = viewConfigs[currentView]

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="flex h-18 items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-foreground">{dashboardName}</h1>
          <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
            {currentViewConfig.name}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Selector */}
          <ViewSelector
            currentView={currentView}
            onViewChange={onViewChange}
          />

          {/* Period Filter - Icon with period label */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Select
                value={filters.period}
                onValueChange={(value) => onFiltersChange({ ...filters, period: value })}
              >
                <SelectTrigger className="w-10 h-10 p-0">
                  <Calendar className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Día</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-sm font-medium">
              {filters.period === "day" ? "Hoy" :
                filters.period === "week" ? "Esta semana" :
                  filters.period === "month" ? "Este mes" :
                    filters.period === "year" ? "Este año" : "Personalizado"}
            </Badge>
          </div>

          {/* Advanced Filters - Icon only */}
          <FiltersSystem filters={filters} onFiltersChange={onFiltersChange} />

          {/* Theme Toggle - Icon only */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-transparent"
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}