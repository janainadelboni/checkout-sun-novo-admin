import DraggableKpiCards from './DraggableKpiCards'
import { VisaoGeralVendas } from './widgets/VisaoGeralVendas'
import { TopProdutos } from './widgets/TopProdutos'
import DraggableSections, { type SectionItem } from './DraggableSection'

const cardsFaturamento = [
  { label: 'Faturamento com Order Bump', valor: 'R$ 120.000,00', tooltip: 'Receita gerada por order bumps' },
  { label: 'Faturamento com PSJ', valor: 'R$ 2.000,00', tooltip: 'Receita via PSJ (Parcelamento sem juros)' },
  { label: 'Faturamento com PSL', valor: 'R$ 2.000,00', tooltip: 'Receita via PSL (Parcelamento sem limites)' },
  { label: 'Produtos ativos', valor: '20', tooltip: 'Produtos com vendas no período' },
  { label: 'Valor transacionado', valor: 'R$ 120.000,00', tooltip: 'Valor total transacionado' },
  { label: 'Total de transações', valor: '30.200', tooltip: 'Número total de transações' },
  { label: 'Total de reembolso', valor: '45', tooltip: 'Total de reembolsos no período' },
  { label: 'Total de chargebacks', valor: '23', tooltip: 'Total de chargebacks no período' },
]

export default function TabTransacoes({ isEditing }: { isEditing?: boolean }) {
  const editing = isEditing ?? false
  const sections: SectionItem[] = [
    { id: 'grafico', label: 'Visão geral de vendas', component: <VisaoGeralVendas /> },
    {
      id: 'kpis-1', label: 'KPIs de faturamento',
      component: <DraggableKpiCards isEditing={editing} items={cardsFaturamento.slice(0, 4).map((c, i) => ({
        id: `fat-${i}`, label: c.label, valor: c.valor, tooltip: c.tooltip,
      }))} />,
    },
    {
      id: 'kpis-2', label: 'KPIs de transações',
      component: <DraggableKpiCards isEditing={editing} items={cardsFaturamento.slice(4).map((c, i) => ({
        id: `fat2-${i}`, label: c.label, valor: c.valor, tooltip: c.tooltip,
      }))} />,
    },
    { id: 'top-produtos', label: 'Top 10 produtos', component: <TopProdutos /> },
  ]
  return <DraggableSections sections={sections} isEditing={editing} />
}
