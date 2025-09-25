"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Calendar, Moon, Sun, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"
import { FiltersSystem, type FilterState } from "@/components/filters-system"
import { ViewSelector } from "@/components/view-selector"
import { DataManagementButton } from "@/components/data-management-button"
import { viewConfigs, type UserView } from "@/types/views"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const { user, signOut } = useAuth()
  const currentViewConfig = viewConfigs[currentView]

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const handleSignOut = async () => {
    await signOut()
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
          {/* Data Management Button - Only visible in Dirección General */}
          <DataManagementButton currentView={currentView} />

          {/* View Selector */}
          <ViewSelector
            currentView={currentView}
            onViewChange={onViewChange}
          />

          {/* Filters Section - Grouped with visual separator */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-900/50 dark:to-gray-900/50 border border-slate-200/50 dark:border-slate-700/50">
            {/* Period Filter - Enhanced design */}
            <div className="relative group">
              <Select
                value={filters.period}
                onValueChange={(value) => onFiltersChange({ ...filters, period: value })}
              >
                <SelectTrigger className="h-10 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      {filters.period === "day" ? "Hoy" :
                        filters.period === "week" ? "Esta semana" :
                          filters.period === "month" ? "Este mes" :
                            filters.period === "year" ? "Este año" : "Personalizado"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Día</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>

              {/* Tooltip indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Global effect indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                  Afecta toda la página
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

            {/* Advanced Filters */}
            <FiltersSystem filters={filters} onFiltersChange={onFiltersChange} />
          </div>

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

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">
                  {user?.email?.split('@')[0] || 'Usuario'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}