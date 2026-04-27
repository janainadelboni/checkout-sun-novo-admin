import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'

const { Title, Text } = Typography

function PieChart({ segments, size = 140 }: { segments: { percent: number; color: string; label: string }[]; size?: number }) {
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
            <title>{`${seg.label}: ${seg.percent}%`}</title>
          </path>
        )
      })}
    </svg>
  )
}

const rastreamentoData: Record<string, { label: string; quantidade: number; cor: string }[]> = {
  Source: [
    { label: 'Google', quantidade: 10000, cor: '#1890FF' },
    { label: 'Facebook', quantidade: 8500, cor: '#1890FF' },
    { label: 'Instagram', quantidade: 6200, cor: '#FAAD14' },
    { label: 'email', quantidade: 3800, cor: '#EB2F96' },
  ],
  Medium: [{ label: 'cpc', quantidade: 6000, cor: '#1890FF' }, { label: 'organic', quantidade: 4000, cor: '#52C41A' }],
  Campaign: [{ label: 'black_friday', quantidade: 8000, cor: '#722ED1' }, { label: 'launch_2025', quantidade: 2000, cor: '#FAAD14' }],
  Term: [{ label: 'curso online', quantidade: 7000, cor: '#1890FF' }, { label: 'mentoria', quantidade: 3000, cor: '#EB2F96' }],
  Content: [{ label: 'banner_topo', quantidade: 5500, cor: '#52C41A' }, { label: 'video_ad', quantidade: 4500, cor: '#FAAD14' }],
}

export function RastreamentoVendas() {
  const [tab, setTab] = useState('Source')
  const data = rastreamentoData[tab] || []
  const totalQtd = data.reduce((s, d) => s + d.quantidade, 0)
  const maxQtd = Math.max(...data.map((d) => d.quantidade))

  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={5} className="!mb-0">Rastreamento de vendas</Title>
        <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['Source', 'Medium', 'Campaign', 'Term', 'Content']} size="small" />
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <PieChart segments={[
            { percent: 65, color: '#1890FF', label: 'Rastreável' },
            { percent: 35, color: '#FAAD14', label: 'Não rastreável' },
          ]} />
          <div className="flex flex-col gap-1">
            {[{ label: 'Rastreável', color: '#1890FF' }, { label: 'Não rastreável', color: '#FAAD14' }].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
                <Text className="text-xs whitespace-nowrap">{l.label}</Text>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center py-1">
            <div className="w-[100px] shrink-0" /><div className="flex-1" />
            <div className="w-[110px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
          </div>
          {data.map((item) => {
            const pct = ((item.quantidade / totalQtd) * 100).toFixed(0)
            const barW = ((item.quantidade / maxQtd) * 100).toFixed(0)
            return (
              <Tooltip key={item.label} title={`${item.label}: ${item.quantidade.toLocaleString('pt-BR')} vendas (${pct}%)`}>
              <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
                <div className="w-[100px] shrink-0"><Text className="text-sm whitespace-nowrap">{item.label}</Text></div>
                <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
                  <div className="h-full rounded" style={{ width: `${barW}%`, backgroundColor: item.cor, minWidth: '4px' }} />
                </div>
                <div className="w-[110px] text-right shrink-0 pl-4">
                  <span>
                    <Text className="text-xs">{item.quantidade.toLocaleString('pt-BR')}</Text>
                    <Text type="secondary" className="text-[10px] ml-1">({pct}%)</Text>
                  </span>
                </div>
              </div>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </div>
  )
}
