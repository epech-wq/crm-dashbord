"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { DataManagementDialog } from "@/components/data-management-dialog"
import { type UserView } from "@/types/views"

interface DataManagementButtonProps {
  currentView: UserView
}

export const DataManagementButton = ({ currentView }: DataManagementButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  // Only show in Dirección General view
  if (currentView !== "direccion-general") {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="font-medium text-emerald-900 dark:text-emerald-100">
          Carga y Reportería
        </span>
      </Button>

      <DataManagementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}