import { Typography, Tooltip } from 'antd'

const { Title, Text } = Typography

const motivos = [
  { label: 'Saldo insuficiente', quantidade: 10000, cor: '#1890FF' },
  { label: 'Segurança', quantidade: 4500, cor: '#1890FF' },
  { label: 'Banco recusou', quantidade: 2800, cor: '#52C41A' },
  { label: 'Operadora recusou', quantidade: 2800, cor: '#FAAD14' },
  { label: 'Cartão inválido', quantidade: 1200, cor: '#EB2F96' },
]

const totalRecusas = motivos.reduce((s, m) => s + m.quantidade, 0)
const maxQtd = Math.max(...motivos.map((m) => m.quantidade))

export function MotivosRecusa() {
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6 h-full">
      <Title level={5} className="!mb-4">Motivos de Recusa de Cartão</Title>
      <div className="flex items-center py-1">
        <div className="w-[150px] shrink-0" /><div className="flex-1" />
        <div className="w-[110px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Quantidade</Text></div>
      </div>
      {motivos.map((m) => {
        const pct = ((m.quantidade / totalRecusas) * 100).toFixed(0)
        const barW = ((m.quantidade / maxQtd) * 100).toFixed(0)
        return (
          <Tooltip key={m.label} title={`${m.label}: ${m.quantidade.toLocaleString('pt-BR')} recusas (${pct}%)`}>
          <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
            <div className="w-[150px] shrink-0"><Text className="text-sm whitespace-nowrap">{m.label}</Text></div>
            <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
              <div className="h-full rounded" style={{ width: `${barW}%`, backgroundColor: m.cor, minWidth: '4px' }} />
            </div>
            <div className="w-[110px] text-right shrink-0 pl-4">
              <span>
                <Text className="text-xs">{m.quantidade.toLocaleString('pt-BR')}</Text>
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
