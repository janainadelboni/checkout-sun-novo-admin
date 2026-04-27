import { Typography, Tag, Table } from 'antd'

const { Title, Text } = Typography

type Recurso = {
  key: string
  nome: string
  tipo: string
  valorTransacionado: number
  participacaoPercent: string
  participacaoCompras: number
  taxaAceitacao: string
  impacto: string
}

const recursosAtivos: Recurso[] = [
  { key: '1', nome: 'Cupom de desconto', tipo: 'Conversão', valorTransacionado: 48200, participacaoPercent: '52%', participacaoCompras: 3456, taxaAceitacao: '45%', impacto: '20%' },
  { key: '2', nome: 'Order Bump', tipo: 'Conversão', valorTransacionado: 12800, participacaoPercent: '28%', participacaoCompras: 190, taxaAceitacao: '89%', impacto: '22%' },
  { key: '3', nome: 'Exit Pop-up', tipo: 'Conversão', valorTransacionado: 8400, participacaoPercent: '18%', participacaoCompras: 345, taxaAceitacao: '34%', impacto: '19%' },
  { key: '4', nome: 'One Click Buy', tipo: 'Recuperação', valorTransacionado: 4100, participacaoPercent: '10%', participacaoCompras: 34, taxaAceitacao: '10%', impacto: '18%' },
  { key: '5', nome: 'Página de obrigado', tipo: 'Upsell', valorTransacionado: 2900, participacaoPercent: '8%', participacaoCompras: 34, taxaAceitacao: '10%', impacto: '17%' },
  { key: '6', nome: 'Back Redirect', tipo: 'Recuperação', valorTransacionado: 2100, participacaoPercent: '5%', participacaoCompras: 18, taxaAceitacao: '8%', impacto: '15%' },
  { key: '7', nome: 'Timer de Escassez', tipo: 'Conversão', valorTransacionado: 1800, participacaoPercent: '4%', participacaoCompras: 12, taxaAceitacao: '—', impacto: '16%' },
  { key: '8', nome: 'Toast', tipo: 'Conversão', valorTransacionado: 950, participacaoPercent: '2%', participacaoCompras: 8, taxaAceitacao: '—', impacto: '14%' },
  { key: '9', nome: 'Checkout Embedado', tipo: 'Conversão', valorTransacionado: 620, participacaoPercent: '1%', participacaoCompras: 5, taxaAceitacao: '—', impacto: '12%' },
]

const tipoColors: Record<string, string> = {
  'Conversão': 'gold',
  'Upsell': 'volcano',
  'Recuperação': 'blue',
}

const maxValor = Math.max(...recursosAtivos.map((r) => r.valorTransacionado))

export function RecursosAtivos() {
  const columns = [
    {
      title: 'Recurso',
      dataIndex: 'nome',
      key: 'nome',
      width: 160,
      render: (nome: string) => <Text strong className="text-sm">{nome}</Text>,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 110,
      render: (tipo: string) => <Tag color={tipoColors[tipo] || 'default'}>{tipo}</Tag>,
    },
    {
      title: 'Valor transacionado',
      dataIndex: 'valorTransacionado',
      key: 'valorTransacionado',
      width: 180,
      sorter: (a: Recurso, b: Recurso) => a.valorTransacionado - b.valorTransacionado,
      render: (valor: number) => (
        <div>
          <Text strong className="text-sm">R$ {valor.toLocaleString('pt-BR')}</Text>
          <div className="h-1.5 bg-[#f0f0f0] rounded mt-1 w-full max-w-[120px]">
            <div className="h-full rounded bg-[#1890FF]" style={{ width: `${(valor / maxValor) * 100}%` }} />
          </div>
        </div>
      ),
    },
    {
      title: 'Participação nas vendas',
      key: 'participacao',
      width: 160,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.participacaoPercent) - parseFloat(b.participacaoPercent),
      render: (_: unknown, r: Recurso) => (
        <div>
          <Text strong className="text-sm">{r.participacaoPercent}</Text>
          <Text type="secondary" className="text-xs block">{r.participacaoCompras.toLocaleString('pt-BR')} compras</Text>
        </div>
      ),
    },
    {
      title: 'Taxa de aceitação',
      dataIndex: 'taxaAceitacao',
      key: 'taxaAceitacao',
      width: 130,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.taxaAceitacao) - parseFloat(b.taxaAceitacao),
      render: (taxa: string) => (
        <div>
          <Text strong className="text-sm">{taxa}</Text>
          <Text type="secondary" className="text-xs block">das exibições</Text>
        </div>
      ),
    },
    {
      title: 'Impacto no checkout',
      dataIndex: 'impacto',
      key: 'impacto',
      width: 120,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.impacto) - parseFloat(b.impacto),
      render: (impacto: string) => <Text strong className="text-sm">{impacto}</Text>,
    },
  ]

  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <div className="mb-1">
        <Title level={5} className="!mb-0">Conversão de Recursos Ativos</Title>
      </div>
      <Text type="secondary" className="text-xs block mb-4">Recursos ranqueados por valor transacionado. Clique no cabeçalho para reordenar.</Text>

      <Table
        dataSource={recursosAtivos}
        columns={columns}
        pagination={false}
        size="small"
        showSorterTooltip={false}
      />
    </div>
  )
}
