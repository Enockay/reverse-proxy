import { useState } from 'react'

// Validated dataviz palette (see dataviz skill references/palette.md)
export const SEQUENTIAL_BLUE = '#2a78d6'
export const SEQUENTIAL_ORANGE = '#eb6834'

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0)
}

export function RevenueChart({ data, color, emptyLabel }) {
  const [hovered, setHovered] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-gray-400 text-center px-4">
        {emptyLabel}
      </div>
    )
  }

  const isAllZero = data.every(d => d.amount === 0)

  const width = 700
  const height = 180
  const paddingLeft = 44
  const paddingBottom = 20
  const plotWidth = width - paddingLeft - 8
  const plotHeight = height - paddingBottom - 8

  const maxValue = Math.max(...data.map(d => d.amount), 1)
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue || 1)))
  const axisMax = Math.ceil((maxValue * 1.15) / magnitude) * magnitude || 1
  const gridSteps = [0, 0.25, 0.5, 0.75, 1].map(f => axisMax * f)

  const barSlot = plotWidth / data.length
  const barWidth = Math.min(24, barSlot - 2)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
        {gridSteps.map((g, i) => {
          const y = 8 + plotHeight - (g / axisMax) * plotHeight
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - 4} y2={y} stroke="#e1e0d9" strokeWidth="1" />
              <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#898781">
                {g >= 1000 ? `${Math.round(g / 1000)}K` : Math.round(g)}
              </text>
            </g>
          )
        })}

        {data.map((d, i) => {
          const x = paddingLeft + i * barSlot + (barSlot - barWidth) / 2
          const barHeight = (d.amount / axisMax) * plotHeight
          const y = 8 + plotHeight - barHeight
          const isHovered = hovered === i
          return (
            <rect
              key={d.date}
              x={x}
              y={barHeight > 0 ? y : 8 + plotHeight - 1}
              width={barWidth}
              height={Math.max(barHeight, 1)}
              rx={4}
              fill={color}
              opacity={isHovered ? 1 : 0.85}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}

        <line x1={paddingLeft} y1={8 + plotHeight} x2={width - 4} y2={8 + plotHeight} stroke="#c3c2b7" strokeWidth="1" />

        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 6) !== 0) return null
          const x = paddingLeft + i * barSlot + barSlot / 2
          return (
            <text key={d.date} x={x} y={height - 4} textAnchor="middle" fontSize="9" fill="#898781">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          )
        })}
      </svg>

      {hovered !== null && data[hovered] && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2.5 py-1.5 pointer-events-none shadow-lg">
          <div className="font-semibold">{formatCurrency(data[hovered].amount)}</div>
          <div className="text-gray-300">{new Date(data[hovered].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      )}

      {isAllZero && (
        <div className="absolute inset-x-0 top-8 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-400 bg-white/80 px-2 rounded">{emptyLabel}</span>
        </div>
      )}
    </div>
  )
}

export function IncomeCard({ icon: Icon, title, subtitle, chartColor, data, emptyLabel, allTime, thisMonth }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 flex items-center">
            <Icon className="w-4 h-4 mr-2 text-gray-500" />
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-baseline gap-4 my-3">
        <div>
          <p className="text-xs text-gray-500">All time</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(allTime)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">This month</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(thisMonth)}</p>
        </div>
      </div>
      <RevenueChart data={data} color={chartColor} emptyLabel={emptyLabel} />
    </div>
  )
}
