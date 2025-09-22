export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  segment: "Enterprise" | "SMB" | "Startup"
  status: "active" | "inactive" | "pending"
  acquisitionDate: string
  lifetimeValue: number
  lastOrderDate: string
}

export interface Product {
  id: string
  name: string
  category: "Software" | "Hardware" | "Servicios" | "Consultoría"
  price: number
  cost: number
  margin: number
}

export interface Order {
  id: string
  customerId: string
  customer: string
  customerEmail: string
  productIds: string[]
  products: string[]
  amount: number
  cost: number
  margin: number
  status: "Completado" | "Pendiente" | "En proceso" | "Cancelado"
  date: string
  location: {
    lat: number
    lng: number
    city: string
    state: string
    country: string
  }
  address: string
  salesRep: string
  channel: "Online" | "Telefónico" | "Presencial" | "Partner"
  priority: "Alta" | "Media" | "Baja"
  category: "Software" | "Hardware" | "Servicios" | "Consultoría" | "Mixto"
  customerSegment: "Enterprise" | "SMB" | "Startup"
  paymentMethod: "Tarjeta" | "Transferencia" | "Efectivo" | "Crédito"
  deliveryDate?: string
  notes?: string
  discount: number
  tax: number
  netAmount: number
}

// Datos base de clientes
export const mockCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "Juan Pérez",
    email: "juan.perez@techcorp.mx",
    phone: "+52 55 1234 5678",
    company: "TechCorp México",
    segment: "Enterprise",
    status: "active",
    acquisitionDate: "2023-03-15",
    lifetimeValue: 45000,
    lastOrderDate: "2024-01-15",
  },
  {
    id: "CUST002",
    name: "María García",
    email: "maria.garcia@innovasoft.com",
    phone: "+52 55 2345 6789",
    company: "InnovaSoft",
    segment: "SMB",
    status: "active",
    acquisitionDate: "2023-06-20",
    lifetimeValue: 18500,
    lastOrderDate: "2024-01-15",
  },
  {
    id: "CUST003",
    name: "Carlos López",
    email: "carlos.lopez@startupnl.com",
    phone: "+52 81 3456 7890",
    company: "Startup NL",
    segment: "Startup",
    status: "active",
    acquisitionDate: "2023-09-10",
    lifetimeValue: 8900,
    lastOrderDate: "2024-01-14",
  },
  {
    id: "CUST004",
    name: "Ana Martínez",
    email: "ana.martinez@digitaljalisco.mx",
    phone: "+52 33 4567 8901",
    company: "Digital Jalisco",
    segment: "SMB",
    status: "active",
    acquisitionDate: "2023-11-05",
    lifetimeValue: 12300,
    lastOrderDate: "2024-01-14",
  },
  {
    id: "CUST005",
    name: "Luis Rodríguez",
    email: "luis.rodriguez@hotelqr.com",
    phone: "+52 998 5678 9012",
    company: "Hotel QR",
    segment: "Enterprise",
    status: "active",
    acquisitionDate: "2023-01-20",
    lifetimeValue: 67800,
    lastOrderDate: "2024-01-13",
  },
  {
    id: "CUST006",
    name: "Sofia Hernández",
    email: "sofia.hernandez@fronteratech.mx",
    phone: "+52 664 6789 0123",
    company: "Frontera Tech",
    segment: "SMB",
    status: "active",
    acquisitionDate: "2023-04-12",
    lifetimeValue: 23400,
    lastOrderDate: "2024-01-13",
  },
  {
    id: "CUST007",
    name: "Diego Morales",
    email: "diego.morales@puebladigital.com",
    phone: "+52 222 7890 1234",
    company: "Puebla Digital",
    segment: "Startup",
    status: "inactive",
    acquisitionDate: "2023-08-30",
    lifetimeValue: 5600,
    lastOrderDate: "2024-01-12",
  },
  {
    id: "CUST008",
    name: "Carmen Jiménez",
    email: "carmen.jimenez@potosisolutions.mx",
    phone: "+52 444 8901 2345",
    company: "Potosí Solutions",
    segment: "SMB",
    status: "pending",
    acquisitionDate: "2023-07-18",
    lifetimeValue: 15700,
    lastOrderDate: "2024-01-12",
  },
]

// Productos disponibles
export const mockProducts: Product[] = [
  {
    id: "PROD001",
    name: "CRM Enterprise Suite",
    category: "Software",
    price: 15000,
    cost: 3000,
    margin: 80,
  },
  {
    id: "PROD002",
    name: "Analytics Dashboard Pro",
    category: "Software",
    price: 8500,
    cost: 1700,
    margin: 80,
  },
  {
    id: "PROD003",
    name: "Consultoría Implementación",
    category: "Consultoría",
    price: 12000,
    cost: 4800,
    margin: 60,
  },
  {
    id: "PROD004",
    name: "Servidor Dedicado",
    category: "Hardware",
    price: 25000,
    cost: 18000,
    margin: 28,
  },
  {
    id: "PROD005",
    name: "Soporte Premium 24/7",
    category: "Servicios",
    price: 6000,
    cost: 2400,
    margin: 60,
  },
]

// Generar pedidos consistentes
export const mockOrders: Order[] = [
  {
    id: "#ORD-2024-001",
    customerId: "CUST001",
    customer: "Juan Pérez",
    customerEmail: "juan.perez@techcorp.mx",
    productIds: ["PROD001", "PROD003"],
    products: ["CRM Enterprise Suite", "Consultoría Implementación"],
    amount: 27000,
    cost: 7800,
    margin: 71.1,
    status: "Completado",
    date: "2024-01-15",
    location: { lat: 19.4326, lng: -99.1332, city: "Ciudad de México", state: "CDMX", country: "México" },
    address: "Colonia Roma Norte, CDMX",
    salesRep: "Roberto Silva",
    channel: "Presencial",
    priority: "Alta",
    category: "Software",
    customerSegment: "Enterprise",
    paymentMethod: "Transferencia",
    deliveryDate: "2024-01-20",
    notes: "Cliente requiere implementación personalizada",
    discount: 5,
    tax: 16,
    netAmount: 24300,
  },
  {
    id: "#ORD-2024-002",
    customerId: "CUST002",
    customer: "María García",
    customerEmail: "maria.garcia@innovasoft.com",
    productIds: ["PROD002", "PROD005"],
    products: ["Analytics Dashboard Pro", "Soporte Premium 24/7"],
    amount: 14500,
    cost: 4100,
    margin: 71.7,
    status: "Pendiente",
    date: "2024-01-15",
    location: { lat: 19.4284, lng: -99.1276, city: "Ciudad de México", state: "CDMX", country: "México" },
    address: "Colonia Condesa, CDMX",
    salesRep: "Ana Torres",
    channel: "Online",
    priority: "Media",
    category: "Software",
    customerSegment: "SMB",
    paymentMethod: "Tarjeta",
    deliveryDate: "2024-01-22",
    notes: "Pendiente de aprobación de presupuesto",
    discount: 10,
    tax: 16,
    netAmount: 13050,
  },
  {
    id: "#ORD-2024-003",
    customerId: "CUST003",
    customer: "Carlos López",
    customerEmail: "carlos.lopez@startupnl.com",
    productIds: ["PROD002"],
    products: ["Analytics Dashboard Pro"],
    amount: 8500,
    cost: 1700,
    margin: 80,
    status: "Completado",
    date: "2024-01-14",
    location: { lat: 25.6866, lng: -100.3161, city: "Monterrey", state: "Nuevo León", country: "México" },
    address: "Centro de Monterrey, NL",
    salesRep: "Miguel Hernández",
    channel: "Telefónico",
    priority: "Baja",
    category: "Software",
    customerSegment: "Startup",
    paymentMethod: "Transferencia",
    deliveryDate: "2024-01-16",
    notes: "Implementación rápida solicitada",
    discount: 15,
    tax: 16,
    netAmount: 7225,
  },
  {
    id: "#ORD-2024-004",
    customerId: "CUST004",
    customer: "Ana Martínez",
    customerEmail: "ana.martinez@digitaljalisco.mx",
    productIds: ["PROD005"],
    products: ["Soporte Premium 24/7"],
    amount: 6000,
    cost: 2400,
    margin: 60,
    status: "En proceso",
    date: "2024-01-14",
    location: { lat: 20.6597, lng: -103.3496, city: "Guadalajara", state: "Jalisco", country: "México" },
    address: "Zona Centro, Guadalajara, JAL",
    salesRep: "Patricia López",
    channel: "Partner",
    priority: "Media",
    category: "Servicios",
    customerSegment: "SMB",
    paymentMethod: "Crédito",
    deliveryDate: "2024-01-25",
    notes: "Contrato anual de soporte",
    discount: 0,
    tax: 16,
    netAmount: 6000,
  },
  {
    id: "#ORD-2024-005",
    customerId: "CUST005",
    customer: "Luis Rodríguez",
    customerEmail: "luis.rodriguez@hotelqr.com",
    productIds: ["PROD001", "PROD004", "PROD003"],
    products: ["CRM Enterprise Suite", "Servidor Dedicado", "Consultoría Implementación"],
    amount: 52000,
    cost: 25800,
    margin: 50.4,
    status: "Completado",
    date: "2024-01-13",
    location: { lat: 21.1619, lng: -86.8515, city: "Cancún", state: "Quintana Roo", country: "México" },
    address: "Zona Hotelera, Cancún, QR",
    salesRep: "Roberto Silva",
    channel: "Presencial",
    priority: "Alta",
    category: "Mixto",
    customerSegment: "Enterprise",
    paymentMethod: "Transferencia",
    deliveryDate: "2024-01-18",
    notes: "Proyecto integral para cadena hotelera",
    discount: 8,
    tax: 16,
    netAmount: 47840,
  },
  {
    id: "#ORD-2024-006",
    customerId: "CUST006",
    customer: "Sofia Hernández",
    customerEmail: "sofia.hernandez@fronteratech.mx",
    productIds: ["PROD002", "PROD003"],
    products: ["Analytics Dashboard Pro", "Consultoría Implementación"],
    amount: 20500,
    cost: 6500,
    margin: 68.3,
    status: "Completado",
    date: "2024-01-13",
    location: { lat: 32.5027, lng: -117.0039, city: "Tijuana", state: "Baja California", country: "México" },
    address: "Zona Río, Tijuana, BC",
    salesRep: "Carlos Mendoza",
    channel: "Online",
    priority: "Media",
    category: "Consultoría",
    customerSegment: "SMB",
    paymentMethod: "Tarjeta",
    deliveryDate: "2024-01-19",
    notes: "Cliente fronterizo, facturación especial",
    discount: 12,
    tax: 16,
    netAmount: 18040,
  },
  {
    id: "#ORD-2024-007",
    customerId: "CUST007",
    customer: "Diego Morales",
    customerEmail: "diego.morales@puebladigital.com",
    productIds: ["PROD005"],
    products: ["Soporte Premium 24/7"],
    amount: 6000,
    cost: 2400,
    margin: 60,
    status: "Pendiente",
    date: "2024-01-12",
    location: { lat: 19.0414, lng: -98.2063, city: "Puebla", state: "Puebla", country: "México" },
    address: "Centro Histórico, Puebla, PUE",
    salesRep: "Ana Torres",
    channel: "Telefónico",
    priority: "Baja",
    category: "Servicios",
    customerSegment: "Startup",
    paymentMethod: "Efectivo",
    deliveryDate: "2024-01-30",
    notes: "Startup en crecimiento, pago diferido",
    discount: 20,
    tax: 16,
    netAmount: 4800,
  },
  {
    id: "#ORD-2024-008",
    customerId: "CUST008",
    customer: "Carmen Jiménez",
    customerEmail: "carmen.jimenez@potosisolutions.mx",
    productIds: ["PROD002", "PROD005"],
    products: ["Analytics Dashboard Pro", "Soporte Premium 24/7"],
    amount: 14500,
    cost: 4100,
    margin: 71.7,
    status: "Completado",
    date: "2024-01-12",
    location: { lat: 22.1565, lng: -100.9855, city: "San Luis Potosí", state: "San Luis Potosí", country: "México" },
    address: "Centro, San Luis Potosí, SLP",
    salesRep: "Miguel Hernández",
    channel: "Partner",
    priority: "Media",
    category: "Software",
    customerSegment: "SMB",
    paymentMethod: "Crédito",
    deliveryDate: "2024-01-17",
    notes: "Cliente referido por partner certificado",
    discount: 7,
    tax: 16,
    netAmount: 13485,
  },
]

// Datos históricos para comparaciones
export const generateHistoricalData = (period: string) => {
  const currentData = {
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: mockOrders.length,
    activeCustomers: mockCustomers.length,
    avgOrderValue: mockOrders.reduce((sum, order) => sum + order.amount, 0) / mockOrders.length,
    conversionRate: 68.5,
    customerLifetimeValue:
      mockCustomers.reduce((sum, customer) => sum + customer.lifetimeValue, 0) / mockCustomers.length,
    orderFulfillmentTime: 2.3,
    customerSatisfaction: 4.7,
  }

  // Simular datos del período anterior con variaciones realistas
  const variations = {
    day: { min: 0.85, max: 1.15 },
    week: { min: 0.9, max: 1.1 },
    month: { min: 0.92, max: 1.08 },
    year: { min: 0.95, max: 1.05 },
  }

  const variation = variations[period as keyof typeof variations] || variations.month
  const factor = Math.random() * (variation.max - variation.min) + variation.min

  return {
    current: currentData,
    previous: {
      totalRevenue: Math.round(currentData.totalRevenue * factor),
      totalOrders: Math.round(currentData.totalOrders * factor),
      activeCustomers: Math.round(currentData.activeCustomers * factor),
      avgOrderValue: Math.round(currentData.avgOrderValue * factor),
      conversionRate: Math.round(currentData.conversionRate * factor * 10) / 10,
      customerLifetimeValue: Math.round(currentData.customerLifetimeValue * factor),
      orderFulfillmentTime: Math.round(currentData.orderFulfillmentTime * factor * 10) / 10,
      customerSatisfaction: Math.round(currentData.customerSatisfaction * factor * 10) / 10,
    },
  }
}

// Datos para gráficos por período
export const generateChartData = (period: string) => {
  const periods = {
    day: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    week: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    month: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    year: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  }

  const labels = periods[period as keyof typeof periods] || periods.month

  return labels.map((label, index) => ({
    period: label,
    ventas: Math.floor(Math.random() * 50000) + 10000,
    pedidos: Math.floor(Math.random() * 50) + 10,
    clientes: Math.floor(Math.random() * 20) + 5,
    conversion: Math.floor(Math.random() * 30) + 50,
  }))
}
