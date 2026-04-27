import DraggableKpiCards from './DraggableKpiCards'
import { VisaoGeralVendas } from './widgets/VisaoGeralVendas'
import { TopProdutos } from './widgets/TopProdutos'
import DraggableSections, { type SectionItem } from './DraggableSection'
import { WidgetEmpty, KpisEmpty } from './WidgetEmpty'

const cardsFaturamento = [
  { label: 'Valor transacionado', valor: 'R$ 120.000,00', tooltip: 'Soma do valor de todas as transações aprovadas no período.\nFórmula: Somatório das transações aprovadas\nEx: 1.200 vendas × R$ 100 = R$ 120.000' },
  { label: 'Valor transacionado c/ Order Bump', valor: 'R$ 12.800,00', tooltip: 'Recorte do valor transacionado referente a transações com Order Bump aceito.\nFórmula: Somatório das transações aprovadas com Order Bump' },
  { label: 'Valor transacionado c/ PSJ', valor: 'R$ 2.000,00', tooltip: 'Valor de transações pagas com Parcelamento Sem Juros.\nFórmula: Somatório das transações aprovadas via PSJ' },
  { label: 'Valor transacionado c/ PSL', valor: 'R$ 2.000,00', tooltip: 'Valor de transações pagas com Parcelamento Sem Limites.\nFórmula: Somatório das transações aprovadas via PSL' },
  { label: 'Total de transações', valor: '30.200', tooltip: 'Quantidade total de transações aprovadas no período.\nFórmula: Contagem de transações aprovadas' },
  { label: 'Total de reembolsos', valor: '45', tooltip: 'Quantidade de transações reembolsadas no período.\nFórmula: Contagem de transações com status reembolsado' },
  { label: 'Total de chargebacks', valor: '23', tooltip: 'Quantidade de chargebacks registrados no período.\nFórmula: Contagem de transações com chargeback' },
  { label: 'Produtos ativos', valor: '20', tooltip: 'Quantidade de links de checkout prontos para venda.\nCada lote de ingresso conta como um produto distinto.' },
]

export default function TabTransacoes({ isEditing, hasData = true }: { isEditing?: boolean; hasData?: boolean }) {
  const editing = isEditing ?? false
  const noData = !hasData
  const sections: SectionItem[] = [
    { id: 'grafico', label: 'Visão geral de vendas', component: noData ? <WidgetEmpty title="Visão geral de vendas" /> : <VisaoGeralVendas /> },
    {
      id: 'kpis-1', label: 'KPIs de faturamento',
      component: noData ? <KpisEmpty /> : <DraggableKpiCards isEditing={editing} items={cardsFaturamento.slice(0, 4).map((c, i) => ({
        id: `fat-${i}`, label: c.label, valor: c.valor, tooltip: c.tooltip,
      }))} />,
    },
    {
      id: 'kpis-2', label: 'KPIs de transações',
      component: noData ? <KpisEmpty /> : <DraggableKpiCards isEditing={editing} items={cardsFaturamento.slice(4).map((c, i) => ({
        id: `fat2-${i}`, label: c.label, valor: c.valor, tooltip: c.tooltip,
      }))} />,
    },
    { id: 'top-produtos', label: 'Top 10 produtos', component: noData ? <WidgetEmpty title="Top 10 produtos" /> : <TopProdutos /> },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
