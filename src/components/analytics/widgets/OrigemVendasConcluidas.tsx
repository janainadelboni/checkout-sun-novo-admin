import { Typography, Table, Tooltip } from 'antd'



function PieChart({ segments, size = 160 }: { segments: { percent: number; color: string; label: string; tooltip?: string }[]; size?: number }) {
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

const origemVendas = [
  { key: '1', origem: 'Produtor', color: '#2BBCCF', quantidade: 190 },
  { key: '2', origem: 'Afiliado', color: 'var(--ant-color-warning)', quantidade: 223 },
  { key: '3', origem: 'Coprodutor', color: '#2B4ACF', quantidade: 19 },
  { key: '4', origem: 'Outros', color: '#D9D9D9', quantidade: 8 },
]

const total = origemVendas.reduce((s, d) => s + d.quantidade, 0)

export function OrigemVendasConcluidas() {
  const columns = [
    {
      title: 'Origem',
      dataIndex: 'origem',
      key: 'origem',
      render: (nome: string, r: typeof origemVendas[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
          <Typography.Text >{nome}</Typography.Text>
        </div>
      ),
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      width: 130,
      render: (v: number) => (
        <span>
          {v.toLocaleString('pt-BR')}
          <Typography.Text type="secondary" className="ml-1 !text-[14px]">({((v / total) * 100).toFixed(0)}%)</Typography.Text>
        </span>
      ),
    },
  ]

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6 h-full">
      <Typography.Title level={5} className="mb-4">Origem das vendas concluídas</Typography.Title>
      <div className="flex justify-center mb-4">
        <PieChart segments={origemVendas.map((d) => {
          const pct = Math.round((d.quantidade / total) * 100)
          return {
            percent: pct,
            color: d.color,
            label: d.origem,
            tooltip: `${d.origem}: ${d.quantidade.toLocaleString('pt-BR')} vendas (${pct}%)`,
          }
        })} />
      </div>
      <Table dataSource={origemVendas} columns={columns} pagination={false} size="middle" />
    </div>
  )
}
