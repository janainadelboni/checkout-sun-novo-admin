import { useState, useEffect, useRef, createContext, useContext } from 'react'
import {
  Button,
  Checkbox,
  Input,
  Layout,
  Menu,
  Modal,
  Radio,
  Segmented,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
  StarOutlined,
  CheckOutlined,
  DesktopOutlined,
  TagOutlined,
  EyeOutlined,
  DownOutlined,
  MobileOutlined,
} from '@ant-design/icons'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HolderOutlined } from '@ant-design/icons'
import { EduzzLogo, CheckoutSunLogo } from '../Logos'

const { Sider, Content } = Layout
const { Title, Text } = Typography

// ── DATA ─────────────────────────────────────────────────────────────
// Hierarquia: Produto > Variação (opcional) > Oferta (com preço/moeda)
const ALL_PRODUCTS = [
  {
    id: '2704934', name: 'A Nova Escola De Vendas', image: null,
    variations: [
      {
        id: '2223785', name: 'Acesso Completo',
        offers: [
          { id: 'k9x2m4p7', name: 'Oferta Principal', price: 'R$ 297,00', currency: 'BRL' },
          { id: 'j3w8n1q5', name: 'Oferta Promocional', price: 'R$ 197,00', currency: 'BRL' },
          { id: 'r7t5v2b8', name: 'International', price: 'USD 59.00', currency: 'USD' },
        ],
      },
    ],
  },
  {
    id: '2704935', name: 'Plano Black Monstro', image: null,
    variations: [
      {
        id: '2285001', name: 'Mensal',
        offers: [
          { id: 'a1b2c3d4', name: 'Oferta Base', price: 'R$ 97,00', currency: 'BRL' },
        ],
      },
      {
        id: '2285002', name: 'Anual 40% OFF',
        offers: [
          { id: 'e5f6g7h8', name: 'Oferta Base', price: 'R$ 697,00', currency: 'BRL' },
          { id: 'i9j0k1l2', name: 'Promo Lançamento', price: 'R$ 497,00', currency: 'BRL' },
        ],
      },
    ],
  },
  {
    id: '2030747', name: 'Academia 360', image: null,
    variations: [
      {
        id: '2030747', name: null,
        offers: [
          { id: 'm3n4o5p6', name: 'Oferta Base', price: 'R$ 97,00', currency: 'BRL' },
        ],
      },
    ],
  },
  {
    id: '2099100', name: 'Masterclass de Copywriting', image: null,
    variations: [
      {
        id: '2099100', name: null,
        offers: [
          { id: 'q7r8s9t0', name: 'Oferta Base', price: 'R$ 67,00', currency: 'BRL' },
          { id: 'u1v2w3x4', name: 'Oferta Internacional', price: 'USD 14.00', currency: 'USD' },
        ],
      },
    ],
  },
  {
    id: '2112200', name: 'Kit Ferramentas de Marketing', image: null,
    variations: [
      {
        id: '2112200', name: null,
        offers: [
          { id: 'y5z6a7b8', name: 'Oferta Base', price: 'R$ 37,00', currency: 'BRL' },
        ],
      },
    ],
  },
  {
    id: '2130011', name: 'Curso Tráfego Pago Avançado', image: null,
    variations: [
      {
        id: '2340001', name: 'Básico',
        offers: [
          { id: 'c9d0e1f2', name: 'Oferta Base', price: 'R$ 147,00', currency: 'BRL' },
        ],
      },
      {
        id: '2340002', name: 'Completo + Mentoria',
        offers: [
          { id: 'g3h4i5j6', name: 'Oferta Base', price: 'R$ 497,00', currency: 'BRL' },
          { id: 'k7l8m9n0', name: 'Oferta Early Bird', price: 'R$ 347,00', currency: 'BRL' },
        ],
      },
    ],
  },
]

// Helper: flatten para busca — cada oferta carrega contexto do produto/variação
function flattenOffers(products) {
  const result = []
  for (const prod of products) {
    for (const variation of prod.variations) {
      for (const offer of variation.offers) {
        result.push({
          offerId: offer.id,
          offerName: offer.name,
          price: offer.price,
          currency: offer.currency,
          variationId: variation.id,
          variationName: variation.name,
          productId: prod.id,
          productName: prod.name,
          // label legível
          label: [
            prod.name,
            variation.name,
            offer.name !== 'Oferta Base' ? offer.name : null,
          ].filter(Boolean).join(' · '),
        })
      }
    }
  }
  return result
}

const ALL_OFFERS = flattenOffers(ALL_PRODUCTS)

const EXISTING_OBS = [
  { id: 'ob-001', name: 'Upsell Masterclass',  mainOffers: ['k9x2m4p7', 'e5f6g7h8'], bumpOffers: ['q7r8s9t0'], checkouts: 2, active: true  },
  { id: 'ob-002', name: 'Kit Ferramentas',     mainOffers: ['m3n4o5p6'],              bumpOffers: ['y5z6a7b8'], checkouts: 1, active: true  },
  { id: 'ob-003', name: 'OB Academia',         mainOffers: ['c9d0e1f2'],              bumpOffers: ['u1v2w3x4'], checkouts: 0, active: false },
]

// Resolve offer IDs to labels for display
function resolveOfferLabels(offerIds) {
  return offerIds.map(id => {
    const o = ALL_OFFERS.find(f => f.offerId === id)
    return o ? o.label : id
  })
}

const STEPS = ['Identificação', 'Oferta', 'Revisão']

// ── CHIP ─────────────────────────────────────────────────────────────
function Chip({ label, onRemove, color = 'blue' }) {
  const colors = {
    blue:  'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  }
  const btnColors = {
    blue:  'bg-blue-200 text-blue-700 hover:bg-blue-300',
    green: 'bg-green-200 text-green-700 hover:bg-green-300',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${colors[color]}`}>
      <span className="max-w-[180px] truncate">{label}</span>
      <button onClick={onRemove} className={`flex items-center justify-center w-4 h-4 rounded-full ${btnColors[color]}`}>
        <CloseOutlined style={{ fontSize: 8 }} />
      </button>
    </span>
  )
}

// ── OFFER TREE SELECTOR ──────────────────────────────────────────────
function OfferTreeSelector({ products, selectedOfferIds, onToggleOffer, excludeOfferIds = [], onlyCurrency = null, color = 'blue' }) {
  const isIncluded = (o) => !excludeOfferIds.includes(o.id) && (!onlyCurrency || o.currency === onlyCurrency)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState({}) // default closed

  const toggleOpen = (id) => setOpen(s => ({ ...s, [id]: !s[id] }))

  const selColor = color === 'green' ? '#52c41a' : '#2B4ACF'
  const selBg = color === 'green' ? '#f6ffed' : '#eef1fc'
  const tagColor = color === 'green' ? 'success' : 'blue'

  const filtered = products.filter(prod => {
    if (!search) return true
    const q = search.toLowerCase()
    if (prod.name.toLowerCase().includes(q)) return true
    return prod.variations.some(v =>
      (v.name && v.name.toLowerCase().includes(q)) ||
      v.offers.some(o => o.name.toLowerCase().includes(q) || o.price.toLowerCase().includes(q))
    )
  })

  return (
    <div>
      <Input
        placeholder="Buscar produto, variação ou oferta"
        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 14 }}>Nenhum produto encontrado</div>
        )}
        {filtered.map(prod => {
          const hasVariations = prod.variations.length > 1 || prod.variations[0]?.name
          const isOpen = !!open[prod.id]
          const allVisibleOffers = prod.variations.flatMap(v => v.offers.filter(isIncluded))
          const totalOffers = allVisibleOffers.length
          const selCount = allVisibleOffers.filter(o => selectedOfferIds.includes(o.id)).length

          if (totalOffers === 0) return null

          // Simple product: no named variation + single visible offer → flat selectable row
          const isSimple = !hasVariations && totalOffers === 1
          if (isSimple) {
            const offer = allVisibleOffers[0]
            const variation = prod.variations[0]
            const sel = selectedOfferIds.includes(offer.id)
            return (
              <div
                key={prod.id}
                onClick={() => onToggleOffer(offer, variation, prod)}
                style={{
                  borderRadius: 8, border: `1px solid ${sel ? selColor : '#e5e7eb'}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', cursor: 'pointer',
                  background: sel ? selBg : '#fafafa',
                  transition: 'all 0.15s',
                }}
              >
                <Radio checked={sel} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prod.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>#{prod.id} · Oferta Base</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, flexShrink: 0, color: sel ? selColor : '#111827' }}>
                  {offer.price}
                </span>
                <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0, width: 32, textAlign: 'center' }}>
                  {offer.currency}
                </span>
              </div>
            )
          }

          // Complex product: has variations or multiple offers → collapsible
          return (
            <div key={prod.id} style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
              {/* Product header */}
              <div
                onClick={() => toggleOpen(prod.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', background: '#fafafa', cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <DownOutlined style={{ fontSize: 10, color: '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prod.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>#{prod.id}</span>
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                  {totalOffers} oferta{totalOffers > 1 ? 's' : ''}
                  {hasVariations ? ` · ${prod.variations.length} var.` : ''}
                </span>
                {selCount > 0 && <Tag color={tagColor} style={{ margin: 0, fontSize: 10 }}>{selCount}</Tag>}
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ borderTop: '1px solid #f0f0f0' }}>
                  {prod.variations.map(variation => {
                    const visibleOffers = variation.offers.filter(isIncluded)
                    if (visibleOffers.length === 0) return null

                    return (
                      <div key={variation.id}>
                        {variation.name && (
                          <div style={{ padding: '4px 16px', background: '#f9fafb', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {variation.name}
                            </span>
                            <span style={{ fontSize: 10, color: '#b0b0b0' }}>#{variation.id}</span>
                          </div>
                        )}
                        {visibleOffers.map((offer, i) => {
                          const sel = selectedOfferIds.includes(offer.id)
                          const isLast = i === visibleOffers.length - 1
                          return (
                            <div
                              key={offer.id}
                              onClick={() => onToggleOffer(offer, variation, prod)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px 10px 32px',
                                borderBottom: !isLast ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                                background: sel ? selBg : 'transparent',
                                transition: 'background 0.15s',
                              }}
                            >
                              <Radio checked={sel} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 14, color: '#374151', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {offer.name}
                                </span>
                                <span style={{ fontSize: 11, color: '#b0b0b0' }}>#{offer.id}</span>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 500, flexShrink: 0, color: sel ? selColor : '#111827' }}>
                                {offer.price}
                              </span>
                              <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0, width: 32, textAlign: 'center' }}>
                                {offer.currency}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── STEP PROGRESS — segmented bar + label ────────────────────────────
function StepProgress({ currentStep }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-xs font-medium text-[#2B4ACF]">Passo {currentStep + 1} de {STEPS.length}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-500">{STEPS[currentStep]}</span>
      </div>
      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-[#2B4ACF]' : 'bg-[#e5e7eb]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ── WIZARD SHELL ─────────────────────────────────────────────────────
function WizardShell({ currentStep, onBack, title, subtitle, breadcrumbItems, children }) {
  return (
    <AppShell breadcrumbItems={breadcrumbItems}>
      <div className="flex flex-col gap-4 mb-4">
        <Button icon={<LeftOutlined />} onClick={onBack} className="w-fit">Voltar</Button>
        <StepProgress currentStep={currentStep} />
        <div>
          <Title level={3} className="!mb-1">{title}</Title>
          <Text type="secondary">{subtitle}</Text>
        </div>
      </div>

      {children}
    </AppShell>
  )
}

// ── SHELL LAYOUT ─────────────────────────────────────────────────────
const NavContext = createContext(null)

function AppShell({ children }) {
  const onNavigate = useContext(NavContext)
  return (
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
            selectedKeys={['order-bump']}
            className="border-none"
            onClick={({ key }) => {
              if (key !== 'order-bump') onNavigate?.(key)
            }}
            items={[
              { key: 'analytics', label: 'Visão geral' },
              { key: 'rastreamento', label: 'Rastreamento' },
              { key: 'order-bump', label: 'Order Bump' },
            ]}
          />
        </Sider>

        {/* Main Content */}
        <Content className="p-8 bg-white flex flex-col gap-6 w-full">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SCREEN 0 — OB List
// ─────────────────────────────────────────────────────────────────────
function OBListScreen({ navigate }) {
  return (
    <AppShell breadcrumbItems={[{ title: <HomeOutlined /> }, { title: 'Checkout Sun' }, { title: 'Order Bump' }]}>
      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <Title level={3} className="!mb-1">Order Bump</Title>
          <Text type="secondary">Gerencie suas ofertas de order bump</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('a1')}>
          Criar novo Order Bump
        </Button>
      </div>

      {/* Cards list — same pattern as Rastreamento pixel cards */}
      <div className="flex flex-col gap-4">
        {EXISTING_OBS.map((ob) => (
          <div
            key={ob.id}
            className={`flex items-center p-4 border rounded-lg w-full transition-all ${
              ob.active
                ? 'border-[#d9d9d9] hover:border-[#2B4ACF]/40 hover:shadow-sm cursor-pointer'
                : 'border-dashed border-[#d9d9d9] bg-[#fafafa]'
            }`}
          >
            {/* Left: Name + status */}
            <div className="w-[260px] shrink-0 flex flex-col gap-1">
              <Text strong className="!text-base">{ob.name}</Text>
              {ob.active ? (
                <Tag color="success" className="!text-xs !w-fit !m-0">Ativo</Tag>
              ) : (
                <Tag className="!text-xs !w-fit !m-0 !text-[rgba(0,0,0,0.25)]">Inativo</Tag>
              )}
            </div>

            {/* Middle: Counts */}
            <div className="w-[200px] shrink-0 flex flex-col gap-1">
              <Tooltip title={resolveOfferLabels(ob.mainOffers).join('\n')} overlayStyle={{ whiteSpace: 'pre-line' }}>
                <Tag className="!border-[#d9d9d9] !bg-transparent !m-0 !cursor-help">
                  {ob.mainOffers.length} Oferta(s) principal(is)
                </Tag>
              </Tooltip>
              <Tag className="!border-[#d9d9d9] !bg-transparent !m-0">
                {ob.checkouts} Checkout(s)
              </Tag>
            </div>

            {/* Right: Action */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <Button
                type="primary"
                ghost
                icon={<EyeOutlined />}
                onClick={() => {}}
              >
                Ver detalhes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STEP 1 — Nome + Oferta(s) principal(is) (checkout onde o bump aparece)
// ─────────────────────────────────────────────────────────────────────
function Step1({ navigate, state, setState }) {
  const selectedIds = state.mainOffers.map(o => o.offerId)

  // Radio behavior: one offer per product
  const toggleOffer = (offer, variation, product) => {
    setState(s => {
      const exists = s.mainOffers.find(o => o.offerId === offer.id)
      if (exists) return { ...s, mainOffers: s.mainOffers.filter(o => o.offerId !== offer.id) }
      // Remove any other offer from the same product, then add the new one
      const withoutSameProduct = s.mainOffers.filter(o => o.productId !== product.id)
      return { ...s, mainOffers: [...withoutSameProduct, {
        offerId: offer.id, offerName: offer.name, price: offer.price, currency: offer.currency,
        variationName: variation.name, productId: product.id, productName: product.name,
        label: [product.name, variation.name, offer.name !== 'Oferta Base' ? offer.name : null].filter(Boolean).join(' · '),
      }] }
    })
  }

  const remove = (offerId) => setState(s => ({ ...s, mainOffers: s.mainOffers.filter(o => o.offerId !== offerId) }))
  const canContinue = state.name.trim() && state.mainOffers.length > 0
  const [previewMode, setPreviewMode] = useState('desktop')

  return (
    <WizardShell
      currentStep={0}
      onBack={() => navigate('obList')}
      title="Criar Order Bump"
      subtitle="Defina o nome e selecione em quais checkouts o bump será exibido"
      breadcrumbItems={[{ title: <HomeOutlined /> }, { title: 'Order Bump' }, { title: 'Novo OB' }]}
    >
      <div className="flex gap-6 items-start">
        {/* Left — Form */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Name */}
          <div className="bg-[#fafafa] rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Order Bump <span className="text-red-500">*</span>
            </label>
            <Input
              value={state.name}
              onChange={e => setState(s => ({ ...s, name: e.target.value }))}
              placeholder="Ex: Upsell Masterclass Pro"
              size="large"
            />
            <Text type="secondary" className="!text-xs mt-1 block">Usado apenas para identificação interna</Text>
          </div>

          {/* Offer selection */}
          <div className="border border-[#d9d9d9] rounded-lg p-5 bg-white">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                Oferta(s) / checkout(s) principal(is) <span className="text-red-500">*</span>
              </label>
              {state.mainOffers.length > 0 && (
                <Tag color="blue" className="!m-0">{state.mainOffers.length} selecionada{state.mainOffers.length > 1 ? 's' : ''}</Tag>
              )}
            </div>
            <Text type="secondary" className="!text-xs block mb-3">
              Selecione as ofertas (checkouts) onde o bump será exibido. Cada oferta tem seu próprio link e preço.
            </Text>

            {state.mainOffers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                {state.mainOffers.map(o => (
                  <Chip key={o.offerId} label={o.label} onRemove={() => remove(o.offerId)} color="blue" />
                ))}
              </div>
            )}

            <OfferTreeSelector
              products={ALL_PRODUCTS}
              selectedOfferIds={selectedIds}
              onToggleOffer={toggleOffer}
              color="blue"
            />
          </div>
        </div>

        {/* Right — Preview */}
        <CheckoutPreview
          mainOffers={state.mainOffers}
          bumpOffers={state.bumpOffers}
          mode={previewMode}
          onModeChange={setPreviewMode}
        />
      </div>

      <div className="flex justify-end">
        <Button type="primary" size="large" disabled={!canContinue} onClick={() => canContinue && navigate('a2')} icon={<RightOutlined />} iconPosition="end">
          Continuar
        </Button>
      </div>
    </WizardShell>
  )
}

// ── CHECKOUT PREVIEW ─────────────────────────────────────────────────
function CheckoutPreview({ mainOffers, bumpOffers, mode, onModeChange }) {
  const mainOffer = mainOffers[0]
  return (
    <div className="w-[420px] shrink-0 sticky top-8">
      <div className="border border-[#d9d9d9] rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#fafafa] border-b border-[#f0f0f0] text-xs font-medium px-4 py-2 flex items-center justify-between gap-2" style={{ color: '#475569' }}>
          <span className="flex items-center gap-2">
            <EyeOutlined style={{ color: '#94a3b8' }} /> Pré-visualização
          </span>
          <Segmented
            size="small"
            value={mode}
            onChange={onModeChange}
            options={[
              { label: <DesktopOutlined />, value: 'desktop' },
              { label: <MobileOutlined />, value: 'mobile' },
            ]}
          />
        </div>

        {/* Canvas */}
        <div style={{
          padding: mode === 'mobile' ? '20px 12px' : 16,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            width: mode === 'mobile' ? 320 : '100%',
            maxWidth: '100%',
            border: mode === 'mobile' ? '8px solid #1a1a1a' : 'none',
            borderRadius: mode === 'mobile' ? 28 : 0,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: mode === 'mobile' ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
          }}>
            <div style={{ padding: mode === 'mobile' ? 12 : 0 }}>
              {/* Main offer */}
              {mainOffer ? (
                <div className="bg-white rounded-lg border border-[#d9d9d9] p-3 mb-3">
                  <Text type="secondary" className="!text-[10px] uppercase tracking-wide block mb-1">Checkout principal</Text>
                  <Text strong className="!text-sm">{mainOffer.productName}</Text>
                  {mainOffer.variationName && (
                    <Text type="secondary" className="!text-xs block">{mainOffer.variationName}</Text>
                  )}
                  <Text type="secondary" className="!text-xs block">{mainOffer.price}</Text>
                  {mainOffers.length > 1 && (
                    <Text type="secondary" className="!text-[10px] block mt-1 italic">
                      + {mainOffers.length - 1} outro{mainOffers.length > 2 ? 's' : ''} checkout{mainOffers.length > 2 ? 's' : ''}
                    </Text>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#d9d9d9] rounded-lg mb-3">
                  <Text type="secondary" className="!text-xs block">Selecione um checkout principal</Text>
                </div>
              )}

              {/* Bump offers */}
              {bumpOffers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {bumpOffers.map(bp => (
                    <div key={bp.offerId} className="bg-white rounded-lg border-2 border-dashed border-[#faad14] p-3 relative">
                      <div className="absolute -top-2.5 left-3 bg-[#faad14] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        OFERTA ESPECIAL
                      </div>
                      <div className="flex items-start gap-3 mt-1">
                        <Checkbox checked={false} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <Text strong className="!text-sm block">{bp.productName}</Text>
                          {bp.description ? (
                            <Text type="secondary" className="!text-xs block mt-0.5 leading-relaxed">{bp.description}</Text>
                          ) : (
                            <Text type="secondary" className="!text-xs block mt-0.5 italic !text-gray-300">Sem descrição adicionada...</Text>
                          )}
                          <Text className="!text-sm !text-[#2B4ACF] font-semibold block mt-1">+ {bp.price}</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#d9d9d9] rounded-lg">
                  <TagOutlined className="text-2xl text-gray-300 mb-2" />
                  <Text type="secondary" className="!text-xs block">
                    {mainOffer ? 'Adicione ofertas bump para visualizar' : 'O bump será exibido aqui'}
                  </Text>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-[#d9d9d9] mt-3 pt-3 flex justify-between items-center">
                <Text type="secondary" className="!text-xs">Total estimado</Text>
                <Text strong className="!text-sm">
                  {mainOffer?.price || 'R$ --'}
                  {bumpOffers.length > 0 && <span className="text-gray-400 font-normal"> + bumps</span>}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SORTABLE BUMP CARD ───────────────────────────────────────────────
function SortableBumpCard({ bump, index, onEdit, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: bump.offerId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: '#fff',
    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab', padding: '4px 2px', color: '#94a3b8',
          display: 'flex', alignItems: 'center', flexShrink: 0,
          touchAction: 'none',
        }}
        title="Arraste para reordenar"
      >
        <HolderOutlined style={{ fontSize: 16 }} />
      </div>

      {/* Position badge */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: '#2B4ACF', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, flexShrink: 0,
      }}>
        {index + 1}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text strong style={{ fontSize: 14, display: 'block' }}>{bump.productName}</Text>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
          {bump.variationName && `${bump.variationName} · `}
          {bump.offerName} · <strong style={{ color: '#2B4ACF' }}>{bump.price}</strong>
        </Text>
        {bump.description ? (
          <Text style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>
            "{bump.description}"
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic', color: '#d9d9d9' }}>
            Sem descrição
          </Text>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(bump)}>Editar</Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onRemove(bump.offerId)} />
      </div>
    </div>
  )
}

// ── ADD BUMP MODAL ───────────────────────────────────────────────────
function AddBumpModal({ open, onClose, onSave, excludeOfferIds, editingBump = null }) {
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [description, setDescription] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Reset on open/editingBump change
  useEffect(() => {
    if (open) {
      if (editingBump) {
        setSelectedOffer({
          offer: { id: editingBump.offerId, name: editingBump.offerName, price: editingBump.price, currency: editingBump.currency },
          variation: { id: '', name: editingBump.variationName },
          product: { id: editingBump.productId, name: editingBump.productName },
        })
        setDescription(editingBump.description || '')
      } else {
        setSelectedOffer(null)
        setDescription('')
      }
      setDropdownOpen(false)
    }
  }, [open, editingBump])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleSelectOffer = (offer, variation, product) => {
    setSelectedOffer({ offer, variation, product })
    setDropdownOpen(false)
  }

  const handleSave = () => {
    if (!selectedOffer) return
    const { offer, variation, product } = selectedOffer
    onSave({
      offerId: offer.id, offerName: offer.name, price: offer.price, currency: offer.currency,
      variationName: variation.name, productId: product.id, productName: product.name,
      label: [product.name, variation.name, offer.name !== 'Oferta Base' ? offer.name : null].filter(Boolean).join(' · '),
      description: description.trim(),
    })
  }

  const footer = [
    <Button key="cancel" onClick={onClose}>Cancelar</Button>,
    <Button key="save" type="primary" disabled={!selectedOffer} onClick={handleSave}>
      {editingBump ? 'Salvar alterações' : 'Adicionar bump'}
    </Button>,
  ]

  const selectedLabel = selectedOffer
    ? [selectedOffer.product.name, selectedOffer.variation.name, selectedOffer.offer.name !== 'Oferta Base' ? selectedOffer.offer.name : null].filter(Boolean).join(' › ')
    : ''

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editingBump ? 'Editar oferta bump' : 'Adicionar oferta bump'}
      width={640}
      footer={footer}
      destroyOnHidden
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>
        {/* Offer selector — input + floating dropdown with OfferTreeSelector */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#475569', display: 'block', marginBottom: 6 }}>
            Produto / Oferta <span style={{ color: '#ef4444' }}>*</span>
          </label>

          <div ref={wrapperRef} style={{ position: 'relative' }}>
            {/* Field displaying selection or placeholder — opens dropdown on click */}
            <div
              onClick={() => setDropdownOpen(true)}
              style={{
                width: '100%',
                minHeight: 40,
                padding: '8px 12px',
                border: `1px solid ${dropdownOpen ? '#2B4ACF' : '#d9d9d9'}`,
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'border-color 0.15s',
              }}
            >
              <SearchOutlined style={{ color: '#9ca3af', flexShrink: 0 }} />
              {selectedOffer ? (
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, color: '#111827' }}>
                  {selectedLabel}
                  <span style={{ color: '#2B4ACF', fontWeight: 500, marginLeft: 6 }}>· {selectedOffer.offer.price}</span>
                </div>
              ) : (
                <span style={{ flex: 1, fontSize: 14, color: '#9ca3af' }}>Buscar produto, variação ou oferta</span>
              )}
              {selectedOffer && (
                <CloseOutlined
                  onClick={(e) => { e.stopPropagation(); setSelectedOffer(null) }}
                  style={{ color: '#9ca3af', fontSize: 12, cursor: 'pointer', padding: 4 }}
                />
              )}
            </div>

            {/* Floating dropdown with the same tree selector from Step 1 */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                zIndex: 100,
                background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                maxHeight: 400,
                overflowY: 'auto',
              }}>
                <OfferTreeSelector
                  products={ALL_PRODUCTS}
                  selectedOfferIds={selectedOffer ? [selectedOffer.offer.id] : []}
                  onToggleOffer={handleSelectOffer}
                  excludeOfferIds={excludeOfferIds}
                  onlyCurrency="BRL"
                  color="green"
                />
              </div>
            )}
          </div>

        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#475569', display: 'block', marginBottom: 6 }}>
            Descrição persuasiva exibida no checkout
          </label>
          <Input.TextArea
            value={description}
            onChange={e => e.target.value.length <= MAX_DESCRIPTION_LENGTH && setDescription(e.target.value)}
            placeholder="Ex: Aproveite esta oferta exclusiva e complemente seu aprendizado com este material..."
            rows={3}
            maxLength={MAX_DESCRIPTION_LENGTH}
            showCount
          />
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 6 }}>
            Uma descrição persuasiva aumenta a taxa de conversão do bump.
          </Text>
        </div>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STEP 2 — Oferta(s) bump (o que será oferecido no checkout)
// ─────────────────────────────────────────────────────────────────────
function Step2({ navigate, state, setState }) {
  const mainOfferIds = state.mainOffers.map(o => o.offerId)
  const atLimit = state.bumpOffers.length >= MAX_BUMP_PRODUCTS
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBump, setEditingBump] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop')

  const bumpOfferIds = state.bumpOffers.map(o => o.offerId)
  // When editing, don't exclude the current offer from selection
  const excludeIds = editingBump
    ? [...mainOfferIds, ...bumpOfferIds.filter(id => id !== editingBump.offerId)]
    : [...mainOfferIds, ...bumpOfferIds]

  const handleAdd = () => {
    setEditingBump(null)
    setModalOpen(true)
  }

  const handleEdit = (bump) => {
    setEditingBump(bump)
    setModalOpen(true)
  }

  const handleRemove = (offerId) => {
    setState(s => ({ ...s, bumpOffers: s.bumpOffers.filter(o => o.offerId !== offerId) }))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setState(s => {
      const oldIndex = s.bumpOffers.findIndex(o => o.offerId === active.id)
      const newIndex = s.bumpOffers.findIndex(o => o.offerId === over.id)
      return { ...s, bumpOffers: arrayMove(s.bumpOffers, oldIndex, newIndex) }
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleSave = (bumpData) => {
    setState(s => {
      if (editingBump) {
        return { ...s, bumpOffers: s.bumpOffers.map(o => o.offerId === editingBump.offerId ? bumpData : o) }
      }
      return { ...s, bumpOffers: [...s.bumpOffers, bumpData] }
    })
    setModalOpen(false)
  }

  const canContinue = state.bumpOffers.length > 0

  return (
    <WizardShell
      currentStep={1}
      onBack={() => navigate('a1')}
      title="Oferta(s) do bump"
      subtitle={`Adicione até ${MAX_BUMP_PRODUCTS} ofertas que serão exibidas como bump no(s) checkout(s)`}
      breadcrumbItems={[{ title: <HomeOutlined /> }, { title: 'Order Bump' }, { title: 'Novo OB' }]}
    >
      <div className="flex gap-6 items-start">
        {/* Left — Added bumps list */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="border border-[#d9d9d9] rounded-lg p-5 bg-white">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block">
                Ofertas bump <span className="text-red-500">*</span>
              </label>
              <Text type="secondary" className="!text-xs">
                {state.bumpOffers.length} de {MAX_BUMP_PRODUCTS} adicionada{state.bumpOffers.length !== 1 ? 's' : ''}
              </Text>
            </div>

            <div className="flex flex-col gap-3">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={state.bumpOffers.map(o => o.offerId)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-3">
                    {state.bumpOffers.map((bp, i) => (
                      <SortableBumpCard
                        key={bp.offerId}
                        bump={bp}
                        index={i}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add slot — dashed placeholder appended to the list */}
              {!atLimit && (
                <button
                  type="button"
                  onClick={handleAdd}
                  style={{
                    border: '1px dashed #d9d9d9', borderRadius: 8,
                    padding: state.bumpOffers.length === 0 ? '32px 20px' : '16px',
                    background: '#fafafa', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    color: '#475569', fontSize: 14, fontWeight: 500,
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#2B4ACF'
                    e.currentTarget.style.color = '#2B4ACF'
                    e.currentTarget.style.background = '#eef1fc'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#d9d9d9'
                    e.currentTarget.style.color = '#475569'
                    e.currentTarget.style.background = '#fafafa'
                  }}
                >
                  <PlusOutlined />
                  {state.bumpOffers.length === 0 ? 'Adicionar primeira oferta bump' : 'Adicionar outra oferta bump'}
                </button>
              )}

              {atLimit && (
                <div style={{
                  border: '1px dashed #d9d9d9', borderRadius: 8, padding: 12,
                  background: '#fafafa', textAlign: 'center',
                }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Limite de {MAX_BUMP_PRODUCTS} ofertas bump atingido
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Checkout preview */}
        <CheckoutPreview
          mainOffers={state.mainOffers}
          bumpOffers={state.bumpOffers}
          mode={previewMode}
          onModeChange={setPreviewMode}
        />
      </div>

      <div className="flex justify-end">
        <Button type="primary" size="large" disabled={!canContinue} onClick={() => canContinue && navigate('a4')} icon={<RightOutlined />} iconPosition="end">
          Continuar
        </Button>
      </div>

      <AddBumpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        excludeOfferIds={excludeIds}
        editingBump={editingBump}
      />
    </WizardShell>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STEP 3 — Revisão
// ─────────────────────────────────────────────────────────────────────
function StepReview({ navigate, state }) {
  return (
    <WizardShell
      currentStep={2}
      onBack={() => navigate('a2')}
      title="Revisão"
      subtitle="Confirme antes de criar"
      breadcrumbItems={[{ title: <HomeOutlined /> }, { title: 'Order Bump' }, { title: 'Novo OB' }]}
    >
      <div className="max-w-[700px] mx-auto w-full flex flex-col gap-3">
        {/* Name */}
        <div className="border border-[#d9d9d9] rounded-lg p-4 flex items-center justify-between">
          <div>
            <Text type="secondary" className="!text-xs uppercase tracking-wide">Nome do Order Bump</Text>
            <div className="text-base font-bold">{state.name}</div>
          </div>
          <Button type="link" icon={<EditOutlined />} onClick={() => navigate('a1')}>Editar</Button>
        </div>

        {/* Main products */}
        <div className="border border-[#d9d9d9] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="font-semibold">Oferta(s) / checkout(s) principal(is) <span className="font-normal text-gray-400 ml-1">({state.mainOffers.length})</span></Text>
            <Button type="link" icon={<EditOutlined />} onClick={() => navigate('a1')}>Editar</Button>
          </div>
          {state.mainOffers.map(o => (
            <div key={o.offerId} className="flex justify-between items-center py-2 border-t border-[#f0f0f0] text-sm">
              <div>
                <span className="font-medium text-gray-700">{o.productName}</span>
                {o.variationName && <span className="text-gray-400 ml-1">· {o.variationName}</span>}
                <span className="text-gray-400 ml-1">· {o.offerName}</span>
              </div>
              <span className="text-gray-400 shrink-0 ml-2">{o.price}</span>
            </div>
          ))}
        </div>

        {/* Bump offers */}
        <div className="border border-[#d9d9d9] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="font-semibold">Oferta(s) bump <span className="font-normal text-gray-400 ml-1">({state.bumpOffers.length})</span></Text>
            <Button type="link" icon={<EditOutlined />} onClick={() => navigate('a2')}>Editar</Button>
          </div>
          {state.bumpOffers.map(o => (
            <div key={o.offerId} className="py-3 border-t border-[#f0f0f0]">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-gray-700">{o.productName}</span>
                  {o.variationName && <span className="text-gray-400 ml-1">· {o.variationName}</span>}
                  <span className="text-gray-400 ml-1">· {o.offerName}</span>
                </div>
                <span className="text-gray-400 shrink-0 ml-2">{o.price}</span>
              </div>
              {o.description && (
                <Text type="secondary" className="!text-xs mt-1 block italic">"{o.description}"</Text>
              )}
            </div>
          ))}
        </div>

        <Button type="primary" size="large" icon={<StarOutlined />} onClick={() => navigate('success')}>
          Criar Order Bump
        </Button>
      </div>
    </WizardShell>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SUCCESS
// ─────────────────────────────────────────────────────────────────────
function SuccessScreen({ navigate, state }) {
  return (
    <AppShell breadcrumbItems={[{ title: <HomeOutlined /> }, { title: 'Order Bump' }, { title: 'Sucesso' }]}>
      <div className="max-w-[600px] mx-auto text-center pt-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckOutlined style={{ fontSize: 40, color: '#52c41a' }} />
        </div>
        <Title level={2}>Order Bump criado!</Title>
        <Text type="secondary" className="block mb-8">
          <strong className="text-gray-900">{state.name}</strong> está ativo e pronto para converter.
        </Text>

        <div className="border border-[#d9d9d9] rounded-lg p-5 text-left mb-6">
          <Text className="font-semibold block mb-4">Resumo</Text>

          <div className="mb-3">
            <Text type="secondary" className="!text-xs uppercase tracking-wide block mb-1">Checkouts principais ({state.mainOffers.length})</Text>
            <div className="flex flex-wrap gap-1.5">
              {state.mainOffers.map(o => <Tag key={o.offerId} color="blue" className="!m-0 !text-xs">{o.label}</Tag>)}
            </div>
          </div>

          <div className="border-t border-[#f0f0f0] pt-3">
            <Text type="secondary" className="!text-xs uppercase tracking-wide block mb-1">Oferta(s) bump ({state.bumpOffers.length})</Text>
            <div className="flex flex-col gap-2 mt-1">
              {state.bumpOffers.map(o => (
                <div key={o.offerId}>
                  <Tag color="success" className="!m-0">{o.productName} · {o.price}</Tag>
                  {o.description && <Text type="secondary" className="!text-xs block mt-0.5 ml-1 italic">"{o.description}"</Text>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="primary" size="large" onClick={() => navigate('obList')}>
          Ver todos os Order Bumps
        </Button>
      </div>
    </AppShell>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────
const MAX_BUMP_PRODUCTS = 5
const MAX_DESCRIPTION_LENGTH = 255
const INITIAL = { name: '', mainOffers: [], bumpOffers: [] }

export default function PaginaOrderBump({ onNavigate }) {
  const [screen, setScreen] = useState('obList')
  const [state, setState] = useState(INITIAL)

  const navigate = (s) => {
    if (s === 'obList') setState(INITIAL)
    setScreen(s)
  }

  let content
  switch (screen) {
    case 'obList':  content = <OBListScreen navigate={navigate} />; break
    case 'a1':      content = <Step1 navigate={navigate} state={state} setState={setState} />; break
    case 'a2':      content = <Step2 navigate={navigate} state={state} setState={setState} />; break
    case 'a4':      content = <StepReview navigate={navigate} state={state} />; break
    case 'success': content = <SuccessScreen navigate={navigate} state={state} />; break
    default:        content = <OBListScreen navigate={navigate} />
  }
  return <NavContext.Provider value={onNavigate}>{content}</NavContext.Provider>
}
