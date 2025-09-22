"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ChannelAnalysisChartProps {
  data: any
  hideFinancials?: boolean
}

export const ChannelAnalysisChart = ({ data, hideFinancials = false }: ChannelAnalysisChartProps) => {
  const channelData = [
    { channel: "Online", conversion: 3.2, orders: 145, revenue: hideFinancials ? 0 : 52000 },
    { channel: "Telefónico", conversion: 8.5, orders: 89, revenue: hideFinancials ? 0 : 38000 },
    { channel: "Presencial", conversion: 12.8, orders: 67, revenue: hideFinancials ? 0 : 45000 },
    { channel: "Partner", conversion: 6.1, orders: 34, revenue: hideFinancials ? 0 : 28000 },
  ]

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={channelData}>
          <defs>
            <linearGradient id="channelGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="channel"
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="conversion"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#channelGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Channel metrics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {channelData.slice(0, 2).map((channel) => (
          <div key={channel.channel} className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-sm font-medium text-foreground">{channel.channel}</div>
            <div className="text-xs text-muted-foreground">
              {channel.conversion}% conversión • {channel.orders} pedidos
            </div>
            {!hideFinancials && (
              <div className="text-xs text-muted-foreground">
                ${(channel.revenue / 1000).toFixed(0)}K ingresos
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}