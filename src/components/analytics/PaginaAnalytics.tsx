import { cloneElement, useState, type CSSProperties, type ReactElement } from 'react'
import {
  Alert,
  Button,
  DatePicker,
  Input,
  Layout,
  Menu,
  Modal,
  Tabs,
  Tag,
  TreeSelect,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { buildRangePresets } from '../../utils/datePresets'
import { Settings, Book, Save, Trash2, Undo2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EduzzLogo, CheckoutSunLogo } from '../Logos'
import DemoBar, { DemoStateSegmented, type DemoState } from '../DemoBar'
import TabPerformance from './TabPerformance'
import TabTransacoes from './TabTransacoes'
import TabPagamentos from './TabPagamentos'
import TabOrigem from './TabOrigem'
import TabPersonalizado from './TabPersonalizado'

const { Sider, Content } = Layout


// --- Types ---
type FiltroSalvo = {
  id: string
  nome: string
  produtos: string[]
  periodo: string
}

// --- Product tree data ---
const produtosTree = [
  {
    title: 'Selecionar todos (195)',
    value: 'todos',
    key: 'todos',
    children: [
      {
        title: '953627 – generic service',
        value: '953627',
        key: '953627',
      },
      {
        title: 'Lançamento – VIP',
        value: 'lancamento-vip',
        key: 'lancamento-vip',
        children: [
          { title: '1741244 – Lançamento – VIP (Produto Pai)', value: '1741244', key: '1741244' },
          { title: '1652158 – Lançamento – VIP – Lote 1', value: '1652158', key: '1652158' },
          { title: '1741245 – Lançamento – VIP – Lote 2', value: '1741245', key: '1741245' },
        ],
      },
      {
        title: 'Evento de teste – Comum',
        value: 'evento-teste',
        key: 'evento-teste',
        children: [
          { title: '1826613 – Evento de teste – Comum (Produto Pai)', value: '1826613', key: '1826613' },
          { title: '1826614 – Evento de teste – Comum – Lote 1', value: '1826614', key: '1826614' },
        ],
      },
      {
        title: 'Como treinar treinadores',
        value: 'como-treinar',
        key: 'como-treinar',
        children: [
          { title: '2704934 – Como treinar treinadores (Produto Pai)', value: '2704934', key: '2704934' },
          { title: '2704935 – Como treinar treinadores – Variação 1', value: '2704935', key: '2704935' },
        ],
      },
      {
        title: 'Mentoria Elite 2026',
        value: 'mentoria-elite',
        key: 'mentoria-elite',
        children: [
          { title: '2073333 – Mentoria Elite 2026 (Produto Pai)', value: '2073333', key: '2073333' },
          { title: '2073334 – Mentoria Elite 2026 – Premium', value: '2073334', key: '2073334' },
        ],
      },
      { title: '2411153 – Curso de Marketing Digital', value: '2411153', key: '2411153' },
      { title: '2576289 – Workshop de Vendas', value: '2576289', key: '2576289' },
      { title: '9104452 – Planilha Financeira Pro', value: '9104452', key: '9104452' },
    ],
  },
]

const { RangePicker } = DatePicker

const PERIODOS: Record<string, string> = {
  hoje: 'Hoje',
  ultimos_7: 'Últimos 7 dias',
  ultimos_15: 'Últimos 15 dias',
  ultimos_30: 'Últimos 30 dias',
  ultimos_90: 'Últimos 90 dias',
  personalizado: 'Personalizado',
}


// Sortable wrapper for Antd Tabs renderTabBar — clones the tab node to preserve internal layout
function DraggableTabNode({ children, nodeKey }: { nodeKey: string; children: ReactElement }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: nodeKey,
  })
  const childProps = (children.props ?? {}) as { style?: CSSProperties }
  const style: CSSProperties = {
    ...(childProps.style ?? {}),
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
  }
  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  })
}

const TAB_COMPONENTS: Record<string, React.FC<{ isEditing?: boolean; hasData?: boolean }>> = {
  Performance: TabPerformance,
  Transações: TabTransacoes,
  Pagamentos: TabPagamentos,
  Origem: TabOrigem,
  Personalizado: TabPersonalizado,
}

export default function PaginaAnalytics({ onVoltar: _onVoltar, onNavigate }: { onVoltar: () => void; onNavigate?: (key: 'analytics' | 'rastreamento' | 'order-bump') => void }) {
  const [tabs, setTabs] = useState(['Performance', 'Transações', 'Pagamentos', 'Origem', 'Personalizado'])
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleTabDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTabs((prev) => arrayMove(prev, prev.indexOf(active.id as string), prev.indexOf(over.id as string)))
    }
  }
  const [activeTab, setActiveTab] = useState('Performance')
  const [isEditing, setIsEditing] = useState(false)

  const [demoState, setDemoState] = useState<DemoState>('ativo')
  const demoHasData = demoState === 'ativo' || demoState === 'erro'
  const stateBanner = (() => {
    if (demoState === 'nao-configurado') {
      return (
        <Alert
          type="info"
          showIcon
          message="Nenhum produto configurado"
          description="Configure ao menos um produto para começar a acompanhar métricas de vendas."
        />
      )
    }
    if (demoState === 'aguardando') {
      return (
        <Alert
          type="info"
          showIcon
          message="Aguardando primeiras vendas"
          description="Tudo pronto — assim que houver vendas, os números aparecerão aqui."
        />
      )
    }
    if (demoState === 'erro') {
      return (
        <Alert
          type="error"
          showIcon
          message="Falha ao carregar parte das métricas"
          description="Alguns indicadores podem estar incompletos. Tente novamente em instantes."
        />
      )
    }
    return null
  })()

  // --- Filters state (with localStorage persistence) ---
  const [produtoFilter, setProdutoFilter] = useState<string[]>(() => {
    try { const v = localStorage.getItem('analytics_produtoFilter'); return v ? JSON.parse(v) : ['todos'] } catch { return ['todos'] }
  })
  const [periodo, setPeriodo] = useState(() => {
    const saved = localStorage.getItem('analytics_periodo')
    // Default to ultimos_7 if no saved value or if saved value is 'hoje' (no data scenario)
    return saved && saved !== 'hoje' ? saved : 'ultimos_7'
  })
  const [customRange, setCustomRange] = useState<[string, string] | null>(() => {
    try { const v = localStorage.getItem('analytics_customRange'); return v ? JSON.parse(v) : null } catch { return null }
  })

  // Persist filters
  const updateProdutoFilter = (v: string[]) => { setProdutoFilter(v); localStorage.setItem('analytics_produtoFilter', JSON.stringify(v)) }
  const updatePeriodo = (v: string) => { setPeriodo(v); localStorage.setItem('analytics_periodo', v); if (v !== 'personalizado') { setCustomRange(null); localStorage.removeItem('analytics_customRange') } }
  const updateCustomRange = (v: [string, string] | null) => { setCustomRange(v); if (v) localStorage.setItem('analytics_customRange', JSON.stringify(v)); else localStorage.removeItem('analytics_customRange') }

  // --- Saved filters ---
  const [filtrosSalvos, setFiltrosSalvos] = useState<FiltroSalvo[]>([])
  const [salvarModalOpen, setSalvarModalOpen] = useState(false)
  const [salvarNome, setSalvarNome] = useState('')
  const [filtrosSalvosModalOpen, setFiltrosSalvosModalOpen] = useState(false)
  const [excluirId, setExcluirId] = useState<string | null>(null)
  const [isSavingInline, setIsSavingInline] = useState(false)
  const [inlineNome, setInlineNome] = useState('')

  // Resolve product labels from tree
  const getAllLabels = (nodes: typeof produtosTree, selected: string[]): string[] => {
    const labels: string[] = []
    for (const node of nodes) {
      if (selected.includes(node.value)) {
        labels.push(node.title.replace(/^\d+ – /, '').replace(/Selecionar todos.*/, 'Todos'))
      }
      if ('children' in node && node.children) labels.push(...getAllLabels(node.children as typeof produtosTree, selected))
    }
    return labels
  }
  const produtoLabels = getAllLabels(produtosTree, produtoFilter)
  const periodPresets = buildRangePresets()
  const periodRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null =
    periodo === 'personalizado' && customRange
      ? [dayjs(customRange[0], 'DD/MM/YYYY'), dayjs(customRange[1], 'DD/MM/YYYY')]
      : (periodPresets.find((p) => p.key === periodo)?.value ?? null)
  const periodoLabel = periodo === 'personalizado' && customRange
    ? `${customRange[0]} – ${customRange[1]}`
    : PERIODOS[periodo]
  const filtrosAtivos = [
    ...(produtoLabels.length > 3 ? [`${produtoLabels.length} produtos`] : produtoLabels),
    periodoLabel,
  ]

  const hasFiltrosAtivos = produtoFilter.length > 0

  // --- Handlers ---
  const handleRemoveTag = (tag: string) => {
    if (PERIODOS[periodo] === tag) {
      setPeriodo('ultimos_30')
    } else {
      // Find the value key matching this label and remove it
      updateProdutoFilter([])
    }
  }

  const handleLimparFiltros = () => {
    updateProdutoFilter([])
    updatePeriodo('ultimos_30')
  }

  const handleSalvarFiltro = (nome: string) => {
    if (!nome.trim()) return
    const novo: FiltroSalvo = {
      id: Date.now().toString(),
      nome: nome.trim(),
      produtos: [...produtoFilter],
      periodo,
    }
    setFiltrosSalvos((prev) => [...prev, novo])
    setSalvarModalOpen(false)
    setSalvarNome('')
    setIsSavingInline(false)
    setInlineNome('')
  }

  const handleAplicarFiltro = (filtro: FiltroSalvo) => {
    updateProdutoFilter(filtro.produtos)
    updatePeriodo(filtro.periodo)
    setFiltrosSalvosModalOpen(false)
  }

  const handleExcluirFiltro = () => {
    if (excluirId) {
      setFiltrosSalvos((prev) => prev.filter((f) => f.id !== excluirId))
      setExcluirId(null)
    }
  }

  return (
    <>
      <Layout className="min-h-screen bg-(--ant-color-bg-container)">
        <div className="h-[78px] bg-(--ant-color-fill-quaternary) flex items-center justify-center border-b border-(--ant-color-split)">
          <EduzzLogo />
        </div>

        <Layout className="bg-white">
          <Sider theme="light" width={288} className="border-r border-(--ant-color-split)">
            <div className="px-4 py-2.5"><CheckoutSunLogo /></div>
            <Menu
              mode="inline"
              selectedKeys={['visao-geral']}
              className="border-none"
              onClick={({ key }) => {
                if (key === 'rastreamento') onNavigate?.('rastreamento')
                else if (key === 'order-bump') onNavigate?.('order-bump')
              }}
              items={[
                { key: 'visao-geral', label: 'Visão geral' },
                { key: 'rastreamento', label: 'Rastreamento' },
                { key: 'order-bump', label: 'Order Bump' },
              ]}
            />
          </Sider>

          <Content className="bg-white flex flex-col gap-0 w-full pb-24">
            {/* Edit mode bar */}
            {isEditing && (
              <div className="bg-(--ant-color-fill-tertiary) border-b border-(--ant-color-split) px-8 py-3 flex items-center justify-between sticky top-0 z-20">
                <Typography.Text strong >Modo de edição</Typography.Text>
                <div className="flex items-center gap-2">
                  <Button icon={<Undo2 size={14} />} onClick={() => { /* TODO: restore defaults */ }}>
                    Restaurar padrão
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="primary" icon={<Save size={14} />} onClick={() => setIsEditing(false)}>
                    Salvar
                  </Button>
                </div>
              </div>
            )}

            <div className="p-8 flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <Typography.Title level={3} className="mb-1">Visão geral</Typography.Title>
                <Typography.Text type="secondary">Acompanhe as métricas de seus produtos em tempo real</Typography.Text>
              </div>
              {!isEditing && (
                <Button
                  icon={<Settings size={14} />}
                  onClick={() => setIsEditing(true)}
                >
                  Personalizar
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="border border-(--ant-color-split) rounded-lg p-4 flex flex-col gap-3">
              {/* Row 1: Inputs */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <Typography.Text type="secondary" >Produto(s)</Typography.Text>
                  <TreeSelect
                    treeData={produtosTree}
                    value={produtoFilter}
                    onChange={updateProdutoFilter}
                    treeCheckable
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    placeholder="Pesquise pelo ID ou título do produto"
                    className="w-full"
                    maxTagCount={2}
                    maxTagPlaceholder={(omitted) => `+${omitted.length} mais`}
                    treeDefaultExpandAll
                    showSearch
                    treeNodeFilterProp="title"
                    allowClear
                  />
                </div>
                <div className="flex flex-col gap-1 w-[280px]">
                  <Typography.Text type="secondary" >Período</Typography.Text>
                  <RangePicker
                    size="middle"
                    format="DD/MM/YYYY"
                    presets={periodPresets}
                    className="w-full"
                    placeholder={['Data inicial', 'Data final']}
                    allowClear={false}
                    value={periodRangeValue}
                    onChange={(_dates, dateStrings) => {
                      if (!dateStrings[0] || !dateStrings[1]) return
                      const matched = periodPresets.find(
                        (p) =>
                          p.value[0].format('DD/MM/YYYY') === dateStrings[0] &&
                          p.value[1].format('DD/MM/YYYY') === dateStrings[1],
                      )
                      if (matched) {
                        updatePeriodo(matched.key)
                      } else {
                        updatePeriodo('personalizado')
                        updateCustomRange([dateStrings[0], dateStrings[1]])
                      }
                    }}
                  />
                </div>
                {/* Filtros salvos dropdown */}
                <div className="w-[200px] flex flex-col gap-1">
                  <Typography.Text type="secondary" >&nbsp;</Typography.Text>
                  <Button
                    icon={<Book size={14} />}
                    onClick={() => setFiltrosSalvosModalOpen(true)}
                    disabled={filtrosSalvos.length === 0}
                    className="w-full !justify-start"
                  >
                    Filtros salvos {filtrosSalvos.length > 0 && `(${filtrosSalvos.length})`}
                  </Button>
                </div>
              </div>

              {/* Row 2: Active filters + Save */}
              <div className="flex items-center gap-2">
                <Typography.Text type="secondary" className="whitespace-nowrap">Filtros ativo(s):</Typography.Text>
                {filtrosAtivos.map((filtro) => (
                  <Tag key={filtro} closable onClose={() => handleRemoveTag(filtro)} className="m-0">{filtro}</Tag>
                ))}
                <a
                  className="text-sm text-(--ant-color-text-tertiary) hover:text-(--ant-color-text-secondary) cursor-pointer ml-1 whitespace-nowrap"
                  onClick={handleLimparFiltros}
                >
                  Limpar filtro(s)
                </a>

                <div className="flex-1" />

                {/* Inline save mode */}
                {isSavingInline ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nome do filtro"
                      value={inlineNome}
                      onChange={(e) => setInlineNome(e.target.value)}
                      onPressEnter={() => handleSalvarFiltro(inlineNome)}
                      className="w-[180px]"
                      autoFocus
                    />
                    <Button type="primary" onClick={() => handleSalvarFiltro(inlineNome)} disabled={!inlineNome.trim()}>
                      Salvar
                    </Button>
                    <Button onClick={() => { setIsSavingInline(false); setInlineNome('') }}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  hasFiltrosAtivos && (
                    <Button
                      icon={<Save size={14} />}
                      onClick={() => setIsSavingInline(true)}
                    >
                      Salvar filtro
                    </Button>
                  )
                )}
              </div>
            </div>

            {stateBanner}

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabs.map((tab) => {
                const Component = TAB_COMPONENTS[tab]
                return {
                  key: tab,
                  label: tab,
                  children: Component ? <Component isEditing={isEditing} hasData={demoHasData && periodo !== 'hoje'} /> : null,
                }
              })}
              renderTabBar={(tabBarProps, DefaultTabBar) => (
                isEditing ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTabDragEnd}>
                    <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
                      <DefaultTabBar {...tabBarProps}>
                        {(node) => (
                          <DraggableTabNode key={node.key} nodeKey={String(node.key)}>
                            {node}
                          </DraggableTabNode>
                        )}
                      </DefaultTabBar>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <DefaultTabBar {...tabBarProps} />
                )
              )}
            />
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* Modal: Salvar filtro */}
      <Modal
        open={salvarModalOpen}
        onCancel={() => { setSalvarModalOpen(false); setSalvarNome('') }}
        title="Salvar filtro"
        okText="Salvar"
        cancelText="Cancelar"
        onOk={() => handleSalvarFiltro(salvarNome)}
        okButtonProps={{ disabled: !salvarNome.trim() }}
        width={520}
      >
        <div className="flex flex-col gap-1">
          <Typography.Text >Nome do filtro</Typography.Text>
          <Input
            placeholder="Ex: Treinadores dos últimos 30 dias"
            value={salvarNome}
            onChange={(e) => setSalvarNome(e.target.value)}
            onPressEnter={() => handleSalvarFiltro(salvarNome)}
            autoFocus
          />
        </div>
      </Modal>

      {/* Modal: Filtros salvos */}
      <Modal
        open={filtrosSalvosModalOpen}
        onCancel={() => setFiltrosSalvosModalOpen(false)}
        title="Filtros salvos"
        footer={null}
        width={660}
      >
        <div className="flex flex-col gap-3">
          {filtrosSalvos.length === 0 ? (
            <Typography.Text type="secondary" className="py-4 text-center block">
              Nenhum filtro salvo ainda.
            </Typography.Text>
          ) : (
            filtrosSalvos.map((filtro) => (
              <div key={filtro.id} className="border border-(--ant-color-split) rounded-lg p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <Typography.Text strong className="block mb-1.5">{filtro.nome}</Typography.Text>
                  <div className="flex items-center gap-2">
                    <Tag className="m-0">{filtro.produtos.length} produto{filtro.produtos.length !== 1 ? 's' : ''}</Tag>
                    <Tag className="m-0">{PERIODOS[filtro.periodo]}</Tag>
                  </div>
                </div>
                <Button type="primary" onClick={() => handleAplicarFiltro(filtro)}>
                  Aplicar
                </Button>
                <Button
                  danger
                  icon={<Trash2 size={14} />}
                  onClick={() => setExcluirId(filtro.id)}
                />
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal: Excluir filtro */}
      <Modal
        open={!!excluirId}
        onCancel={() => setExcluirId(null)}
        title="Excluir filtro salvo"
        okText="Excluir"
        cancelText="Cancelar"
        onOk={handleExcluirFiltro}
        okButtonProps={{ danger: true }}
        width={520}
      >
        <Typography.Text>Você está prestes a excluir um filtro salvo, tem certeza que deseja continuar?</Typography.Text>
      </Modal>

      <DemoBar>
        <DemoStateSegmented
          value={demoState}
          onChange={setDemoState}
          states={['nao-configurado', 'aguardando', 'ativo', 'erro']}
        />
      </DemoBar>
    </>
  )
}
