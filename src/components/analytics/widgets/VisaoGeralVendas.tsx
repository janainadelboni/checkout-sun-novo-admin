import { useState } from 'react'
import { Typography } from 'antd'

const { Title, Text } = Typography

export function VisaoGeralVendas() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const valorTransacionado = [8000, 9500, 10000, 8500, 12000, 11000, 7500, 6000, 5500, 6500, 7000, 8000]
  const totalTransacionado = [3000, 3500, 4000, 5000, 5500, 4500, 3500, 3000, 2800, 3200, 3800, 4500]

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const maxVal = 25000
  const width = 800
  const height = 300
  const padX = 40
  const padY = 20
  const chartW = width - padX * 2
  const chartH = height - padY * 2
  const toX = (i: number) => padX + (i / (meses.length - 1)) * chartW
  const toY = (v: number) => padY + chartH - (v / maxVal) * chartH
  const pathValor = valorTransacionado.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const pathTotal = totalTransacionado.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const gridLines = [0, 5000, 10000, 15000, 20000, 25000]

  const formatValue = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-4">Visão geral de vendas</Title>
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="w-full"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid */}
        {gridLines.map((val) => (
          <g key={val}>
            <line x1={padX} y1={toY(val)} x2={width - padX} y2={toY(val)} stroke="rgba(0,0,0,0.06)" />
            <text x={padX - 8} y={toY(val) + 4} textAnchor="end" fill="rgba(0,0,0,0.45)" fontSize="10">{val === 0 ? '0' : `${val / 1000}k`}</text>
          </g>
        ))}
        {/* Month labels */}
        {meses.map((m, i) => (
          <text key={m} x={toX(i)} y={height + 15} textAnchor="middle" fill="rgba(0,0,0,0.45)" fontSize="10">{m}</text>
        ))}
        {/* Lines */}
        <path d={pathValor} fill="none" stroke="#FAAD14" strokeWidth="2.5" />
        <path d={pathTotal} fill="none" stroke="#13C2C2" strokeWidth="2.5" />

        {/* Hover vertical line + dots */}
        {hoverIndex !== null && (
          <>
            <line x1={toX(hoverIndex)} y1={padY} x2={toX(hoverIndex)} y2={padY + chartH} stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx={toX(hoverIndex)} cy={toY(valorTransacionado[hoverIndex])} r="4" fill="#FAAD14" stroke="#fff" strokeWidth="2" />
            <circle cx={toX(hoverIndex)} cy={toY(totalTransacionado[hoverIndex])} r="4" fill="#13C2C2" stroke="#fff" strokeWidth="2" />
          </>
        )}

        {/* Tooltip */}
        {hoverIndex !== null && (() => {
          const x = toX(hoverIndex)
          const tooltipW = 170
          const tooltipH = 52
          const tooltipX = x + tooltipW + 10 > width ? x - tooltipW - 10 : x + 10
          const tooltipY = 10
          return (
            <g>
              <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="4" fill="rgba(0,0,0,0.8)" />
              <text x={tooltipX + 8} y={tooltipY + 16} fill="#fff" fontSize="10" fontWeight="600">{meses[hoverIndex]}</text>
              <circle cx={tooltipX + 12} cy={tooltipY + 30} r="3" fill="#FAAD14" />
              <text x={tooltipX + 20} y={tooltipY + 33} fill="rgba(255,255,255,0.8)" fontSize="9">{formatValue(valorTransacionado[hoverIndex])}</text>
              <circle cx={tooltipX + 12} cy={tooltipY + 44} r="3" fill="#13C2C2" />
              <text x={tooltipX + 20} y={tooltipY + 47} fill="rgba(255,255,255,0.8)" fontSize="9">{formatValue(totalTransacionado[hoverIndex])}</text>
            </g>
          )
        })()}

        {/* Invisible hover zones */}
        {meses.map((_, i) => {
          const sliceW = chartW / meses.length
          return (
            <rect
              key={i}
              x={toX(i) - sliceW / 2}
              y={padY}
              width={sliceW}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
          )
        })}
      </svg>
      {/* Legend - left aligned */}
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#FAAD14] rounded" /><Text type="secondary" className="text-xs">Valor transacionado</Text></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#13C2C2] rounded" /><Text type="secondary" className="text-xs">Total transacionado</Text></div>
      </div>
    </div>
  )
}
