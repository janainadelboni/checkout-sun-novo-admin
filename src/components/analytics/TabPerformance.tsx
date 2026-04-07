import { Typography, Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import FunilDeConversao from './FunilDeConversao'
import DraggableKpiCards, { type KpiItem } from './DraggableKpiCards'
import { RecursosAtivos } from './widgets/RecursosAtivos'
import DraggableSections, { type SectionItem } from './DraggableSection'
import { MyEduzzLogo, BlinketLogo } from '../Logos'

const { Title, Text } = Typography

const kpis: KpiItem[] = [
  { id: 'conversao', label: 'Taxa de conversão', valor: '10%', tooltip: 'Percentual de visitantes que finalizaram a compra' },
  { id: 'abandono', label: 'Taxa de abandono checkout', valor: '20%', tooltip: 'Percentual de visitantes que abandonaram o checkout' },
  { id: 'recompra', label: 'Índice de recompra', valor: '5%', tooltip: 'Percentual de compradores que compraram novamente' },
  { id: 'tempo', label: 'Tempo médio de compra', valor: '74s', tooltip: 'Tempo médio entre a entrada no checkout e a finalização' },
]

function LinksExternos() {
  return (
    <div className="flex gap-4">
      <div className="flex-1 border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
        <Title level={5} className="!mb-1">Gerenciamento e métricas de Assinaturas</Title>
        <div className="mb-3">
          <MyEduzzLogo />
        </div>
        <Text type="secondary" className="text-sm block mb-4">
          Gerencie planos, cobranças recorrentes, inadimplência e o ciclo de vida dos assinantes em um só painel.
        </Text>
        <Button icon={<ExportOutlined />}>Ir para Assinaturas</Button>
      </div>
      <div className="flex-1 border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
        <Title level={5} className="!mb-1">Métricas de eventos é na Blinket</Title>
        <div className="mb-3">
          <BlinketLogo />
        </div>
        <Text type="secondary" className="text-sm block mb-4">
          Crie uma página de vendas, acompanhe as métricas do evento e organize participantes.
        </Text>
        <Button icon={<ExportOutlined />}>Ir para Blinket</Button>
      </div>
    </div>
  )
}

export default function TabPerformance({ isEditing }: { isEditing?: boolean }) {
  const editing = isEditing ?? false
  const sections: SectionItem[] = [
    { id: 'funil', label: 'Funil de conversão', component: <FunilDeConversao /> },
    { id: 'kpis', label: 'KPIs de performance', component: <DraggableKpiCards items={kpis} isEditing={editing} /> },
    { id: 'recursos', label: 'Conversão de Recursos Ativos', component: <RecursosAtivos /> },
    { id: 'links', label: 'Links externos', component: <LinksExternos /> },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
