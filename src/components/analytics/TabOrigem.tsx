import { DispositivosAcesso } from './widgets/DispositivosAcesso'
import { OrigemVendasConcluidas } from './widgets/OrigemVendasConcluidas'
import { RastreamentoVendas } from './widgets/RastreamentoVendas'
import { LocalDeVendas } from './widgets/LocalDeVendas'
import DraggableSections, { type SectionItem } from './DraggableSection'

const sections: SectionItem[] = [
  { id: 'dispositivos-origem', label: 'Dispositivos e Origem das vendas', component: (
    <div className="flex gap-4 items-stretch">
      <div className="flex-1 flex"><div className="flex-1"><DispositivosAcesso /></div></div>
      <div className="flex-1 flex"><div className="flex-1"><OrigemVendasConcluidas /></div></div>
    </div>
  ) },
  { id: 'rastreamento', label: 'Rastreamento de vendas', component: <RastreamentoVendas /> },
  { id: 'local', label: 'Local de vendas', component: <LocalDeVendas /> },
]

export default function TabOrigem({ isEditing }: { isEditing?: boolean }) {
  return <DraggableSections sections={sections} isEditing={isEditing ?? false} />
}
