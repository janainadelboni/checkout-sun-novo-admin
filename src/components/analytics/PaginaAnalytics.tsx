import { useState } from 'react'
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Layout,
  Menu,
  Modal,
  Select,
  Tag,
  TreeSelect,
  Typography,
} from 'antd'
import {
  HolderOutlined,
  SettingOutlined,
  BookOutlined,
  SaveOutlined,
  DeleteOutlined,
  UndoOutlined,
} from '@ant-design/icons'

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
import { rootzzTheme } from '../../theme/rootzz'
import TabPerformance from './TabPerformance'
import TabTransacoes from './TabTransacoes'
import TabPagamentos from './TabPagamentos'
import TabOrigem from './TabOrigem'
import TabPersonalizado from './TabPersonalizado'

const { Sider, Content } = Layout
const { Title, Text } = Typography

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
  ultimos_7: 'Últimos 7 dias',
  ultimos_15: 'Últimos 15 dias',
  ultimos_30: 'Últimos 30 dias',
  ultimos_90: 'Últimos 90 dias',
  personalizado: 'Personalizado',
}

// --- SortableTab (unchanged) ---
function SortableTab({
  tab, isActive, isEditing, onClick,
}: {
  tab: string; isActive: boolean; isEditing: boolean; onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tab, disabled: !isEditing,
  })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div
      ref={setNodeRef} style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`flex items-center gap-1.5 ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {isEditing && <div className="text-[rgba(0,0,0,0.25)] flex items-center mb-3"><HolderOutlined className="text-xs" /></div>}
      <button
        onPointerDown={(e) => { if (isEditing) e.stopPropagation() }}
        onClick={onClick}
        className={`pb-3 text-sm font-medium border-b-2 transition-colors bg-transparent whitespace-nowrap cursor-pointer ${
          isActive ? 'border-[#0d2772] text-[#0d2772]' : 'border-transparent text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.85)]'
        }`}
      >
        {tab}
      </button>
    </div>
  )
}

const TAB_COMPONENTS: Record<string, React.FC<{ isEditing?: boolean }>> = {
  Performance: TabPerformance,
  Transações: TabTransacoes,
  Pagamentos: TabPagamentos,
  Origem: TabOrigem,
  Personalizado: TabPersonalizado,
}

export default function PaginaAnalytics({ onVoltar: _onVoltar }: { onVoltar: () => void }) {
  const [tabs, setTabs] = useState(['Performance', 'Transações', 'Pagamentos', 'Origem', 'Personalizado'])
  const [activeTab, setActiveTab] = useState('Performance')
  const [isEditing, setIsEditing] = useState(false)

  // --- Filters state ---
  const [produtoFilter, setProdutoFilter] = useState<string[]>(['todos'])
  const [periodo, setPeriodo] = useState('ultimos_30')
  const [customRange, setCustomRange] = useState<[string, string] | null>(null)

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
      setProdutoFilter([])
    }
  }

  const handleLimparFiltros = () => {
    setProdutoFilter([])
    setPeriodo('ultimos_30')
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
    setProdutoFilter(filtro.produtos)
    setPeriodo(filtro.periodo)
    setFiltrosSalvosModalOpen(false)
  }

  const handleExcluirFiltro = () => {
    if (excluirId) {
      setFiltrosSalvos((prev) => prev.filter((f) => f.id !== excluirId))
      setExcluirId(null)
    }
  }

  // --- DnD ---
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleTabDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTabs((prev) => arrayMove(prev, prev.indexOf(active.id as string), prev.indexOf(over.id as string)))
    }
  }

  const ActiveTabComponent = TAB_COMPONENTS[activeTab]

  return (
    <ConfigProvider theme={rootzzTheme}>
      <Layout className="min-h-screen bg-white">
        <div className="h-[78px] bg-[#fafafa] flex items-center justify-center border-b border-[rgba(0,0,0,0.06)]">
          <EduzzLogo />
        </div>

        <Layout className="!bg-white">
          <Sider width={288} className="!bg-white border-r border-[rgba(0,0,0,0.06)]">
            <div className="px-4 py-[10px]"><CheckoutSunLogo /></div>
            <Menu mode="inline" selectedKeys={['visao-geral']} className="border-none" items={[
              { key: 'visao-geral', label: 'Visão geral' },
              { key: 'produtos', label: 'Produtos' },
              { key: 'monitoramento', label: 'Monitoramento' },
            ]} />
          </Sider>

          <Content className="bg-white flex flex-col gap-0 w-full">
            {/* Edit mode bar */}
            {isEditing && (
              <div className="bg-[#f5f5f5] border-b border-[rgba(0,0,0,0.06)] px-8 py-3 flex items-center justify-between sticky top-0 z-20">
                <Text strong className="text-sm">Modo de edição</Text>
                <div className="flex items-center gap-2">
                  <Button icon={<UndoOutlined />} onClick={() => { /* TODO: restore defaults */ }}>
                    Restaurar padrão
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={() => setIsEditing(false)}>
                    Salvar
                  </Button>
                </div>
              </div>
            )}

            <div className="p-8 flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <Title level={3} className="!mb-1">Visão geral</Title>
                <Text type="secondary">Acompanhe as métricas de seus produtos em tempo real</Text>
              </div>
              {!isEditing && (
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  Personalizar
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-4 flex flex-col gap-3">
              {/* Row 1: Inputs */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                  <Text type="secondary" className="text-xs">Produto(s)</Text>
                  <TreeSelect
                    treeData={produtosTree}
                    value={produtoFilter}
                    onChange={setProdutoFilter}
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
                <div className={`flex flex-col gap-1 ${periodo === 'personalizado' ? 'w-[380px]' : 'w-[200px]'}`}>
                  <Text type="secondary" className="text-xs">Período</Text>
                  <div className="flex gap-2">
                    <Select
                      value={periodo}
                      onChange={(v) => { setPeriodo(v); if (v !== 'personalizado') setCustomRange(null) }}
                      className={periodo === 'personalizado' ? 'w-[160px]' : 'w-full'}
                      options={Object.entries(PERIODOS).map(([value, label]) => ({ value, label }))}
                    />
                    {periodo === 'personalizado' && (
                      <RangePicker
                        size="middle"
                        format="DD/MM/YYYY"
                        className="flex-1"
                        onChange={(_dates, dateStrings) => {
                          if (dateStrings[0] && dateStrings[1]) {
                            setCustomRange([dateStrings[0], dateStrings[1]])
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
                {/* Filtros salvos dropdown */}
                <div className="w-[200px] flex flex-col gap-1">
                  <Text type="secondary" className="text-xs">&nbsp;</Text>
                  <Button
                    icon={<BookOutlined />}
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
                <Text type="secondary" className="text-xs whitespace-nowrap">Filtros ativo(s):</Text>
                {filtrosAtivos.map((filtro) => (
                  <Tag key={filtro} closable onClose={() => handleRemoveTag(filtro)} className="!m-0">{filtro}</Tag>
                ))}
                <a
                  className="text-xs text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.65)] cursor-pointer ml-1 whitespace-nowrap"
                  onClick={handleLimparFiltros}
                >
                  Limpar filtro(s)
                </a>

                <div className="flex-1" />

                {/* Inline save mode */}
                {isSavingInline ? (
                  <div className="flex items-center gap-2">
                    <Input
                      size="small"
                      placeholder="Nome do filtro"
                      value={inlineNome}
                      onChange={(e) => setInlineNome(e.target.value)}
                      onPressEnter={() => handleSalvarFiltro(inlineNome)}
                      className="w-[180px]"
                      autoFocus
                    />
                    <Button size="small" type="primary" onClick={() => handleSalvarFiltro(inlineNome)} disabled={!inlineNome.trim()}>
                      Salvar
                    </Button>
                    <Button size="small" onClick={() => { setIsSavingInline(false); setInlineNome('') }}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  hasFiltrosAtivos && (
                    <Button
                      size="small"
                      icon={<SaveOutlined />}
                      onClick={() => setIsSavingInline(true)}
                    >
                      Salvar filtro
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-[rgba(0,0,0,0.06)]">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTabDragEnd}>
                <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
                  <div className="flex items-center gap-6">
                    {tabs.map((tab) => (
                      <SortableTab key={tab} tab={tab} isActive={activeTab === tab} isEditing={isEditing} onClick={() => setActiveTab(tab)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Tab Content */}
            {ActiveTabComponent && <ActiveTabComponent isEditing={isEditing} />}
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
          <Text className="text-sm">Nome do filtro</Text>
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
            <Text type="secondary" className="text-sm py-4 text-center block">
              Nenhum filtro salvo ainda.
            </Text>
          ) : (
            filtrosSalvos.map((filtro) => (
              <div key={filtro.id} className="border border-[rgba(0,0,0,0.06)] rounded-lg p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <Text strong className="text-sm block mb-1.5">{filtro.nome}</Text>
                  <div className="flex items-center gap-2">
                    <Tag className="!m-0">{filtro.produtos.length} produto{filtro.produtos.length !== 1 ? 's' : ''}</Tag>
                    <Tag className="!m-0">{PERIODOS[filtro.periodo]}</Tag>
                  </div>
                </div>
                <Button type="primary" size="small" onClick={() => handleAplicarFiltro(filtro)}>
                  Aplicar
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
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
        <Text>Você está prestes a excluir um filtro salvo, tem certeza que deseja continuar?</Text>
      </Modal>
    </ConfigProvider>
  )
}
