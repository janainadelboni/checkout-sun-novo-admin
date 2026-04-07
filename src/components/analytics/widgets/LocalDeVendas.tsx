import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'

const { Title, Text } = Typography

const localVendas: Record<string, { label: string; valor: string; percent: string; quantidade: number; cor: string }[]> = {
  País: [
    { label: 'Brasil', valor: 'R$ 9.324,01', percent: '4%', quantidade: 10000, cor: '#EB2F96' },
    { label: 'Portugal', valor: 'R$ 9.324,01', percent: '4%', quantidade: 10000, cor: '#1890FF' },
    { label: 'China', valor: 'R$ 9.324,01', percent: '4%', quantidade: 10000, cor: '#FAAD14' },
    { label: 'Japão', valor: 'R$ 9.324,01', percent: '4%', quantidade: 10000, cor: '#FAAD14' },
  ],
  Estado: [
    { label: 'São Paulo', valor: 'R$ 5.000,00', percent: '40%', quantidade: 5000, cor: '#1890FF' },
    { label: 'Rio de Janeiro', valor: 'R$ 3.000,00', percent: '25%', quantidade: 3000, cor: '#52C41A' },
  ],
  Cidade: [
    { label: 'São Paulo', valor: 'R$ 3.000,00', percent: '30%', quantidade: 3000, cor: '#1890FF' },
    { label: 'Rio de Janeiro', valor: 'R$ 2.000,00', percent: '20%', quantidade: 2000, cor: '#FAAD14' },
  ],
}

export function LocalDeVendas() {
  const [tab, setTab] = useState('País')
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={5} className="!mb-0">Local de vendas</Title>
        <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['País', 'Estado', 'Cidade']} size="small" />
      </div>
      <div className="flex gap-6">
        <div className="w-[300px] h-[180px] bg-[#e8e8e8] rounded-lg flex items-center justify-center shrink-0">
          <Text type="secondary" className="text-sm">Mapa</Text>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center py-1">
            <div className="w-[100px] shrink-0" /><div className="flex-1" />
            <div className="w-[90px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Valor</Text></div>
            <div className="w-[75px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
          </div>
          {(localVendas[tab] || []).map((item) => (
            <Tooltip key={item.label} title={`${item.label}: ${item.valor} (${item.quantidade.toLocaleString('pt-BR')})`}>
            <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
              <div className="w-[100px] shrink-0"><Text className="text-sm whitespace-nowrap">{item.label}</Text></div>
              <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
                <div className="h-full rounded" style={{ width: `${(item.quantidade / 10000) * 100}%`, backgroundColor: item.cor, minWidth: '4px' }} />
              </div>
              <div className="w-[90px] text-right shrink-0 pl-4"><Text strong className="text-xs whitespace-nowrap">{item.valor}</Text></div>
              <div className="w-[75px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs whitespace-nowrap">{item.quantidade.toLocaleString('pt-BR')}</Text></div>
            </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
