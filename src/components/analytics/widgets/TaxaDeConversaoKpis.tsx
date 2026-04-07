import DraggableKpiCards, { type KpiItem } from '../DraggableKpiCards'

const kpis: KpiItem[] = [
  { id: 'conversao', label: 'Taxa de conversão', valor: '10%', tooltip: 'Percentual de visitantes que finalizaram a compra' },
  { id: 'abandono', label: 'Taxa de abandono checkout', valor: '20%', tooltip: 'Percentual de visitantes que abandonaram o checkout' },
  { id: 'recompra', label: 'Índice de recompra', valor: '5%', tooltip: 'Percentual de compradores que compraram novamente' },
  { id: 'tempo', label: 'Tempo médio de compra', valor: '74s', tooltip: 'Tempo médio entre a entrada no checkout e a finalização' },
]

export function TaxaDeConversaoKpis({ isEditing }: { isEditing?: boolean }) {
  return <DraggableKpiCards items={kpis} isEditing={isEditing} />
}
