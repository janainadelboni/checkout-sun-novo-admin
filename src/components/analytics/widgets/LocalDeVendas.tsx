import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'

const { Title, Text } = Typography

const localVendas: Record<string, { label: string; valor: string; quantidade: number; cor: string }[]> = {
  País: [
    { label: 'Brasil', valor: 'R$ 85.000,00', quantidade: 8500, cor: '#2B4ACF' },
    { label: 'Portugal', valor: 'R$ 12.300,00', quantidade: 1200, cor: '#1890FF' },
    { label: 'EUA', valor: 'R$ 8.500,00', quantidade: 450, cor: '#13C2C2' },
    { label: 'Angola', valor: 'R$ 3.200,00', quantidade: 280, cor: '#FAAD14' },
  ],
  Estado: [
    { label: 'São Paulo', valor: 'R$ 32.000,00', quantidade: 3200, cor: '#2B4ACF' },
    { label: 'Rio de Janeiro', valor: 'R$ 18.000,00', quantidade: 1800, cor: '#1890FF' },
    { label: 'Minas Gerais', valor: 'R$ 12.000,00', quantidade: 1200, cor: '#13C2C2' },
    { label: 'Paraná', valor: 'R$ 8.000,00', quantidade: 800, cor: '#FAAD14' },
  ],
  Cidade: [
    { label: 'São Paulo', valor: 'R$ 18.000,00', quantidade: 1800, cor: '#2B4ACF' },
    { label: 'Rio de Janeiro', valor: 'R$ 12.000,00', quantidade: 1200, cor: '#1890FF' },
    { label: 'Belo Horizonte', valor: 'R$ 6.000,00', quantidade: 600, cor: '#13C2C2' },
    { label: 'Curitiba', valor: 'R$ 4.500,00', quantidade: 450, cor: '#FAAD14' },
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
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={5} className="!mb-0">Local de vendas</Title>
        <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['País', 'Estado', 'Cidade']} size="small" />
      </div>
      <div className="flex gap-6">
        <div className="w-[320px] h-[220px] bg-[#fafafa] rounded-lg shrink-0 overflow-hidden">
          <MapVisualization data={data} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center py-1">
            <div className="w-[100px] shrink-0" /><div className="flex-1" />
            <div className="w-[100px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Valor</Text></div>
            <div className="w-[80px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
          </div>
          {data.map((item) => (
            <Tooltip key={item.label} title={`${item.label}: ${item.valor} (${item.quantidade.toLocaleString('pt-BR')} vendas)`}>
            <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
              <div className="w-[120px] shrink-0 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.cor }} />
                <Text className="text-sm whitespace-nowrap">{item.label}</Text>
              </div>
              <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
                <div className="h-full rounded" style={{ width: `${(item.quantidade / maxQtd) * 100}%`, backgroundColor: item.cor, minWidth: '4px' }} />
              </div>
              <div className="w-[100px] text-right shrink-0 pl-4"><Text strong className="text-xs whitespace-nowrap">{item.valor}</Text></div>
              <div className="w-[80px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs whitespace-nowrap">{item.quantidade.toLocaleString('pt-BR')}</Text></div>
            </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
