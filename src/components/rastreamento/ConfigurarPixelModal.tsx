import { useState } from 'react'
import {
  Modal,
  Button,
  Checkbox,
  Divider,
  Input,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Typography,
  Tag,
  Alert,
  Tooltip,
} from 'antd'
import { ChevronLeft, HelpCircle } from 'lucide-react'

/* ─── tipos de pixel disponíveis (RN01) ─── */
export type PixelProvider = 'meta' | 'ga4' | 'google_ads' | 'gtm'

type PixelOption = {
  key: PixelProvider
  label: string
  logo: string
  idPlaceholder: string
  idLabel: string
}

const PIXEL_OPTIONS: PixelOption[] = [
  {
    key: 'meta',
    label: 'Meta (Facebook)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
    idPlaceholder: 'Ex: 123456789012345',
    idLabel: 'ID do Pixel do Facebook',
  },
  {
    key: 'ga4',
    label: 'Google Analytics 4',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    idPlaceholder: 'Ex: G-XXXXXXXXXX',
    idLabel: 'ID de medição do GA4',
  },
  {
    key: 'google_ads',
    label: 'Google Ads',
    logo: 'https://www.gstatic.com/adx/doubleclick.ico',
    idPlaceholder: 'Ex: AW-123456789',
    idLabel: 'ID de conversão do Google Ads',
  },
  {
    key: 'gtm',
    label: 'Google Tag Manager',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
    idPlaceholder: 'Ex: GTM-XXXXXXX',
    idLabel: 'ID do contêiner GTM',
  },
]

/* ─── Eventos disponíveis (RF03) ─── */
type EventOption = {
  key: string
  label: string
  description: string
}

const EVENTS: EventOption[] = [
  { key: 'PageView', label: 'PageView', description: 'Quando o comprador acessa a página do checkout' },
  { key: 'FormInteraction', label: 'FormInteraction', description: 'Ao preencher nome, e-mail ou outro campo inicial' },
  { key: 'Lead', label: 'Lead', description: 'Ao preencher nome, email e telefone' },
  { key: 'AddPaymentInfo', label: 'AddPaymentInfo', description: 'Ao interagir com formas de pagamento' },
  { key: 'Purchase', label: 'Purchase', description: 'Quando o pagamento é confirmado' },
  { key: 'ViewBoleto', label: 'Visualização de boleto', description: 'Quando o boleto gerado for visualizado' },
]

/* ─── Produtos mock (tree) ─── */
const produtosTree = [
  { title: 'Selecionar todos', value: 'todos', key: 'todos', children: [
    { title: '2704934 – A Nova Escola De Vendas', value: '2704934', key: '2704934' },
    { title: '2704935 – Plano Black Monstro 40% OFF', value: '2704935', key: '2704935' },
    { title: '2411153 – A sabedoria do grande sábio do marketing digital', value: '2411153', key: '2411153' },
    { title: '2030747 – Academia 360', value: '2030747', key: '2030747' },
    { title: 'Festival Eduzz Summit 2026', value: 'festival-summit', key: 'festival-summit', children: [
      { title: '2576289 – Ingresso PISTA - Lote 01', value: '2576289', key: '2576289' },
      { title: '2576290 – Ingresso PISTA - Lote 02', value: '2576290', key: '2576290' },
      { title: '2576291 – Ingresso VIP - Lote 01', value: '2576291', key: '2576291' },
    ]},
    { title: '2073333 – Apresentação Pesquisa Unity', value: '2073333', key: '2073333' },
    { title: 'Pack de Templates Pro', value: 'pack-templates', key: 'pack-templates', children: [
      { title: '9104452 – Planilha de vendas', value: '9104452', key: '9104452' },
      { title: '9104453 – Planilha financeira', value: '9104453', key: '9104453' },
    ]},
    { title: '2073334 – Curso de Marketing Digital', value: '2073334', key: '2073334' },
  ]},
]

// Helper: extrai todos os IDs numéricos (folhas) dos valores selecionados no tree
const getAllLeafValues = (nodes: typeof produtosTree, selected: string[]): number[] => {
  const ids: number[] = []
  for (const node of nodes) {
    if (selected.includes(node.value)) {
      const num = Number(node.value)
      if (!isNaN(num)) ids.push(num)
    }
    if ('children' in node && node.children) {
      ids.push(...getAllLeafValues(node.children as typeof produtosTree, selected))
    }
  }
  return ids
}

// Helper: nome do produto por value
const getNodeTitle = (nodes: typeof produtosTree, value: string): string | undefined => {
  for (const node of nodes) {
    if (node.value === value) return node.title
    if ('children' in node && node.children) {
      const found = getNodeTitle(node.children as typeof produtosTree, value)
      if (found) return found
    }
  }
  return undefined
}

/* ─── Steps ─── */
type Step = 'select_provider' | 'configure'

/* ─── Modos de abertura do modal ─── */
export type ModalMode =
  | { type: 'new' }                                         // Configurar novo pixel (fluxo completo com seleção de provider)
  | { type: 'configure'; provider: PixelProvider }           // Modal Configurar (pula seleção de provider, produtos livres)
  | { type: 'bulk'; produtoIds: number[]; produtoNomes: Record<number, string>; provider?: PixelProvider }  // Configurar e vincular produtos (produtos pré-selecionados)
  | { type: 'edit'; produtoId: number; produtoNome: string; existing?: PixelConfig; provider?: PixelProvider } // Editar/criar por produto específico

/* ─── Props ─── */
interface ConfigurarPixelModalProps {
  open: boolean
  onClose: () => void
  onSave?: (config: PixelConfig) => void
  mode?: ModalMode
}

export interface PixelConfig {
  provider: PixelProvider
  nomePixel: string
  pixelId: string
  events: string[]
  apiConversao: boolean
  tokenApi: string
  produtos: string[]
  diferenciarBoleto: boolean
  valorCustomizado: 'nunca' | 'customizado' | 'sempre'
}

export default function ConfigurarPixelModal({
  open,
  onClose,
  onSave,
  mode = { type: 'new' },
}: ConfigurarPixelModalProps) {
  const [step, setStep] = useState<Step>('select_provider')
  const [selectedProvider, setSelectedProvider] = useState<PixelProvider | null>(null)

  // Configuração
  const [nomePixel, setNomePixel] = useState('')
  const [pixelId, setPixelId] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [apiConversao, setApiConversao] = useState(false)
  const [tokenApi, setTokenApi] = useState('')
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([])
  const [receberEvento, setReceberEvento] = useState<'imediatos' | 'nao_imediato' | 'todos'>('imediatos')
  const [diferenciarBoleto, setDiferenciarBoleto] = useState(false)
  const [valorCustomizado, setValorCustomizado] = useState<'nunca' | 'customizado' | 'sempre'>('nunca')

  // Erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Determina se os produtos são fixos (apenas edit com existing)
  const isProductsLocked = mode.type === 'edit'
  const isBulk = mode.type === 'bulk'
  const isEdit = mode.type === 'edit'


  // Inicializa o modal com base no modo ao abrir
  const initFromMode = () => {
    if (mode.type === 'configure') {
      setSelectedProvider(mode.provider)
      const info = PIXEL_OPTIONS.find((p) => p.key === mode.provider)
      if (info) setNomePixel(`${info.label} - Principal`)
      setStep('configure')
    } else if (mode.type === 'bulk') {
      setSelectedProdutos(mode.produtoIds.map(String))
      if (mode.provider) {
        setSelectedProvider(mode.provider)
        const info = PIXEL_OPTIONS.find((p) => p.key === mode.provider)
        if (info) setNomePixel(`${info.label} - Principal`)
        setPixelId('7644657994596') // ID já configurado
        setStep('configure')
      } else {
        setStep('select_provider')
      }
    } else if (mode.type === 'edit') {
      setSelectedProdutos([String(mode.produtoId)])
      if (mode.existing) {
        // Modo edição com dados existentes
        setSelectedProvider(mode.existing.provider)
        setNomePixel(mode.existing.nomePixel || '')
        setPixelId(mode.existing.pixelId)
        setSelectedEvents(mode.existing.events)
        setApiConversao(mode.existing.apiConversao)
        setTokenApi(mode.existing.tokenApi)
        setDiferenciarBoleto(mode.existing.diferenciarBoleto)
        setValorCustomizado(mode.existing.valorCustomizado)
        setStep('configure')
      } else if (mode.provider) {
        // Configurar individualmente — provider conhecido, pula seleção
        setSelectedProvider(mode.provider)
        setPixelId('7644657994596') // ID já configurado
        setStep('configure')
      } else {
        setStep('select_provider')
      }
    } else {
      setStep('select_provider')
    }
  }

  // biome-ignore lint: inicializa ao abrir
  useState(() => {
    if (open) initFromMode()
  })

  // Reinicializa quando o modal abre
  // biome-ignore lint: effect on open
  const [prevOpen, setPrevOpen] = useState(false)
  if (open && !prevOpen) {
    initFromMode()
  }
  if (open !== prevOpen) {
    setPrevOpen(open)
  }

  const resetForm = () => {
    setStep('select_provider')
    setSelectedProvider(null)
    setNomePixel('')
    setPixelId('')
    setSelectedEvents([])
    setApiConversao(false)
    setTokenApi('')
    setSelectedProdutos([])
    setReceberEvento('imediatos')
    setDiferenciarBoleto(false)
    setValorCustomizado('nunca')
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSelectProvider = (provider: PixelProvider) => {
    setSelectedProvider(provider)
    const info = PIXEL_OPTIONS.find((p) => p.key === provider)
    if (info) setNomePixel(`${info.label} - Principal`)
    setStep('configure')
  }

  const handleBackToSelect = () => {
    setStep('select_provider')
    setSelectedProvider(null)
    setPixelId('')
    setSelectedEvents([])
    setApiConversao(false)
    setTokenApi('')
    setErrors({})
  }

  const toggleEvent = (eventKey: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventKey)
        ? prev.filter((e) => e !== eventKey)
        : [...prev, eventKey]
    )
    setErrors((prev) => ({ ...prev, events: '' }))
  }

  const handleProdutosChange = (values: string[]) => {
    setSelectedProdutos(values)
    setErrors((prev) => ({ ...prev, produtos: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!nomePixel.trim()) {
      newErrors.nomePixel = 'O nome do pixel é obrigatório'
    }
    if (!pixelId.trim()) {
      newErrors.pixelId = 'O ID do pixel é obrigatório'
    }
    if (selectedEvents.length === 0) {
      newErrors.events = 'Selecione pelo menos um evento'
    }
    if (selectedProdutos.length === 0) {
      newErrors.produtos = 'Selecione pelo menos um produto'
    }
    if (apiConversao && !tokenApi.trim()) {
      newErrors.tokenApi = 'O token da API de conversão é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate() || !selectedProvider) return

    const config: PixelConfig = {
      provider: selectedProvider,
      nomePixel,
      pixelId,
      events: selectedEvents,
      apiConversao,
      tokenApi,
      produtos: selectedProdutos,
      diferenciarBoleto,
      valorCustomizado,
    }

    onSave?.(config)
    handleClose()
  }

  const providerInfo = PIXEL_OPTIONS.find((p) => p.key === selectedProvider)

  const hasPurchase = selectedEvents.includes('Purchase')

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnHidden
      closable
      title={null}
      className="configurar-pixel-modal"
      centered
      styles={{
        body: { padding: 0 },
      }}
    >
      {/* ══════════ STEP 1: Seleção do tipo de pixel (RN01) ══════════ */}
      {step === 'select_provider' && (
        <div className="p-6">
          <div className="text-center mb-6">
            <Typography.Title level={4} className="mb-1">
              {isBulk
                ? 'Configurar Pixel em Massa'
                : isEdit
                  ? 'Configurar Pixel'
                  : 'Configurar Pixel'}
            </Typography.Title>
            <Typography.Text type="secondary">
              Selecione o tipo de pixel que deseja configurar
            </Typography.Text>
          </div>

          {/* Banner de contexto: quantos produtos selecionados (bulk) ou qual produto (edit) */}
          {isBulk && mode.type === 'bulk' && (
            <Alert
              type="info"
              showIcon
              className="mb-4"
              message={
                <Typography.Text >
                  Configurando pixel para <Typography.Text strong>{mode.produtoIds.length} produto(s) / evento(s)</Typography.Text> selecionado(s)
                </Typography.Text>
              }
              description={
                <div className="flex flex-wrap gap-1 mt-1">
                  {mode.produtoIds.slice(0, 5).map((id) => (
                    <Tag key={id} className="text-sm">
                      {mode.produtoNomes[id] || `Produto ${id}`}
                    </Tag>
                  ))}
                  {mode.produtoIds.length > 5 && (
                    <Tag className="text-sm">+{mode.produtoIds.length - 5} mais</Tag>
                  )}
                </div>
              }
            />
          )}

          {isEdit && mode.type === 'edit' && (
            <Alert
              type="info"
              showIcon
              className="mb-4"
              message={
                <Typography.Text >
                  Configurando pixel para: <Typography.Text strong>{mode.produtoNome}</Typography.Text>
                </Typography.Text>
              }
            />
          )}

          <div className="flex flex-col gap-3">
            {PIXEL_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelectProvider(option.key)}
                className="flex items-center gap-4 p-4 border border-(--ant-color-border) rounded-lg hover:border-(--ant-color-primary) hover:bg-[#f5f7ff] transition-all cursor-pointer bg-white text-left w-full"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-(--ant-color-fill-tertiary) shrink-0 overflow-hidden">
                  <img
                    src={option.logo}
                    alt={option.label}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <Typography.Text strong >{option.label}</Typography.Text>
                </div>
                <ChevronLeft size={14} className="rotate-180 text-(--ant-color-text-quaternary)" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ STEP 2: Configuração do pixel ══════════ */}
      {step === 'configure' && providerInfo && (
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-(--ant-color-split)">
            <div className="flex items-center gap-3">
              {/* No modo configure/bulk com provider/edit com provider, não tem "voltar" para step 1 */}
              {mode.type !== 'configure' && !(mode.type === 'bulk' && mode.provider) && !(isEdit && mode.type === 'edit' && (mode.existing || mode.provider)) && (
                <>
                  <Button
                    type="text"
                    icon={<ChevronLeft size={14} />}
                    onClick={handleBackToSelect}
                    className="p-0 h-auto"
                  >
                    Voltar
                  </Button>
                  <Divider type="vertical" className="h-5" />
                </>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded bg-(--ant-color-fill-tertiary) overflow-hidden">
                  <img
                    src={providerInfo.logo}
                    alt={providerInfo.label}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <Typography.Title level={5} className="mb-0">
                  Configurar {providerInfo.label}
                </Typography.Title>
              </div>
            </div>
            {/* Contexto de bulk no step 2 */}
            {isBulk && mode.type === 'bulk' && (
              <div className="mt-3 px-0">
                <Tag color="blue" className="text-sm">
                  {mode.produtoIds.length} produto(s) / evento(s) selecionado(s)
                </Tag>
              </div>
            )}
          </div>

          {/* Body - scrollable */}
          <div className="px-6 py-5 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">

            {/* ── Nome do pixel ── */}
            <div className="flex flex-col gap-2">
              <Typography.Text strong>Nome do pixel</Typography.Text>
              <Input
                placeholder={`Ex: ${providerInfo.label} - Principal`}
                value={nomePixel}
                onChange={(e) => {
                  setNomePixel(e.target.value)
                  setErrors((prev) => ({ ...prev, nomePixel: '' }))
                }}
                status={errors.nomePixel ? 'error' : undefined}
              />
              <Typography.Text type="secondary" >
                Dê um nome para identificar este pixel (ex: "Facebook - Remarketing", "GA4 - Loja Principal")
              </Typography.Text>
              {errors.nomePixel && (
                <Typography.Text type="danger" >{errors.nomePixel}</Typography.Text>
              )}
            </div>
            {/* ── RN02: ID do pixel ── */}
            <div className="flex flex-col gap-2">
              <Typography.Text strong>{providerInfo.idLabel}</Typography.Text>
              <Input
                placeholder={providerInfo.idPlaceholder}
                value={pixelId}
                onChange={(e) => {
                  setPixelId(e.target.value)
                  setErrors((prev) => ({ ...prev, pixelId: '' }))
                }}
                status={errors.pixelId ? 'error' : undefined}
                disabled={isBulk || (isEdit && mode.type === 'edit' && !!mode.provider)}
              />
              {errors.pixelId && (
                <Typography.Text type="danger" >{errors.pixelId}</Typography.Text>
              )}
            </div>
            {/* ── RN04: Seleção de eventos (RF03) ── */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Typography.Text strong>Eventos que serão enviados</Typography.Text>
                <Typography.Text type="secondary">
                  Selecione os eventos que deseja rastrear. Pelo menos um evento deve ser selecionado.
                </Typography.Text>
              </div>
              {errors.events && (
                <Typography.Text type="danger" >{errors.events}</Typography.Text>
              )}
              <div className="grid grid-cols-2 gap-3">
                {EVENTS.map((event) => (
                  <label
                    key={event.key}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedEvents.includes(event.key)
                        ? 'border-(--ant-color-primary) bg-[#f5f7ff]'
                        : 'border-(--ant-color-border) hover:border-(--ant-color-primary)/40'
                    }`}
                  >
                    <Checkbox
                      checked={selectedEvents.includes(event.key)}
                      onChange={() => toggleEvent(event.key)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 flex flex-col gap-1 items-start">
                      <Tag color="blue">{event.key}</Tag>
                      <Typography.Text type="secondary">
                        {event.description}
                      </Typography.Text>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ── RF04: Configs avançadas de Purchase ── */}
            {hasPurchase && (
              <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Typography.Text strong>Configurações de Purchase</Typography.Text>
                    <Typography.Text type="secondary">
                      Configure como os eventos de venda serão enviados.
                    </Typography.Text>
                  </div>

                  {/* Deseja receber evento de */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Typography.Text >Deseja receber evento de:</Typography.Text>
                      <Tooltip title="Define em qual momento o evento de Purchase será disparado para a plataforma de anúncios. Isso impacta diretamente a otimização das suas campanhas.">
                        <HelpCircle size={14} className="text-(--ant-color-text-tertiary) text-sm cursor-help" />
                      </Tooltip>
                    </div>
                    <Radio.Group
                      value={receberEvento}
                      onChange={(e) => setReceberEvento(e.target.value)}
                      className="block w-full"
                    >
                      <div className="flex flex-col gap-3">
                        <label className="p-4 border border-(--ant-color-border) rounded-lg hover:border-(--ant-color-primary)/40 transition-all flex items-start gap-3 cursor-pointer">
                          <Radio value="imediatos" className="m-0" />
                          <div className="flex flex-col gap-1 flex-1">
                            <Typography.Text strong>Pagamentos imediatos</Typography.Text>
                            <Typography.Text type="secondary">
                              O evento é disparado assim que o pagamento é confirmado. Aplica-se a: Pix, Cartão de crédito e Saldo Eduzz.
                            </Typography.Text>
                          </div>
                        </label>
                        <label className="p-4 border border-(--ant-color-border) rounded-lg hover:border-(--ant-color-primary)/40 transition-all flex items-start gap-3 cursor-pointer">
                          <Radio value="nao_imediato" className="m-0" />
                          <div className="flex flex-col gap-1 flex-1">
                            <Typography.Text strong>Pagamento não imediato</Typography.Text>
                            <Typography.Text type="secondary">
                              O evento é disparado quando o boleto é gerado (antes da compensação). Útil para rastrear a intenção de compra mesmo antes da confirmação do pagamento.
                            </Typography.Text>
                          </div>
                        </label>
                        <label className="p-4 border border-(--ant-color-border) rounded-lg hover:border-(--ant-color-primary)/40 transition-all flex items-start gap-3 cursor-pointer">
                          <Radio value="todos" className="m-0" />
                          <div className="flex flex-col gap-1 flex-1">
                            <Typography.Text strong>Todos</Typography.Text>
                            <Typography.Text type="secondary">
                              Dispara o evento para todas as formas de pagamento (imediatos + boleto). Recomendado para ter a visão completa de conversões.
                            </Typography.Text>
                          </div>
                        </label>
                      </div>
                    </Radio.Group>
                  </div>

                  {/* RF19: Diferenciar boleto */}
                  <div className="flex items-center justify-between gap-4 p-4 border border-(--ant-color-border) rounded-lg">
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Typography.Text>Diferenciar pagamento não imediato (boleto)</Typography.Text>
                        <Tooltip title="Quando ativado, a geração do boleto dispara um evento separado (ex: ViewBoleto) antes do evento de Purchase. Isso permite distinguir quem gerou boleto de quem efetivamente pagou.">
                          <HelpCircle size={14} className="text-(--ant-color-text-tertiary) cursor-help" />
                        </Tooltip>
                      </div>
                      <Typography.Text type="secondary">
                        Se ativado, boletos gerados enviam evento intermediário antes do Purchase.
                      </Typography.Text>
                    </div>
                    <Switch
                      checked={diferenciarBoleto}
                      onChange={setDiferenciarBoleto}
                    />
                  </div>

                  {/* RF20: Valor customizado */}
                  <div className="flex flex-col gap-2">
                    <Typography.Text >Envio do valor da compra</Typography.Text>
                    <Select
                      value={valorCustomizado}
                      onChange={setValorCustomizado}
                      options={[
                        { value: 'nunca', label: 'Nunca enviar' },
                        { value: 'customizado', label: 'Sempre enviar com valores customizados' },
                        { value: 'sempre', label: 'Sempre enviar' },
                      ]}
                    />
                    {valorCustomizado === 'customizado' && (
                      <div className="flex flex-col gap-3 mt-1 p-4 bg-(--ant-color-fill-quaternary) rounded-lg border border-(--ant-color-split)">
                        <div className="flex flex-col gap-1.5">
                          <Typography.Text className="font-medium">Método de pagamento</Typography.Text>
                          <Select
                            placeholder="Selecione o método de pagamento"
                            options={[
                              { value: 'cartao', label: 'Cartão de crédito' },
                              { value: 'boleto', label: 'Boleto' },
                              { value: 'pix', label: 'PIX' },
                              { value: 'todos', label: 'Todos os métodos' },
                            ]}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Typography.Text className="font-medium">Novo valor</Typography.Text>
                          <Input placeholder="Ex: 99.90" prefix="R$" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            )}
            {/* ── RN03: Associação a produtos (após eventos) ── */}
            <div className="flex flex-col gap-3">
              <Typography.Text strong>Vincular produto(s) / evento(s)</Typography.Text>

              {errors.produtos && (
                <Typography.Text type="danger" >{errors.produtos}</Typography.Text>
              )}

              {/* TreeSelect de produtos */}
              {!isProductsLocked && (
                <TreeSelect
                  treeData={produtosTree}
                  value={selectedProdutos}
                  onChange={handleProdutosChange}
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                  placeholder="Pesquise pelo ID ou título do produto"
                  className="w-full"
                  maxTagCount={3}
                  maxTagPlaceholder={(omitted) => `+${omitted.length} mais`}
                  treeDefaultExpandAll
                  showSearch
                  treeNodeFilterProp="title"
                  allowClear
                />
              )}

              {/* Produtos selecionados em modo edit (locked) */}
              {isProductsLocked && selectedProdutos.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProdutos.map((val) => {
                    const title = getNodeTitle(produtosTree, val) || (mode.type === 'edit' ? `${mode.produtoId} - ${mode.produtoNome}` : val)
                    return (
                      <Tag key={val} className="!flex items-center gap-1 py-1 px-2">
                        {title}
                      </Tag>
                    )
                  })}
                </div>
              )}
            </div>
            {/* ── RN05: API de conversão ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Text strong>API de Conversão</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" >
                    Envio via servidor para maior precisão no rastreamento.
                  </Typography.Text>
                </div>
                <Switch
                  checked={apiConversao}
                  onChange={(checked) => {
                    setApiConversao(checked)
                    if (!checked) {
                      setTokenApi('')
                      setErrors((prev) => ({ ...prev, tokenApi: '' }))
                    }
                  }}
                />
              </div>

              {apiConversao && (
                <div className="p-4 bg-(--ant-color-fill-quaternary) rounded-lg flex flex-col gap-2">
                  <Typography.Text strong >Token API de Conversão</Typography.Text>
                  <Input.Password
                    placeholder="Cole o token da API de conversão aqui"
                    value={tokenApi}
                    onChange={(e) => {
                      setTokenApi(e.target.value)
                      setErrors((prev) => ({ ...prev, tokenApi: '' }))
                    }}
                    status={errors.tokenApi ? 'error' : undefined}
                  />
                  {errors.tokenApi && (
                    <Typography.Text type="danger" >{errors.tokenApi}</Typography.Text>
                  )}
                  <Alert
                    type="info"
                    showIcon
                    message={
                      <Typography.Text >
                        Dentro das configurações do seu Pixel do Facebook, vá na aba Configurações e em API de Conversões, dentro da sessão Configurar Manualmente, clique em Gerar Token de Acesso.
                      </Typography.Text>
                    }
                    className="mt-1"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-(--ant-color-split) flex justify-end gap-3 sticky bottom-0 bg-white z-10">
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="primary" onClick={handleSave}>
              {isBulk
                ? `Aplicar para ${selectedProdutos.length} item(ns)`
                : 'Aplicar'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
