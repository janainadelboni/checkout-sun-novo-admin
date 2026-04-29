import { Typography } from 'antd'
import { BarChart3 } from 'lucide-react'
export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 border border-(--ant-color-split) rounded-lg bg-(--ant-color-fill-quaternary)">
      <BarChart3 size={14} className="text-[44px] text-[rgba(0,0,0,0.15)]" />
      <div className="flex flex-col items-center gap-1.5 max-w-[380px]">
        <Typography.Text strong className="text-center">
          {message || 'Ainda não há dados para exibir neste período'}
        </Typography.Text>
        <Typography.Text type="secondary" className="text-center leading-relaxed">
          Quando suas vendas começarem a acontecer, os dados aparecerão aqui automaticamente. Você também pode ajustar o filtro de período para visualizar outro intervalo.
        </Typography.Text>
      </div>
    </div>
  )
}
