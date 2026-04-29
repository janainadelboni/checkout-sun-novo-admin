import { Typography, Table } from 'antd'



function PieChart({ segments, size = 160 }: { segments: { percent: number; color: string; label: string }[]; size?: number }) {
  const cx = size / 2; const cy = size / 2; const r = size / 2 - 10; let cum = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const s = cum * 3.6 * (Math.PI / 180); cum += seg.percent
        const e = cum * 3.6 * (Math.PI / 180); const la = seg.percent > 50 ? 1 : 0
        const x1 = cx + r * Math.cos(s - Math.PI / 2); const y1 = cy + r * Math.sin(s - Math.PI / 2)
        const x2 = cx + r * Math.cos(e - Math.PI / 2); const y2 = cy + r * Math.sin(e - Math.PI / 2)
        return (
          <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} Z`} fill={seg.color} className="cursor-pointer hover:opacity-80 transition-opacity">
            <title>{`${seg.label}: ${seg.percent}%`}</title>
          </path>
        )
      })}
    </svg>
  )
}

const dispositivos = [
  { key: '1', dispositivo: 'Desktop', color: '#1890FF', acessos: 5200, compras: 190, ticket: 223.68 },
  { key: '2', dispositivo: 'Celular', color: 'var(--ant-color-warning)', acessos: 4100, compras: 223, ticket: 180.50 },
  { key: '3', dispositivo: 'Tablet', color: '#EB2F96', acessos: 800, compras: 19, ticket: 150.00 },
  { key: '4', dispositivo: 'Outros', color: '#D9D9D9', acessos: 300, compras: 5, ticket: 95.00 },
]

const totalAcessos = dispositivos.reduce((s, d) => s + d.acessos, 0)
const totalCompras = dispositivos.reduce((s, d) => s + d.compras, 0)

export function DispositivosAcesso() {
  const columns = [
    {
      title: 'Dispositivo',
      dataIndex: 'dispositivo',
      key: 'dispositivo',
      render: (nome: string, r: typeof dispositivos[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
          <Typography.Text >{nome}</Typography.Text>
        </div>
      ),
    },
    {
      title: 'Acessos',
      dataIndex: 'acessos',
      key: 'acessos',
      width: 120,
      render: (v: number) => (
        <span>
          {v.toLocaleString('pt-BR')}
          <Typography.Text type="secondary" className="ml-1">({((v / totalAcessos) * 100).toFixed(0)}%)</Typography.Text>
        </span>
      ),
    },
    {
      title: 'Compras',
      dataIndex: 'compras',
      key: 'compras',
      width: 120,
      render: (v: number) => (
        <span>
          {v.toLocaleString('pt-BR')}
          <Typography.Text type="secondary" className="ml-1">({((v / totalCompras) * 100).toFixed(0)}%)</Typography.Text>
        </span>
      ),
    },
    {
      title: 'Ticket médio',
      dataIndex: 'ticket',
      key: 'ticket',
      width: 110,
      render: (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
  ]

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6 h-full">
      <Typography.Title level={5} className="mb-4">Dispositivos de acesso</Typography.Title>
      <div className="flex justify-center mb-4">
        <PieChart segments={dispositivos.map((d) => ({ percent: Math.round((d.acessos / totalAcessos) * 100), color: d.color, label: d.dispositivo }))} />
      </div>
      <Table dataSource={dispositivos} columns={columns} pagination={false} size="middle" />
    </div>
  )
}
