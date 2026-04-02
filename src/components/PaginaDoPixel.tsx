import { useState } from 'react'
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  HomeOutlined,
  LeftOutlined,
  PlusOutlined,
  SearchOutlined,

  DeleteOutlined,
  QuestionCircleOutlined,
  CaretRightOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import ConfigurarPixelModal, { type ModalMode, type PixelConfig } from './ConfigurarPixelModal'
import { EduzzLogo, CheckoutSunLogo } from './Logos'

const { Sider, Content } = Layout
const { Title, Text } = Typography

type Produto = {
  id: number
  nome: string
  tipo: 'principal' | 'variacao' | 'lote'
  produtoPaiNome?: string
}

type LogEnvio = {
  key: number
  nomeEvento: string
  origem: 'Navegador' | 'Servidor'
  dataHora: string
  status: 'Sucesso' | 'Erro'
  produtoId: number
}

const logsDeEnvio: LogEnvio[] = [
  { key: 1, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '19/03/2026 14:32:10', status: 'Sucesso', produtoId: 2704934 },
  { key: 2, nomeEvento: 'PageView', origem: 'Navegador', dataHora: '19/03/2026 13:15:44', status: 'Sucesso', produtoId: 2704934 },
  { key: 3, nomeEvento: 'FormInteraction', origem: 'Navegador', dataHora: '19/03/2026 12:08:22', status: 'Sucesso', produtoId: 2704935 },
  { key: 4, nomeEvento: 'Lead', origem: 'Navegador', dataHora: '18/03/2026 18:50:01', status: 'Erro', produtoId: 2704935 },
  { key: 5, nomeEvento: 'AddPaymentInfo', origem: 'Navegador', dataHora: '18/03/2026 16:22:33', status: 'Sucesso', produtoId: 2030747 },
  { key: 6, nomeEvento: 'PageView', origem: 'Navegador', dataHora: '18/03/2026 15:10:05', status: 'Sucesso', produtoId: 2704934 },
  { key: 7, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '18/03/2026 14:05:12', status: 'Erro', produtoId: 2030747 },
  { key: 8, nomeEvento: 'PageView', origem: 'Navegador', dataHora: '18/03/2026 10:05:33', status: 'Sucesso', produtoId: 2704935 },
  { key: 9, nomeEvento: 'FormInteraction', origem: 'Servidor', dataHora: '17/03/2026 22:14:50', status: 'Sucesso', produtoId: 2704934 },
  { key: 10, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '17/03/2026 19:30:00', status: 'Sucesso', produtoId: 2704935 },
  { key: 11, nomeEvento: 'ViewBoleto', origem: 'Navegador', dataHora: '17/03/2026 18:45:20', status: 'Sucesso', produtoId: 2411153 },
  { key: 12, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '17/03/2026 16:30:15', status: 'Sucesso', produtoId: 2073333 },
  { key: 13, nomeEvento: 'Lead', origem: 'Navegador', dataHora: '17/03/2026 14:20:08', status: 'Erro', produtoId: 9104452 },
  { key: 14, nomeEvento: 'PageView', origem: 'Navegador', dataHora: '17/03/2026 11:55:42', status: 'Sucesso', produtoId: 2576289 },
  { key: 15, nomeEvento: 'AddPaymentInfo', origem: 'Servidor', dataHora: '16/03/2026 20:10:30', status: 'Sucesso', produtoId: 2704934 },
  { key: 16, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '16/03/2026 18:44:12', status: 'Sucesso', produtoId: 2073334 },
  { key: 17, nomeEvento: 'FormInteraction', origem: 'Navegador', dataHora: '16/03/2026 15:30:00', status: 'Sucesso', produtoId: 2030747 },
  { key: 18, nomeEvento: 'Lead', origem: 'Navegador', dataHora: '16/03/2026 12:15:55', status: 'Erro', produtoId: 2704935 },
  { key: 19, nomeEvento: 'PageView', origem: 'Navegador', dataHora: '15/03/2026 22:05:18', status: 'Sucesso', produtoId: 9104452 },
  { key: 20, nomeEvento: 'Purchase', origem: 'Servidor', dataHora: '15/03/2026 19:48:33', status: 'Sucesso', produtoId: 2704934 },
]

const produtosIniciais: Produto[] = [
  { id: 2704934, nome: 'A Nova Escola De Vendas', tipo: 'principal' },
  { id: 2704935, nome: 'Plano Black Monstro 40% OFF', tipo: 'principal' },
  { id: 2411153, nome: 'A sabedoria do grande sábio do marketing digital', tipo: 'principal' },
  { id: 2030747, nome: 'Academia 360', tipo: 'principal' },
  { id: 2576289, nome: 'Ingresso PISTA - Lote 01', tipo: 'lote', produtoPaiNome: 'Festival Eduzz Summit 2026' },
  { id: 2073333, nome: 'Apresentação Pesquisa Unity', tipo: 'principal' },
  { id: 9104452, nome: 'Planilha de vendas', tipo: 'variacao', produtoPaiNome: 'Pack de Templates Pro' },
  { id: 2073334, nome: 'Curso de Marketing Digital', tipo: 'principal' },
]

// stats calculados dinamicamente dentro do componente

/* --- Mapa de nomes dos providers --- */
const PROVIDER_NAMES: Record<string, string> = {
  meta: 'Facebook',
  ga4: 'Google Analytics 4',
  google_ads: 'Google AdWords',
  gtm: 'Google Tag Manager',
  hubspot: 'HubSpot',
}

const PROVIDER_LOGOS: Record<string, string> = {
  meta: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
  ga4: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
  google_ads: 'https://www.gstatic.com/adx/doubleclick.ico',
  gtm: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
  hubspot: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
}

interface PaginaDoPixelProps {
  provider?: string
  onVoltar?: () => void
}

export default function PaginaDoPixel({ provider = 'ga4', onVoltar }: PaginaDoPixelProps) {
  const [produtos] = useState<Produto[]>(produtosIniciais)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [produtoFilter, setProdutoFilter] = useState<number[]>([])
  const [funilPeriodo, setFunilPeriodo] = useState<string>('ultimos_30')

  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('produtos')
  const [logProdutoFilter, setLogProdutoFilter] = useState<number[]>([])
  const [logOrigemFilter, setLogOrigemFilter] = useState<string | null>(null)
  const [logEventoFilter, setLogEventoFilter] = useState<string | null>(null)
  const [logStatusFilter, setLogStatusFilter] = useState<string | null>(null)
  const [logPeriodoFilter, setLogPeriodoFilter] = useState<string | null>('ultimos_30')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>({ type: 'new' })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [testProdutoFilter, setTestProdutoFilter] = useState<number | null>(null)
  const [testCode, setTestCode] = useState('')
  const [testValidated, setTestValidated] = useState(false)
  const [testResults, setTestResults] = useState<{ evento: string; origem: string; parametro: string; dataHora: string; status: 'Sucesso' | 'Erro' }[]>([])

  const handleTestarEvento = (eventoName: string) => {
    const origens = ['Navegador', 'Servidor'] as const
    const statuses = ['Sucesso', 'Sucesso', 'Sucesso', 'Erro'] as const // 75% sucesso
    const novoResult = {
      evento: eventoName,
      origem: origens[Math.floor(Math.random() * origens.length)],
      parametro: 'Valor customizado',
      dataHora: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }
    setTestResults((prev) => [novoResult, ...prev])
  }

  const handleLimparTestes = () => {
    setTestResults([])
  }

  const handleClearTestFilter = () => {
    setTestProdutoFilter(null)
    setTestCode('')
    setTestValidated(false)
    setTestResults([])
  }

  // Simula configs existentes (para demonstrar modo edicao)
  const [pixelConfigs, setPixelConfigs] = useState<Record<number, PixelConfig>>({
    2704934: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'Lead', 'AddPaymentInfo', 'Initiatecheckout', 'Purchase'],
      apiConversao: true,
      tokenApi: 'EAABsbCS1IEXBO...',
      produtos: [2704934],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
    2704935: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'AddPaymentInfo', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: [2704935],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
    2411153: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'Lead', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: [2411153],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
    2030747: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'Initiatecheckout', 'Purchase'],
      apiConversao: true,
      tokenApi: 'EAABsbCS1IEXBO...',
      produtos: [2030747],
      diferenciarBoleto: false,
      valorCustomizado: 'sempre',
    },
    2576289: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'AddPaymentInfo'],
      apiConversao: false,
      tokenApi: '',
      produtos: [2576289],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
    2073333: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'Lead', 'Initiatecheckout', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: [2073333],
      diferenciarBoleto: true,
      valorCustomizado: 'nunca',
    },
    9104452: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: [9104452],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
    2073334: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'AddPaymentInfo', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: [2073334],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
    },
  })

  const handleOpenNew = () => {
    // "Configurar e vincular produtos" — abre direto no provider da página com produtos pré-selecionados
    const providerKey = (provider as import('./ConfigurarPixelModal').PixelProvider) || 'meta'
    const allProdutoIds = produtos.map(p => p.id)
    const produtoNomes: Record<number, string> = {}
    for (const p of produtos) { produtoNomes[p.id] = p.nome }
    setModalMode({ type: 'bulk', produtoIds: allProdutoIds, produtoNomes, provider: providerKey })
    setModalOpen(true)
  }


  const handleSaveConfig = (config: PixelConfig) => {
    const newConfigs = { ...pixelConfigs }
    for (const prodId of config.produtos) {
      newConfigs[prodId] = config
    }
    setPixelConfigs(newConfigs)
    console.log('Pixel configurado:', config)
  }

  const handleClearAllLogFilters = () => {
    setLogProdutoFilter([])
    setLogOrigemFilter(null)
    setLogEventoFilter(null)
    setLogStatusFilter(null)
    setLogPeriodoFilter('ultimos_30')
  }

  const hasAnyLogFilter =
    logProdutoFilter.length > 0 ||
    logOrigemFilter !== null ||
    logEventoFilter !== null ||
    logStatusFilter !== null

  const logsFiltrados = logsDeEnvio.filter((log) => {
    if (logProdutoFilter.length > 0 && !logProdutoFilter.includes(log.produtoId)) return false
    if (logOrigemFilter && log.origem !== logOrigemFilter) return false
    if (logEventoFilter && log.nomeEvento !== logEventoFilter) return false
    if (logStatusFilter && log.status !== logStatusFilter) return false
    return true
  })

  // Opcoes de filtro derivadas dos dados
  const eventosUnicos = [...new Set(logsDeEnvio.map((l) => l.nomeEvento))]

  // Filtered products for the table
  const produtosFiltrados = produtos.filter((p) => {
    if (produtoFilter.length > 0 && !produtoFilter.includes(p.id)) return false
    return true
  })

  const pageSize = 10
  const paginatedProdutos = produtosFiltrados.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const allSelected =
    paginatedProdutos.length > 0 &&
    paginatedProdutos.every((p) => selectedIds.includes(p.id))
  const indeterminate =
    paginatedProdutos.some((p) => selectedIds.includes(p.id)) && !allSelected

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedProdutos.some((p) => p.id === id))
      )
    } else {
      const pageIds = paginatedProdutos.map((p) => p.id)
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])])
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    setSelectedIds([])
    setDeleteModalOpen(false)
  }

  const handleClearProductFilters = () => {
    setProdutoFilter([])
  }

  // Mapa de cores dos eventos (mesma ordem e cor do funil)
  const eventoCores: Record<string, string> = {
    'PageView': '#1890FF',
    'FormInteraction': '#FAAD14',
    'Lead': '#13C2C2',
    'AddPaymentInfo': '#52C41A',
    'Initiatecheckout': '#EB2F96',
    'Purchase': '#722ED1',
  }
  const ordemEventos = ['PageView', 'FormInteraction', 'Lead', 'AddPaymentInfo', 'Initiatecheckout', 'Purchase']

  // Eventos cadastrados por produto (mock) — usando os mesmos nomes do funil
  const eventosPorProduto: Record<number, { nome: string; disparados: number }[]> = {
    2704934: [
      { nome: 'PageView', disparados: 2450 },
      { nome: 'FormInteraction', disparados: 890 },
      { nome: 'Lead', disparados: 345 },
      { nome: 'AddPaymentInfo', disparados: 210 },
      { nome: 'Initiatecheckout', disparados: 156 },
      { nome: 'Purchase', disparados: 78 },
    ],
    2704935: [
      { nome: 'PageView', disparados: 1800 },
      { nome: 'FormInteraction', disparados: 620 },
      { nome: 'AddPaymentInfo', disparados: 220 },
      { nome: 'Purchase', disparados: 15 },
    ],
    2411153: [
      { nome: 'PageView', disparados: 890 },
      { nome: 'Lead', disparados: 45 },
      { nome: 'Purchase', disparados: 8 },
    ],
    2030747: [
      { nome: 'PageView', disparados: 1024 },
      { nome: 'FormInteraction', disparados: 567 },
      { nome: 'Initiatecheckout', disparados: 312 },
      { nome: 'Purchase', disparados: 89 },
    ],
    2576289: [
      { nome: 'PageView', disparados: 312 },
      { nome: 'AddPaymentInfo', disparados: 78 },
    ],
    2073333: [
      { nome: 'PageView', disparados: 4200 },
      { nome: 'Lead', disparados: 180 },
      { nome: 'Initiatecheckout', disparados: 95 },
      { nome: 'Purchase', disparados: 52 },
    ],
    9104452: [
      { nome: 'PageView', disparados: 650 },
      { nome: 'FormInteraction', disparados: 234 },
      { nome: 'Purchase', disparados: 33 },
    ],
    2073334: [
      { nome: 'PageView', disparados: 1500 },
      { nome: 'FormInteraction', disparados: 430 },
      { nome: 'AddPaymentInfo', disparados: 200 },
      { nome: 'Purchase', disparados: 75 },
    ],
  }

  // Agrupa eventos por etapa do funil
  const eventosAgrupados: Record<string, number> = {}
  for (const eventos of Object.values(eventosPorProduto)) {
    for (const ev of eventos) {
      eventosAgrupados[ev.nome] = (eventosAgrupados[ev.nome] || 0) + ev.disparados
    }
  }

  // Etapas do funil usando os mesmos eventos cadastráveis (topo → fundo)
  const funilEtapas = [
    { label: 'PageView', valor: 10200, cor: '#1890FF' },
    { label: 'FormInteraction', valor: 4590, cor: '#FAAD14' },
    { label: 'Lead', valor: 2856, cor: '#13C2C2' },
    { label: 'AddPaymentInfo', valor: 1820, cor: '#52C41A' },
    { label: 'Initiatecheckout', valor: 1224, cor: '#EB2F96' },
    { label: 'Purchase', valor: 380, cor: '#722ED1' },
  ]
  const funilTopo = funilEtapas[0].valor || 1
  const funilComPercent = funilEtapas.map((etapa, i) => {
    const topoFundo = ((etapa.valor / funilTopo) * 100).toFixed(0)
    const anterior = i > 0 ? funilEtapas[i - 1].valor : etapa.valor
    const entreEtapas = anterior > 0 ? ((etapa.valor / anterior) * 100).toFixed(0) : '0'
    return { ...etapa, topoFundo, entreEtapas }
  })



  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleConfigIndividual = (produtoId: number) => {
    const produto = produtos.find((p) => p.id === produtoId)
    const existing = pixelConfigs[produtoId]
    const providerKey = (provider as import('./ConfigurarPixelModal').PixelProvider) || 'meta'
    setModalMode({
      type: 'edit',
      produtoId,
      produtoNome: produto?.nome || `Produto ${produtoId}`,
      existing,
      provider: providerKey,
    })
    setModalOpen(true)
  }

  const handleTestarEnvio = (produtoId: number) => {
    setTestProdutoFilter(produtoId)
    setActiveTab('teste')
  }

  const handleVerLogEventos = (produtoId: number) => {
    setLogProdutoFilter([produtoId])
    setActiveTab('logs')
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0d2772' } }}>
      <Layout className="min-h-screen bg-white">
        {/* Header */}
        <div className="h-[78px] bg-[#fafafa] flex items-center justify-center border-b border-[rgba(0,0,0,0.06)]">
          <EduzzLogo />
        </div>

        <Layout>
          {/* Sidebar */}
          <Sider width={288} className="!bg-white border-r border-[rgba(0,0,0,0.06)]">
            <div className="px-4 py-[10px]">
              <CheckoutSunLogo />
            </div>
            <Menu
              mode="inline"
              selectedKeys={['rastreamento']}
              className="border-none"
              items={[
                { key: 'visao-geral', label: 'Visao geral' },
                { key: 'produtos', label: 'Produtos' },
                { key: 'rastreamento', label: 'Rastreamento' },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content className="p-8 bg-white flex flex-col gap-8 max-w-[1280px] mx-auto w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { title: <HomeOutlined /> },
                { title: 'Checkout Sun' },
                { title: 'Rastreamento' },
                { title: PROVIDER_NAMES[provider] || 'Pixel' },
              ]}
            />

            {/* Back button */}
            <div>
              <Button icon={<LeftOutlined />} onClick={onVoltar}>Voltar</Button>
            </div>

            {/* Title + Actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {PROVIDER_LOGOS[provider] && (
                  <img src={PROVIDER_LOGOS[provider]} alt="" className="h-8 object-contain" />
                )}
                <div>
                  <Title level={3} className="!mb-1">
                    {PROVIDER_NAMES[provider] || 'Pixel'}
                  </Title>
                  <Text type="secondary">
                    Acompanhe e configure seu pixel de rastreamento
                  </Text>
                </div>
              </div>
              <Button
                style={{ backgroundColor: '#FAAD14', borderColor: '#FAAD14', color: '#fff' }}
                icon={<PlusOutlined />}
                onClick={handleOpenNew}
              >
                Configurar e vincular produtos
              </Button>
            </div>

            {/* Tabs: Produtos / Logs de Eventos */}
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key)
                if (key === 'produtos') {
                  handleClearAllLogFilters()
                }
              }}
              items={[
                {
                  key: 'produtos',
                  label: 'Produtos',
                  children: (
                    <div className="flex flex-col gap-6">
                      {/* Search / filter area */}
                      <div className="bg-[#fafafa] rounded-lg p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Text strong className="text-sm">Filtrar por produto</Text>
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Todos"
                            value={produtoFilter}
                            onChange={(value) => setProdutoFilter(value)}
                            options={produtosIniciais.map((p) => ({
                              value: p.id,
                              label: `${p.id} - ${p.nome}`,
                            }))}
                            showSearch
                            filterOption={(input, option) =>
                              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            suffixIcon={<SearchOutlined className="text-[rgba(0,0,0,0.45)]" />}
                            className="w-full"
                            maxTagCount="responsive"
                          />
                        </div>

                        {/* Active filter tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Text type="secondary" className="text-xs">Filtros ativos:</Text>
                          {produtoFilter.length > 0 ? (
                            produtoFilter.map((id) => {
                              const p = produtosIniciais.find((pr) => pr.id === id)
                              return (
                                <Tag key={`prod-${id}`} closable onClose={() => setProdutoFilter((prev) => prev.filter((x) => x !== id))} className="!text-xs">
                                  Produto: {id} - {p?.nome || id}
                                </Tag>
                              )
                            })
                          ) : (
                            <Tag className="!text-xs !font-medium">Produtos: Todos ({produtos.length})</Tag>
                          )}
                          {produtoFilter.length > 0 && (
                            <a
                              href="#"
                              className="text-[rgba(0,0,0,0.45)] text-xs hover:text-[rgba(0,0,0,0.65)]"
                              onClick={(e) => {
                                e.preventDefault()
                                handleClearProductFilters()
                              }}
                            >
                              Limpar filtros
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Funil de eventos + KPIs lado a lado */}
                      <div className="flex flex-col gap-3">
                        {/* Título + filtro de período */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Title level={5} className="!mb-0">Funil de eventos</Title>
                            <Tooltip title="Taxa calculada com base no PageView (base = 100%). Valores variam conforme produtos e período filtrados.">
                              <QuestionCircleOutlined className="text-[rgba(0,0,0,0.45)] text-sm cursor-help" />
                            </Tooltip>
                          </div>
                          <Select
                            value={funilPeriodo}
                            onChange={(value) => setFunilPeriodo(value)}
                            options={[
                              { value: 'ultimos_7', label: 'Últimos 7 dias' },
                              { value: 'ultimos_15', label: 'Últimos 15 dias' },
                              { value: 'ultimos_30', label: 'Últimos 30 dias' },
                              { value: 'ultimos_90', label: 'Últimos 90 dias' },
                            ]}
                            className="w-[170px]"
                            size="small"
                          />
                        </div>

                        <div className="flex gap-6 items-stretch">
                          {/* Funil - Esquerda */}
                          <div className="flex-1 flex flex-col justify-between">
                            {/* Header do funil */}
                            <div className="flex items-center justify-end gap-0 mb-1">
                              <Tooltip title="Taxa calculada com base no PageView do período selecionado.">
                                <div className="w-[50px] text-right cursor-help">
                                  <Text type="secondary" className="text-[11px] font-medium whitespace-nowrap">Taxa</Text>
                                </div>
                              </Tooltip>
                              <div className="w-[70px] text-right">
                                <Text type="secondary" className="text-[11px] font-medium whitespace-nowrap">Qtd.</Text>
                              </div>
                            </div>

                            {/* Etapas */}
                            {funilComPercent.map((etapa) => (
                              <div key={etapa.label} className="flex items-center gap-2">
                                <div className="w-[140px] shrink-0">
                                  <Tag
                                    className="!text-xs !font-semibold !px-2 !py-0.5 !rounded"
                                    style={{
                                      color: '#0d2772',
                                      borderColor: '#0d2772',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    {etapa.label}
                                  </Tag>
                                </div>
                                <div className="flex-1 h-6 bg-[#f5f5f5] rounded overflow-hidden">
                                  <div
                                    className="h-full rounded transition-all"
                                    style={{
                                      width: `${etapa.topoFundo}%`,
                                      backgroundColor: etapa.cor,
                                      minWidth: '4px',
                                    }}
                                  />
                                </div>
                                <div className="w-[50px] text-right shrink-0">
                                  <Text strong className="text-xs">{etapa.topoFundo}%</Text>
                                </div>
                                <div className="w-[70px] text-right shrink-0">
                                  <Text type="secondary" className="text-xs">{etapa.valor.toLocaleString('pt-BR')}</Text>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Cards - Direita */}
                          <div className="w-[240px] shrink-0 flex flex-col gap-3">
                            {/* Saúde do pixel */}
                            <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-4 flex flex-col gap-2.5">
                              <Text type="secondary" className="text-xs font-medium">Saúde do pixel</Text>
                              <div className="flex items-center justify-between">
                                <Text className="text-xs">Último evento</Text>
                                <Tag color="success" className="!text-xs !border-solid !m-0">há 12 min</Tag>
                              </div>
                              <div className="flex items-center justify-between">
                                <Text className="text-xs">Eventos com erro</Text>
                                <Tag color="error" className="!text-xs !border-solid !m-0">4 (20%)</Tag>
                              </div>
                            </div>

                            {/* Cobertura por evento */}
                            <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-4 flex flex-col gap-2">
                              <Tooltip title="Quantos produtos/eventos atrelados possuem cada evento configurado.">
                                <Text type="secondary" className="text-xs font-medium mb-0.5 cursor-help">Cobertura de evento por produto</Text>
                              </Tooltip>
                              {ordemEventos.map((eventoName) => {
                                const produtosComEvento = produtosFiltrados.filter((p) => {
                                  const evs = eventosPorProduto[p.id] || []
                                  return evs.some((e) => e.nome === eventoName)
                                })
                                const com = produtosComEvento.length
                                const cor = eventoCores[eventoName] || '#8c8c8c'
                                const total = produtosFiltrados.length
                                const nomesLista = produtosComEvento.map((p) => `${p.id} - ${p.nome}`).join('\n')
                                const tooltipText = `${com} de ${total} produtos com ${eventoName}:\n${nomesLista}`

                                return (
                                  <Tooltip
                                    key={eventoName}
                                    title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
                                  >
                                    <div
                                      className="flex items-center justify-between cursor-pointer hover:bg-[rgba(0,0,0,0.04)] rounded px-1 -mx-1"
                                      onClick={() => {
                                        const ids = produtosComEvento.map((p) => p.id)
                                        setProdutoFilter(ids)
                                      }}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cor }} />
                                        <Text className="text-xs">{eventoName}</Text>
                                      </div>
                                      <Text strong className={`text-xs ${com < total ? '!text-[#FAAD14]' : '!text-[#52C41A]'}`}>
                                        {com}/{total}
                                      </Text>
                                    </div>
                                  </Tooltip>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bulk action buttons */}
                      {selectedIds.length > 0 && (
                        <div className="flex justify-end gap-3">
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteSelected}
                          >
                            Excluir selecionado(s)
                          </Button>
                        </div>
                      )}

                      {/* Simple table */}
                      <div className="border border-[#f0f0f0] rounded-lg bg-white">
                        {/* Header */}
                        <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)] h-[46px] items-center rounded-t-lg">
                          <div className="w-[48px] flex items-center justify-center">
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
                          <div className="flex-1 px-4 flex items-center gap-1">
                            <Text strong className="text-sm">Produtos</Text>
                            <Tooltip title="Essa tela se refere aos produtos, em caso de eventos Blinket, se refere a cada ingresso ou lote individualmente.">
                              <QuestionCircleOutlined className="text-xs text-[rgba(0,0,0,0.45)] cursor-help" />
                            </Tooltip>
                          </div>
                          <div className="w-[140px] px-4 flex items-center justify-center shrink-0">
                            <Text strong className="text-sm whitespace-nowrap">Configuração</Text>
                          </div>
                          <div className="w-[120px] px-4 flex items-center justify-center shrink-0">
                            <Text strong className="text-sm">Detalhes</Text>
                          </div>
                        </div>

                        {/* Rows */}
                        {paginatedProdutos.map((produto) => {
                          const isExpanded = expandedId === produto.id
                          const eventosRaw = eventosPorProduto[produto.id] || []
                          const eventos = [...eventosRaw].sort((a, b) => {
                            const ia = ordemEventos.indexOf(a.nome)
                            const ib = ordemEventos.indexOf(b.nome)
                            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
                          })
                          return (
                            <div key={produto.id}>
                              {/* Main row */}
                              <div
                                className={`flex border-b border-[#f0f0f0] min-h-[56px] items-center hover:bg-[#fafafa] cursor-pointer ${isExpanded ? 'bg-[#fafafa]' : ''}`}
                                onClick={() => toggleExpand(produto.id)}
                              >
                                <div className="w-[48px] flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(produto.id)}
                                    onChange={() => toggleSelect(produto.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 cursor-pointer accent-[#0d2772]"
                                  />
                                </div>
                                <div className="flex-1 px-4">
                                  <span className="text-sm">
                                    {produto.id} - {produto.nome}
                                  </span>
                                </div>
                                <div className="w-[140px] px-4 flex justify-center shrink-0">
                                  <Tooltip title="Configurar eventos e pixel deste produto individualmente">
                                    <Button
                                      type="text"
                                      icon={<SettingOutlined />}
                                      onClick={(e) => { e.stopPropagation(); handleConfigIndividual(produto.id) }}
                                      className="!text-[rgba(0,0,0,0.45)] hover:!text-[#0d2772] !whitespace-nowrap"
                                    >
                                      Configurar
                                    </Button>
                                  </Tooltip>
                                </div>
                                <div className="w-[120px] px-4 flex justify-center shrink-0">
                                  <a
                                    href="#"
                                    className="text-[#1677ff] text-sm hover:underline"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      toggleExpand(produto.id)
                                    }}
                                  >
                                    {isExpanded ? 'Ver menos' : 'Ver detalhes'}
                                  </a>
                                </div>
                              </div>

                              {/* Expanded content */}
                              {isExpanded && (
                                <div className="border-b border-[#f0f0f0] bg-white px-12 py-6">
                                  {/* Events table - simple format */}
                                  <div className="border border-[#f0f0f0] rounded-lg overflow-hidden mb-4">
                                    <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)] h-[40px] items-center">
                                      <div className="flex-1 px-4">
                                        <Text strong className="text-sm">Eventos cadastrados</Text>
                                      </div>
                                      <div className="w-[140px] px-4 text-right">
                                        <Text strong className="text-sm">Percentual</Text>
                                      </div>
                                      <div className="w-[140px] px-4 text-right">
                                        <Text strong className="text-sm">Quantidade</Text>
                                      </div>
                                    </div>
                                    {eventos.map((ev, i) => {
                                      const maxDisparados = Math.max(...eventos.map(e => e.disparados), 1)
                                      const percentual = ((ev.disparados / maxDisparados) * 100).toFixed(0)
                                      const cor = eventoCores[ev.nome] || '#8c8c8c'
                                      return (
                                        <div key={i} className="flex border-b border-[#f0f0f0] h-12 items-center">
                                          <div className="flex-1 px-4">
                                            <Tag
                                              className="!text-xs !font-semibold !px-2 !py-0.5 !rounded"
                                              style={{
                                                color: '#0d2772',
                                                borderColor: '#0d2772',
                                                backgroundColor: 'transparent',
                                              }}
                                            >
                                              <span
                                                className="inline-block w-2 h-2 rounded-full mr-1.5"
                                                style={{ backgroundColor: cor }}
                                              />
                                              {ev.nome}
                                            </Tag>
                                          </div>
                                          <div className="w-[140px] px-4 text-right">
                                            <Text className="text-sm">{percentual}%</Text>
                                          </div>
                                          <div className="w-[140px] px-4 text-right">
                                            <Text className="text-sm">{ev.disparados.toLocaleString('pt-BR')}</Text>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex gap-3">
                                    <Button onClick={() => handleConfigIndividual(produto.id)}>
                                      Configurar individualmente
                                    </Button>
                                    <Button onClick={() => handleTestarEnvio(produto.id)}>
                                      Testar envio dos eventos
                                    </Button>
                                    <Button onClick={() => handleVerLogEventos(produto.id)}>
                                      Ver log eventos
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Pagination */}
                      <div className="flex justify-end">
                        <Pagination
                          current={currentPage}
                          total={produtosFiltrados.length}
                          pageSize={pageSize}
                          onChange={setCurrentPage}
                          showSizeChanger={false}
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'logs',
                  label: 'Logs de eventos',
                  children: (
                    <div className="flex flex-col gap-6">
                      {/* Filtros */}
                      <div className="bg-[#fafafa] rounded-lg p-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                          <Text strong className="text-sm">Filtrar por produto</Text>
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Todos"
                            value={logProdutoFilter}
                            onChange={(value) => setLogProdutoFilter(value)}
                            options={produtosIniciais.map((p) => ({
                              value: p.id,
                              label: `${p.id} - ${p.nome}`,
                            }))}
                            showSearch
                            filterOption={(input, option) =>
                              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            suffixIcon={<SearchOutlined className="text-[rgba(0,0,0,0.45)]" />}
                            className="w-full"
                            maxTagCount="responsive"
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <Text type="secondary" className="text-xs">Periodo</Text>
                            <Select
                              value={logPeriodoFilter}
                              onChange={setLogPeriodoFilter}
                              options={[
                                { value: 'ultimos_30', label: 'Últimos 30 dias' },
                                { value: 'ultimos_7', label: 'Últimos 7 dias' },
                                { value: 'hoje', label: 'Hoje' },
                                { value: 'custom', label: 'Personalizado' },
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Text type="secondary" className="text-xs">Origem</Text>
                            <Select
                              allowClear
                              placeholder="Todos"
                              value={logOrigemFilter}
                              onChange={(value) => setLogOrigemFilter(value ?? null)}
                              options={[
                                { value: 'Navegador', label: 'Navegador' },
                                { value: 'Servidor', label: 'Servidor' },
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Text type="secondary" className="text-xs">Evento</Text>
                            <Select
                              allowClear
                              placeholder="Todos"
                              value={logEventoFilter}
                              onChange={(value) => setLogEventoFilter(value ?? null)}
                              options={eventosUnicos.map((ev) => ({ value: ev, label: ev }))}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Text type="secondary" className="text-xs">Status</Text>
                            <Select
                              allowClear
                              placeholder="Todos"
                              value={logStatusFilter}
                              onChange={(value) => setLogStatusFilter(value ?? null)}
                              options={[
                                { value: 'Sucesso', label: 'Sucesso' },
                                { value: 'Erro', label: 'Erro' },
                              ]}
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Text type="secondary" className="text-xs">Filtros ativos:</Text>
                          {logProdutoFilter.length > 0 ? (
                            logProdutoFilter.map((id) => {
                              const p = produtosIniciais.find((pr) => pr.id === id)
                              return (
                                <Tag key={`prod-${id}`} closable onClose={() => setLogProdutoFilter((prev) => prev.filter((x) => x !== id))} className="!text-xs">
                                  Produto/Evento: {id} - {p?.nome || id}
                                </Tag>
                              )
                            })
                          ) : (
                            <Tag className="!text-xs">Produtos: Todos</Tag>
                          )}
                          <Tag className="!text-xs">Últimos 30 dias</Tag>
                          <Tag className="!text-xs">Origem: {logOrigemFilter ?? 'Todos'}</Tag>
                          <Tag className="!text-xs">Eventos: {logEventoFilter ?? 'todos'}</Tag>
                          <Tag className="!text-xs">Status: {logStatusFilter ?? 'todos'}</Tag>
                          {hasAnyLogFilter && (
                            <a href="#" className="text-[rgba(0,0,0,0.45)] text-xs" onClick={(e) => { e.preventDefault(); handleClearAllLogFilters() }}>
                              Limpar filtros
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Summary bar */}
                      <div className="flex items-center gap-3 justify-end">
                        <Text type="secondary" className="text-sm">
                          {logsFiltrados.length} evento(s) encontrado(s)
                        </Text>
                        <Tag color="success" className="!border-solid">
                          {logsFiltrados.filter((l) => l.status === 'Sucesso').length} sucesso(s)
                        </Tag>
                        <Tag color="error" className="!border-solid">
                          {logsFiltrados.filter((l) => l.status === 'Erro').length} erro(s)
                        </Tag>
                      </div>

                      {/* Logs table */}
                      <Table
                        dataSource={logsFiltrados}
                        columns={[
                          {
                            title: 'Produto',
                            dataIndex: 'produtoId',
                            key: 'produtoId',
                            render: (produtoId: number) => {
                              const p = produtosIniciais.find((pr) => pr.id === produtoId)
                              return (
                                <Text className="text-xs text-[rgba(0,0,0,0.65)]">
                                  {produtoId} - {p?.nome || 'Desconhecido'}
                                </Text>
                              )
                            },
                          },
                          {
                            title: 'Evento',
                            dataIndex: 'nomeEvento',
                            key: 'nomeEvento',
                            render: (evento: string) => (
                              <Tag className="!border-solid !bg-transparent !text-[#0d2772] !border-[#d9d9d9] !font-medium">{evento}</Tag>
                            ),
                          },
                          {
                            title: 'Origem',
                            dataIndex: 'origem',
                            key: 'origem',
                            render: (origem: string) => {
                              const label = origem === 'Navegador' ? 'Pixel' : 'API'
                              const tip = origem === 'Navegador'
                                ? 'Pixel: evento disparado pelo navegador do usuário através do script de rastreamento instalado na página.'
                                : 'API: evento enviado diretamente pelo servidor via API de conversões, sem depender do navegador do usuário.'
                              return (
                                <Tooltip title={tip}>
                                  <Tag color={origem === 'Navegador' ? 'warning' : 'processing'} className="!border-solid cursor-help">{label}</Tag>
                                </Tooltip>
                              )
                            },
                          },
                          { title: 'Data e hora', dataIndex: 'dataHora', key: 'dataHora' },
                          {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status: string) => {
                              if (status === 'Sucesso') {
                                return <Tag color="success" className="!border-solid">Sucesso</Tag>
                              }
                              return (
                                <Tooltip title="O evento não foi enviado. Possíveis causas: ID do pixel incorreto, token da API inválido, timeout na conexão ou bloqueio por ad-blocker. Verifique as configurações do pixel e tente novamente.">
                                  <Tag color="error" className="!border-solid cursor-help">Não enviado</Tag>
                                </Tooltip>
                              )
                            },
                          },
                        ]}
                        pagination={{ pageSize: 10 }}
                        size="middle"
                      />
                    </div>
                  ),
                },
                {
                  key: 'teste',
                  label: 'Teste de evento',
                  children: (() => {
                    const hasTestProduct = testProdutoFilter !== null
                    const testProdutoInfo = hasTestProduct ? produtosIniciais.find((p) => p.id === testProdutoFilter) : null
                    const codeDisabled = !hasTestProduct ? 'opacity-40 pointer-events-none' : ''
                    const cardsDisabled = !testValidated ? 'opacity-40 pointer-events-none' : ''

                    return (
                    <div className="flex flex-col gap-6">
                      {/* Filtrar por produto */}
                      <div className="bg-[#fafafa] rounded-lg p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Text strong className="text-sm">Filtrar por produto</Text>
                          <Select
                            allowClear
                            placeholder="Selecione um produto para testar"
                            value={testProdutoFilter}
                            onChange={(value) => {
                              setTestProdutoFilter(value ?? null)
                              if (!value) {
                                setTestCode('')
                                setTestValidated(false)
                              }
                            }}
                            options={produtosIniciais.map((p) => ({
                              value: p.id,
                              label: `${p.id} - ${p.nome}`,
                            }))}
                            showSearch
                            filterOption={(input, option) =>
                              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            suffixIcon={<SearchOutlined className="text-[rgba(0,0,0,0.45)]" />}
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Text type="secondary" className="text-xs">Filtros ativos:</Text>
                          {hasTestProduct && testProdutoInfo ? (
                            <Tag closable onClose={handleClearTestFilter} className="!text-xs !font-medium">
                              Produto: {testProdutoFilter} - {testProdutoInfo.nome}
                            </Tag>
                          ) : (
                            <Tag className="!text-xs">Produto: Nenhum selecionado</Tag>
                          )}
                          {hasTestProduct && (
                            <a href="#" className="text-[rgba(0,0,0,0.45)] text-xs" onClick={(e) => { e.preventDefault(); handleClearTestFilter() }}>
                              Limpar filtros
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Código de teste */}
                      <div className={`border border-[#d9d9d9] rounded-lg p-6 flex flex-col gap-3 ${codeDisabled}`}>
                        <Title level={5} className="!mb-0">Código de teste da Meta</Title>
                        <Text type="secondary" className="text-sm">
                          Copie o código de teste do Gerenciador da Meta e cole aqui. O botão "testar" ficará disponível após o preenchimento. O código será enviado como parâmetro no link do checkout para que a Meta identifique o evento como teste.
                        </Text>
                        <div className="flex gap-2 mt-1">
                          <Input
                            placeholder="Cole o código de teste da Meta aqui (ex: TESTE1234)"
                            value={testCode}
                            onChange={(e) => { setTestCode(e.target.value); setTestValidated(false) }}
                            disabled={!hasTestProduct}
                            className="flex-1"
                          />
                          <Button
                            disabled={!hasTestProduct || !testCode}
                            onClick={() => setTestValidated(true)}
                          >
                            Validar
                          </Button>
                        </div>
                        {/* Warning banner */}
                        <div className="bg-[#E6F4FF] border border-[#91CAFF] rounded-lg px-4 py-2.5 mt-1">
                          <Text className="text-sm !text-[#0958D9]">
                            Para habilitar os botões "Testar", insira e valide o código de teste acima.
                          </Text>
                        </div>
                      </div>

                      {/* Event cards - 2 columns */}
                      <div className={`grid grid-cols-2 gap-4 ${cardsDisabled}`}>
                        {[
                          { name: 'PageView', desc: 'Quando o comprador acessa a página do checkout', cor: '#1890FF' },
                          { name: 'FormInteraction', desc: 'Ao preencher nome, e-mail ou outro campo inicial', cor: '#FAAD14' },
                          { name: 'Lead', desc: 'Ao preencher nome, email e telefone', cor: '#13C2C2' },
                          { name: 'AddPaymentInfo', desc: 'Ao interagir com formas de pagamento', cor: '#52C41A' },
                          { name: 'Initiatecheckout', desc: 'Ao interagir com o botão de finalizar compra', cor: '#EB2F96' },
                          { name: 'Purchase', desc: 'Quando o pagamento é confirmado', cor: '#722ED1' },
                        ].map((ev) => (
                          <div key={ev.name} className="border border-[#d9d9d9] rounded-lg p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Tag
                                className="!text-xs !font-semibold !px-2.5 !py-0.5 !rounded !bg-transparent"
                                style={{ color: '#0d2772', borderColor: '#0d2772' }}
                              >
                                {ev.name}
                              </Tag>
                              <Button
                                type="text"
                                size="small"
                                disabled={!testValidated}
                                onClick={() => handleTestarEvento(ev.name)}
                                className="!text-[rgba(0,0,0,0.45)] flex items-center gap-1"
                              >
                                <CaretRightOutlined /> Testar
                              </Button>
                            </div>
                            <Text type="secondary" className="text-xs">{ev.desc}</Text>
                          </div>
                        ))}
                      </div>

                      {/* Test results - only appear after user clicks "Testar" */}
                      {testResults.length > 0 && (
                        <>
                          {/* Summary bar */}
                          <div className="flex items-center justify-end gap-3 bg-[#fafafa] rounded-lg px-4 py-2.5">
                            <Text type="secondary" className="text-sm">Últimas 24h</Text>
                            <Tag className="!border-solid !bg-transparent !font-medium">{testResults.length} evento(s)</Tag>
                            <Tag color="success" className="!border-solid">
                              {testResults.filter((r) => r.status === 'Sucesso').length} sucesso(s)
                            </Tag>
                            <Tag color="error" className="!border-solid">
                              {testResults.filter((r) => r.status === 'Erro').length} erro(s)
                            </Tag>
                            <Button size="small" type="text" className="!text-xs" onClick={handleLimparTestes}>Limpar</Button>
                          </div>

                          {/* Results table */}
                          <Table
                            dataSource={testResults.map((r, i) => ({ ...r, key: i }))}
                            columns={[
                              {
                                title: 'Evento',
                                dataIndex: 'evento',
                                key: 'evento',
                                render: (evento: string) => (
                                  <Tag className="!border-solid !bg-transparent !text-[#0d2772] !border-[#d9d9d9] !font-medium">{evento}</Tag>
                                ),
                              },
                              {
                                title: 'Origem',
                                dataIndex: 'origem',
                                key: 'origem',
                                render: (origem: string) => {
                                  const label = origem === 'Navegador' ? 'Pixel' : 'API'
                                  const tip = origem === 'Navegador'
                                    ? 'Pixel: evento disparado pelo navegador do usuário através do script de rastreamento instalado na página.'
                                    : 'API: evento enviado diretamente pelo servidor via API de conversões, sem depender do navegador do usuário.'
                                  return (
                                    <Tooltip title={tip}>
                                      <Tag color={origem === 'Navegador' ? 'warning' : 'processing'} className="!border-solid cursor-help">{label}</Tag>
                                    </Tooltip>
                                  )
                                },
                              },
                              { title: 'Parâmetro', dataIndex: 'parametro', key: 'parametro' },
                              { title: 'Data e hora', dataIndex: 'dataHora', key: 'dataHora' },
                              {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                                render: (status: string) => {
                                  if (status === 'Sucesso') {
                                    return <Tag color="success" className="!border-solid">Sucesso</Tag>
                                  }
                                  return (
                                    <Tooltip title="O evento não foi enviado. Possíveis causas: ID do pixel incorreto, token da API inválido, timeout na conexão ou bloqueio por ad-blocker. Verifique as configurações do pixel e tente novamente.">
                                      <Tag color="error" className="!border-solid cursor-help">Não enviado</Tag>
                                    </Tooltip>
                                  )
                                },
                              },
                            ]}
                            pagination={false}
                            size="middle"
                          />
                        </>
                      )}
                    </div>
                    )
                  })(),
                },
              ]}
            />
          </Content>
        </Layout>
      </Layout>
      {/* Modal de configuracao de pixel */}
      <ConfigurarPixelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveConfig}
        mode={modalMode}
      />

      {/* Modal de confirmação de exclusão */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        width={480}
        closable
        title={null}
      >
        <div className="flex flex-col gap-6 py-2">
          <div>
            <Title level={4} className="!mb-2">Excluir produto(s) / evento(s)</Title>
            <Text type="secondary">
              Tem certeza que deseja excluir {selectedIds.length} item(ns) selecionado(s)?
              Esta ação não pode ser desfeita.
            </Text>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0]">
            {selectedIds.map((id) => {
              const p = produtos.find((pr) => pr.id === id)
              return (
                <Tag key={id} className="!text-xs">
                  {p?.nome || `Produto ${id}`}
                </Tag>
              )
            })}
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button danger type="primary" onClick={confirmDelete}>
              Excluir {selectedIds.length} item(ns)
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}
