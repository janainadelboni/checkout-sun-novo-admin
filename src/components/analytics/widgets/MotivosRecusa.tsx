import { Typography, Tooltip } from 'antd'



const motivos = [
  { label: 'Saldo insuficiente', quantidade: 10000, cor: '#1890FF' },
  { label: 'Segurança', quantidade: 4500, cor: '#1890FF' },
  { label: 'Banco recusou', quantidade: 2800, cor: 'var(--ant-color-success)' },
  { label: 'Operadora recusou', quantidade: 2800, cor: 'var(--ant-color-warning)' },
  { label: 'Cartão inválido', quantidade: 1200, cor: '#EB2F96' },
]

const totalRecusas = motivos.reduce((s, m) => s + m.quantidade, 0)
const maxQtd = Math.max(...motivos.map((m) => m.quantidade))

export function MotivosRecusa() {
  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6 h-full">
      <Typography.Title level={5} className="mb-4">Motivos de Recusa de Cartão</Typography.Title>
      <div className="flex items-center py-1">
        <div className="w-[170px] shrink-0" /><div className="flex-1" />
        <div className="w-[120px] text-right shrink-0 pl-4"><Typography.Text type="secondary" className="whitespace-nowrap">Quantidade</Typography.Text></div>
      </div>
      {motivos.map((m) => {
        const pct = ((m.quantidade / totalRecusas) * 100).toFixed(0)
        const barW = ((m.quantidade / maxQtd) * 100).toFixed(0)
        return (
          <Tooltip key={m.label} title={`${m.label}: ${m.quantidade.toLocaleString('pt-BR')} recusas (${pct}%)`}>
          <div className="flex items-center py-2.5 border-b border-(--ant-color-split) last:border-b-0 cursor-default hover:bg-(--ant-color-fill-quaternary) rounded transition-colors">
            <div className="w-[170px] shrink-0"><Typography.Text className="truncate block">{m.label}</Typography.Text></div>
            <div className="flex-1 h-4 bg-(--ant-color-fill-tertiary) rounded overflow-hidden mx-2 min-w-[60px]">
              <div className="h-full rounded min-w-1" style={{ width: `${barW}%`, backgroundColor: m.cor }} />
            </div>
            <div className="w-[120px] text-right shrink-0 pl-4 whitespace-nowrap">
              <Typography.Text>{m.quantidade.toLocaleString('pt-BR')}</Typography.Text>
              <Typography.Text type="secondary" className="ml-1">({pct}%)</Typography.Text>
            </div>
          </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
