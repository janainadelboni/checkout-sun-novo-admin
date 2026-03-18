import { useState } from 'react'
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Input,
  Layout,
  Menu,
  Pagination,
  Switch,
  Tag,
  Typography,
} from 'antd'
import {
  HomeOutlined,
  LeftOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons'

const { Sider, Content } = Layout
const { Title, Text } = Typography

type Produto = {
  id: number
  nome: string
  ativo: boolean
}

const produtosIniciais: Produto[] = [
  { id: 1, nome: '2704934 - A Nova Escola De Vendas', ativo: true },
  { id: 2, nome: '2704935 - Plano Black Monstro 40% OFF', ativo: true },
  { id: 3, nome: '2030747 - Academia 360', ativo: true },
  { id: 4, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 5, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 6, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 7, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 8, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 9, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 10, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 11, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
  { id: 12, nome: '2073333 - Apresentação Pesquisa Unity', ativo: false },
]

const stats = [
  { label: 'Total de pixels cadastrados', value: 23 },
  { label: 'Total de pixels ativos', value: 10 },
  { label: 'Total de pixels inativos', value: 3 },
  { label: 'Quantidade de eventos disparados', value: 5677 },
]

export default function PaginaDoPixel() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3])
  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState(['Todos'])
  const [currentPage, setCurrentPage] = useState(1)

  const allSelected =
    produtos.length > 0 && selectedIds.length === produtos.length
  const indeterminate =
    selectedIds.length > 0 && selectedIds.length < produtos.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(produtos.map((p) => p.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAtivo = (id: number) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    )
  }

  const handleDesativar = () => {
    setProdutos((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, ativo: false } : p))
    )
  }

  const handleAtivar = () => {
    setProdutos((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, ativo: true } : p))
    )
  }

  const removeTag = (tag: string) => {
    setFilterTags((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0d2772' } }}>
      <Layout className="min-h-screen bg-white">
        {/* Header */}
        <div className="h-[78px] bg-[#fafafa] flex items-center justify-center border-b border-[rgba(0,0,0,0.06)]">
          <img
            src="https://www.figma.com/api/mcp/asset/bd9aeaae-9ca0-4d48-94dc-e2450c2549f7"
            alt="Eduzz"
            className="h-[30px]"
          />
        </div>

        <Layout>
          {/* Sidebar */}
          <Sider width={288} className="!bg-white border-r border-[rgba(0,0,0,0.06)]">
            <div className="px-4 py-[10px]">
              <img
                src="https://www.figma.com/api/mcp/asset/ccb2f5d9-39f4-44a0-9ff5-69a4e8747651"
                alt="Checkout Sun"
                className="h-[25px]"
              />
            </div>
            <Menu
              mode="inline"
              selectedKeys={['monitoramento']}
              className="border-none"
              items={[
                { key: 'visao-geral', label: 'Visão geral' },
                { key: 'produtos', label: 'Produtos' },
                { key: 'monitoramento', label: 'Monitoramento' },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content className="p-8 bg-white flex flex-col gap-8">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { title: <HomeOutlined /> },
                { title: 'Breadcrumb Link' },
                { title: 'Breadcrumb Link' },
                { title: 'Breadcrumb Link' },
              ]}
            />

            {/* Back button */}
            <div>
              <Button icon={<LeftOutlined />}>Voltar</Button>
            </div>

            {/* Title + Actions */}
            <div className="flex items-start justify-between">
              <div>
                <Title level={3} className="!mb-1">
                  Pixel Google Analytics 4
                </Title>
                <Text type="secondary">
                  Acompanhe e configure seu pixel de rastreamento
                </Text>
              </div>
              <div className="flex gap-2">
                <Button>Configurar em massa</Button>
                <Button type="primary" icon={<PlusOutlined />}>
                  Atrelar novo produto
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#fafafa] rounded p-6 shadow-sm flex flex-col gap-2 h-[108px] justify-between"
                >
                  <Text type="secondary" className="text-sm leading-[22px]">
                    {stat.label}
                  </Text>
                  <Title level={2} className="!mb-0 !text-black">
                    {stat.value.toLocaleString('pt-BR')}
                  </Title>
                </div>
              ))}
            </div>

            {/* Search / filter */}
            <div className="border border-[#d9d9d9] rounded-lg p-4 flex flex-col gap-3">
              <Text strong>Pesquise por produto</Text>
              <Input
                placeholder="Pesquise pelo ID ou título do produto"
                suffix={<SearchOutlined className="text-[rgba(0,0,0,0.45)]" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex gap-2 flex-wrap">
                {filterTags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeTag(tag)}
                    className="text-sm"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Bulk action buttons */}
            <div className="flex justify-end gap-2">
              <Button onClick={handleDesativar}>Desativar selecionado(s)</Button>
              <Button onClick={handleAtivar}>Ativar selecionado(s)</Button>
            </div>

            {/* Table */}
            <div className="border border-[#f0f0f0] rounded-lg overflow-hidden bg-white">
              {/* Header */}
              <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)] h-[46px] items-center">
                <div className="w-[64px] flex items-center justify-center px-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = indeterminate
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-[#0d2772]"
                  />
                </div>
                <div className="flex-1 px-4">
                  <Text strong className="text-sm">Produto</Text>
                </div>
                <div className="w-[160px] px-4 flex items-center gap-2 justify-center">
                  <Text strong className="text-sm">Ação</Text>
                  <FilterOutlined className="text-[rgba(0,0,0,0.45)] text-xs" />
                </div>
                <div className="w-[160px] px-4 flex items-center justify-center">
                  <Text strong className="text-sm">Status</Text>
                </div>
              </div>

              {/* Rows */}
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="flex border-b border-[#f0f0f0] h-16 items-center"
                >
                  <div className="w-[64px] flex items-center justify-center px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(produto.id)}
                      onChange={() => toggleSelect(produto.id)}
                      className="w-4 h-4 cursor-pointer accent-[#0d2772]"
                    />
                  </div>
                  <div className="flex-1 px-4">
                    <Text>{produto.nome}</Text>
                  </div>
                  <div className="w-[160px] px-4 flex justify-center">
                    <a
                      href="#"
                      className="text-[#092691] text-sm hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Configurar
                    </a>
                  </div>
                  <div className="w-[160px] px-4 flex justify-center">
                    <Switch
                      checked={produto.ativo}
                      onChange={() => toggleAtivo(produto.id)}
                      size="default"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end">
              <Pagination
                current={currentPage}
                total={50}
                pageSize={10}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
