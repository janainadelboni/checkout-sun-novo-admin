import { useState } from 'react'
import {
  App,
  Button,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tag,
  Typography,
} from 'antd'
import {
  BookOutlined,
  DeleteOutlined,
  DownOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons'

const { Text } = Typography

// ─── Types ───────────────────────────────────────────────────────────────────

interface SavedFilter {
  id: string
  name: string
  products: string[]
  period: string
}

interface FilterSelection {
  products: string[]
  period: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  'Todos',
  'Produto A',
  'Produto B',
  'Produto C',
  'Produto D',
  'Produto E',
  'Produto F',
]

const PERIODS = [
  'Hoje',
  'Últimos 7 dias',
  'Últimos 30 dias',
  'Últimos 3 meses',
  'Últimos 6 meses',
  'Este ano',
]

const DEFAULT_PRODUCTS = ['Todos']
const DEFAULT_PERIOD = 'Últimos 30 dias'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function summaryText(items: string[], max = 2) {
  if (items.length === 0) return null
  const visible = items.slice(0, max).join(', ')
  const rest = items.length - max
  return rest > 0 ? `${visible} +${rest}` : visible
}

function isDefaultState(products: string[], period: string) {
  return (
    products.length === 1 &&
    products[0] === 'Todos' &&
    period === DEFAULT_PERIOD
  )
}

// ─── Save filter modal ──────────────────────────────────────────────────────

function SaveFilterModal({
  open,
  selection,
  onSave,
  onCancel,
}: {
  open: boolean
  selection: FilterSelection
  onSave: (name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    if (!name.trim()) {
      setError('Nome do filtro é obrigatório')
      return
    }
    onSave(name.trim())
    setName('')
    setError('')
  }

  function handleCancel() {
    setName('')
    setError('')
    onCancel()
  }

  const productLabel =
    selection.products.length === 1 && selection.products[0] === 'Todos'
      ? 'Todos os produtos'
      : summaryText(selection.products, 4) ?? 'Nenhum selecionado'

  return (
    <Modal
      title="Salvar filtro"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Salvar
        </Button>,
      ]}
      destroyOnHidden
    >
      <div className="space-y-4 pt-2">
        <div>
          <Text strong className="block mb-1.5">
            Nome do filtro <span className="text-red-500">*</span>
          </Text>
          <Input
            placeholder='Ex.: "Q1 – Produtos principais"'
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value.trim()) setError('')
            }}
            status={error ? 'error' : ''}
            onPressEnter={handleSave}
            autoFocus
          />
          {error && (
            <Text type="danger" className="text-xs mt-1 block">
              {error}
            </Text>
          )}
        </div>

        <Divider className="my-0" />

        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <Text strong className="block text-sm">
            Resumo da configuração
          </Text>
          <div className="flex gap-2">
            <Text type="secondary" className="text-xs w-16 shrink-0 pt-0.5">
              Produtos:
            </Text>
            <Text className="text-sm">{productLabel}</Text>
          </div>
          <div className="flex gap-2">
            <Text type="secondary" className="text-xs w-16 shrink-0 pt-0.5">
              Período:
            </Text>
            <Text className="text-sm">{selection.period}</Text>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Saved filters dropdown content ─────────────────────────────────────────

function SavedFiltersDropdown({
  filters,
  appliedId,
  onApply,
  onDelete,
}: {
  filters: SavedFilter[]
  appliedId: string | null
  onApply: (f: SavedFilter) => void
  onDelete: (id: string) => void
}) {
  if (filters.length === 0) {
    return (
      <div className="py-6 px-4 text-center">
        <Text type="secondary" className="text-sm">
          Você ainda não salvou nenhum filtro.
        </Text>
      </div>
    )
  }

  return (
    <div className="py-1" style={{ minWidth: 300 }}>
      {filters.map((f) => (
        <div
          key={f.id}
          onClick={() => onApply(f)}
          className={`flex items-start justify-between gap-3 px-3 py-2.5 cursor-pointer group transition-colors hover:bg-gray-50 ${
            appliedId === f.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex-1 min-w-0">
            <Text
              strong
              className={`block text-sm truncate ${appliedId === f.id ? 'text-blue-600' : ''}`}
            >
              {f.name}
            </Text>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {f.products.slice(0, 2).map((p) => (
                <Tag key={p} color="blue" className="m-0 text-xs leading-4 px-1.5 py-0">
                  {p}
                </Tag>
              ))}
              {f.products.length > 2 && (
                <Tag className="m-0 text-xs leading-4 px-1.5 py-0">
                  +{f.products.length - 2}
                </Tag>
              )}
              <Tag color="geekblue" className="m-0 text-xs leading-4 px-1.5 py-0">
                {f.period}
              </Tag>
            </div>
          </div>

          <Popconfirm
            title="Excluir filtro?"
            description="Esta ação não pode ser desfeita."
            onConfirm={(e) => {
              e?.stopPropagation()
              onDelete(f.id)
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function FilterPanel() {
  const { message } = App.useApp()

  const [products, setProducts] = useState<string[]>(DEFAULT_PRODUCTS)
  const [period, setPeriod] = useState<string>(DEFAULT_PERIOD)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [appliedFilterId, setAppliedFilterId] = useState<string | null>(null)
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  function handleProductChange(values: string[]) {
    if (values.length === 0) {
      setProducts([])
      return
    }
    const hadTodos = products.includes('Todos')
    const addingTodos = values.includes('Todos') && !hadTodos

    if (addingTodos) {
      setProducts(['Todos'])
    } else if (hadTodos && values.length > 1) {
      setProducts(values.filter((v) => v !== 'Todos'))
    } else {
      setProducts(values)
    }
  }

  function removeProduct(product: string) {
    setProducts((prev) => prev.filter((p) => p !== product))
  }

  function clearAll() {
    setProducts(DEFAULT_PRODUCTS)
    setPeriod(DEFAULT_PERIOD)
    setAppliedFilterId(null)
  }

  function handleApplyFilter(filter: SavedFilter) {
    setProducts(filter.products)
    setPeriod(filter.period)
    setAppliedFilterId(filter.id)
    setSavedFiltersOpen(false)
    message.info(`Filtro "${filter.name}" aplicado`)
  }

  function handleDeleteFilter(id: string) {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id))
    if (appliedFilterId === id) setAppliedFilterId(null)
    message.success('Filtro removido')
  }

  function handleSave(name: string) {
    const newFilter: SavedFilter = {
      id: crypto.randomUUID(),
      name,
      products,
      period,
    }
    setSavedFilters((prev) => [newFilter, ...prev])
    setModalOpen(false)
    message.success('Filtro salvo')
  }

  const isDefault = isDefaultState(products, period)
  const hasSavedFilters = savedFilters.length > 0

  const activeChips: { key: string; label: string; onClose: () => void }[] = []

  if (!isDefault) {
    if (!(products.length === 1 && products[0] === 'Todos')) {
      products.forEach((p) =>
        activeChips.push({
          key: `prod-${p}`,
          label: p,
          onClose: () => removeProduct(p),
        }),
      )
    }
    if (period !== DEFAULT_PERIOD) {
      activeChips.push({
        key: `per-${period}`,
        label: period,
        onClose: () => setPeriod(DEFAULT_PERIOD),
      })
    }
  }

  const hasActiveFilters = !isDefault
  const appliedFilter = savedFilters.find((f) => f.id === appliedFilterId)

  const productDisplayText =
    products.length === 0
      ? undefined
      : products.includes('Todos')
        ? 'Todos os produtos'
        : undefined

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <Text className="text-gray-700 font-semibold text-sm block mb-3">
            Filtros
          </Text>

          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <div className="grid grid-cols-3 gap-4 items-end">
              {/* Produtos */}
              <div>
                <Text className="text-xs text-gray-500 block mb-1.5">Produto</Text>
                <Select
                  mode="multiple"
                  showSearch={{
                    filterOption: (input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                  }}
                  placeholder="Buscar produto..."
                  value={products}
                  onChange={handleProductChange}
                  options={PRODUCTS.map((p) => ({ value: p, label: p }))}
                  suffixIcon={<SearchOutlined className="text-gray-400" />}
                  maxTagCount={1}
                  maxTagPlaceholder={(omitted) =>
                    productDisplayText ? undefined : `+${omitted.length}`
                  }
                  tagRender={({ label, closable, onClose }) =>
                    productDisplayText ? (
                      <span className="ant-select-selection-item">
                        <span className="ant-select-selection-item-content">
                          {productDisplayText}
                        </span>
                      </span>
                    ) : (
                      <Tag closable={closable} onClose={onClose} className="m-0">
                        {label}
                      </Tag>
                    )
                  }
                  style={{ width: '100%' }}
                />
              </div>

              {/* Período */}
              <div>
                <Text className="text-xs text-gray-500 block mb-1.5">Período</Text>
                <Select
                  placeholder="Selecionar período"
                  value={period}
                  onChange={setPeriod}
                  options={PERIODS.map((p) => ({ value: p, label: p }))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Filtros salvos */}
              <div>
                <Text className="text-xs text-gray-500 block mb-1.5">Filtros salvos</Text>
                <Select
                  style={{ width: '100%' }}
                  disabled={!hasSavedFilters}
                  open={savedFiltersOpen}
                  onOpenChange={setSavedFiltersOpen}
                  value={appliedFilterId}
                  allowClear
                  onClear={() => setAppliedFilterId(null)}
                  suffixIcon={<DownOutlined className="text-gray-400 text-xs" />}
                  placeholder={
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <BookOutlined />
                      {hasSavedFilters ? 'Selecionar filtro' : 'Nenhum filtro salvo'}
                    </span>
                  }
                  labelRender={() =>
                    appliedFilter ? (
                      <span className="flex items-center gap-1.5">
                        <BookOutlined className="text-blue-500" />
                        <span className="truncate">{appliedFilter.name}</span>
                      </span>
                    ) : null
                  }
                  options={savedFilters.map((f) => ({ value: f.id, label: f.name }))}
                  popupRender={() => (
                    <SavedFiltersDropdown
                      filters={savedFilters}
                      appliedId={appliedFilterId}
                      onApply={handleApplyFilter}
                      onDelete={handleDeleteFilter}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── active filters bar ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mt-3 min-h-[22px]">
            {hasActiveFilters ? (
              <>
                <Text className="text-gray-400 text-xs shrink-0">Filtros ativo(s):</Text>

                {activeChips.map((chip) => (
                  <Tag key={chip.key} closable onClose={chip.onClose} className="m-0 text-xs">
                    {chip.label}
                  </Tag>
                ))}

                <button
                  onClick={clearAll}
                  className="text-blue-500 text-xs hover:text-blue-400 hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Limpar filtro(s)
                </button>

                <span className="text-gray-300 text-xs">|</span>

                <button
                  onClick={() => setModalOpen(true)}
                  className="text-blue-500 text-xs hover:text-blue-400 hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
                >
                  <SaveOutlined />
                  Salvar filtro
                </button>
              </>
            ) : (
              <Text className="text-gray-400 text-xs italic">Nenhum filtro ativo</Text>
            )}
          </div>
        </div>

        {/* ── demo content placeholder ──────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Text strong>Resultados</Text>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1">
                {activeChips.slice(0, 3).map((c) => (
                  <Tag key={c.key} className="text-xs m-0">
                    {c.label}
                  </Tag>
                ))}
                {activeChips.length > 3 && (
                  <Tag className="text-xs m-0">+{activeChips.length - 3}</Tag>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      <SaveFilterModal
        open={modalOpen}
        selection={{ products, period }}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}
