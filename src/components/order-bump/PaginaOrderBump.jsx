import { useState, useEffect, useRef, createContext, useContext } from 'react'
import {
  App as AntdApp,
  Breadcrumb,
  Button,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Segmented,
  Select,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Settings,
  GripVertical,
  Bold,
  Italic,
  Underline,
  HelpCircle,
  ChevronLeft,
  Home,
  Eye,
  Monitor,
  Smartphone,
  Tag as TagIcon,
  Image as ImageIcon,
  Lock,
  Copy,
  Link as LinkIcon,
  QrCode,
  ExternalLink,
} from 'lucide-react'
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
import { EduzzLogo, CheckoutSunLogo } from '../Logos'

const { Sider, Content } = Layout

// ── DATA ─────────────────────────────────────────────────────────────
const PRODUCT_TYPES = {
  infoproduto: 'Infoproduto',
  evento: 'Ingresso',
  servico: 'Serviço',
  fisico: 'Produto físico',
  assinatura: 'Assinatura',
}

// Matriz de compatibilidade conforme docs Eduzz
function isCompatible(mainType, bumpType) {
  if (mainType === 'assinatura') return bumpType === 'assinatura'
  return ['infoproduto', 'servico'].includes(bumpType)
}

const INITIAL_PRODUCTS = [
  { id: '2704934', name: 'A Nova Escola De Vendas', type: 'infoproduto', priceCents: 29700, bumps: [
    { id: 'b1', bumpProductId: '2099100', priceCents: 4700, salesLimit: 100, salesCount: 23, copy: '<b>Aproveite</b> esta oferta exclusiva e complemente seu aprendizado.\nMaterial extra incluso.', active: true },
  ]},
  { id: '2704935', name: 'Plano Black Monstro', type: 'assinatura', priceCents: 9700, bumps: [], variations: [
    { id: '2704936', name: 'Plano Mensal', priceCents: 9700 },
    { id: '2704937', name: 'Plano Anual (2 meses grátis)', priceCents: 97000 },
  ]},
  { id: '2030747', name: 'Academia 360', type: 'infoproduto', priceCents: 9700, bumps: [
    { id: 'b2', bumpProductId: '2112200', priceCents: 1700, salesLimit: null, salesCount: 0, copy: 'Kit de ferramentas para complementar seus estudos.', active: true },
    { id: 'b3', bumpProductId: '2099100', priceCents: 3700, salesLimit: 50, salesCount: 5, copy: '<b>Apenas 50 unidades</b> nesse preço!', active: true },
  ], variations: [
    { id: '2030748', name: 'Acesso 6 meses', priceCents: 9700 },
    { id: '2030749', name: 'Acesso 12 meses', priceCents: 14700 },
    { id: '2030750', name: 'Acesso vitalício', priceCents: 24700 },
  ]},
  { id: '2099100', name: 'Masterclass de Copywriting', type: 'infoproduto', priceCents: 6700, bumps: [], variations: [
    { id: '2099101', name: 'Lote 1 — Earlybird', priceCents: 4700 },
    { id: '2099102', name: 'Lote 2 — Padrão', priceCents: 6700 },
    { id: '2099103', name: 'Lote 3 — VIP', priceCents: 9700 },
  ]},
  { id: '2112200', name: 'Kit Ferramentas de Marketing', type: 'servico', priceCents: 3700, bumps: [] },
  { id: '2576289', name: 'Ingresso PISTA - Festival 2026', type: 'evento', priceCents: 12000, bumps: [], variations: [
    { id: '2576290', name: 'Lote Promocional', priceCents: 8000 },
    { id: '2576291', name: 'Lote 1', priceCents: 12000 },
    { id: '2576292', name: 'Lote 2', priceCents: 15000 },
  ]},
  { id: '2073334', name: 'Ebook Vendas Premium', type: 'infoproduto', priceCents: 4700, bumps: [] },
  { id: '9104452', name: 'Camiseta Oficial Eduzz', type: 'fisico', priceCents: 8990, bumps: [] },
  { id: '2411153', name: 'Plano Pro Anual', type: 'assinatura', priceCents: 49700, bumps: [] },
]

/**
 * Achata produtos + variações em opções para o Select.
 * Variações herdam type do produto pai e aparecem agrupadas.
 */
function buildBumpOptions(allProducts, mainType, existingBumpProductIds) {
  return allProducts
    .filter(p => isCompatible(mainType, p.type))
    .filter(p => !existingBumpProductIds.includes(p.id))
    .map(p => {
      if (!p.variations || p.variations.length === 0) {
        return {
          label: `${p.id} - ${p.name}`,
          title: `${p.id} ${p.name} ${PRODUCT_TYPES[p.type]}`,
          options: [{
            value: p.id,
            label: `${p.id} - ${p.name} · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(p.priceCents)}`,
            search: `${p.id} ${p.name} ${PRODUCT_TYPES[p.type]}`,
          }],
        }
      }
      return {
        label: `${p.id} - ${p.name} (${p.variations.length} variações)`,
        title: `${p.id} ${p.name}`,
        options: [
          {
            value: p.id,
            label: `${p.id} - ${p.name} (Produto pai) · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(p.priceCents)}`,
            search: `${p.id} ${p.name} ${PRODUCT_TYPES[p.type]} pai`,
          },
          ...p.variations
            .filter(v => !existingBumpProductIds.includes(v.id))
            .map(v => ({
              value: v.id,
              label: `${v.id} - ${v.name} · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(v.priceCents)}`,
              search: `${v.id} ${v.name} ${p.name} ${PRODUCT_TYPES[p.type]}`,
            })),
        ],
      }
    })
}

const MAX_BUMPS_PER_PRODUCT = 5
const MAX_COPY_LENGTH = 500

// ── HELPERS ──────────────────────────────────────────────────────────
function fmtBRL(cents) {
  if (cents == null) return '—'
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function stripHtml(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

function findProduct(products, id) {
  for (const p of products) {
    if (p.id === id) return p
    const v = p.variations?.find(v => v.id === id)
    if (v) return { ...v, type: p.type, parentId: p.id, parentName: p.name }
  }
  return null
}

// ── NAV CONTEXT ──────────────────────────────────────────────────────
const NavContext = createContext(null)

// ── KPI ROW ──────────────────────────────────────────────────────────
function KpiCard({ label, value, hint }) {
  return (
    <div className="relative flex-1 min-w-0 rounded-lg px-4 py-3 flex flex-col gap-0.5 bg-[#f5f7fa]">
      {hint && (
        <Tooltip title={hint}>
          <HelpCircle size={14} className="absolute top-2.5 right-2.5 text-(--ant-color-text-quaternary) cursor-help" />
        </Tooltip>
      )}
      <div className="pr-5">
        <Typography.Text type="secondary" className="text-[11px] leading-tight">
          {label}
        </Typography.Text>
      </div>
      <Typography.Title level={4} className="mb-0 mt-auto">
        {value}
      </Typography.Title>
    </div>
  )
}

function KpisRow({ products }) {
  const withBump = products.filter(p => p.bumps.length > 0).length
  const withoutBump = products.length - withBump
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <KpiCard label="Produtos com bump" value={withBump} />
      <KpiCard label="Produtos sem bump" value={withoutBump} />
      <KpiCard label="Participação nas vendas" value="12,4%" hint="Vendas com bump aceito / total de vendas (últimos 30 dias)" />
      <KpiCard label="Taxa de aceitação" value="34,7%" hint="Compradores que aceitaram o bump quando exibido" />
      <KpiCard label="Impacto no checkout" value="+ R$ 8.342" hint="Receita adicional gerada por bumps (últimos 30 dias)" />
    </div>
  )
}

// ── RICH TEXT EDITOR ─────────────────────────────────────────────────
function RichTextEditor({ value, onChange, placeholder, maxLength = MAX_COPY_LENGTH }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCommand = (cmd) => {
    document.execCommand(cmd, false)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
  }

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || ''
    const plain = stripHtml(html)
    if (plain.length <= maxLength) {
      onChange(html)
    } else {
      editorRef.current.innerHTML = value || ''
      placeCaretAtEnd(editorRef.current)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); handleCommand('bold') }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') { e.preventDefault(); handleCommand('italic') }
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') { e.preventDefault(); handleCommand('underline') }
  }

  const charCount = stripHtml(value || '').length
  const isEmpty = charCount === 0

  return (
    <div className="border border-(--ant-color-border) rounded-md focus-within:border-(--ant-color-primary) transition-colors bg-(--ant-color-bg-container)">
      <div className="flex items-center border-b border-(--ant-color-split) px-2 bg-(--ant-color-fill-quaternary) h-9">
        <div className="flex items-center gap-0.5">
          <Tooltip title="Negrito (Cmd+B)">
            <Button type="text" icon={<Bold size={14} />} onMouseDown={e => e.preventDefault()} onClick={() => handleCommand('bold')} />
          </Tooltip>
          <Tooltip title="Itálico (Cmd+I)">
            <Button type="text" icon={<Italic size={14} />} onMouseDown={e => e.preventDefault()} onClick={() => handleCommand('italic')} />
          </Tooltip>
          <Tooltip title="Sublinhado (Cmd+U)">
            <Button type="text" icon={<Underline size={14} />} onMouseDown={e => e.preventDefault()} onClick={() => handleCommand('underline')} />
          </Tooltip>
        </div>
        <div className="ml-auto tabular-nums">
          <Typography.Text type="secondary">{charCount}/{maxLength}</Typography.Text>
        </div>
      </div>
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="px-3 py-2.5 min-h-24 outline-none break-words"
        />
        {isEmpty && (
          <div className="absolute top-2.5 left-3 pointer-events-none">
            <Typography.Text type="secondary">{placeholder}</Typography.Text>
          </div>
        )}
      </div>
    </div>
  )
}

function placeCaretAtEnd(el) {
  if (!el) return
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

// ── BUMP PREVIEW (single bump card as it appears in checkout) ────────
function BumpCard({ bumpProduct, priceCents, copy, salesLimit, draft = false }) {
  if (!bumpProduct) return null
  const avulso = bumpProduct.priceCents
  const hasDiscount = priceCents != null && avulso > priceCents
  const discountPct = hasDiscount ? Math.round((1 - priceCents / avulso) * 100) : 0
  const displayName = bumpProduct.parentName ? `${bumpProduct.parentName} — ${bumpProduct.name}` : bumpProduct.name

  return (
    <div className={`rounded-lg border-2 bg-white overflow-hidden ${draft ? 'border-dashed border-(--ant-color-primary)' : 'border-(--ant-color-primary)'}`}>
      <div className="bg-(--ant-color-primary) px-3 py-1.5 flex items-center justify-between">
        <Typography.Text strong className="!text-white text-xs uppercase tracking-wide">
          Oferta especial
        </Typography.Text>
        {draft && (
          <Typography.Text className="!text-white text-xs uppercase">
            (rascunho)
          </Typography.Text>
        )}
      </div>
      <div className="p-3 flex items-start gap-2.5">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 accent-(--ant-color-primary) cursor-pointer"
          readOnly
        />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <Typography.Text strong className="block">
            Adicionar {displayName}
          </Typography.Text>
          <div className="flex items-center gap-2 flex-wrap">
            <Typography.Text strong className="!text-(--ant-color-primary)">
              {priceCents != null ? fmtBRL(priceCents) : '—'}
            </Typography.Text>
            {hasDiscount && (
              <Typography.Text type="secondary" delete className="text-xs">
                {fmtBRL(avulso)}
              </Typography.Text>
            )}
            {discountPct > 0 && (
              <Tag color="success" className="m-0">−{discountPct}%</Tag>
            )}
          </div>
          {copy && stripHtml(copy).trim().length > 0 && (
            <div
              className="text-(--ant-color-text-secondary) text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          )}
          {salesLimit && (
            <Typography.Text className="!text-(--ant-color-warning) text-xs">
              ⚡ Apenas {salesLimit} unidades nesse preço
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CHECKOUT PREVIEW (entire checkout flow for the main product) ─────
function CheckoutPreview({ mainProduct, allProducts, activeBumps, draftBump }) {
  const [device, setDevice] = useState('desktop')
  const draftProduct = draftBump?.bumpProductId ? findProduct(allProducts, draftBump.bumpProductId) : null
  const hasAnyBump = activeBumps.length > 0 || draftProduct

  const total =
    mainProduct.priceCents +
    activeBumps.reduce((sum, b) => sum + (b.priceCents || 0), 0) +
    (draftProduct && draftBump?.priceCents ? draftBump.priceCents : 0)

  const installments = Math.round(mainProduct.priceCents / 12)

  return (
    <div className="border border-(--ant-color-split) rounded-lg bg-(--ant-color-bg-container) overflow-hidden sticky top-6">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-(--ant-color-split) flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-(--ant-color-primary)" />
          <Typography.Text strong>Pré-visualização</Typography.Text>
        </div>
        <Segmented
          value={device}
          onChange={setDevice}
          size="small"
          options={[
            { value: 'desktop', icon: <Monitor size={14} /> },
            { value: 'mobile', icon: <Smartphone size={14} /> },
          ]}
        />
      </div>

      {/* Body — emulates Eduzz Checkout Sun layout */}
      <div className="p-4 bg-(--ant-color-fill-quaternary)">
        <div className={`mx-auto transition-all ${device === 'mobile' ? 'max-w-[300px]' : ''}`}>
          <div className="bg-white rounded border border-(--ant-color-split) overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-gradient-to-br from-(--ant-color-fill-tertiary) to-(--ant-color-fill-secondary) flex items-center justify-center">
              <Typography.Text type="secondary" className="text-[10px] uppercase tracking-wide">Banner do produto</Typography.Text>
            </div>

            {/* Product info */}
            <div className="p-3 flex gap-3 border-b border-(--ant-color-split)">
              <div className="w-16 h-16 bg-(--ant-color-fill-tertiary) rounded shrink-0 flex items-center justify-center">
                <ImageIcon size={20} className="text-(--ant-color-text-quaternary)" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <Typography.Text strong className="block leading-tight">{mainProduct.name}</Typography.Text>
                <Typography.Text type="secondary" className="text-[11px]">{PRODUCT_TYPES[mainProduct.type]}</Typography.Text>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <Typography.Text strong className="!text-(--ant-color-primary) text-base leading-none">{fmtBRL(mainProduct.priceCents)}</Typography.Text>
                </div>
                <Typography.Text type="secondary" className="text-[11px]">ou em até 12x de {fmtBRL(installments)}</Typography.Text>
              </div>
            </div>

            {/* Order bump section */}
            <div className="p-3 border-b border-(--ant-color-split) flex flex-col gap-2">
              <Typography.Text className="text-[11px] uppercase tracking-wide !text-(--ant-color-text-secondary) font-medium">
                Adicione mais ao seu pedido
              </Typography.Text>
              {hasAnyBump ? (
                <div className="flex flex-col gap-2">
                  {activeBumps.map((bump) => {
                    const bp = findProduct(allProducts, bump.bumpProductId)
                    if (!bp) return null
                    return (
                      <BumpCard
                        key={bump.id}
                        bumpProduct={bp}
                        priceCents={bump.priceCents}
                        copy={bump.copy}
                        salesLimit={bump.salesLimit}
                      />
                    )
                  })}
                  {draftProduct && (
                    <BumpCard
                      bumpProduct={draftProduct}
                      priceCents={draftBump.priceCents}
                      copy={draftBump.copy}
                      salesLimit={draftBump.salesLimit}
                      draft
                    />
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-(--ant-color-border) rounded py-6 text-center flex flex-col items-center gap-2">
                  <TagIcon size={20} className="text-(--ant-color-text-quaternary)" />
                  <Typography.Text type="secondary" className="text-xs">
                    O bump será exibido aqui
                  </Typography.Text>
                </div>
              )}
            </div>

            {/* Payment methods placeholder */}
            <div className="p-3 border-b border-(--ant-color-split) flex flex-col gap-2">
              <Typography.Text className="text-[11px] uppercase tracking-wide !text-(--ant-color-text-secondary) font-medium">
                Forma de pagamento
              </Typography.Text>
              <div className="flex gap-2">
                <div className="flex-1 h-9 rounded border border-(--ant-color-split) bg-(--ant-color-fill-quaternary) flex items-center justify-center">
                  <Typography.Text type="secondary" className="text-[10px]">Cartão</Typography.Text>
                </div>
                <div className="flex-1 h-9 rounded border border-(--ant-color-split) bg-(--ant-color-fill-quaternary) flex items-center justify-center">
                  <Typography.Text type="secondary" className="text-[10px]">Pix</Typography.Text>
                </div>
                <div className="flex-1 h-9 rounded border border-(--ant-color-split) bg-(--ant-color-fill-quaternary) flex items-center justify-center">
                  <Typography.Text type="secondary" className="text-[10px]">Boleto</Typography.Text>
                </div>
              </div>
            </div>

            {/* Total + CTA */}
            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Typography.Text type="secondary" className="text-xs">Total</Typography.Text>
                <Typography.Text strong className="text-base">{fmtBRL(total)}</Typography.Text>
              </div>
              <div className="h-9 rounded bg-(--ant-color-primary) flex items-center justify-center gap-1.5">
                <Lock size={12} className="text-white" />
                <Typography.Text strong className="!text-white text-xs">Comprar agora</Typography.Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── BUMP FORM (inline in drawer) ─────────────────────────────────────
function BumpForm({ mainProduct, allProducts, existingBumpProductIds, editing, onSave, onCancel, onDraftChange }) {
  const [bumpProductId, setBumpProductId] = useState(editing?.bumpProductId || null)
  const [priceCents, setPriceCents] = useState(editing?.priceCents ?? null)
  const [hasLimit, setHasLimit] = useState(!!editing?.salesLimit)
  const [salesLimit, setSalesLimit] = useState(editing?.salesLimit || null)
  const [copy, setCopy] = useState(editing?.copy || '')

  useEffect(() => {
    onDraftChange?.({ bumpProductId, priceCents, salesLimit: hasLimit ? salesLimit : null, copy })
  }, [bumpProductId, priceCents, hasLimit, salesLimit, copy])

  // Builds nested options (parent product + variations grouped) for the Select.
  const bumpOptions = buildBumpOptions(
    allProducts.filter(p => p.id !== mainProduct.id),
    mainProduct.type,
    existingBumpProductIds.filter(id => id !== editing?.bumpProductId)
  )

  const selectedBumpProduct = bumpProductId ? findProduct(allProducts, bumpProductId) : null
  const avulso = selectedBumpProduct?.priceCents
  const discountPct = (priceCents != null && avulso) ? Math.round((1 - priceCents / avulso) * 100) : 0

  const canSave = bumpProductId && priceCents != null

  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: editing?.id || `b-${Date.now()}`,
      bumpProductId,
      priceCents,
      salesLimit: hasLimit ? (salesLimit || null) : null,
      salesCount: editing?.salesCount || 0,
      copy,
      active: editing?.active !== false,
    })
  }

  return (
    <div className="border border-(--ant-color-split) rounded-lg bg-(--ant-color-fill-quaternary)">
      <div className="px-5 py-3">
        <Typography.Text strong>{editing ? 'Editar bump' : 'Novo bump'}</Typography.Text>
      </div>
      <div className="mx-5 border-t border-(--ant-color-split)" />

      {/* Bump product selector */}
      <div className="flex flex-col gap-1.5 px-5 py-4">
        <div className="flex items-center gap-1">
          <label className="font-medium text-(--ant-color-text)">
            Produto do bump<span className="text-(--ant-color-error) ml-0.5">*</span>
          </label>
          <Tooltip title={`Apenas produtos compatíveis com ${PRODUCT_TYPES[mainProduct.type]} aparecem na lista`}>
            <HelpCircle size={14} className="text-(--ant-color-text-quaternary) cursor-help" />
          </Tooltip>
        </div>
        <Select
          value={bumpProductId}
          onChange={(v) => {
            setBumpProductId(v)
            const p = findProduct(allProducts, v)
            if (p && priceCents == null) setPriceCents(p.priceCents)
          }}
          placeholder="Buscar por nome ou ID do produto"
          showSearch
          filterOption={(input, option) => {
            if (!option) return false
            const q = input.toLowerCase()
            return (option.search || option.label || '').toLowerCase().includes(q)
          }}
          className="w-full"
          options={bumpOptions}
          notFoundContent={<Typography.Text type="secondary">Nenhum produto compatível</Typography.Text>}
        />
      </div>
      <div className="mx-5 border-t border-(--ant-color-split)" />

      {/* Price */}
      <div className="flex flex-col gap-1.5 px-5 py-4">
        <div className="flex items-center gap-1">
          <label className="font-medium text-(--ant-color-text)">
            Preço com desconto<span className="text-(--ant-color-error) ml-0.5">*</span>
          </label>
          <Tooltip title="Defina um preço promocional menor que o avulso. O desconto aparece como atrativo no checkout.">
            <HelpCircle size={14} className="text-(--ant-color-text-quaternary) cursor-help" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {avulso && (
            <Typography.Text type="secondary" className="whitespace-nowrap">
              De <span className="line-through">{fmtBRL(avulso)}</span> por
            </Typography.Text>
          )}
          <InputNumber
            value={priceCents != null ? priceCents / 100 : null}
            onChange={(v) => setPriceCents(v != null ? Math.round(v * 100) : null)}
            placeholder="0,00"
            min={0}
            precision={2}
            decimalSeparator=","
            prefix="R$"
            className="!w-40"
            disabled={!bumpProductId}
          />
          {avulso && discountPct > 0 && (
            <Tag color="success" className="m-0">−{discountPct}% off</Tag>
          )}
          {avulso && discountPct < 0 && (
            <Tag color="warning" className="m-0">+{Math.abs(discountPct)}% acima do avulso</Tag>
          )}
          {avulso && discountPct === 0 && priceCents != null && (
            <Typography.Text type="secondary" className="text-xs">Sem desconto</Typography.Text>
          )}
        </div>
        {bumpProductId && (
          <Typography.Text type="secondary" className="text-xs">
            Use um valor menor que o avulso para gerar percepção de oferta no checkout.
          </Typography.Text>
        )}
      </div>
      <div className="mx-5 border-t border-(--ant-color-split)" />

      {/* Sales limit (inline phrase) */}
      <div className="flex items-center gap-2 flex-wrap px-5 py-4">
        <Switch checked={hasLimit} onChange={setHasLimit} size="small" />
        <Typography.Text>Limitar venda a</Typography.Text>
        <InputNumber
          value={salesLimit}
          onChange={setSalesLimit}
          placeholder="100"
          min={1}
          disabled={!hasLimit}
          className="!w-24"
        />
        <Typography.Text>unidades</Typography.Text>
        <Tooltip title='Útil para criar escassez ("primeiras 100 unidades")'>
          <HelpCircle size={14} className="text-(--ant-color-text-quaternary) cursor-help" />
        </Tooltip>
      </div>
      <div className="mx-5 border-t border-(--ant-color-split)" />

      {/* Copy */}
      <div className="flex flex-col gap-1.5 px-5 py-4">
        <div className="flex items-center gap-1">
          <label className="font-medium text-(--ant-color-text)">
            Descrição do bump
          </label>
          <Tooltip title="Aparece no checkout. Suporta negrito, itálico, sublinhado e quebra de linha.">
            <HelpCircle size={14} className="text-(--ant-color-text-quaternary) cursor-help" />
          </Tooltip>
        </div>
        <RichTextEditor
          value={copy}
          onChange={setCopy}
          placeholder="Ex: Aproveite esta oferta exclusiva e complemente seu aprendizado..."
        />
      </div>
      <div className="mx-5 border-t border-(--ant-color-split)" />

      <div className="flex items-center justify-end gap-2 px-5 py-3">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" disabled={!canSave} onClick={handleSave}>
          {editing ? 'Salvar alterações' : 'Adicionar bump'}
        </Button>
      </div>
    </div>
  )
}

// ── SORTABLE BUMP ITEM ───────────────────────────────────────────────
function SortableBumpItem({ bump, allProducts, onEdit, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: bump.id })
  const bumpProduct = findProduct(allProducts, bump.bumpProductId)
  const avulso = bumpProduct?.priceCents
  const discountPct = (avulso && bump.priceCents != null) ? Math.round((1 - bump.priceCents / avulso) * 100) : 0

  const transformStyle = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined

  return (
    <div
      ref={setNodeRef}
      className={`border border-(--ant-color-border) rounded-lg p-3 bg-(--ant-color-bg-container) flex items-start gap-3 ${
        isDragging ? 'opacity-40 z-10 shadow-(--ant-box-shadow)' : ''
      }`}
      style={{ transform: transformStyle, transition }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-(--ant-color-icon) mt-1 touch-none"
      >
        <GripVertical size={16} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Typography.Text strong>
            {bumpProduct
              ? (bumpProduct.parentName ? `${bumpProduct.parentName} — ${bumpProduct.name}` : bumpProduct.name)
              : 'Produto removido'}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-xs">#{bump.bumpProductId}</Typography.Text>
          <Tag>{bumpProduct ? PRODUCT_TYPES[bumpProduct.type] : '—'}</Tag>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Typography.Text strong className="text-(--ant-color-primary)">
            {fmtBRL(bump.priceCents)}
          </Typography.Text>
          {avulso && bump.priceCents !== avulso && (
            <Typography.Text type="secondary" delete>
              {fmtBRL(avulso)}
            </Typography.Text>
          )}
          {discountPct > 0 && <Tag color="success">-{discountPct}%</Tag>}
          {bump.salesLimit && (
            <Tag color="warning">
              {bump.salesCount || 0}/{bump.salesLimit} vendidos
            </Tag>
          )}
        </div>
        {bump.copy && (
          <div
            className="leading-relaxed whitespace-pre-wrap text-(--ant-color-text-secondary)"
            dangerouslySetInnerHTML={{ __html: bump.copy }}
          />
        )}
      </div>

      <div className="flex gap-1 flex-shrink-0 items-start">
        <Button icon={<Pencil size={14} />} onClick={() => onEdit(bump)} />
        <Button danger icon={<Trash2 size={14} />} onClick={() => onRemove(bump.id)} />
      </div>
    </div>
  )
}

// ── BUMPS DRAWER ─────────────────────────────────────────────────────
function BumpsDetailView({ product, allProducts, onClose, onUpdateProduct }) {
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(null)
  const [workingProduct, setWorkingProduct] = useState(product)
  const [qrOpen, setQrOpen] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const { message } = AntdApp.useApp()

  const checkoutUrl = `https://chk.eduzz.com/${workingProduct?.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl)
      message.success('Link do checkout copiado')
    } catch {
      message.error('Não foi possível copiar o link')
    }
  }

  useEffect(() => {
    setEditing(null)
    setDraft(null)
    setWorkingProduct(product)
  }, [product?.id, product])

  useEffect(() => {
    if (!editing) setDraft(null)
  }, [editing])

  if (!workingProduct) return null

  const bumps = workingProduct.bumps
  const atLimit = bumps.length >= MAX_BUMPS_PER_PRODUCT
  const existingBumpProductIds = bumps.map(b => b.bumpProductId)
  const isDirty = JSON.stringify(workingProduct) !== JSON.stringify(product)

  const handleSaveBump = (bumpData) => {
    setWorkingProduct(p => {
      const newBumps = editing && editing !== 'new'
        ? p.bumps.map(b => b.id === bumpData.id ? bumpData : b)
        : [...p.bumps, bumpData]
      return { ...p, bumps: newBumps }
    })
    setEditing(null)
  }

  const handleRemove = (bumpId) => {
    setWorkingProduct(p => ({ ...p, bumps: p.bumps.filter(b => b.id !== bumpId) }))
  }

  const handleToggleBumps = (enabled) => {
    setWorkingProduct(p => ({ ...p, bumpsEnabled: enabled }))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setWorkingProduct(p => {
      const oldIndex = p.bumps.findIndex(b => b.id === active.id)
      const newIndex = p.bumps.findIndex(b => b.id === over.id)
      return { ...p, bumps: arrayMove(p.bumps, oldIndex, newIndex) }
    })
  }

  const handleSaveAll = () => {
    onUpdateProduct(workingProduct)
    onClose()
  }

  return (
    <>
      <Breadcrumb
        items={[
          { title: <Home size={14} /> },
          { title: 'Checkout Sun' },
          { title: 'Order Bump' },
          { title: workingProduct.name },
        ]}
      />

      <div>
        <Button icon={<ChevronLeft size={14} />} onClick={onClose}>Voltar</Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Typography.Title level={3} className="mb-0">{workingProduct.id} - {workingProduct.name}</Typography.Title>
          <div className="flex items-center gap-2">
            <Tag>{PRODUCT_TYPES[workingProduct.type]}</Tag>
            <Typography.Text type="secondary">{fmtBRL(workingProduct.priceCents)}</Typography.Text>
          </div>
        </div>
        {bumps.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Typography.Text>Order bumps ativos</Typography.Text>
            <Switch
              checked={workingProduct.bumpsEnabled !== false}
              onChange={handleToggleBumps}
            />
          </div>
        )}
      </div>

      {/* Checkout URL card */}
      <div className="bg-(--ant-color-fill-quaternary) rounded-lg px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-(--ant-color-bg-container) flex items-center justify-center shrink-0">
          <LinkIcon size={14} className="text-(--ant-color-text-secondary)" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <Typography.Text strong className="text-sm">Página de checkout</Typography.Text>
          <Typography.Text type="secondary" className="truncate text-xs">{checkoutUrl}</Typography.Text>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="small" icon={<Copy size={12} />} onClick={handleCopyLink}>Copiar link</Button>
          <Button size="small" icon={<QrCode size={12} />} onClick={() => setQrOpen(true)}>QR Code</Button>
          <Button
            size="small"
            icon={<ExternalLink size={12} />}
            onClick={() => window.open(checkoutUrl, '_blank', 'noopener,noreferrer')}
          >
            Ver página
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <Typography.Text strong>Bumps configurados</Typography.Text>
          <Typography.Text type="secondary">
            {bumps.length} de {MAX_BUMPS_PER_PRODUCT} · arraste para reordenar
          </Typography.Text>
        </div>

        {bumps.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={bumps.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {bumps.map(b => (
                  <SortableBumpItem
                    key={b.id}
                    bump={b}
                    allProducts={allProducts}
                    onEdit={(bump) => setEditing(bump)}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {editing && (
          <BumpForm
            mainProduct={workingProduct}
            allProducts={allProducts}
            existingBumpProductIds={existingBumpProductIds}
            editing={editing === 'new' ? null : editing}
            onSave={handleSaveBump}
            onCancel={() => setEditing(null)}
            onDraftChange={setDraft}
          />
        )}

        {!editing && !atLimit && (
          <Button
            type="dashed"
            block
            icon={<Plus size={16} />}
            onClick={() => setEditing('new')}
            className="h-14"
          >
            {bumps.length === 0 ? 'Adicionar primeiro bump' : 'Adicionar outro bump'}
          </Button>
        )}

        {atLimit && !editing && (
          <div className="border border-dashed border-(--ant-color-border) rounded-lg p-3 bg-(--ant-color-fill-quaternary) text-center">
            <Typography.Text type="secondary">
              Limite de {MAX_BUMPS_PER_PRODUCT} bumps atingido
            </Typography.Text>
          </div>
        )}

        {bumps.length === 0 && !editing && (
          <div className="text-center py-2">
            <Typography.Text type="secondary">
              Este produto ainda não tem nenhum bump configurado.
            </Typography.Text>
          </div>
        )}
      </div>
      {/* Preview oculto — para reativar, restaurar o grid e o <CheckoutPreview /> abaixo
      <CheckoutPreview
        mainProduct={workingProduct}
        allProducts={allProducts}
        activeBumps={workingProduct.bumpsEnabled === false ? [] : bumps}
        draftBump={workingProduct.bumpsEnabled === false ? null : draft}
      />
      */}

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-(--ant-color-split) px-8 py-3 flex items-center justify-end gap-2 z-20 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        {isDirty && (
          <Typography.Text type="secondary" className="mr-auto">
            Você tem alterações não salvas
          </Typography.Text>
        )}
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="primary" onClick={handleSaveAll} disabled={!isDirty}>
          Salvar configurações
        </Button>
      </div>

      {/* Spacer to prevent content overlap with sticky bar */}
      <div className="h-16" />

      {/* QR Code modal */}
      <Modal
        open={qrOpen}
        onCancel={() => setQrOpen(false)}
        title="QR Code da página de checkout"
        footer={[
          <Button key="copy" icon={<Copy size={14} />} onClick={handleCopyLink}>
            Copiar link
          </Button>,
          <Button key="close" type="primary" onClick={() => setQrOpen(false)}>
            Fechar
          </Button>,
        ]}
        width={420}
        destroyOnHidden
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(checkoutUrl)}`}
            alt="QR Code do checkout"
            className="w-60 h-60 border border-(--ant-color-split) rounded-lg p-2 bg-white"
          />
          <Typography.Text type="secondary" className="text-center break-all">
            {checkoutUrl}
          </Typography.Text>
        </div>
      </Modal>
    </>
  )
}

// ── PRODUCT ROW ──────────────────────────────────────────────────────
function ProductRow({ product, onConfigure }) {
  const hasBumps = product.bumps.length > 0
  const bumpsEnabled = product.bumpsEnabled !== false

  return (
    <div
      onClick={() => onConfigure(product)}
      className="border border-(--ant-color-border) rounded-lg p-4 bg-(--ant-color-bg-container) flex items-center gap-4 cursor-pointer hover:border-(--ant-color-primary) hover:shadow-(--ant-box-shadow-tertiary) transition-all"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Typography.Text strong className="truncate">
          {product.id} - {product.name}
        </Typography.Text>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag>{PRODUCT_TYPES[product.type]}</Tag>
          <Typography.Text type="secondary">{fmtBRL(product.priceCents)}</Typography.Text>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {hasBumps ? (
          <div className="flex items-center gap-2">
            <Tag color={bumpsEnabled ? 'success' : 'default'} className="m-0">
              {bumpsEnabled ? 'Ativo' : 'Inativo'}
            </Tag>
            <Typography.Text type="secondary">
              {product.bumps.length} bump{product.bumps.length !== 1 ? 's' : ''}
            </Typography.Text>
          </div>
        ) : (
          <Typography.Text type="secondary">Sem bump</Typography.Text>
        )}

        <Button
          type={hasBumps ? 'default' : 'primary'}
          icon={hasBumps ? <Settings size={14} /> : <Plus size={14} />}
          onClick={(e) => { e.stopPropagation(); onConfigure(product) }}
        >
          {hasBumps ? 'Gerenciar' : 'Configurar bump'}
        </Button>
      </div>
    </div>
  )
}

// ── SHELL LAYOUT ─────────────────────────────────────────────────────
function AppShell({ children }) {
  const onNavigate = useContext(NavContext)
  return (
    <Layout className="min-h-screen bg-(--ant-color-bg-container)">
      <div className="h-20 bg-(--ant-color-fill-quaternary) flex items-center justify-center border-b border-(--ant-color-split)">
        <EduzzLogo />
      </div>
      <Layout>
        <Sider theme="light" width={288} className="border-r border-(--ant-color-split)">
          <div className="px-4 py-2.5">
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
        <Content className="p-8 bg-(--ant-color-bg-container) flex flex-col gap-6 w-full">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

// ── CREATE ORDER BUMP MODAL ──────────────────────────────────────────
function CreateBumpModal({ open, products, onPick, onCancel }) {
  const [productId, setProductId] = useState(null)

  const options = products.map(p => {
    const bumpsTag = p.bumps.length > 0 ? ` · ${p.bumps.length} bump${p.bumps.length !== 1 ? 's' : ''}` : ''
    if (!p.variations || p.variations.length === 0) {
      return {
        label: `${p.id} - ${p.name}`,
        title: `${p.id} ${p.name}`,
        options: [{
          value: p.id,
          label: `${p.id} - ${p.name} · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(p.priceCents)}${bumpsTag}`,
          search: `${p.id} ${p.name} ${PRODUCT_TYPES[p.type]}`,
        }],
      }
    }
    return {
      label: `${p.id} - ${p.name} (${p.variations.length} variações)`,
      title: `${p.id} ${p.name}`,
      options: [
        {
          value: p.id,
          label: `${p.id} - ${p.name} (Produto pai) · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(p.priceCents)}${bumpsTag}`,
          search: `${p.id} ${p.name} ${PRODUCT_TYPES[p.type]} pai`,
        },
        ...p.variations.map(v => ({
          value: v.id,
          label: `${v.id} - ${v.name} · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(v.priceCents)}`,
          search: `${v.id} ${v.name} ${p.name} ${PRODUCT_TYPES[p.type]}`,
        })),
      ],
    }
  })

  const handleOk = () => {
    if (!productId) return
    // Selecting a variation opens the parent product's detail (bumps live on the parent)
    let target = products.find(x => x.id === productId)
    if (!target) {
      target = products.find(p => p.variations?.some(v => v.id === productId))
    }
    if (target) { setProductId(null); onPick(target) }
  }

  return (
    <Modal
      open={open}
      onCancel={() => { setProductId(null); onCancel() }}
      title="Criar order bump"
      okText="Continuar"
      cancelText="Cancelar"
      onOk={handleOk}
      okButtonProps={{ disabled: !productId }}
      width={600}
      destroyOnHidden
    >
      <div className="flex flex-col gap-2">
        <label className="font-medium text-(--ant-color-text)">
          Selecione o produto principal<span className="text-(--ant-color-error) ml-0.5">*</span>
        </label>
        <Select
          value={productId}
          onChange={setProductId}
          placeholder="Buscar por nome ou ID"
          showSearch
          filterOption={(input, option) => (option?.search || '').toLowerCase().includes(input.toLowerCase())}
          options={options}
          className="w-full"
          autoFocus
        />
        <Typography.Text type="secondary" className="text-xs">
          O bump aparecerá no checkout deste produto.
        </Typography.Text>
      </div>
    </Modal>
  )
}

// ── ROOT ─────────────────────────────────────────────────────────────
export default function PaginaOrderBump({ onNavigate }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [search, setSearch] = useState('')
  const [drawerProduct, setDrawerProduct] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

  const handleUpdateProduct = (updated) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
    setDrawerProduct(updated)
  }

  const productsWithBumps = products.filter(p => p.bumps.length > 0)
  const filtered = search
    ? productsWithBumps.filter(p => {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.id.includes(q)
      })
    : productsWithBumps

  return (
    <NavContext.Provider value={onNavigate}>
      <AppShell>
        {drawerProduct ? (
          <BumpsDetailView
            product={drawerProduct}
            allProducts={products}
            onClose={() => setDrawerProduct(null)}
            onUpdateProduct={handleUpdateProduct}
          />
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <Typography.Title level={3} className="mb-0">Order Bump</Typography.Title>
                <Typography.Text type="secondary">
                  Configure ofertas adicionais para aumentar o ticket médio dos seus produtos
                </Typography.Text>
              </div>
              {productsWithBumps.length > 0 && (
                <Button type="primary" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
                  Criar order bump
                </Button>
              )}
            </div>

            <KpisRow products={products} />

            {productsWithBumps.length === 0 ? (
              <div className="border border-dashed border-(--ant-color-border) rounded-lg p-12 text-center flex flex-col items-center gap-3">
                <Typography.Title level={5} className="mb-0">Nenhum order bump configurado</Typography.Title>
                <Typography.Text type="secondary" className="max-w-[420px]">
                  Crie ofertas adicionais nos seus produtos e aumente o ticket médio das suas vendas.
                </Typography.Text>
                <Button type="primary" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
                  Criar order bump
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <Input
                    placeholder="Buscar produto por nome ou ID"
                    prefix={<Search size={14} className="text-(--ant-color-text-tertiary)" />}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-90"
                    allowClear
                  />
                  <Typography.Text type="secondary">
                    {filtered.length} de {productsWithBumps.length} produto{productsWithBumps.length !== 1 ? 's' : ''} com bump
                  </Typography.Text>
                </div>

                <div className="flex flex-col gap-3">
                  {filtered.length === 0 && (
                    <div className="border border-dashed border-(--ant-color-border) rounded-lg p-8 text-center">
                      <Typography.Text type="secondary">
                        Nenhum produto encontrado com esse termo
                      </Typography.Text>
                    </div>
                  )}
                  {filtered.map(p => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      onConfigure={setDrawerProduct}
                    />
                  ))}
                </div>
              </>
            )}

            <CreateBumpModal
              open={createOpen}
              products={products}
              onPick={(p) => { setCreateOpen(false); setDrawerProduct(p) }}
              onCancel={() => setCreateOpen(false)}
            />
          </>
        )}
      </AppShell>
    </NavContext.Provider>
  )
}
