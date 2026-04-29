import { Typography, Tag, Table } from 'antd'
import { Upload } from 'lucide-react'
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
          <Typography.Text >{nome}</Typography.Text>
          <Upload size={14} className="text-(--ant-color-text-quaternary) text-sm" />
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
      width: 200,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.valor - b.valor,
      defaultSortOrder: 'descend' as const,
      render: (v: number) => <Typography.Text strong>R$ {v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography.Text>,
    },
    {
      title: 'Ticket médio',
      dataIndex: 'ticket',
      key: 'ticket',
      width: 150,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.ticket - b.ticket,
      render: (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      width: 130,
      sorter: (a: typeof topProdutos[0], b: typeof topProdutos[0]) => a.quantidade - b.quantidade,
      render: (v: number) => <Typography.Text type="secondary">{v}</Typography.Text>,
    },
  ]

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <Typography.Title level={5} className="mb-4">Top 10 produtos</Typography.Title>
      <Table dataSource={topProdutos} columns={columns} pagination={false} size="middle" showSorterTooltip={false} />
    </div>
  )
}
