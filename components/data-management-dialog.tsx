"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, FileText, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DataManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DataManagementDialog = ({ open, onOpenChange }: DataManagementDialogProps) => {
  const [downloadFormat, setDownloadFormat] = useState("csv")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleDownload = () => {
    // Simulate download functionality
    toast({
      title: "Descarga iniciada",
      description: `Los datos se están descargando en formato ${downloadFormat.toUpperCase()}`,
    })
    onOpenChange(false)
  }

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo para subir",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = uploadFile.name.toLowerCase().substring(uploadFile.name.lastIndexOf('.'))

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Formato no válido",
        description: "Solo se permiten archivos CSV y Excel (.csv, .xlsx, .xls)",
        variant: "destructive",
      })
      return
    }

    // Simulate upload functionality
    toast({
      title: "Subida simulada",
      description: `Archivo "${uploadFile.name}" procesado correctamente`,
    })
    setUploadFile(null)
    onOpenChange(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type on selection
      const allowedTypes = ['.csv', '.xlsx', '.xls']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Formato no válido",
          description: "Solo se permiten archivos CSV y Excel (.csv, .xlsx, .xls)",
          variant: "destructive",
        })
        event.target.value = '' // Clear the input
        return
      }

      setUploadFile(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Carga y Reportaría
          </DialogTitle>
          <DialogDescription>
            Descarga datos del sistema o sube reportes para análisis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium">Descargar Datos</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Formato de descarga</Label>
              <select
                id="format"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
            </div>

            <Button onClick={handleDownload} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar Datos
            </Button>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">Subir Reporte</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Seleccionar archivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Solo se permiten archivos CSV y Excel (.csv, .xlsx, .xls)
              </p>
              {uploadFile && (
                <p className="text-xs text-green-600 font-medium">
                  Archivo seleccionado: {uploadFile.name}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Esta funcionalidad es solo visual. Los archivos no se subirán realmente al sistema.
              </p>
            </div>

            <Button onClick={handleUpload} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Subir Reporte
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}