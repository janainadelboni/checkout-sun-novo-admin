import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'



function PieChart({ segments, size = 140 }: { segments: { percent: number; color: string; label: string; tooltip?: string }[]; size?: number }) {
  const cx = size / 2; const cy = size / 2; const r = size / 2 - 10; let cum = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const s = cum * 3.6 * (Math.PI / 180); cum += seg.percent
        const e = cum * 3.6 * (Math.PI / 180); const la = seg.percent > 50 ? 1 : 0
        const x1 = cx + r * Math.cos(s - Math.PI / 2); const y1 = cy + r * Math.sin(s - Math.PI / 2)
        const x2 = cx + r * Math.cos(e - Math.PI / 2); const y2 = cy + r * Math.sin(e - Math.PI / 2)
        return (
          <Tooltip key={i} title={seg.tooltip || `${seg.label}: ${seg.percent}%`}>
            <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} Z`} fill={seg.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
          </Tooltip>
        )
      })}
    </svg>
  )
}

const rastreamentoData: Record<string, { label: string; quantidade: number; cor: string }[]> = {
  Source: [
    { label: 'Google', quantidade: 10000, cor: '#2B4ACF' },
    { label: 'Facebook', quantidade: 8500, cor: '#2B4ACF' },
    { label: 'Instagram', quantidade: 6200, cor: 'var(--ant-color-warning)' },
    { label: 'email', quantidade: 3800, cor: '#CF2B9E' },
  ],
  Medium: [{ label: 'cpc', quantidade: 6000, cor: '#2B4ACF' }, { label: 'organic', quantidade: 4000, cor: 'var(--ant-color-success)' }],
  Campaign: [{ label: 'black_friday', quantidade: 8000, cor: '#6D2BCF' }, { label: 'launch_2025', quantidade: 2000, cor: 'var(--ant-color-warning)' }],
  Term: [{ label: 'curso online', quantidade: 7000, cor: '#2B4ACF' }, { label: 'mentoria', quantidade: 3000, cor: '#CF2B9E' }],
  Content: [{ label: 'banner_topo', quantidade: 5500, cor: 'var(--ant-color-success)' }, { label: 'video_ad', quantidade: 4500, cor: 'var(--ant-color-warning)' }],
}

export function RastreamentoVendas() {
  const [tab, setTab] = useState('Source')
  const data = rastreamentoData[tab] || []
  const totalQtd = data.reduce((s, d) => s + d.quantidade, 0)
  const maxQtd = Math.max(...data.map((d) => d.quantidade))

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={5} className="mb-0">Rastreamento de vendas</Typography.Title>
        <Segmented size="small" value={tab} onChange={(v) => setTab(v as string)} options={['Source', 'Medium', 'Campaign', 'Term', 'Content']} />
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <PieChart segments={[
            { percent: 65, color: '#2B4ACF', label: 'Rastreável', tooltip: `Rastreável: ${Math.round(totalQtd * 0.65).toLocaleString('pt-BR')} vendas (65%)` },
            { percent: 35, color: 'var(--ant-color-warning)', label: 'Não rastreável', tooltip: `Não rastreável: ${Math.round(totalQtd * 0.35).toLocaleString('pt-BR')} vendas (35%)` },
          ]} />
          <div className="flex flex-col gap-1">
            {[{ label: 'Rastreável', color: '#2B4ACF' }, { label: 'Não rastreável', color: 'var(--ant-color-warning)' }].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
                <Typography.Text className="whitespace-nowrap">{l.label}</Typography.Text>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center py-1">
            <div className="w-[110px] shrink-0" /><div className="flex-1" />
            <div className="w-[120px] text-right shrink-0 pl-4"><Typography.Text type="secondary" className="whitespace-nowrap">Quantidade</Typography.Text></div>
          </div>
          {data.map((item) => {
            const pct = ((item.quantidade / totalQtd) * 100).toFixed(0)
            const barW = ((item.quantidade / maxQtd) * 100).toFixed(0)
            return (
              <Tooltip key={item.label} title={`${item.label}: ${item.quantidade.toLocaleString('pt-BR')} vendas (${pct}%)`}>
              <div className="flex items-center py-2.5 border-b border-(--ant-color-split) last:border-b-0 cursor-default hover:bg-(--ant-color-fill-quaternary) rounded transition-colors">
                <div className="w-[110px] shrink-0"><Typography.Text className="truncate block">{item.label}</Typography.Text></div>
                <div className="flex-1 h-4 bg-(--ant-color-fill-tertiary) rounded overflow-hidden mx-2 min-w-[60px]">
                  <div className="h-full rounded min-w-1" style={{ width: `${barW}%`, backgroundColor: item.cor }} />
                </div>
                <div className="w-[120px] text-right shrink-0 pl-4 whitespace-nowrap">
                  <Typography.Text>{item.quantidade.toLocaleString('pt-BR')}</Typography.Text>
                  <Typography.Text type="secondary" className="ml-1 !text-[14px]">({pct}%)</Typography.Text>
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
