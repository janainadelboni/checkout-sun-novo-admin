import { Typography, Tag, Table } from 'antd'
import { ExportOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const topProdutos = [
  { key: '1', nome: 'Curso de Marketing Digital', tipo: 'Digital', valor: 42500, quantidade: 190, ticket: 223.68 },
  { key: '2', nome: 'Mentoria Elite 2026', tipo: 'Digital', valor: 38200, quantidade: 145, ticket: 263.45 },
  { key: '3', nome: 'Workshop de Vendas Presencial', tipo: 'Evento', valor: 28900, quantidade: 98, ticket: 294.90 },
  { key: '4', nome: 'Planilha Financeira Pro', tipo: 'Serviço', valor: 18700, quantidade: 312, ticket: 59.94 },
  { key: '5', nome: 'Lançamento VIP – Lote 1', tipo: 'Evento', valor: 15300, quantidade: 85, ticket: 180.00 },
  { key: '6', nome: 'Como treinar treinadores', tipo: 'Digital', valor: 12100, quantidade: 220, ticket: 55.00 },
  { key: '7', nome: 'Pack de Templates Canva', tipo: 'Serviço', valor: 9800, quantidade: 410, ticket: 23.90 },
  { key: '8', nome: 'Consultoria 1:1 Premium', tipo: 'Serviço', valor: 8500, quantidade: 17, ticket: 500.00 },
  { key: '9', nome: 'Ebook Receitas Fitness', tipo: 'Digital', valor: 6200, quantidade: 520, ticket: 11.92 },
  { key: '10', nome: 'Evento de teste – Comum', tipo: 'Evento', valor: 4100, quantidade: 62, ticket: 66.13 },
]

const tipoColors: Record<string, string> = { Digital: 'blue', Evento: 'orange', Serviço: 'green' }

export function TopProdutos() {
  const columns = [
    {
      title: 'Produto',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string) => (
        <div className="flex items-center gap-2">
          <Text className="text-sm">{nome}</Text>
          <ExportOutlined className="text-[rgba(0,0,0,0.25)] text-xs" />
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 100,
      render: (tipo: string) => <Tag color={tipoColors[tipo] || 'default'}>{tipo}</Tag>,
    },
    {
      title: 'Valor transacionado',
      dataIndex: 'valor',
      key: 'valor',
      width: 160,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.valor - b.valor,
      defaultSortOrder: 'descend' as const,
      render: (v: number) => <Text strong className="text-sm">R$ {v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: 'Ticket médio',
      dataIndex: 'ticket',
      key: 'ticket',
      width: 120,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.ticket - b.ticket,
      render: (v: number) => <Text className="text-sm">R$ {v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      width: 100,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.quantidade - b.quantidade,
      render: (v: number) => <Text type="secondary" className="text-sm">{v}</Text>,
    },
  ]

  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-4">Top 10 produtos</Title>
      <Table dataSource={topProdutos} columns={columns} pagination={false} size="small" showSorterTooltip={false} />
    </div>
  )
}
