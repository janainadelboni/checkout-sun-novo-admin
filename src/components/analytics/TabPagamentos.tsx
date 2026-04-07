import DraggableKpiCards from './DraggableKpiCards'
import { MetodosPagamento } from './widgets/MetodosPagamento'
import { TaxaConversaoMetodo } from './widgets/TaxaConversaoMetodo'
import { MotivosRecusa } from './widgets/MotivosRecusa'
import { ParcelasSelecionadas } from './widgets/ParcelasSelecionadas'
import DraggableSections, { type SectionItem } from './DraggableSection'

export default function TabPagamentos({ isEditing }: { isEditing?: boolean }) {
  const editing = isEditing ?? false
  const sections: SectionItem[] = [
    {
      id: 'taxas', label: 'Taxas de aprovação',
      component: <DraggableKpiCards isEditing={editing} items={[
        { id: 'taxa-cartao', label: 'Taxa de Aprovação de Cartão', valor: '54%' },
        { id: 'taxa-pix', label: 'Taxa de Pagamento de Pix', valor: '20%' },
        { id: 'taxa-boleto', label: 'Taxa de Pagamento de Boleto', valor: '5%' },
      ]} />,
    },
    { id: 'metodos-transacoes', label: 'Métodos de pagamento e Transações', component: (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex"><div className="flex-1"><MetodosPagamento /></div></div>
        <div className="w-[380px] shrink-0 flex"><div className="flex-1"><TaxaConversaoMetodo /></div></div>
      </div>
    ) },
    { id: 'recusa-parcelas', label: 'Motivos de recusa e Parcelas', component: (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex"><div className="flex-1"><MotivosRecusa /></div></div>
        <div className="flex-1 flex"><div className="flex-1"><ParcelasSelecionadas /></div></div>
      </div>
    ) },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
