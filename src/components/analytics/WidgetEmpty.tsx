import { Typography } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const descricoes: Record<string, string> = {
  // Performance
  'Funil de conversão': 'Visualize cada etapa da jornada de compra no checkout — do acesso à compra finalizada — e identifique onde os compradores estão desistindo.',
  'Conversão de Recursos Ativos': 'Acompanhe o desempenho das ferramentas de venda ativas no seu checkout, como Order Bump, Exit Pop-up e Cupom de desconto.',

  // Transações
  'Visão geral de vendas': 'Acompanhe a evolução do valor e volume de vendas ao longo do tempo para identificar tendências e sazonalidades.',
  'Top 10 produtos': 'Descubra quais produtos geram mais receita e volume de vendas no período selecionado.',

  // Pagamentos
  'Transações por Método de Pagamento': 'Entenda como seus compradores preferem pagar — cartão, Pix, boleto — e o volume de cada método.',
  'Transações': 'Visualize a distribuição entre transações geradas, em aberto e pagas para cada método de pagamento.',
  'Motivos de Recusa de Cartão': 'Identifique os principais motivos de recusa nas tentativas de pagamento com cartão de crédito.',
  'Parcelas mais selecionadas': 'Saiba quantas parcelas seus compradores mais escolhem em cada método de parcelamento.',

  // Origem
  'Dispositivos de acesso': 'Descubra de quais dispositivos (desktop, celular, tablet) seus compradores acessam e compram no checkout.',
  'Origem das vendas concluídas': 'Entenda se suas vendas vêm diretamente de você, de afiliados ou coprodutores.',
  'Rastreamento de vendas': 'Analise quais canais e campanhas (UTMs) geram mais vendas rastreáveis no seu checkout.',
  'Local de vendas': 'Veja a distribuição geográfica das suas vendas por país, estado e cidade.',
}

export function WidgetEmpty({ title }: { title: string }) {
  const descricao = descricoes[title]
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-0">{title}</Title>
      <div className="flex flex-col items-center justify-center py-8 gap-3 max-w-[360px] mx-auto">
        <BarChartOutlined className="text-[28px] text-[rgba(0,0,0,0.1)]" />
        {descricao && (
          <Text type="secondary" className="text-xs text-center leading-relaxed">
            {descricao}
          </Text>
        )}
      </div>
    </div>
  )
}

const kpiDescricoes = [
  'Taxa de conversão',
  'Taxa de abandono',
  'Índice de recompra',
  'Tempo médio de compra',
]

export function KpisEmpty() {
  return (
    <div className="flex gap-3 items-stretch">
      {kpiDescricoes.map((label, i) => (
        <div key={i} className="flex-1 min-w-0 rounded-lg px-4 py-3 bg-[#f5f7fa] flex flex-col gap-1">
          <Text type="secondary" className="text-xs">{label}</Text>
          <Text className="text-2xl font-semibold text-[rgba(0,0,0,0.1)]">—</Text>
        </div>
      ))}
    </div>
  )
}
