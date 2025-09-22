"use client"

import { Calendar, Clock, Users, MapPin } from "lucide-react"

interface UpcomingScheduleChartProps {
  data?: any
}

export const UpcomingScheduleChart = ({ data }: UpcomingScheduleChartProps) => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Reunión con Cliente Enterprise",
      time: "10:00 AM",
      date: "Hoy",
      attendees: 4,
      location: "Sala de Juntas A",
      type: "meeting",
      priority: "high"
    },
    {
      id: 2,
      title: "Demo de Producto - Startup XYZ",
      time: "2:30 PM",
      date: "Hoy",
      attendees: 2,
      location: "Virtual",
      type: "demo",
      priority: "medium"
    },
    {
      id: 3,
      title: "Seguimiento Post-Venta",
      time: "9:00 AM",
      date: "Mañana",
      attendees: 1,
      location: "Llamada",
      type: "followup",
      priority: "low"
    },
    {
      id: 4,
      title: "Presentación Propuesta SMB",
      time: "11:30 AM",
      date: "Mañana",
      attendees: 3,
      location: "Cliente",
      type: "presentation",
      priority: "high"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low": return "bg-green-100 text-green-700 border-green-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-3 w-3" />
      case "demo": return <Calendar className="h-3 w-3" />
      case "followup": return <Clock className="h-3 w-3" />
      case "presentation": return <MapPin className="h-3 w-3" />
      default: return <Calendar className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
          <div className={`p-1.5 rounded-full ${getPriorityColor(event.priority)}`}>
            {getTypeIcon(event.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm text-foreground truncate">{event.title}</h4>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
            </div>

            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {event.attendees}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center pt-2">
        <button className="text-xs text-primary hover:underline">
          Ver todas las citas →
        </button>
      </div>
    </div>
  )
}