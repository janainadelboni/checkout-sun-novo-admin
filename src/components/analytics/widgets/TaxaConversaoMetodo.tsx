import { useState } from 'react'
import { Typography, Segmented } from 'antd'

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
  { label: 'Transações geradas', color: '#1890FF', valor: 'R$ 9.324,01', quantidade: 1247 },
  { label: 'Transações em aberto', color: '#EB2F96', valor: 'R$ 9.324,01', quantidade: 1200 },
  { label: 'Transações pagas', color: '#FAAD14', valor: 'R$ 300,00', quantidade: 800 },
]

const totalQtd = transacoes.reduce((s, t) => s + t.quantidade, 0)

export function TaxaConversaoMetodo() {
  const [tab, setTab] = useState('Geral')
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6 h-full">
      <Title level={5} className="!mb-3">Transações</Title>
      <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['Geral', 'Cartão', 'Boleto', 'Pix']} size="small" className="mb-4" />
      <div className="flex justify-center mb-4">
        <PieChart segments={transacoes.map((t) => ({
          percent: Math.round((t.quantidade / totalQtd) * 100),
          color: t.color,
          label: t.label,
          detail: `${t.valor} (${t.quantidade})`,
        }))} />
      </div>
      <div className="flex flex-col">
        {transacoes.map((t) => {
          const pct = ((t.quantidade / totalQtd) * 100).toFixed(0)
          return (
            <div key={t.label} className="flex items-center py-2 border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: t.color }} />
                <Text className="text-xs whitespace-nowrap">{t.label}</Text>
              </div>
              <div className="w-[90px] text-right shrink-0 pl-3">
                <Text strong className="text-xs whitespace-nowrap">{t.valor}</Text>
              </div>
              <div className="w-[90px] text-right shrink-0 pl-3">
                <span>
                  <Text className="text-xs">{t.quantidade.toLocaleString('pt-BR')}</Text>
                  <Text type="secondary" className="text-[10px] ml-1">({pct}%)</Text>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
