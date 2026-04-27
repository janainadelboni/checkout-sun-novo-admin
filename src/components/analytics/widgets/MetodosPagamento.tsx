import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'

const { Title, Text } = Typography

const metodos = [
  { label: 'Cartão de crédito', valor: 'R$ 9.324,01', quantidade: 190, cor: '#1890FF' },
  { label: 'Pix', valor: 'R$ 9.324,01', quantidade: 190, cor: '#52C41A' },
  { label: 'Boleto', valor: 'R$ 9.324,01', quantidade: 190, cor: '#52C41A' },
  { label: 'Múltiplos cartões', valor: 'R$ 9.324,01', quantidade: 190, cor: '#FAAD14' },
  { label: 'Boleto parcelado', valor: 'R$ 9.324,01', quantidade: 190, cor: '#1890FF' },
  { label: 'Pagamento combinado', valor: 'R$ 9.324,01', quantidade: 190, cor: '#EB2F96' },
]

const totalQtd = metodos.reduce((s, m) => s + m.quantidade, 0)
const maxQtd = Math.max(...metodos.map((m) => m.quantidade))

export function MetodosPagamento() {
  const [tab, setTab] = useState('Geral')
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6 h-full">
      <Title level={5} className="!mb-3">Transações por Método de Pagamento</Title>
      <Segmented value={tab} onChange={(v) => setTab(v as string)} options={['Geral', 'Sucesso']} size="small" className="mb-4" />
      <div className="flex items-center py-1">
        <div className="w-[160px] shrink-0" /><div className="flex-1" />
        <div className="w-[100px] text-right shrink-0 pl-3"><Text type="secondary" className="text-[11px] whitespace-nowrap">Valor</Text></div>
        <div className="w-[100px] text-right shrink-0 pl-3"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
      </div>
      {metodos.map((m) => {
        const pct = ((m.quantidade / totalQtd) * 100).toFixed(0)
        const barW = ((m.quantidade / maxQtd) * 100).toFixed(0)
        return (
          <Tooltip key={m.label} title={`${m.label}: ${m.valor} — ${m.quantidade} transações (${pct}%)`}>
          <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
            <div className="w-[160px] shrink-0"><Text className="text-sm whitespace-nowrap">{m.label}</Text></div>
            <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
              <div className="h-full rounded" style={{ width: `${barW}%`, backgroundColor: m.cor, minWidth: '4px' }} />
            </div>
            <div className="w-[100px] text-right shrink-0 pl-3"><Text strong className="text-sm whitespace-nowrap">{m.valor}</Text></div>
            <div className="w-[100px] text-right shrink-0 pl-3">
              <span>
                <Text className="text-xs">{m.quantidade}</Text>
                <Text type="secondary" className="text-[10px] ml-1">({pct}%)</Text>
              </span>
            </div>
          </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
