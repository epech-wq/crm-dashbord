/**
 * Utilidades de formateo para mantener consistencia en toda la aplicación
 */

// Formateo de moneda en pesos mexicanos
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Formateo de moneda con decimales cuando sea necesario
export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Formateo de porcentajes
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

// Formateo de números grandes (K, M)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

// Formateo de fechas en español
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Formateo de fechas con hora
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Etiquetas de estado consistentes
export const statusLabels = {
  // Estados de pedidos
  order: {
    'Completado': 'Completado',
    'Pendiente': 'Pendiente',
    'En proceso': 'En Proceso',
    'Cancelado': 'Cancelado',
  },
  // Estados de clientes
  customer: {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'pending': 'Pendiente',
  },
  // Estados de promociones
  promotion: {
    'active': 'Activa',
    'inactive': 'Inactiva',
    'scheduled': 'Programada',
    'expired': 'Expirada',
  },
  // Estados de stock
  stock: {
    'critical': 'Crítico',
    'low': 'Bajo',
    'medium': 'Medio',
    'good': 'Bueno',
  },
  // Prioridades
  priority: {
    'alta': 'Alta',
    'media': 'Media',
    'baja': 'Baja',
  },
  // Estados de alertas
  alert: {
    'activa': 'Activa',
    'en_proceso': 'En Proceso',
    'resuelta': 'Resuelta',
  }
} as const

// Colores consistentes para estados
export const statusColors = {
  // Estados de pedidos
  order: {
    'Completado': 'bg-green-100 text-green-800 border-green-200',
    'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'En proceso': 'bg-blue-100 text-blue-800 border-blue-200',
    'Cancelado': 'bg-red-100 text-red-800 border-red-200',
  },
  // Estados de promociones
  promotion: {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
    'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
    'expired': 'bg-red-100 text-red-800 border-red-200',
  },
  // Estados de stock
  stock: {
    'critical': 'bg-red-100 text-red-800 border-red-200',
    'low': 'bg-orange-100 text-orange-800 border-orange-200',
    'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'good': 'bg-green-100 text-green-800 border-green-200',
  },
  // Prioridades
  priority: {
    'alta': 'bg-red-100 text-red-800 border-red-200',
    'media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'baja': 'bg-green-100 text-green-800 border-green-200',
  },
  // Estados de alertas
  alert: {
    'activa': 'bg-red-100 text-red-800 border-red-200',
    'en_proceso': 'bg-blue-100 text-blue-800 border-blue-200',
    'resuelta': 'bg-green-100 text-green-800 border-green-200',
  }
} as const

// Tipos de promociones en español
export const promotionTypeLabels = {
  'percentage': 'Porcentaje',
  'fixed': 'Descuento Fijo',
  'bogo': 'Compra y Obtén',
  'bundle': 'Paquete',
} as const

// Canales de venta en español
export const channelLabels = {
  'Online': 'En Línea',
  'Telefónico': 'Telefónico',
  'Presencial': 'Presencial',
  'Partner': 'Socio Comercial',
} as const

// Métodos de pago en español
export const paymentMethodLabels = {
  'Tarjeta': 'Tarjeta de Crédito',
  'Transferencia': 'Transferencia Bancaria',
  'Efectivo': 'Efectivo',
  'Crédito': 'Crédito Empresarial',
} as const

// Segmentos de clientes
export const customerSegmentLabels = {
  'Enterprise': 'Empresarial',
  'SMB': 'PyME',
  'Startup': 'Startup',
} as const

// Categorías de productos
export const productCategoryLabels = {
  'Software': 'Software',
  'Hardware': 'Hardware',
  'Servicios': 'Servicios',
  'Consultoría': 'Consultoría',
  'Mixto': 'Mixto',
} as const