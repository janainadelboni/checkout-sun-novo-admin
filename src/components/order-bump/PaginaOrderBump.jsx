import { useState, useEffect, useRef, createContext, useContext } from 'react'
import {
  Button,
  Drawer,
  Input,
  InputNumber,
  Layout,
  Menu,
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
  CheckCircle,
  GripVertical,
  Bold,
  Italic,
  Underline,
  Info,
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
  { id: '2704935', name: 'Plano Black Monstro', type: 'assinatura', priceCents: 9700, bumps: [] },
  { id: '2030747', name: 'Academia 360', type: 'infoproduto', priceCents: 9700, bumps: [
    { id: 'b2', bumpProductId: '2112200', priceCents: 1700, salesLimit: null, salesCount: 0, copy: 'Kit de ferramentas para complementar seus estudos.', active: true },
    { id: 'b3', bumpProductId: '2099100', priceCents: 3700, salesLimit: 50, salesCount: 5, copy: '<b>Apenas 50 unidades</b> nesse preço!', active: true },
  ]},
  { id: '2099100', name: 'Masterclass de Copywriting', type: 'infoproduto', priceCents: 6700, bumps: [] },
  { id: '2112200', name: 'Kit Ferramentas de Marketing', type: 'servico', priceCents: 3700, bumps: [] },
  { id: '2576289', name: 'Ingresso PISTA - Festival 2026', type: 'evento', priceCents: 12000, bumps: [] },
  { id: '2073334', name: 'Ebook Vendas Premium', type: 'infoproduto', priceCents: 4700, bumps: [] },
  { id: '9104452', name: 'Camiseta Oficial Eduzz', type: 'fisico', priceCents: 8990, bumps: [] },
  { id: '2411153', name: 'Plano Pro Anual', type: 'assinatura', priceCents: 49700, bumps: [] },
]

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
  return products.find(p => p.id === id)
}

// ── NAV CONTEXT ──────────────────────────────────────────────────────
const NavContext = createContext(null)

// ── KPI ROW ──────────────────────────────────────────────────────────
function KpiCard({ label, value, hint }) {
  return (
    <div className="border border-(--ant-color-border) rounded-lg p-4 bg-(--ant-color-bg-container) flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Typography.Text type="secondary" className="uppercase tracking-wide">
          {label}
        </Typography.Text>
        {hint && (
          <Tooltip title={hint}>
            <Info size={12} className="text-(--ant-color-text-tertiary)" />
          </Tooltip>
        )}
      </div>
      <Typography.Title level={3} className="mb-0">
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

// ── FIELD LABEL/HINT ─────────────────────────────────────────────────
function FieldLabel({ children, required, suffix }) {
  return (
    <div className="flex items-center justify-between min-h-6">
      <label className="font-medium text-(--ant-color-text)">
        {children}
        {required && <span className="text-(--ant-color-error) ml-0.5">*</span>}
      </label>
      {suffix}
    </div>
  )
}

function FieldHint({ children }) {
  return (
    <div className="min-h-4 leading-snug">
      <Typography.Text type="secondary">{children}</Typography.Text>
    </div>
  )
}

// ── BUMP FORM (inline in drawer) ─────────────────────────────────────
function BumpForm({ mainProduct, allProducts, existingBumpProductIds, editing, onSave, onCancel }) {
  const [bumpProductId, setBumpProductId] = useState(editing?.bumpProductId || null)
  const [priceCents, setPriceCents] = useState(editing?.priceCents ?? null)
  const [hasLimit, setHasLimit] = useState(!!editing?.salesLimit)
  const [salesLimit, setSalesLimit] = useState(editing?.salesLimit || null)
  const [copy, setCopy] = useState(editing?.copy || '')

  const eligibleProducts = allProducts.filter(p =>
    p.id !== mainProduct.id &&
    isCompatible(mainProduct.type, p.type) &&
    (!existingBumpProductIds.includes(p.id) || p.id === editing?.bumpProductId)
  )

  const selectedBumpProduct = bumpProductId ? findProduct(allProducts, bumpProductId) : null
  const avulso = selectedBumpProduct?.priceCents
  const discountPct = (priceCents != null && avulso) ? Math.round((1 - priceCents / avulso) * 100) : 0

  const canSave = bumpProductId && priceCents != null && stripHtml(copy).trim().length > 0

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
    <div className="border border-(--ant-color-primary-border) rounded-lg p-5 bg-(--ant-color-primary-bg) flex flex-col gap-5">
      <Typography.Text strong>{editing ? 'Editar bump' : 'Novo bump'}</Typography.Text>

      {/* Bump product selector */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Produto do bump</FieldLabel>
        <Select
          value={bumpProductId}
          onChange={(v) => {
            setBumpProductId(v)
            const p = findProduct(allProducts, v)
            if (p && priceCents == null) setPriceCents(Math.round(p.priceCents * 0.7))
          }}
          placeholder="Selecione um produto compatível"
          showSearch
          optionFilterProp="label"
          className="w-full"
          options={eligibleProducts.map(p => ({
            value: p.id,
            label: `${p.name} · ${PRODUCT_TYPES[p.type]} · ${fmtBRL(p.priceCents)}`,
          }))}
          notFoundContent={<Typography.Text type="secondary">Nenhum produto compatível</Typography.Text>}
        />
        <FieldHint>
          Apenas produtos compatíveis com {PRODUCT_TYPES[mainProduct.type]} aparecem na lista
        </FieldHint>
      </div>

      {/* Price + reference */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Preço como bump</FieldLabel>
          <InputNumber
            value={priceCents != null ? priceCents / 100 : null}
            onChange={(v) => setPriceCents(v != null ? Math.round(v * 100) : null)}
            placeholder="0,00"
            min={0}
            precision={2}
            decimalSeparator=","
            prefix="R$"
            className="w-full"
            disabled={!bumpProductId}
          />
          <FieldHint>
            {avulso ? (
              <>
                Avulso: {fmtBRL(avulso)}
                {discountPct > 0 && (
                  <span className="text-(--ant-color-success) ml-1.5">· -{discountPct}%</span>
                )}
                {discountPct < 0 && (
                  <span className="text-(--ant-color-warning) ml-1.5">· +{Math.abs(discountPct)}%</span>
                )}
              </>
            ) : (
              'Selecione o produto para ver o preço avulso'
            )}
          </FieldHint>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel suffix={<Switch checked={hasLimit} onChange={setHasLimit} />}>
            Limite de venda
          </FieldLabel>
          <InputNumber
            value={salesLimit}
            onChange={setSalesLimit}
            placeholder="Sem limite"
            min={1}
            disabled={!hasLimit}
            className="w-full"
            addonAfter="un."
          />
          <FieldHint>
            {hasLimit ? 'Útil para criar escassez ("primeiras 100 unidades")' : 'Opcional — útil para escassez'}
          </FieldHint>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Descrição do bump</FieldLabel>
        <RichTextEditor
          value={copy}
          onChange={setCopy}
          placeholder="Ex: Aproveite esta oferta exclusiva e complemente seu aprendizado..."
        />
        <FieldHint>
          Aparece no checkout. Suporta negrito, itálico, sublinhado e quebra de linha.
        </FieldHint>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" disabled={!canSave} onClick={handleSave}>
          {editing ? 'Salvar alterações' : 'Adicionar bump'}
        </Button>
      </div>
    </div>
  )
}

// ── SORTABLE BUMP ITEM ───────────────────────────────────────────────
function SortableBumpItem({ bump, allProducts, onEdit, onRemove, onToggleActive }) {
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
      } ${!bump.active ? 'opacity-60' : ''}`}
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
          <Typography.Text strong>{bumpProduct?.name || 'Produto removido'}</Typography.Text>
          <Tag>{bumpProduct ? PRODUCT_TYPES[bumpProduct.type] : '—'}</Tag>
          {!bump.active && <Tag>Inativo</Tag>}
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

      <div className="flex flex-col gap-1 flex-shrink-0 items-end">
        <Tooltip title={bump.active ? 'Desativar' : 'Ativar'}>
          <Switch checked={bump.active} onChange={() => onToggleActive(bump.id)} />
        </Tooltip>
        <div className="flex gap-1 mt-1">
          <Button icon={<Pencil size={14} />} onClick={() => onEdit(bump)} />
          <Button danger icon={<Trash2 size={14} />} onClick={() => onRemove(bump.id)} />
        </div>
      </div>
    </div>
  )
}

// ── BUMPS DRAWER ─────────────────────────────────────────────────────
function BumpsDrawer({ open, product, allProducts, onClose, onUpdateProduct }) {
  const [editing, setEditing] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    setEditing(null)
  }, [product?.id])

  if (!product) return null

  const bumps = product.bumps
  const atLimit = bumps.length >= MAX_BUMPS_PER_PRODUCT
  const existingBumpProductIds = bumps.map(b => b.bumpProductId)

  const handleSaveBump = (bumpData) => {
    const newBumps = editing && editing !== 'new'
      ? bumps.map(b => b.id === bumpData.id ? bumpData : b)
      : [...bumps, bumpData]
    onUpdateProduct({ ...product, bumps: newBumps })
    setEditing(null)
  }

  const handleRemove = (bumpId) => {
    onUpdateProduct({ ...product, bumps: bumps.filter(b => b.id !== bumpId) })
  }

  const handleToggleActive = (bumpId) => {
    onUpdateProduct({
      ...product,
      bumps: bumps.map(b => b.id === bumpId ? { ...b, active: !b.active } : b),
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = bumps.findIndex(b => b.id === active.id)
    const newIndex = bumps.findIndex(b => b.id === over.id)
    onUpdateProduct({ ...product, bumps: arrayMove(bumps, oldIndex, newIndex) })
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={580}
      title={
        <div className="flex flex-col gap-0.5">
          <Typography.Text strong>{product.name}</Typography.Text>
          <div className="flex items-center gap-2 font-normal">
            <Tag>{PRODUCT_TYPES[product.type]}</Tag>
            <Typography.Text type="secondary">#{product.id}</Typography.Text>
            <Typography.Text type="secondary">·</Typography.Text>
            <Typography.Text type="secondary">{fmtBRL(product.priceCents)}</Typography.Text>
          </div>
        </div>
      }
      destroyOnHidden
    >
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
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {editing && (
          <BumpForm
            mainProduct={product}
            allProducts={allProducts}
            existingBumpProductIds={existingBumpProductIds}
            editing={editing === 'new' ? null : editing}
            onSave={handleSaveBump}
            onCancel={() => setEditing(null)}
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
    </Drawer>
  )
}

// ── PRODUCT ROW ──────────────────────────────────────────────────────
function ProductRow({ product, onConfigure }) {
  const hasBumps = product.bumps.length > 0
  const activeBumps = product.bumps.filter(b => b.active).length

  return (
    <div
      onClick={() => onConfigure(product)}
      className="border border-(--ant-color-border) rounded-lg p-4 bg-(--ant-color-bg-container) flex items-center gap-4 cursor-pointer hover:border-(--ant-color-primary) hover:shadow-(--ant-box-shadow-tertiary) transition-all"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Typography.Text strong className="truncate">
          {product.name}
        </Typography.Text>
        <div className="flex items-center gap-2 flex-wrap">
          <Typography.Text type="secondary">#{product.id}</Typography.Text>
          <Tag>{PRODUCT_TYPES[product.type]}</Tag>
          <Typography.Text type="secondary">{fmtBRL(product.priceCents)}</Typography.Text>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {hasBumps ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-(--ant-color-success)" />
            <Typography.Text>
              {activeBumps} de {product.bumps.length} ativo{activeBumps !== 1 ? 's' : ''}
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

// ── ROOT ─────────────────────────────────────────────────────────────
export default function PaginaOrderBump({ onNavigate }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [drawerProduct, setDrawerProduct] = useState(null)

  const handleUpdateProduct = (updated) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
    setDrawerProduct(updated)
  }

  const filtered = products.filter(p => {
    if (filter === 'with-bump' && p.bumps.length === 0) return false
    if (filter === 'without-bump' && p.bumps.length > 0) return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.id.includes(q)) return false
    }
    return true
  })

  return (
    <NavContext.Provider value={onNavigate}>
      <AppShell>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Typography.Title level={3} className="mb-0">Order Bump</Typography.Title>
            <Typography.Text type="secondary">
              Configure ofertas adicionais para aumentar o ticket médio dos seus produtos
            </Typography.Text>
          </div>
        </div>

        <KpisRow products={products} />

        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Buscar produto por nome ou ID"
            prefix={<Search size={14} className="text-(--ant-color-text-tertiary)" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-90"
            allowClear
          />
          <Select
            value={filter}
            onChange={setFilter}
            className="w-50"
            options={[
              { value: 'all', label: 'Todos os produtos' },
              { value: 'with-bump', label: 'Com bump configurado' },
              { value: 'without-bump', label: 'Sem bump configurado' },
            ]}
          />
          <Typography.Text type="secondary">
            {filtered.length} de {products.length} produto{products.length !== 1 ? 's' : ''}
          </Typography.Text>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="border border-dashed border-(--ant-color-border) rounded-lg p-8 text-center">
              <Typography.Text type="secondary">
                Nenhum produto encontrado com esses filtros
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

        <BumpsDrawer
          open={!!drawerProduct}
          product={drawerProduct}
          allProducts={products}
          onClose={() => setDrawerProduct(null)}
          onUpdateProduct={handleUpdateProduct}
        />
      </AppShell>
    </NavContext.Provider>
  )
}
