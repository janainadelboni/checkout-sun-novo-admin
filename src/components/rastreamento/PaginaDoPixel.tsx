import { useRef, useState } from 'react'
import {
  Alert,
  Breadcrumb,
  Button,
  DatePicker,
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
import dayjs from 'dayjs'
import { Home, ChevronLeft, Plus, Search, Trash2, HelpCircle, ChevronRight, Settings, BarChart3, Activity, FilterX } from 'lucide-react'
import ConfigurarPixelModal, { type ModalMode, type PixelConfig } from './ConfigurarPixelModal'
import DemoBar, { DemoStateSegmented, type DemoState } from '../DemoBar'
import { EduzzLogo, CheckoutSunLogo } from '../Logos'
import { buildRangePresets } from '../../utils/datePresets'

const { RangePicker } = DatePicker

const { Sider, Content } = Layout


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
  gatilho?: 'pageview' | 'button'
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
  { key: 21, nomeEvento: 'Initiatecheckout', origem: 'Navegador', dataHora: '19/03/2026 13:18:02', status: 'Sucesso', produtoId: 2704934, gatilho: 'button' },
  { key: 22, nomeEvento: 'Initiatecheckout', origem: 'Navegador', dataHora: '18/03/2026 16:25:14', status: 'Sucesso', produtoId: 2030747, gatilho: 'button' },
  { key: 23, nomeEvento: 'Initiatecheckout', origem: 'Navegador', dataHora: '17/03/2026 16:32:45', status: 'Sucesso', produtoId: 2073333, gatilho: 'pageview' },
  { key: 24, nomeEvento: 'Initiatecheckout', origem: 'Navegador', dataHora: '17/03/2026 11:58:30', status: 'Erro', produtoId: 2073333, gatilho: 'pageview' },
  { key: 25, nomeEvento: 'Initiatecheckout', origem: 'Navegador', dataHora: '16/03/2026 20:14:08', status: 'Sucesso', produtoId: 2704934, gatilho: 'button' },
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
  onNavigate?: (key: 'analytics' | 'rastreamento' | 'order-bump') => void
}

export default function PaginaDoPixel({ provider = 'ga4', onVoltar, onNavigate }: PaginaDoPixelProps) {
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
  const [logCustomRange, setLogCustomRange] = useState<[string, string] | null>(null)
  const [demoState, setDemoState] = useState<DemoState>('ativo')
  const semDados = demoState !== 'ativo' && demoState !== 'erro'
  const stateBanner = (() => {
    if (demoState === 'nao-configurado') {
      return (
        <Alert
          type="info"
          showIcon
          message="Pixel ainda não configurado"
          description="Vincule produtos e eventos para começar a rastrear."
        />
      )
    }
    if (demoState === 'em-preenchimento') {
      return (
        <Alert
          type="warning"
          showIcon
          message="Pixel em preenchimento"
          description="Termine a configuração para ativar o rastreamento."
        />
      )
    }
    if (demoState === 'aguardando') {
      return (
        <Alert
          type="info"
          showIcon
          message="Aguardando primeiros eventos"
          description="O pixel está ativo. Assim que houver tráfego, os eventos começarão a aparecer aqui."
        />
      )
    }
    if (demoState === 'erro') {
      return (
        <Alert
          type="error"
          showIcon
          message="Falhas no envio de eventos"
          description="Alguns disparos não chegaram ao destino. Verifique os logs abaixo."
        />
      )
    }
    return null
  })()
  const [simulateSaveError, setSimulateSaveError] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>({ type: 'new' })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)
  const [pendingBulkConfig, setPendingBulkConfig] = useState<PixelConfig | null>(null)
  const [testProdutoFilter, setTestProdutoFilter] = useState<number | null>(null)
  const [testCode, setTestCode] = useState('')
  const [testValidated, setTestValidated] = useState(false)
  const [testResults, setTestResults] = useState<{ evento: string; origem: string; parametro: string; dataHora: string; status: 'Sucesso' | 'Erro'; gatilho?: 'pageview' | 'button' }[]>([])

  const testResultsRef = useRef<HTMLDivElement>(null)
  const [testHighlight, setTestHighlight] = useState(false)

  const handleTestarEvento = (eventoName: string, gatilho?: 'pageview' | 'button') => {
    const origens = ['Navegador', 'Servidor'] as const
    const statuses = ['Sucesso', 'Sucesso', 'Sucesso', 'Erro'] as const // 75% sucesso
    const novoResult = {
      evento: eventoName,
      origem: origens[Math.floor(Math.random() * origens.length)],
      parametro: 'Valor customizado',
      dataHora: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      gatilho,
    }
    setTestResults((prev) => [novoResult, ...prev])
    setTestHighlight(true)
    setTimeout(() => {
      testResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
    setTimeout(() => setTestHighlight(false), 2000)
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
      produtos: ['2704934'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: 'button',
    },
    2704935: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'AddPaymentInfo', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['2704935'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: null,
    },
    2411153: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'Lead', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['2411153'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: null,
    },
    2030747: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'Initiatecheckout', 'Purchase'],
      apiConversao: true,
      tokenApi: 'EAABsbCS1IEXBO...',
      produtos: ['2030747'],
      diferenciarBoleto: false,
      valorCustomizado: 'sempre',
      initiateCheckoutTrigger: 'button',
    },
    2576289: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'AddPaymentInfo'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['2576289'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: null,
    },
    2073333: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'Lead', 'Initiatecheckout', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['2073333'],
      diferenciarBoleto: true,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: 'pageview',
    },
    9104452: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['9104452'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: null,
    },
    2073334: {
      provider: 'meta',
      nomePixel: 'Facebook - Principal',
      pixelId: '7644657994596',
      events: ['PageView', 'FormInteraction', 'AddPaymentInfo', 'Purchase'],
      apiConversao: false,
      tokenApi: '',
      produtos: ['2073334'],
      diferenciarBoleto: false,
      valorCustomizado: 'nunca',
      initiateCheckoutTrigger: null,
    },
  })

  const handleOpenNew = () => {
    // "Configurar e vincular produtos" — abre direto no provider da página com produtos pré-selecionados
    const providerKey = (provider as import('./ConfigurarPixelModal').PixelProvider) || 'meta'
    const allProdutoIds = produtos.map(p => p.id)
    const produtoNomes: Record<number, string> = {}
    for (const p of produtos) { produtoNomes[p.id] = p.nome }
    // Pega uma config existente do mesmo provider pra herdar escolhas já feitas (ex: trigger do Initiatecheckout)
    const existing = Object.values(pixelConfigs).find(c => c.provider === providerKey)
    setModalMode({ type: 'bulk', produtoIds: allProdutoIds, produtoNomes, provider: providerKey, existing })
    setModalOpen(true)
  }


  const handleSaveConfig = (config: PixelConfig) => {
    // Se é bulk (mais de 1 produto), mostra confirmação antes de aplicar
    if (config.produtos.length > 1) {
      setPendingBulkConfig(config)
      setBulkConfirmOpen(true)
      return
    }
    applyConfig(config)
  }

  const applyConfig = (config: PixelConfig) => {
    const newConfigs = { ...pixelConfigs }
    for (const prodId of config.produtos) {
      const numId = Number(prodId)
      if (!isNaN(numId)) {
        newConfigs[numId] = config
      }
    }
    setPixelConfigs(newConfigs)
    console.log('Pixel configurado:', config)
  }

  const confirmBulkConfig = () => {
    if (pendingBulkConfig) {
      applyConfig(pendingBulkConfig)
    }
    setBulkConfirmOpen(false)
    setPendingBulkConfig(null)
  }

  const handleClearAllLogFilters = () => {
    setLogProdutoFilter([])
    setLogOrigemFilter(null)
    setLogEventoFilter(null)
    setLogStatusFilter(null)
    setLogPeriodoFilter('ultimos_30')
    setLogCustomRange(null)
  }

  const hasAnyLogFilter =
    logProdutoFilter.length > 0 ||
    logOrigemFilter !== null ||
    logEventoFilter !== null ||
    logStatusFilter !== null

  const logRangePresets = buildRangePresets()
  const logRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null =
    logPeriodoFilter === 'personalizado' && logCustomRange
      ? [dayjs(logCustomRange[0], 'DD/MM/YYYY'), dayjs(logCustomRange[1], 'DD/MM/YYYY')]
      : (logRangePresets.find((p) => p.key === logPeriodoFilter)?.value ?? null)
  const logPeriodoLabel =
    logPeriodoFilter === 'personalizado' && logCustomRange
      ? `${logCustomRange[0]} – ${logCustomRange[1]}`
      : (logRangePresets.find((p) => p.key === logPeriodoFilter)?.label ?? 'Últimos 30 dias')

  // Datasets dependentes do estado de demo
  const logsBase = semDados ? [] : logsDeEnvio
  const produtosBase = produtos

  const logsFiltrados = logsBase.filter((log) => {
    if (logProdutoFilter.length > 0 && !logProdutoFilter.includes(log.produtoId)) return false
    if (logOrigemFilter && log.origem !== logOrigemFilter) return false
    if (logEventoFilter) {
      const [filterEvent, filterGatilho] = logEventoFilter.split(':')
      if (log.nomeEvento !== filterEvent) return false
      if (filterGatilho && log.gatilho !== filterGatilho) return false
    }
    if (logStatusFilter && log.status !== logStatusFilter) return false
    return true
  })

  // Opcoes do filtro de evento — expande Initiatecheckout em dois itens (pageview / button)
  const eventoFilterOptions = (() => {
    const eventos = [...new Set(logsBase.map((l) => l.nomeEvento))]
    const opts: { value: string; label: string }[] = []
    for (const ev of eventos) {
      if (ev === 'Initiatecheckout') {
        opts.push({ value: 'Initiatecheckout:pageview', label: 'Initiatecheckout · Ao abrir página' })
        opts.push({ value: 'Initiatecheckout:button', label: 'Initiatecheckout · Ao clicar no botão' })
      } else {
        opts.push({ value: ev, label: ev })
      }
    }
    return opts
  })()

  const logEventoFilterLabel = (() => {
    if (!logEventoFilter) return 'todos'
    return eventoFilterOptions.find((o) => o.value === logEventoFilter)?.label ?? logEventoFilter
  })()

  // Filtered products for the table
  const produtosFiltrados = produtosBase.filter((p) => {
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
    'PageView': '#2B4ACF',
    'FormInteraction': 'var(--ant-color-warning)',
    'Lead': '#2BBCCF',
    'AddPaymentInfo': 'var(--ant-color-success)',
    'Initiatecheckout': '#CF2B9E',
    'Purchase': '#6D2BCF',
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
  const semDadosFunil = semDados
  const funilEtapas = [
    { label: 'PageView', valor: semDadosFunil ? 0 : 10200, cor: '#2B4ACF' },
    { label: 'FormInteraction', valor: semDadosFunil ? 0 : 4590, cor: 'var(--ant-color-warning)' },
    { label: 'Lead', valor: semDadosFunil ? 0 : 2856, cor: '#2BBCCF' },
    { label: 'AddPaymentInfo', valor: semDadosFunil ? 0 : 1820, cor: 'var(--ant-color-success)' },
    { label: 'Initiatecheckout', valor: semDadosFunil ? 0 : 1224, cor: '#CF2B9E' },
    { label: 'Purchase', valor: semDadosFunil ? 0 : 380, cor: '#6D2BCF' },
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
    <>
      <Layout className="min-h-screen bg-(--ant-color-bg-container)">
        {/* Header */}
        <div className="h-[78px] bg-(--ant-color-fill-quaternary) flex items-center justify-center border-b border-(--ant-color-split)">
          <EduzzLogo />
        </div>

        <Layout>
          {/* Sidebar */}
          <Sider theme="light" width={288} className="border-r border-(--ant-color-split)">
            <div className="px-4 py-2.5">
              <CheckoutSunLogo />
            </div>
            <Menu
              mode="inline"
              selectedKeys={['rastreamento']}
              className="border-none"
              onClick={({ key }) => {
                if (key === 'visao-geral') onNavigate?.('analytics')
                else if (key === 'rastreamento') onNavigate?.('rastreamento')
                else if (key === 'order-bump') onNavigate?.('order-bump')
              }}
              items={[
                { key: 'visao-geral', label: 'Visão geral' },
                { key: 'rastreamento', label: 'Rastreamento' },
                { key: 'order-bump', label: 'Order Bump' },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content className="p-8 pb-24 bg-white flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { title: <Home size={14} /> },
                { title: 'Checkout Sun' },
                { title: 'Rastreamento' },
                { title: PROVIDER_NAMES[provider] || 'Pixel' },
              ]}
            />

            {/* Back button */}
            <div>
              <Button icon={<ChevronLeft size={14} />} onClick={onVoltar}>Voltar</Button>
            </div>

            {/* Title + Actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {PROVIDER_LOGOS[provider] && (
                  <img src={PROVIDER_LOGOS[provider]} alt="" className="h-8 object-contain" />
                )}
                <div>
                  <Typography.Title level={3} className="mb-1">
                    {PROVIDER_NAMES[provider] || 'Pixel'}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Acompanhe e configure seu pixel de rastreamento
                  </Typography.Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="primary"
                  icon={<Plus size={14} />}
                  onClick={handleOpenNew}
                >
                  Configurar e vincular produtos
                </Button>
              </div>
            </div>

            {stateBanner}

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
                      <div className="bg-(--ant-color-fill-quaternary) rounded-lg p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Typography.Text strong >Filtrar por produto</Typography.Text>
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
                            suffixIcon={<Search size={14} className="text-(--ant-color-text-tertiary)" />}
                            className="w-full"
                            maxTagCount="responsive"
                          />
                        </div>

                        {/* Active filter tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Typography.Text type="secondary" >Filtros ativos:</Typography.Text>
                          {produtoFilter.length > 0 ? (
                            produtoFilter.map((id) => {
                              const p = produtosIniciais.find((pr) => pr.id === id)
                              return (
                                <Tag key={`prod-${id}`} closable onClose={() => setProdutoFilter((prev) => prev.filter((x) => x !== id))} className="text-sm">
                                  Produto: {id} - {p?.nome || id}
                                </Tag>
                              )
                            })
                          ) : (
                            <Tag className="text-sm font-medium">Produtos: Todos ({produtos.length})</Tag>
                          )}
                          {produtoFilter.length > 0 && (
                            <a
                              href="#"
                              className="text-(--ant-color-text-tertiary) text-sm hover:text-(--ant-color-text-secondary)"
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
                            <Typography.Title level={5} className="mb-0">Funil de eventos</Typography.Title>
                            <Tooltip title="Taxa calculada com base no PageView (base = 100%). Valores variam conforme produtos e período filtrados.">
                              <HelpCircle size={14} className="text-(--ant-color-text-tertiary) text-sm cursor-help" />
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
                          />
                        </div>

                        <div className="flex gap-6 items-stretch">
                          {/* Funil - Esquerda */}
                          <div className="flex-1 flex flex-col justify-between">
                            {semDadosFunil ? (
                              <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-(--ant-color-border) rounded-lg bg-(--ant-color-fill-quaternary) h-full min-h-[280px]">
                                <BarChart3 size={36} className="text-(--ant-color-text-quaternary) mb-3" />
                                <Typography.Text strong className="mb-1">Sem dados no período</Typography.Text>
                                <Typography.Text type="secondary" className="text-center max-w-[360px]">
                                  Nenhum evento foi disparado nos últimos {funilPeriodo === 'ultimos_7' ? '7' : funilPeriodo === 'ultimos_15' ? '15' : funilPeriodo === 'ultimos_30' ? '30' : '90'} dias. Quando o pixel registrar eventos, eles aparecerão aqui.
                                </Typography.Text>
                              </div>
                            ) : (
                              <>
                                {/* Header do funil */}
                                <div className="flex items-center justify-end gap-0 mb-1">
                                  <Tooltip title="Taxa calculada com base no PageView do período selecionado.">
                                    <div className="w-[50px] text-right cursor-help">
                                      <Typography.Text type="secondary" className="font-medium whitespace-nowrap">Taxa</Typography.Text>
                                    </div>
                                  </Tooltip>
                                  <div className="w-[70px] text-right">
                                    <Typography.Text type="secondary" className="font-medium whitespace-nowrap">Qtd.</Typography.Text>
                                  </div>
                                </div>

                                {/* Etapas */}
                                {funilComPercent.map((etapa) => (
                                  <div key={etapa.label} className="flex items-center gap-3">
                                    <div className="w-[180px] shrink-0">
                                      <Tag color="blue">{etapa.label}</Tag>
                                    </div>
                                    <div className="flex-1 h-6 bg-(--ant-color-fill-tertiary) rounded overflow-hidden">
                                      <div
                                        className="h-full rounded transition-all min-w-1"
                                        style={{
                                          width: `${etapa.topoFundo}%`,
                                          backgroundColor: etapa.cor,
                                        }}
                                      />
                                    </div>
                                    <div className="w-[50px] text-right shrink-0">
                                      <Typography.Text strong >{etapa.topoFundo}%</Typography.Text>
                                    </div>
                                    <div className="w-[70px] text-right shrink-0">
                                      <Typography.Text type="secondary" >{etapa.valor.toLocaleString('pt-BR')}</Typography.Text>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>

                          {/* Cards - Direita */}
                          <div className="w-[240px] shrink-0 flex flex-col gap-3">
                            {/* Saúde do pixel */}
                            <div className="border border-(--ant-color-split) rounded-lg p-4 flex flex-col gap-2.5">
                              <Typography.Text type="secondary" className="font-medium">Saúde do pixel</Typography.Text>
                              {semDadosFunil ? (
                                <div className="flex flex-col items-center gap-1.5 py-3">
                                  <Activity size={20} className="text-(--ant-color-text-quaternary)" />
                                  <Typography.Text type="secondary" className="text-center text-xs">
                                    Nenhum evento enviado ainda
                                  </Typography.Text>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between">
                                    <Typography.Text >Último evento</Typography.Text>
                                    <Tag color="success" className="text-sm border-solid m-0">há 12 min</Tag>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Typography.Text >Eventos com erro</Typography.Text>
                                    <Tag color="error" className="text-sm border-solid m-0">4 (20%)</Tag>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Cobertura por evento */}
                            <div className="border border-(--ant-color-split) rounded-lg p-4 flex flex-col gap-2">
                              <Tooltip title="Quantos produtos/eventos atrelados possuem cada evento configurado.">
                                <Typography.Text type="secondary" className="font-medium mb-0.5 cursor-help">Cobertura de evento por produto</Typography.Text>
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
                                    title={<span className="whitespace-pre-line">{tooltipText}</span>}
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
                                        <Typography.Text >{eventoName}</Typography.Text>
                                      </div>
                                      <Typography.Text strong className={`text-sm ${com < total ? 'text-(--ant-color-warning)' : 'text-(--ant-color-success)'}`}>
                                        {com}/{total}
                                      </Typography.Text>
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
                            icon={<Trash2 size={14} />}
                            onClick={handleDeleteSelected}
                          >
                            Excluir selecionado(s)
                          </Button>
                        </div>
                      )}

                      {/* Simple table */}
                      <div>
                        {/* Header */}
                        <div className="flex bg-(--ant-color-fill-alter) border-b border-(--ant-color-split) h-[46px] items-center">
                          <div className="w-[48px] flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = indeterminate
                              }}
                              onChange={toggleSelectAll}
                              className="w-4 h-4 cursor-pointer accent-(--ant-color-primary)"
                            />
                          </div>
                          <div className="flex-1 px-4 flex items-center gap-1">
                            <Typography.Text strong >Produtos</Typography.Text>
                            <Tooltip title="Essa tela se refere aos produtos, em caso de eventos Blinket, se refere a cada ingresso ou lote individualmente.">
                              <HelpCircle size={14} className="text-sm text-(--ant-color-text-tertiary) cursor-help" />
                            </Tooltip>
                          </div>
                          <div className="w-[140px] px-4 flex items-center justify-center shrink-0">
                            <Typography.Text strong className="whitespace-nowrap">Configuração</Typography.Text>
                          </div>
                          <div className="w-[120px] px-4 flex items-center justify-center shrink-0">
                            <Typography.Text strong >Detalhes</Typography.Text>
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
                                className={`flex border-b border-(--ant-color-split) min-h-[56px] items-center hover:bg-(--ant-color-fill-quaternary) cursor-pointer ${isExpanded ? 'bg-(--ant-color-fill-quaternary)' : ''}`}
                                onClick={() => toggleExpand(produto.id)}
                              >
                                <div className="w-[48px] flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(produto.id)}
                                    onChange={() => toggleSelect(produto.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 cursor-pointer accent-(--ant-color-primary)"
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
                                      icon={<Settings size={14} />}
                                      onClick={(e) => { e.stopPropagation(); handleConfigIndividual(produto.id) }}
                                      className="text-(--ant-color-text-tertiary) hover:text-(--ant-color-primary) !whitespace-nowrap"
                                    >
                                      Configurar
                                    </Button>
                                  </Tooltip>
                                </div>
                                <div className="w-[120px] px-4 flex justify-center shrink-0">
                                  <a
                                    href="#"
                                    className="text-(--ant-color-primary) text-sm hover:underline"
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
                                <div className="border-b border-(--ant-color-split) bg-white px-12 py-6">
                                  {/* Events table - simple format */}
                                  <div className="border border-(--ant-color-split) rounded-lg overflow-hidden mb-4">
                                    <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-(--ant-color-split) h-[40px] items-center">
                                      <div className="flex-1 px-4">
                                        <Typography.Text strong >Eventos cadastrados</Typography.Text>
                                      </div>
                                      <div className="w-[140px] px-4 text-right">
                                        <Typography.Text strong >Percentual</Typography.Text>
                                      </div>
                                      <div className="w-[140px] px-4 text-right">
                                        <Typography.Text strong >Quantidade</Typography.Text>
                                      </div>
                                    </div>
                                    {eventos.map((ev, i) => {
                                      const maxDisparados = Math.max(...eventos.map(e => e.disparados), 1)
                                      const percentual = ((ev.disparados / maxDisparados) * 100).toFixed(0)
                                      const cor = eventoCores[ev.nome] || '#8c8c8c'
                                      return (
                                        <div key={i} className="flex border-b border-(--ant-color-split) h-12 items-center">
                                          <div className="flex-1 px-4">
                                            <Tag
                                              className="text-sm font-semibold px-2 py-0.5 !rounded"
                                              style={{
                                                color: 'var(--ant-color-primary)',
                                                borderColor: 'var(--ant-color-primary)',
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
                                            <Typography.Text >{percentual}%</Typography.Text>
                                          </div>
                                          <div className="w-[140px] px-4 text-right">
                                            <Typography.Text >{ev.disparados.toLocaleString('pt-BR')}</Typography.Text>
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

                        {/* Empty state — filtro retorna 0 produtos */}
                        {paginatedProdutos.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                            <FilterX size={36} className="text-(--ant-color-text-quaternary)" />
                            <div className="flex flex-col items-center gap-1">
                              <Typography.Text strong>Nenhum produto encontrado</Typography.Text>
                              <Typography.Text type="secondary" className="text-center max-w-[420px]">
                                Ajuste os filtros pra ver outros produtos.
                              </Typography.Text>
                            </div>
                            <Button onClick={handleClearProductFilters}>Limpar filtros</Button>
                          </div>
                        )}
                      </div>

                      {/* Pagination */}
                      {paginatedProdutos.length > 0 && (
                        <div className="flex justify-end">
                          <Pagination
                            current={currentPage}
                            total={produtosFiltrados.length}
                            pageSize={pageSize}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                          />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'logs',
                  label: 'Logs de eventos',
                  children: (
                    <div className="flex flex-col gap-6">
                      {/* Filtros */}
                      <div className="bg-(--ant-color-fill-quaternary) rounded-lg p-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                          <Typography.Text strong >Filtrar por produto</Typography.Text>
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
                            suffixIcon={<Search size={14} className="text-(--ant-color-text-tertiary)" />}
                            className="w-full"
                            maxTagCount="responsive"
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <Typography.Text type="secondary" >Período</Typography.Text>
                            <RangePicker
                              size="middle"
                              format="DD/MM/YYYY"
                              presets={logRangePresets}
                              className="w-full"
                              placeholder={['Data inicial', 'Data final']}
                              allowClear={false}
                              value={logRangeValue}
                              onChange={(_dates, dateStrings) => {
                                if (!dateStrings[0] || !dateStrings[1]) return
                                const matched = logRangePresets.find(
                                  (p) =>
                                    p.value[0].format('DD/MM/YYYY') === dateStrings[0] &&
                                    p.value[1].format('DD/MM/YYYY') === dateStrings[1],
                                )
                                if (matched) {
                                  setLogPeriodoFilter(matched.key)
                                  setLogCustomRange(null)
                                } else {
                                  setLogPeriodoFilter('personalizado')
                                  setLogCustomRange([dateStrings[0], dateStrings[1]])
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Typography.Text type="secondary" >Origem</Typography.Text>
                            <Select
                              allowClear
                              placeholder="Todos"
                              value={logOrigemFilter}
                              onChange={(value) => setLogOrigemFilter(value ?? null)}
                              options={[
                                { value: 'Navegador', label: 'Pixel' },
                                { value: 'Servidor', label: 'API' },
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Typography.Text type="secondary" >Evento</Typography.Text>
                            <Select
                              allowClear
                              placeholder="Todos"
                              value={logEventoFilter}
                              onChange={(value) => setLogEventoFilter(value ?? null)}
                              options={eventoFilterOptions}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Typography.Text type="secondary" >Status</Typography.Text>
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
                          <Typography.Text type="secondary" >Filtros ativos:</Typography.Text>
                          {logProdutoFilter.length > 0 ? (
                            logProdutoFilter.map((id) => {
                              const p = produtosIniciais.find((pr) => pr.id === id)
                              return (
                                <Tag key={`prod-${id}`} closable onClose={() => setLogProdutoFilter((prev) => prev.filter((x) => x !== id))} className="text-sm">
                                  Produto/Evento: {id} - {p?.nome || id}
                                </Tag>
                              )
                            })
                          ) : (
                            <Tag className="text-sm">Produtos: Todos</Tag>
                          )}
                          <Tag className="text-sm">{logPeriodoLabel}</Tag>
                          <Tag className="text-sm">Origem: {logOrigemFilter === 'Navegador' ? 'Pixel' : logOrigemFilter === 'Servidor' ? 'API' : 'Todos'}</Tag>
                          <Tag className="text-sm">Eventos: {logEventoFilterLabel}</Tag>
                          <Tag className="text-sm">Status: {logStatusFilter ?? 'todos'}</Tag>
                          {hasAnyLogFilter && (
                            <a href="#" className="text-(--ant-color-text-tertiary) text-sm" onClick={(e) => { e.preventDefault(); handleClearAllLogFilters() }}>
                              Limpar filtros
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Summary bar */}
                      <div className="flex items-center gap-3 justify-end">
                        <Typography.Text type="secondary" >
                          {logsFiltrados.length} evento(s) encontrado(s)
                        </Typography.Text>
                        <Tag color="success" >
                          {logsFiltrados.filter((l) => l.status === 'Sucesso').length} sucesso(s)
                        </Tag>
                        <Tag color="error" >
                          {logsFiltrados.filter((l) => l.status === 'Erro').length} erro(s)
                        </Tag>
                      </div>

                      {/* Logs table */}
                      <Table
                        locale={{
                          emptyText: (
                            <div className="flex flex-col items-center justify-center py-10 px-6 gap-3">
                              {logsBase.length === 0 ? (
                                <>
                                  <Activity size={36} className="text-(--ant-color-text-quaternary)" />
                                  <div className="flex flex-col items-center gap-1">
                                    <Typography.Text strong>Nenhum evento registrado ainda</Typography.Text>
                                    <Typography.Text type="secondary" className="text-center max-w-[420px]">
                                      Os eventos enviados pelos seus produtos vão aparecer aqui assim que o pixel começar a registrá-los.
                                    </Typography.Text>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <FilterX size={36} className="text-(--ant-color-text-quaternary)" />
                                  <div className="flex flex-col items-center gap-1">
                                    <Typography.Text strong>Nenhum log encontrado</Typography.Text>
                                    <Typography.Text type="secondary" className="text-center max-w-[420px]">
                                      Ajuste os filtros pra ver outros eventos.
                                    </Typography.Text>
                                  </div>
                                  <Button onClick={handleClearAllLogFilters}>Limpar filtros</Button>
                                </>
                              )}
                            </div>
                          ),
                        }}
                        dataSource={logsFiltrados}
                        columns={[
                          {
                            title: 'Produto',
                            dataIndex: 'produtoId',
                            key: 'produtoId',
                            render: (produtoId: number) => {
                              const p = produtosIniciais.find((pr) => pr.id === produtoId)
                              return `${produtoId} - ${p?.nome || 'Desconhecido'}`
                            },
                          },
                          {
                            title: 'Evento',
                            dataIndex: 'nomeEvento',
                            key: 'nomeEvento',
                            render: (evento: string, record: LogEnvio) => {
                              if (evento === 'Initiatecheckout' && record.gatilho) {
                                const sub = record.gatilho === 'pageview' ? 'PageView' : 'Botão'
                                return <Tag color="blue">Initiatecheckout · {sub}</Tag>
                              }
                              return <Tag color="blue">{evento}</Tag>
                            },
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
                                  <Tag color={origem === 'Navegador' ? 'warning' : 'processing'} className="cursor-help">{label}</Tag>
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
                                return <Tag color="success" >Sucesso</Tag>
                              }
                              return (
                                <Tooltip title="O evento não foi enviado. Possíveis causas: ID do pixel incorreto, token da API inválido, timeout na conexão ou bloqueio por ad-blocker. Verifique as configurações do pixel e tente novamente.">
                                  <Tag color="error" className="cursor-help">Não enviado</Tag>
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
                      <div className="bg-(--ant-color-fill-quaternary) rounded-lg p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Typography.Text strong >Filtrar por produto</Typography.Text>
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
                            suffixIcon={<Search size={14} className="text-(--ant-color-text-tertiary)" />}
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Typography.Text type="secondary" >Filtros ativos:</Typography.Text>
                          {hasTestProduct && testProdutoInfo ? (
                            <Tag closable onClose={handleClearTestFilter} className="text-sm font-medium">
                              Produto: {testProdutoFilter} - {testProdutoInfo.nome}
                            </Tag>
                          ) : (
                            <Tag className="text-sm">Produto: Nenhum selecionado</Tag>
                          )}
                          {hasTestProduct && (
                            <a href="#" className="text-(--ant-color-text-tertiary) text-sm" onClick={(e) => { e.preventDefault(); handleClearTestFilter() }}>
                              Limpar filtros
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Código de teste */}
                      <div className={`border border-(--ant-color-border) rounded-lg p-6 flex flex-col gap-3 ${codeDisabled}`}>
                        <Typography.Title level={5} className="mb-0">Código de teste da Meta</Typography.Title>
                        <Typography.Text type="secondary" >
                          Copie o código de teste do Gerenciador da Meta e cole aqui. O botão "testar" ficará disponível após o preenchimento. O código será enviado como parâmetro no link do checkout para que a Meta identifique o evento como teste.
                        </Typography.Text>
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
                        <div className="bg-(--ant-color-info-bg) border border-(--ant-color-info-border) rounded-lg px-4 py-2.5 mt-1">
                          <Typography.Text className="!text-(--ant-color-info-text)">
                            Para habilitar os botões "Testar", insira e valide o código de teste acima.
                          </Typography.Text>
                        </div>
                      </div>

                      {/* Event cards - 2 columns */}
                      <div className={`grid grid-cols-2 gap-4 ${cardsDisabled}`}>
                        {([
                          { name: 'PageView', label: 'PageView', desc: 'Quando o comprador acessa a página do checkout', cor: '#2B4ACF' },
                          { name: 'FormInteraction', label: 'FormInteraction', desc: 'Ao preencher nome, e-mail ou outro campo inicial', cor: 'var(--ant-color-warning)' },
                          { name: 'Lead', label: 'Lead', desc: 'Ao preencher nome, email e telefone', cor: '#2BBCCF' },
                          { name: 'AddPaymentInfo', label: 'AddPaymentInfo', desc: 'Ao interagir com formas de pagamento', cor: 'var(--ant-color-success)' },
                          { name: 'Initiatecheckout', label: 'Initiatecheckout · PageView', desc: 'Disparado ao abrir a página de checkout (junto com o PageView)', cor: '#CF2B9E', gatilho: 'pageview' as const },
                          { name: 'Initiatecheckout', label: 'Initiatecheckout · Botão', desc: 'Disparado ao clicar no botão de finalizar compra', cor: '#CF2B9E', gatilho: 'button' as const },
                          { name: 'Purchase', label: 'Purchase', desc: 'Quando o pagamento é confirmado', cor: '#6D2BCF' },
                        ]).map((ev) => (
                          <div key={ev.label} className="border border-(--ant-color-border) rounded-lg p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Tag color="blue">{ev.label}</Tag>
                              <Button
                                type="text"
                                disabled={!testValidated}
                                onClick={() => handleTestarEvento(ev.name, ev.gatilho)}
                                className="text-(--ant-color-text-tertiary) flex items-center gap-1"
                              >
                                <ChevronRight size={14} /> Testar
                              </Button>
                            </div>
                            <Typography.Text type="secondary" >{ev.desc}</Typography.Text>
                          </div>
                        ))}
                      </div>

                      {/* Test results - only appear after user clicks "Testar" */}
                      {testResults.length > 0 && (
                        <div ref={testResultsRef}>
                          {/* Summary bar */}
                          <div className="flex items-center justify-end gap-3 bg-(--ant-color-fill-quaternary) rounded-lg px-4 py-2.5">
                            <Typography.Text type="secondary" >Últimas 24h</Typography.Text>
                            <Tag>{testResults.length} evento(s)</Tag>
                            <Tag color="success" >
                              {testResults.filter((r) => r.status === 'Sucesso').length} sucesso(s)
                            </Tag>
                            <Tag color="error" >
                              {testResults.filter((r) => r.status === 'Erro').length} erro(s)
                            </Tag>
                            <Button type="text" className="text-sm" onClick={handleLimparTestes}>Limpar</Button>
                          </div>

                          {/* Results table */}
                          <Table
                            dataSource={testResults.map((r, i) => ({ ...r, key: i }))}
                            columns={[
                              {
                                title: 'Evento',
                                dataIndex: 'evento',
                                key: 'evento',
                                render: (evento: string, record: { gatilho?: 'pageview' | 'button' }) => {
                                  if (evento === 'Initiatecheckout' && record.gatilho) {
                                    const sub = record.gatilho === 'pageview' ? 'PageView' : 'Botão'
                                    return <Tag color="blue">Initiatecheckout · {sub}</Tag>
                                  }
                                  return <Tag color="blue">{evento}</Tag>
                                },
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
                                      <Tag color={origem === 'Navegador' ? 'warning' : 'processing'} className="cursor-help">{label}</Tag>
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
                                    return <Tag color="success" >Sucesso</Tag>
                                  }
                                  return (
                                    <Tooltip title="O evento não foi enviado. Possíveis causas: ID do pixel incorreto, token da API inválido, timeout na conexão ou bloqueio por ad-blocker. Verifique as configurações do pixel e tente novamente.">
                                      <Tag color="error" className="cursor-help">Não enviado</Tag>
                                    </Tooltip>
                                  )
                                },
                              },
                            ]}
                            pagination={false}
                            size="middle"
                            rowClassName={(_, index) => index === 0 && testHighlight ? 'animate-highlight' : ''}
                          />
                        </div>
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

      <DemoBar>
        <DemoStateSegmented value={demoState} onChange={setDemoState} />
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
          <input
            type="checkbox"
            checked={simulateSaveError}
            onChange={(e) => setSimulateSaveError(e.target.checked)}
            className="accent-(--ant-color-primary)"
          />
          Simular erro ao salvar no modal
        </label>
      </DemoBar>

      {/* Modal de configuracao de pixel */}
      <ConfigurarPixelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveConfig}
        mode={modalMode}
        simulateSaveError={simulateSaveError}
      />

      {/* Modal de dupla confirmação para configuração em massa */}
      <Modal
        open={bulkConfirmOpen}
        onCancel={() => { setBulkConfirmOpen(false); setPendingBulkConfig(null) }}
        footer={null}
        width={520}
        closable
        title={null}
      >
        {pendingBulkConfig && (
          <div className="flex flex-col gap-6 py-2">
            <div>
              <Typography.Title level={4} className="mb-2">Atenção: configuração em massa</Typography.Title>
              <Typography.Text>
                Essa ação irá <Typography.Text strong>sobrescrever todas as configurações individuais</Typography.Text> dos{' '}
                {pendingBulkConfig.produtos.length} produtos selecionados. Configurações anteriores serão perdidas.
              </Typography.Text>
            </div>

            <div className="flex justify-end gap-3">
              <Button onClick={() => { setBulkConfirmOpen(false); setPendingBulkConfig(null) }}>
                Cancelar
              </Button>
              <Button type="primary" danger onClick={confirmBulkConfig}>
                Sobrescrever e aplicar
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
            <Typography.Title level={4} className="mb-2">Excluir produto(s) / evento(s)</Typography.Title>
            <Typography.Text type="secondary">
              Tem certeza que deseja excluir {selectedIds.length} item(ns) selecionado(s)?
              Esta ação não pode ser desfeita.
            </Typography.Text>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 bg-(--ant-color-fill-quaternary) rounded-lg border border-(--ant-color-split)">
            {selectedIds.map((id) => {
              const p = produtos.find((pr) => pr.id === id)
              return (
                <Tag key={id} className="text-sm">
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
    </>
  )
}
