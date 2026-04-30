import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'



const localVendas: Record<string, { label: string; valor: string; quantidade: number; cor: string }[]> = {
  País: [
    { label: 'Brasil', valor: 'R$ 85.000,00', quantidade: 8500, cor: 'var(--ant-color-primary)' },
    { label: 'Portugal', valor: 'R$ 12.300,00', quantidade: 1200, cor: '#2B4ACF' },
    { label: 'EUA', valor: 'R$ 8.500,00', quantidade: 450, cor: '#2BBCCF' },
    { label: 'Angola', valor: 'R$ 3.200,00', quantidade: 280, cor: 'var(--ant-color-warning)' },
  ],
  Estado: [
    { label: 'São Paulo', valor: 'R$ 32.000,00', quantidade: 3200, cor: 'var(--ant-color-primary)' },
    { label: 'Rio de Janeiro', valor: 'R$ 18.000,00', quantidade: 1800, cor: '#2B4ACF' },
    { label: 'Minas Gerais', valor: 'R$ 12.000,00', quantidade: 1200, cor: '#2BBCCF' },
    { label: 'Paraná', valor: 'R$ 8.000,00', quantidade: 800, cor: 'var(--ant-color-warning)' },
  ],
  Cidade: [
    { label: 'São Paulo', valor: 'R$ 18.000,00', quantidade: 1800, cor: 'var(--ant-color-primary)' },
    { label: 'Rio de Janeiro', valor: 'R$ 12.000,00', quantidade: 1200, cor: '#2B4ACF' },
    { label: 'Belo Horizonte', valor: 'R$ 6.000,00', quantidade: 600, cor: '#2BBCCF' },
    { label: 'Curitiba', valor: 'R$ 4.500,00', quantidade: 450, cor: 'var(--ant-color-warning)' },
  ],
}

// Simple world map SVG with highlighted regions
function MapVisualization({ data }: { data: { label: string; quantidade: number; cor: string }[] }) {
  const max = Math.max(...data.map((d) => d.quantidade))
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* South America (Brazil highlight) */}
      <ellipse cx="140" cy="140" rx="50" ry="60" fill="#e8edf5" stroke="#d9d9d9" strokeWidth="0.5" />
      {/* North America */}
      <ellipse cx="120" cy="60" rx="60" ry="40" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="0.5" />
      {/* Europe */}
      <ellipse cx="220" cy="55" rx="40" ry="30" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="0.5" />
      {/* Africa */}
      <ellipse cx="230" cy="130" rx="35" ry="50" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="0.5" />
      {/* Asia */}
      <ellipse cx="310" cy="70" rx="60" ry="45" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="0.5" />
      {/* Oceania */}
      <ellipse cx="340" cy="160" rx="30" ry="20" fill="#f0f0f0" stroke="#d9d9d9" strokeWidth="0.5" />

      {/* Highlight dots for top locations */}
      {data.slice(0, 4).map((d, i) => {
        const positions = [
          { x: 135, y: 130 }, // Brasil / SP
          { x: 215, y: 50 },  // Portugal / RJ / Europe
          { x: 105, y: 55 },  // EUA / MG
          { x: 225, y: 120 }, // Angola / PR / Africa
        ]
        const pos = positions[i] || { x: 200, y: 110 }
        const radius = 6 + (d.quantidade / max) * 14
        return (
          <g key={d.label}>
            <circle cx={pos.x} cy={pos.y} r={radius} fill={d.cor} opacity={0.6} className="hover:opacity-90 transition-opacity">
              <title>{`${d.label}: ${d.quantidade.toLocaleString('pt-BR')} vendas`}</title>
            </circle>
            <circle cx={pos.x} cy={pos.y} r={3} fill={d.cor} opacity={0.9} />
          </g>
        )
      })}
    </svg>
  )
}

export function LocalDeVendas() {
  const [tab, setTab] = useState('País')
  const data = localVendas[tab] || []
  const maxQtd = Math.max(...data.map((d) => d.quantidade))

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={5} className="mb-0">Local de vendas</Typography.Title>
        <Segmented size="small" value={tab} onChange={(v) => setTab(v as string)} options={['País', 'Estado', 'Cidade']} />
      </div>
      <div className="flex gap-6">
        <div className="w-[320px] h-[220px] bg-(--ant-color-fill-quaternary) rounded-lg shrink-0 overflow-hidden">
          <MapVisualization data={data} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center py-1">
            <div className="w-[120px] shrink-0" /><div className="flex-1" />
            <div className="w-[110px] text-right shrink-0 pl-4"><Typography.Text type="secondary" className="whitespace-nowrap">Valor</Typography.Text></div>
            <div className="w-[90px] text-right shrink-0 pl-4"><Typography.Text type="secondary" className="whitespace-nowrap">Quantidade</Typography.Text></div>
          </div>
          {data.map((item) => (
            <Tooltip key={item.label} title={`${item.label}: ${item.valor} (${item.quantidade.toLocaleString('pt-BR')} vendas)`}>
            <div className="flex items-center py-2.5 border-b border-(--ant-color-split) last:border-b-0 cursor-default hover:bg-(--ant-color-fill-quaternary) rounded transition-colors">
              <div className="w-[120px] shrink-0 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.cor }} />
                <Typography.Text className="truncate block">{item.label}</Typography.Text>
              </div>
              <div className="flex-1 h-4 bg-(--ant-color-fill-tertiary) rounded overflow-hidden mx-2 min-w-[60px]">
                <div className="h-full rounded min-w-1" style={{ width: `${(item.quantidade / maxQtd) * 100}%`, backgroundColor: item.cor }} />
              </div>
              <div className="w-[110px] text-right shrink-0 pl-4"><Typography.Text strong className="whitespace-nowrap">{item.valor}</Typography.Text></div>
              <div className="w-[90px] text-right shrink-0 pl-4"><Typography.Text type="secondary" className="whitespace-nowrap">{item.quantidade.toLocaleString('pt-BR')}</Typography.Text></div>
            </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
