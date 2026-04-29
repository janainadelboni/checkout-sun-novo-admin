import { useState } from 'react'
import { Typography, Button, Modal } from 'antd'
import { LayoutGrid, TrendingUp, ArrowRightLeft, CreditCard, Globe, BarChart3, PieChart, DollarSign, Users, Smartphone, Target, Check, Plus, LineChart, Percent, ShoppingCart, X } from 'lucide-react'
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  FunilDeConversao,
  RecursosAtivos,
  TaxaDeConversaoKpis,
  TaxasGerais,
  VisaoGeralVendas,
  TopProdutos,
  MetodosPagamento,
  TaxaConversaoMetodo,
  MotivosRecusa,
  ParcelasSelecionadas,
  DispositivosAcesso,
  OrigemVendasConcluidas,
  RastreamentoVendas,
  LocalDeVendas,
} from './widgets'



type WidgetDef = {
  id: string
  nome: string
  descricao: string
  categoria: string
  icon: React.ReactNode
  component: React.FC
}

const widgetsDisponiveis: WidgetDef[] = [
  { id: 'funil', nome: 'Funil de conversão', descricao: 'Acompanhe etapas e quedas do checkout.', categoria: 'PERFORMANCE', icon: <TrendingUp size={14}  />, component: FunilDeConversao },
  { id: 'recursos', nome: 'Recursos ativos', descricao: 'Veja recursos ligados e impacto na conversão.', categoria: 'PERFORMANCE', icon: <BarChart3 size={14}  />, component: RecursosAtivos },
  { id: 'taxa-conv', nome: 'Taxa de conversão', descricao: 'Percentual de visitas que viram compras.', categoria: 'PERFORMANCE', icon: <Percent size={14}  />, component: TaxaDeConversaoKpis },
  { id: 'taxas-gerais', nome: 'Taxas gerais', descricao: 'Total de taxas e custos sobre as vendas.', categoria: 'PERFORMANCE', icon: <DollarSign size={14}  />, component: TaxasGerais },
  { id: 'visao-vendas', nome: 'Visão geral de vendas', descricao: 'Resumo de vendas e tendências no período.', categoria: 'TRANSAÇÕES', icon: <LineChart size={14}  />, component: VisaoGeralVendas },
  { id: 'top-prod', nome: 'Top produtos', descricao: 'Produtos com maior faturamento e volume.', categoria: 'TRANSAÇÕES', icon: <ShoppingCart size={14}  />, component: TopProdutos },
  { id: 'metodos-pag', nome: 'Métodos de pagamento', descricao: 'Distribuição de vendas por forma de pagamento.', categoria: 'PAGAMENTOS', icon: <CreditCard size={14}  />, component: MetodosPagamento },
  { id: 'taxa-metodo', nome: 'Transações (por método)', descricao: 'Conversão segmentada por cartão, Pix e boleto.', categoria: 'PAGAMENTOS', icon: <ArrowRightLeft size={14}  />, component: TaxaConversaoMetodo },
  { id: 'motivos-recusa', nome: 'Motivos de recusa de cartão', descricao: 'Principais erros e causas de não aprovação.', categoria: 'PAGAMENTOS', icon: <PieChart size={14}  />, component: MotivosRecusa },
  { id: 'parcelas', nome: 'Parcelas selecionadas', descricao: 'Parcelamentos mais escolhidos pelos clientes.', categoria: 'PAGAMENTOS', icon: <BarChart3 size={14}  />, component: ParcelasSelecionadas },
  { id: 'dispositivos', nome: 'Dispositivos de acesso', descricao: 'Acessos por mobile, desktop e tablet.', categoria: 'ORIGEM', icon: <Smartphone size={14}  />, component: DispositivosAcesso },
  { id: 'origem-vendas', nome: 'Origem das vendas concluídas', descricao: 'De onde vieram as vendas aprovadas.', categoria: 'ORIGEM', icon: <Users size={14}  />, component: OrigemVendasConcluidas },
  { id: 'rastreamento', nome: 'Rastreamento de vendas', descricao: 'Vendas rastreáveis versus não rastreáveis.', categoria: 'ORIGEM', icon: <Target size={14}  />, component: RastreamentoVendas },
  { id: 'local', nome: 'Local de vendas', descricao: 'Distribuição geográfica das compras realizadas.', categoria: 'ORIGEM', icon: <Globe size={14}  />, component: LocalDeVendas },
]

const categorias = ['PERFORMANCE', 'TRANSAÇÕES', 'PAGAMENTOS', 'ORIGEM']

// Sortable wrapper for a real widget
function SortableWidget({ id, children, onRemove }: { id: string; children: React.ReactNode; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-10 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-white rounded border border-(--ant-color-split) w-7 h-7 flex items-center justify-center shadow-sm"
        title="Arrastar para reordenar"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--ant-color-text-quaternary)">
          <circle cx="4" cy="3" r="1.2" /><circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" /><circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
        </svg>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded border border-(--ant-color-split) w-7 h-7 flex items-center justify-center shadow-sm cursor-pointer hover:border-red-300"
        title="Remover widget"
      >
        <X size={14} className="text-sm text-[rgba(0,0,0,0.35)]" />
      </button>
      {children}
    </div>
  )
}

export default function TabPersonalizado() {
  const [modalOpen, setModalOpen] = useState(false)
  const [adicionados, setAdicionados] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleAdicionar = (id: string) => {
    setAdicionados((prev) => [...prev, id])
  }

  const handleRemover = (id: string) => {
    setAdicionados((prev) => prev.filter((i) => i !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setAdicionados((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // Empty state
  if (adicionados.length === 0 && !modalOpen) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <LayoutGrid size={14} className="text-[48px] text-[rgba(0,0,0,0.15)]" />
          <Typography.Title level={4} className="mb-0 text-(--ant-color-primary)">Monte do seu jeito!</Typography.Title>
          <Typography.Text type="secondary" className="text-center max-w-[400px]">
            Personalize esta aba com as métricas que fazem mais sentido para o seu negócio. Escolha entre opções de transações, performance, pagamentos e origem.
          </Typography.Text>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Personalizar informações
          </Button>
        </div>
        <WidgetModal open={modalOpen} onClose={() => setModalOpen(false)} adicionados={adicionados} onAdicionar={handleAdicionar} onRemover={handleRemover} />
      </>
    )
  }

  // Dashboard with real widgets
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={5} className="mb-0">Seus widgets</Typography.Title>
        <Button icon={<Plus size={14}  />} onClick={() => setModalOpen(true)}>
          Adicionar widget
        </Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={adicionados} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6">
            {adicionados.map((id) => {
              const widget = widgetsDisponiveis.find((w) => w.id === id)
              if (!widget) return null
              const Component = widget.component
              return (
                <SortableWidget key={id} id={id} onRemove={() => handleRemover(id)}>
                  <Component />
                </SortableWidget>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
      <WidgetModal open={modalOpen} onClose={() => setModalOpen(false)} adicionados={adicionados} onAdicionar={handleAdicionar} onRemover={handleRemover} />
    </>
  )
}

// Modal "Adicionar widget"
function WidgetModal({
  open, onClose, adicionados, onAdicionar, onRemover,
}: {
  open: boolean; onClose: () => void; adicionados: string[]; onAdicionar: (id: string) => void; onRemover: (id: string) => void
}) {
  return (
    <Modal open={open} onCancel={onClose} title={<Typography.Title level={4} className="mb-0">Adicionar widget</Typography.Title>} width={560} footer={null}>
      <div className="max-h-[500px] overflow-y-auto -mx-1 px-1">
        {categorias.map((categoria) => {
          const widgets = widgetsDisponiveis.filter((w) => w.categoria === categoria)
          return (
            <div key={categoria} className="mb-2">
              <Typography.Text strong className="tracking-wider text-(--ant-color-text-tertiary) block mb-2 mt-4">{categoria}</Typography.Text>
              {widgets.map((widget) => {
                const jaAdicionado = adicionados.includes(widget.id)
                return (
                  <div key={widget.id} className="flex items-center gap-3 py-3 border-b border-(--ant-color-split) last:border-b-0">
                    <div className="text-(--ant-color-primary) text-lg w-5 flex justify-center shrink-0">{widget.icon}</div>
                    <div className="flex-1 min-w-0">
                      <Typography.Text strong className="block">{widget.nome}</Typography.Text>
                      <Typography.Text type="secondary" >{widget.descricao}</Typography.Text>
                    </div>
                    <div className="shrink-0 ml-2">
                      {jaAdicionado ? (
                        <Button type="text" className="text-(--ant-color-text-quaternary)" icon={<Check size={14}  />} onClick={() => onRemover(widget.id)}>
                          Já adicionado
                        </Button>
                      ) : (
                        <Button type="default" icon={<Plus size={14}  />} onClick={() => onAdicionar(widget.id)}>
                          Adicionar
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
