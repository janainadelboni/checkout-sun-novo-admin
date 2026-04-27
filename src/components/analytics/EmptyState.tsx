import { Typography } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 border border-[rgba(0,0,0,0.06)] rounded-lg bg-[#fafafa]">
      <BarChartOutlined className="text-[44px] text-[rgba(0,0,0,0.15)]" />
      <div className="flex flex-col items-center gap-1.5 max-w-[380px]">
        <Text strong className="text-sm text-center">
          {message || 'Ainda não há dados para exibir neste período'}
        </Text>
        <Text type="secondary" className="text-xs text-center leading-relaxed">
          Quando suas vendas começarem a acontecer, os dados aparecerão aqui automaticamente. Você também pode ajustar o filtro de período para visualizar outro intervalo.
        </Text>
      </div>
    </div>
  )
}
