import { useState } from 'react'
import { Typography } from 'antd'



export function VisaoGeralVendas() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const valorTransacionado = [8000, 9500, 10000, 8500, 12000, 11000, 7500, 6000, 5500, 6500, 7000, 8000]
  const volumeTransacoes = [300, 350, 400, 500, 550, 450, 350, 300, 280, 320, 380, 450]

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const maxValor = 15000
  const maxVolume = 700
  const width = 800
  const height = 300
  const padL = 55
  const padR = 55
  const padY = 20
  const chartW = width - padL - padR
  const chartH = height - padY * 2
  const toX = (i: number) => padL + (i / (meses.length - 1)) * chartW
  const toYValor = (v: number) => padY + chartH - (v / maxValor) * chartH
  const toYVolume = (v: number) => padY + chartH - (v / maxVolume) * chartH
  const pathValor = valorTransacionado.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toYValor(v)}`).join(' ')
  const pathVolume = volumeTransacoes.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toYVolume(v)}`).join(' ')
  const gridLinesValor = [0, 5000, 10000, 15000]
  const gridLinesVolume = [0, 200, 400, 600]

  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <Typography.Title level={5} className="mb-4">Visão geral de vendas</Typography.Title>
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="w-full"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid + Left axis (R$) */}
        {gridLinesValor.map((val) => (
          <g key={`lv-${val}`}>
            <line x1={padL} y1={toYValor(val)} x2={width - padR} y2={toYValor(val)} stroke="rgba(0,0,0,0.06)" />
            <text x={padL - 8} y={toYValor(val) + 4} textAnchor="end" fill="var(--ant-color-text-tertiary)" fontSize="10">
              {val === 0 ? '0' : `${(val / 1000).toFixed(0)}k`}
            </text>
          </g>
        ))}
        {/* Right axis (qty) */}
        {gridLinesVolume.map((val) => (
          <text key={`rv-${val}`} x={width - padR + 8} y={toYVolume(val) + 4} textAnchor="start" fill="var(--ant-color-text-tertiary)" fontSize="10">
            {val}
          </text>
        ))}
        {/* Axis labels */}
        <text x={10} y={padY - 6} fill="rgba(0,0,0,0.35)" fontSize="9">R$</text>
        <text x={width - 15} y={padY - 6} fill="rgba(0,0,0,0.35)" fontSize="9" textAnchor="end">Qtd</text>
        {/* Month labels */}
        {meses.map((m, i) => (
          <text key={m} x={toX(i)} y={height + 15} textAnchor="middle" fill="var(--ant-color-text-tertiary)" fontSize="10">{m}</text>
        ))}
        {/* Lines */}
        <path d={pathValor} fill="none" stroke="var(--ant-color-warning)" strokeWidth="2.5" />
        <path d={pathVolume} fill="none" stroke="#2BBCCF" strokeWidth="2.5" />
        {/* Hover */}
        {hoverIndex !== null && (
          <>
            <line x1={toX(hoverIndex)} y1={padY} x2={toX(hoverIndex)} y2={padY + chartH} stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx={toX(hoverIndex)} cy={toYValor(valorTransacionado[hoverIndex])} r="4" fill="var(--ant-color-warning)" stroke="#fff" strokeWidth="2" />
            <circle cx={toX(hoverIndex)} cy={toYVolume(volumeTransacoes[hoverIndex])} r="4" fill="#2BBCCF" stroke="#fff" strokeWidth="2" />
          </>
        )}
        {/* Tooltip */}
        {hoverIndex !== null && (() => {
          const x = toX(hoverIndex)
          const tooltipW = 200
          const tooltipH = 52
          const tooltipX = x + tooltipW + 10 > width ? x - tooltipW - 10 : x + 10
          const tooltipY = 10
          return (
            <g>
              <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="4" fill="rgba(0,0,0,0.8)" />
              <text x={tooltipX + 8} y={tooltipY + 16} fill="#fff" fontSize="10" fontWeight="600">{meses[hoverIndex]}</text>
              <circle cx={tooltipX + 12} cy={tooltipY + 30} r="3" fill="var(--ant-color-warning)" />
              <text x={tooltipX + 20} y={tooltipY + 33} fill="rgba(255,255,255,0.8)" fontSize="9">Valor: {formatCurrency(valorTransacionado[hoverIndex])}</text>
              <circle cx={tooltipX + 12} cy={tooltipY + 44} r="3" fill="#2BBCCF" />
              <text x={tooltipX + 20} y={tooltipY + 47} fill="rgba(255,255,255,0.8)" fontSize="9">Volume: {volumeTransacoes[hoverIndex]} transações</text>
            </g>
          )
        })()}
        {/* Hover zones */}
        {meses.map((_, i) => (
          <rect key={i} x={toX(i) - chartW / meses.length / 2} y={padY} width={chartW / meses.length} height={chartH} fill="transparent" onMouseEnter={() => setHoverIndex(i)} />
        ))}
      </svg>
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#F59E0B] rounded" /><Typography.Text type="secondary" >Valor transacionado (R$)</Typography.Text></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#2BBCCF] rounded" /><Typography.Text type="secondary" >Volume de transações (qtd)</Typography.Text></div>
      </div>
    </div>
  )
}
