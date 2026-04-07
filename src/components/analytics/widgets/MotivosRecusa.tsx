import { Typography, Tooltip } from 'antd'

const { Title, Text } = Typography

const motivos = [
  { label: 'Saldo insuficiente', percent: '100%', quantidade: 10000, cor: '#1890FF' },
  { label: 'Segurança', percent: '45%', quantidade: 4500, cor: '#1890FF' },
  { label: 'Banco recusou', percent: '39%', quantidade: 2800, cor: '#52C41A' },
  { label: 'Operadora recusou', percent: '28%', quantidade: 2800, cor: '#FAAD14' },
  { label: 'Cartão inválido', percent: '12%', quantidade: 1200, cor: '#EB2F96' },
]

export function MotivosRecusa() {
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6 h-full">
      <Title level={5} className="!mb-4">Motivos de Recusa de Cartão</Title>
      <div className="flex items-center py-1">
        <div className="w-[150px] shrink-0" /><div className="flex-1" />
        <div className="w-[70px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Percentual</Text></div>
        <div className="w-[75px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
      </div>
      {motivos.map((m) => (
        <Tooltip key={m.label} title={`${m.label}: ${m.percent} (${m.quantidade.toLocaleString('pt-BR')})`}>
        <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
          <div className="w-[150px] shrink-0"><Text className="text-sm whitespace-nowrap">{m.label}</Text></div>
          <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
            <div className="h-full rounded" style={{ width: m.percent, backgroundColor: m.cor, minWidth: '4px' }} />
          </div>
          <div className="w-[70px] text-right shrink-0 pl-4"><Text className="text-xs whitespace-nowrap">{m.percent}</Text></div>
          <div className="w-[75px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs whitespace-nowrap">{m.quantidade.toLocaleString('pt-BR')}</Text></div>
        </div>
        </Tooltip>
      ))}
    </div>
  )
}
