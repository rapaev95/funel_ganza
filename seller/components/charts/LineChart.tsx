'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartDataPoint } from '@/types/dashboard'

interface LineChartProps {
  data: ChartDataPoint[]
  dataKey?: string
  strokeColor?: string
  height?: number
}

export function LineChart({
  data,
  dataKey = 'value',
  strokeColor = '#FF0080',
  height = 300
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="date"
          type="category"
          stroke="rgba(255, 255, 255, 0.5)"
          style={{ fontSize: '12px' }}
          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          tickFormatter={(value) => {
            // Если значение уже в формате "Янв 2024", возвращаем как есть
            if (typeof value === 'string' && value.includes(' ')) {
              return value
            }
            // Иначе пытаемся распарсить как дату
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              return `${date.getDate()}.${date.getMonth() + 1}`
            }
            return value
          }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.5)" 
          style={{ fontSize: '12px' }}
          tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#ffffff'
          }}
          labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
          itemStyle={{ color: '#ffffff' }}
          labelFormatter={(value) => {
            // Если значение уже в формате "Янв 2024", возвращаем как есть
            if (typeof value === 'string' && value.includes(' ')) {
              return value
            }
            // Иначе пытаемся распарсить как дату
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('ru-RU')
            }
            return value
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          dot={{ fill: strokeColor, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

