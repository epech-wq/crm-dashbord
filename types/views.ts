export type UserView = "direccion-general" | "torre-control" | "vista-cliente" | "stock-productos"

export interface ViewConfig {
  id: UserView
  name: string
  description: string
  allowedWidgets: string[]
  defaultLayout: string
  permissions: {
    canViewFinancials: boolean
    canViewAllOrders: boolean
    canViewAnalytics: boolean
    canEditOrders: boolean
    canViewCustomerData: boolean
  }
}

export const viewConfigs: Record<UserView, ViewConfig> = {
  "direccion-general": {
    id: "direccion-general",
    name: "Dirección General",
    description: "Vista ejecutiva con métricas clave y análisis estratégico",
    allowedWidgets: ["metrics", "charts", "recentOrders", "orders", "map"],
    defaultLayout: "executive",
    permissions: {
      canViewFinancials: true,
      canViewAllOrders: true,
      canViewAnalytics: true,
      canEditOrders: true,
      canViewCustomerData: true,
    },
  },
  "torre-control": {
    id: "torre-control",
    name: "Torre de Control",
    description: "Vista operacional para seguimiento y gestión de pedidos",
    allowedWidgets: ["metrics", "recentOrders", "orders", "map"],
    defaultLayout: "operational",
    permissions: {
      canViewFinancials: false,
      canViewAllOrders: true,
      canViewAnalytics: false,
      canEditOrders: true,
      canViewCustomerData: true,
    },
  },
  "vista-cliente": {
    id: "vista-cliente",
    name: "Vista Cliente",
    description: "Vista limitada para clientes con información básica",
    allowedWidgets: ["recentOrders", "map"],
    defaultLayout: "analytics",
    permissions: {
      canViewFinancials: false,
      canViewAllOrders: false,
      canViewAnalytics: false,
      canEditOrders: false,
      canViewCustomerData: false,
    },
  },
  "stock-productos": {
    id: "stock-productos",
    name: "Stock de Productos",
    description: "Vista especializada para gestión y análisis de inventario",
    allowedWidgets: ["metrics", "charts", "map"],
    defaultLayout: "inventory",
    permissions: {
      canViewFinancials: true,
      canViewAllOrders: false,
      canViewAnalytics: true,
      canEditOrders: false,
      canViewCustomerData: false,
    },
  },
}