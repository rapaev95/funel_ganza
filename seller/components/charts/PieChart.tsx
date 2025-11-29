'use client'

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PieChartData {
  name: string
  value: number
}

interface PieChartProps {
  data: PieChartData[]
  colors?: string[]
  height?: number
  showLegend?: boolean
}

const DEFAULT_COLORS = [
  '#FF0080',
  '#7928CA',
  '#d946ef',
  '#a855f7',
  '#ec4899',
  '#f472b6',
  '#c084fc',
  '#a78bfa'
]

export function PieChart({
  data,
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true
}: PieChartProps) {
  // Вычисляем размер радиуса с учетом легенды и отступов
  // Если есть легенда, она занимает примерно 30-40% высоты
  const legendHeight = showLegend ? Math.min(data.length * 20 + 16, 100) : 0
  const availableHeight = height - legendHeight - 30 // 30px отступы сверху и снизу
  const maxRadius = Math.min(availableHeight * 0.4, 60) // Уменьшил максимальный радиус для высоты 200px
  const outerRadius = maxRadius
  const innerRadius = outerRadius * 0.5 // Делаем donut chart для лучшей читаемости
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
        <Pie
          data={data}
          cx="50%"
          cy={showLegend ? "38%" : "50%"} // Сдвигаем вверх, если есть легенда
          labelLine={false}
          label={false} // Убираем подписи на секторах - они создают кашу
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2} // Небольшой отступ между секторами
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#ffffff'
          }}
          labelStyle={{ color: '#ffffff', marginBottom: '4px', fontWeight: 600 }}
          itemStyle={{ color: '#ffffff' }}
          formatter={(value: number, name: string) => [
            `${value.toLocaleString('ru-RU')} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
            name
          ]}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={legendHeight}
            iconType="circle"
            wrapperStyle={{
              paddingTop: '8px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
            formatter={(value) => (
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{value}</span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

