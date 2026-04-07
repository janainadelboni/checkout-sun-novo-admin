import { Typography, Tooltip, Tag } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const recursosAtivos = [
  { nome: 'Order bump', tipo: 'Conversão', percentual: '89%', quantidade: 190, vendas: 1250, configurados: 8, conversao: '89%' },
  { nome: 'Exit Pop-up', tipo: 'Conversão', percentual: '34%', quantidade: 345, vendas: 980, configurados: 5, conversao: '34%' },
  { nome: 'Página de obrigado', tipo: 'Upsell', percentual: '10%', quantidade: 34, vendas: 340, configurados: 3, conversao: '10%' },
  { nome: 'One Click Buy', tipo: 'Recuperação', percentual: '10%', quantidade: 34, vendas: 120, configurados: 2, conversao: '10%' },
  { nome: 'Cupom de desconto', tipo: 'Conversão', percentual: '45%', quantidade: 3456, vendas: 7680, configurados: 12, conversao: '45%' },
]

const tipoColors: Record<string, string> = {
  'Conversão': 'gold',
  'Upsell': 'volcano',
  'Recuperação': 'blue',
}

function RecursoTooltip({ r }: { r: typeof recursosAtivos[0] }) {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <div><strong>Quantidade de bumps vendidos:</strong> {r.quantidade.toLocaleString('pt-BR')}</div>
      <div><strong>Quantidade de Vendas:</strong> {r.vendas.toLocaleString('pt-BR')}</div>
      <div><strong>Quantidade de produtos configurados:</strong> {r.configurados}</div>
      <div><strong>Conversão:</strong> {r.conversao}</div>
    </div>
  )
}

export function RecursosAtivos() {
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-4">Conversão de Recursos Ativos</Title>
      <div className="flex flex-col">
        <div className="flex items-center py-2 border-b border-[rgba(0,0,0,0.06)]">
          <div className="flex-1" />
          <div className="w-[100px] shrink-0" />
          <div className="w-[80px] text-right shrink-0 pl-4">
            <Text type="secondary" className="text-xs font-medium whitespace-nowrap">Percentual</Text>
          </div>
          <div className="w-[90px] text-right shrink-0 pl-4">
            <Text type="secondary" className="text-xs font-medium whitespace-nowrap">Quantidades</Text>
          </div>
        </div>
        {recursosAtivos.map((r) => (
          <div key={r.nome} className="flex items-center py-3 border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
            <div className="flex-1"><Text className="text-sm whitespace-nowrap">{r.nome}</Text></div>
            <div className="w-[100px] shrink-0"><Tag color={tipoColors[r.tipo] || 'default'} className="!m-0">{r.tipo}</Tag></div>
            <div className="w-[80px] text-right shrink-0 pl-4"><Text strong className="text-sm whitespace-nowrap">{r.percentual}</Text></div>
            <div className="w-[90px] text-right shrink-0 pl-4 flex items-center justify-end gap-1">
              <Text type="secondary" className="text-sm whitespace-nowrap">{r.quantidade.toLocaleString('pt-BR')}</Text>
              <Tooltip title={<RecursoTooltip r={r} />} placement="left">
                <QuestionCircleOutlined className="text-[rgba(0,0,0,0.25)] text-xs cursor-help" />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
