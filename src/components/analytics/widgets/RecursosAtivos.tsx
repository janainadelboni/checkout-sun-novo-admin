import { Tooltip, Typography, Tag, Table } from 'antd'



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

export function RecursosAtivos() {
  const columns = [
    {
      title: 'Recurso',
      dataIndex: 'nome',
      key: 'nome',
      width: 200,
      render: (nome: string) => <Typography.Text strong className="whitespace-nowrap">{nome}</Typography.Text>,
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
      render: (valor: number) => `R$ ${valor.toLocaleString('pt-BR')}`,
    },
    {
      title: 'Participação nas vendas',
      key: 'participacao',
      width: 160,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.participacaoPercent) - parseFloat(b.participacaoPercent),
      render: (_: unknown, r: Recurso) => (
        <Tooltip title={`${r.participacaoCompras.toLocaleString('pt-BR')} compras`}>
          <span>{r.participacaoPercent}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Taxa de aceitação',
      dataIndex: 'taxaAceitacao',
      key: 'taxaAceitacao',
      width: 130,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.taxaAceitacao) - parseFloat(b.taxaAceitacao),
      render: (taxa: string) => (
        <Tooltip title="das exibições">
          <span>{taxa}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Impacto no checkout',
      dataIndex: 'impacto',
      key: 'impacto',
      width: 120,
      sorter: (a: Recurso, b: Recurso) => parseFloat(a.impacto) - parseFloat(b.impacto),
      render: (impacto: string) => impacto,
    },
  ]

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <div className="mb-1">
        <Typography.Title level={5} className="mb-0">Conversão de Recursos Ativos</Typography.Title>
      </div>
      <Typography.Text type="secondary" className="block mb-4">Recursos ranqueados por valor transacionado. Clique no cabeçalho para reordenar.</Typography.Text>

      <Table
        dataSource={recursosAtivos}
        columns={columns}
        pagination={false}
        size="middle"
        showSorterTooltip={false}
      />
    </div>
  )
}
