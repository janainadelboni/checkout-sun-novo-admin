import { useState } from 'react'
import { Typography, Segmented, Tooltip } from 'antd'



const metodos = [
  { label: 'Cartão de crédito', valor: 'R$ 9.324,01', quantidade: 190, cor: '#2B4ACF' },
  { label: 'Pix', valor: 'R$ 9.324,01', quantidade: 190, cor: 'var(--ant-color-success)' },
  { label: 'Boleto', valor: 'R$ 9.324,01', quantidade: 190, cor: 'var(--ant-color-success)' },
  { label: 'Múltiplos cartões', valor: 'R$ 9.324,01', quantidade: 190, cor: 'var(--ant-color-warning)' },
  { label: 'Boleto parcelado', valor: 'R$ 9.324,01', quantidade: 190, cor: '#2B4ACF' },
  { label: 'Pagamento combinado', valor: 'R$ 9.324,01', quantidade: 190, cor: '#CF2B9E' },
]

const totalQtd = metodos.reduce((s, m) => s + m.quantidade, 0)
const maxQtd = Math.max(...metodos.map((m) => m.quantidade))

export function MetodosPagamento() {
  const [tab, setTab] = useState('Geral')
  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6 h-full">
      <Typography.Title level={5} className="mb-3">Transações por Método de Pagamento</Typography.Title>
      <Segmented size="small" value={tab} onChange={(v) => setTab(v as string)} options={['Geral', 'Sucesso']} className="mb-4" />
      <div className="flex items-center py-1">
        <div className="w-[180px] shrink-0" /><div className="flex-1" />
        <div className="w-[110px] text-right shrink-0 pl-3"><Typography.Text type="secondary" className="whitespace-nowrap">Valor</Typography.Text></div>
        <div className="w-[110px] text-right shrink-0 pl-3"><Typography.Text type="secondary" className="whitespace-nowrap">Quantidade</Typography.Text></div>
      </div>
      {metodos.map((m) => {
        const pct = ((m.quantidade / totalQtd) * 100).toFixed(0)
        const barW = ((m.quantidade / maxQtd) * 100).toFixed(0)
        return (
          <Tooltip key={m.label} title={`${m.label}: ${m.valor} — ${m.quantidade} transações (${pct}%)`}>
          <div className="flex items-center py-2.5 border-b border-(--ant-color-split) last:border-b-0 cursor-default hover:bg-(--ant-color-fill-quaternary) rounded transition-colors">
            <div className="w-[180px] shrink-0"><Typography.Text className="truncate block">{m.label}</Typography.Text></div>
            <div className="flex-1 h-4 bg-(--ant-color-fill-tertiary) rounded overflow-hidden mx-2 min-w-[60px]">
              <div className="h-full rounded min-w-1" style={{ width: `${barW}%`, backgroundColor: m.cor }} />
            </div>
            <div className="w-[110px] text-right shrink-0 pl-3"><Typography.Text strong className="whitespace-nowrap">{m.valor}</Typography.Text></div>
            <div className="w-[110px] text-right shrink-0 pl-3 whitespace-nowrap">
              <Typography.Text>{m.quantidade}</Typography.Text>
              <Typography.Text type="secondary" className="ml-1 !text-[14px]">({pct}%)</Typography.Text>
            </div>
          </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
