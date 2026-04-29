import { Typography, Button } from 'antd'
import { Upload } from 'lucide-react'
import FunilDeConversao from './FunilDeConversao'
import DraggableKpiCards, { type KpiItem } from './DraggableKpiCards'
import { RecursosAtivos } from './widgets/RecursosAtivos'
import DraggableSections, { type SectionItem } from './DraggableSection'
import { MyEduzzLogo, BlinketLogo } from '../Logos'
import { WidgetEmpty, KpisEmpty } from './WidgetEmpty'



const kpis: KpiItem[] = [
  { id: 'conversao', label: 'Taxa de conversão', valor: '10%', tooltip: 'Percentual de visitantes que concluíram a compra.\nFórmula: Compras finalizadas ÷ Visitou a página\nEx: 120 compras ÷ 1.000 visitas = 12%' },
  { id: 'abandono', label: 'Taxa de abandono checkout', valor: '20%', tooltip: 'Percentual de leads que não concluíram a compra.\nFórmula: Não finalizadas ÷ Preencheu dados de lead\nEx: 800 abandonos ÷ 1.000 leads = 80%' },
  { id: 'recompra', label: 'Índice de recompra', valor: '5%', tooltip: 'Percentual de compradores com mais de uma compra no período.\nFórmula: Compradores recorrentes ÷ Total de compradores únicos' },
  { id: 'tempo', label: 'Tempo médio de compra', valor: '74s', tooltip: 'Tempo médio do pageview até a compra finalizada.\nFórmula: Somatório do tempo (visita → compra) ÷ Total de compras' },
]

function LinksExternos() {
  return (
    <div className="flex gap-4">
      <div className="flex-1 border border-(--ant-color-split) rounded-lg p-6">
        <Typography.Title level={5} className="mb-1">Gerenciamento e métricas de Assinaturas</Typography.Title>
        <div className="mb-3">
          <MyEduzzLogo />
        </div>
        <Typography.Text type="secondary" className="block mb-4">
          Gerencie planos, cobranças recorrentes, inadimplência e o ciclo de vida dos assinantes em um só painel.
        </Typography.Text>
        <Button icon={<Upload size={14}  />}>Ir para Assinaturas</Button>
      </div>
      <div className="flex-1 border border-(--ant-color-split) rounded-lg p-6">
        <Typography.Title level={5} className="mb-1">Métricas de eventos é na Blinket</Typography.Title>
        <div className="mb-3">
          <BlinketLogo />
        </div>
        <Typography.Text type="secondary" className="block mb-4">
          Crie uma página de vendas, acompanhe as métricas do evento e organize participantes.
        </Typography.Text>
        <Button icon={<Upload size={14}  />}>Ir para Blinket</Button>
      </div>
    </div>
  )
}

export default function TabPerformance({ isEditing, hasData = true }: { isEditing?: boolean; hasData?: boolean }) {
  const editing = isEditing ?? false
  const noData = !hasData
  const sections: SectionItem[] = [
    { id: 'funil', label: 'Funil de conversão', component: noData ? <WidgetEmpty title="Funil de conversão" /> : <FunilDeConversao /> },
    { id: 'kpis', label: 'KPIs de performance', component: noData ? <KpisEmpty /> : <DraggableKpiCards items={kpis} isEditing={editing} /> },
    { id: 'recursos', label: 'Conversão de Recursos Ativos', component: noData ? <WidgetEmpty title="Conversão de Recursos Ativos" /> : <RecursosAtivos /> },
    { id: 'links', label: 'Links externos', component: <LinksExternos /> },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
