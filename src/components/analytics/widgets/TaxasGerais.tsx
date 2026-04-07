import DraggableKpiCards from '../DraggableKpiCards'

export function TaxasGerais({ isEditing }: { isEditing?: boolean }) {
  return (
    <DraggableKpiCards isEditing={isEditing} items={[
      { id: 'taxa-cartao', label: 'Taxa de Aprovação de Cartão', valor: '54%' },
      { id: 'taxa-pix', label: 'Taxa de Pagamento de Pix', valor: '20%' },
      { id: 'taxa-boleto', label: 'Taxa de Pagamento de Boleto', valor: '5%' },
    ]} />
  )
}
