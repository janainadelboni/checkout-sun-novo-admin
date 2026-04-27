import { WidgetEmpty } from './WidgetEmpty'
import { DispositivosAcesso } from './widgets/DispositivosAcesso'
import { OrigemVendasConcluidas } from './widgets/OrigemVendasConcluidas'
import { RastreamentoVendas } from './widgets/RastreamentoVendas'
import { LocalDeVendas } from './widgets/LocalDeVendas'
import DraggableSections, { type SectionItem } from './DraggableSection'

export default function TabOrigem({ isEditing, hasData = true }: { isEditing?: boolean; hasData?: boolean }) {
  const noData = !hasData
  const sections: SectionItem[] = [
    { id: 'dispositivos-origem', label: 'Dispositivos e Origem das vendas', component: noData ? (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1"><WidgetEmpty title="Dispositivos de acesso" /></div>
        <div className="flex-1"><WidgetEmpty title="Origem das vendas concluídas" /></div>
      </div>
    ) : (
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex"><div className="flex-1"><DispositivosAcesso /></div></div>
        <div className="flex-1 flex"><div className="flex-1"><OrigemVendasConcluidas /></div></div>
      </div>
    ) },
    { id: 'rastreamento', label: 'Rastreamento de vendas', component: noData ? <WidgetEmpty title="Rastreamento de vendas" /> : <RastreamentoVendas /> },
    { id: 'local', label: 'Local de vendas', component: noData ? <WidgetEmpty title="Local de vendas" /> : <LocalDeVendas /> },
  ]
  return <DraggableSections sections={sections} isEditing={isEditing ?? false} />
}
