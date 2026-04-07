import { Typography, Tag } from 'antd'
import { ExportOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const topProdutos = [
  { nome: 'Produto', tipo: 'Digital', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Digital', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Evento', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Serviço', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Serviço', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Serviço', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Serviço', faturamento: 'R$ 9.324,01', quantidade: 190 },
  { nome: 'Produto', tipo: 'Digital', faturamento: 'R$ 9.324,01', quantidade: 190 },
]

const tipoColors: Record<string, string> = { Digital: 'blue', Evento: 'orange', Serviço: 'green' }

export function TopProdutos() {
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-4">Top 10 produtos</Title>
      <div className="flex flex-col">
        <div className="flex items-center py-2 border-b border-[rgba(0,0,0,0.06)]">
          <div className="flex-1"><Text type="secondary" className="text-xs font-medium whitespace-nowrap">Produto</Text></div>
          <div className="w-[40px] shrink-0" />
          <div className="w-[80px] shrink-0" />
          <div className="w-[100px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs font-medium whitespace-nowrap">Faturamento</Text></div>
          <div className="w-[80px] text-right shrink-0 pl-4"><Text type="secondary" className="text-xs font-medium whitespace-nowrap">Quantidade</Text></div>
        </div>
        {topProdutos.map((p, i) => (
          <div key={i} className="flex items-center py-3 border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
            <div className="flex-1"><Text className="text-sm whitespace-nowrap">{p.nome}</Text></div>
            <div className="w-[40px] shrink-0 flex justify-center"><ExportOutlined className="text-[rgba(0,0,0,0.25)] text-xs" /></div>
            <div className="w-[80px] shrink-0"><Tag color={tipoColors[p.tipo] || 'default'} className="!m-0">{p.tipo}</Tag></div>
            <div className="w-[100px] text-right shrink-0 pl-4"><Text className="text-sm whitespace-nowrap">{p.faturamento}</Text></div>
            <div className="w-[80px] text-right shrink-0 pl-4"><Text type="secondary" className="text-sm whitespace-nowrap">{p.quantidade}</Text></div>
          </div>
        ))}
      </div>
    </div>
  )
}
