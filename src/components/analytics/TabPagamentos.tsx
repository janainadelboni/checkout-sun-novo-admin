import { WidgetEmpty, KpisEmpty } from './WidgetEmpty'
import DraggableKpiCards from './DraggableKpiCards'
import { MetodosPagamento } from './widgets/MetodosPagamento'
import { TaxaConversaoMetodo } from './widgets/TaxaConversaoMetodo'
import { MotivosRecusa } from './widgets/MotivosRecusa'
import { ParcelasSelecionadas } from './widgets/ParcelasSelecionadas'
import DraggableSections, { type SectionItem } from './DraggableSection'

export default function TabPagamentos({ isEditing, hasData = true }: { isEditing?: boolean; hasData?: boolean }) {
  const editing = isEditing ?? false
  const noData = !hasData
  const sections: SectionItem[] = [
    {
      id: 'taxas', label: 'Taxas de aprovação',
      component: noData ? <KpisEmpty /> : <DraggableKpiCards isEditing={editing} items={[
        { id: 'taxa-cartao', label: 'Taxa de Aprovação de Cartão', valor: '54%', tooltip: 'Transações de cartão aprovadas ÷ Total de tentativas de cartão.\nEx: 540 aprovadas ÷ 1.000 tentativas = 54%' },
        { id: 'taxa-pix', label: 'Taxa de Pagamento de Pix', valor: '20%', tooltip: 'Transações Pix pagas ÷ Total de Pix gerados.\nEx: 200 pagos ÷ 1.000 gerados = 20%' },
        { id: 'taxa-boleto', label: 'Taxa de Pagamento de Boleto', valor: '5%', tooltip: 'Boletos pagos ÷ Total de boletos gerados.\nEx: 50 pagos ÷ 1.000 gerados = 5%' },
      ]} />,
    },
    { id: 'metodos-transacoes', label: 'Métodos de pagamento e Transações', component: noData ? (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1"><WidgetEmpty title="Transações por Método de Pagamento" /></div>
        <div className="w-[380px] shrink-0"><WidgetEmpty title="Transações" /></div>
      </div>
    ) : (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex"><div className="flex-1"><MetodosPagamento /></div></div>
        <div className="w-[380px] shrink-0 flex"><div className="flex-1"><TaxaConversaoMetodo /></div></div>
      </div>
    ) },
    { id: 'recusa-parcelas', label: 'Motivos de recusa e Parcelas', component: noData ? (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1"><WidgetEmpty title="Motivos de Recusa de Cartão" /></div>
        <div className="flex-1"><WidgetEmpty title="Parcelas mais selecionadas" /></div>
      </div>
    ) : (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex"><div className="flex-1"><MotivosRecusa /></div></div>
        <div className="flex-1 flex"><div className="flex-1"><ParcelasSelecionadas /></div></div>
      </div>
    ) },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
