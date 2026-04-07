import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'

const { Title, Text } = Typography

function PieChart({ segments, size = 160 }: { segments: { percent: number; color: string; label: string; detail: string }[]; size?: number }) {
  const cx = size / 2; const cy = size / 2; const r = size / 2 - 10; let cum = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const s = cum * 3.6 * (Math.PI / 180); cum += seg.percent
        const e = cum * 3.6 * (Math.PI / 180); const la = seg.percent > 50 ? 1 : 0
        const x1 = cx + r * Math.cos(s - Math.PI / 2); const y1 = cy + r * Math.sin(s - Math.PI / 2)
        const x2 = cx + r * Math.cos(e - Math.PI / 2); const y2 = cy + r * Math.sin(e - Math.PI / 2)
        return (
          <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} Z`} fill={seg.color} className="cursor-pointer hover:opacity-80 transition-opacity">
            <title>{`${seg.label}: ${seg.detail}`}</title>
          </path>
        )
      })}
    </svg>
  )
}

const transacoes = [
  { label: 'Transações geradas', percent: 40, color: '#1890FF', valor: 'R$ 9.324,01', quantidade: 1247 },
  { label: 'Transações em aberto', percent: 20, color: '#EB2F96', valor: 'R$ 9.324,01', quantidade: 1200 },
  { label: 'Transações pagas', percent: 10, color: '#FAAD14', valor: 'R$ 300,00', quantidade: 800 },
]

export function TaxaConversaoMetodo() {
  const [tab, setTab] = useState('Geral')
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6 h-full">
      <Title level={5} className="!mb-3">Transações</Title>
      <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['Geral', 'Cartão', 'Boleto', 'Pix']} size="small" className="mb-4" />
      <div className="flex justify-center mb-4">
        <PieChart segments={transacoes.map((t) => ({ percent: t.percent, color: t.color, label: t.label, detail: `${t.percent}% — ${t.valor} (${t.quantidade})` }))} />
      </div>
      <div className="flex items-center py-1">
        <div className="flex-1" />
        <div className="w-[65px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Percentual</Text></div>
        <div className="w-[90px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Valor</Text></div>
        <div className="w-[65px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
      </div>
      {transacoes.map((t) => (
        <Tooltip key={t.label} title={`${t.label}: ${t.valor} (${t.quantidade})`}>
        <div className="flex items-center py-2 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: t.color }} />
            <Text className="text-xs whitespace-nowrap">{t.label}</Text>
          </div>
          <div className="w-[65px] text-right shrink-0 pl-4"><Text className="text-xs whitespace-nowrap">{t.percent}%</Text></div>
          <div className="w-[90px] text-right shrink-0 pl-4"><Text strong className="text-xs whitespace-nowrap">{t.valor}</Text></div>
          <div className="w-[65px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs whitespace-nowrap">{t.quantidade}</Text></div>
        </div>
        </Tooltip>
      ))}
    </div>
  )
}
