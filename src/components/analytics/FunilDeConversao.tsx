import { useState } from 'react'
import { Tooltip, Typography, Tag, Segmented } from 'antd'
import { HelpCircle } from 'lucide-react'
const funilEtapas = [
  { label: 'Visitou a página', evento: 'pageview', valor: 10200, cor: '#1890FF' },
  { label: 'Preencheu dados', evento: 'lead', valor: 4590, cor: 'var(--ant-color-warning)' },
  { label: 'Dados de pagamento', evento: 'addpaymentinfo', valor: 2856, cor: 'var(--ant-color-success)' },
  { label: 'Compra finalizada', evento: 'purchase', valor: 1224, cor: '#EB2F96' },
]

export default function FunilDeConversao() {
  const [dispositivo, setDispositivo] = useState<string>('Desktop')

  const funilTopo = funilEtapas[0].valor || 1
  const funilComPercent = funilEtapas.map((etapa) => {
    const topoFundo = ((etapa.valor / funilTopo) * 100).toFixed(0)
    return { ...etapa, topoFundo }
  })

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Typography.Title level={5} className="mb-0">Funil de conversão</Typography.Title>
        <Tooltip title="Taxa calculada com base em 'Visitou a página' (base = 100%).">
          <HelpCircle size={14} className="text-(--ant-color-text-tertiary) text-sm cursor-help" />
        </Tooltip>
        <Segmented size="small"
          value={dispositivo}
          onChange={(value) => setDispositivo(value as string)}
          options={['Desktop', 'Celular']}
        />
      </div>

      {/* Funil */}
      <div className="flex flex-col gap-4">
        {/* Header do funil */}
        <div className="flex items-center justify-end gap-0 mb-1">
          <div className="w-[50px] text-right">
            <Typography.Text type="secondary" className="font-medium whitespace-nowrap">Taxa</Typography.Text>
          </div>
          <div className="w-[70px] text-right">
            <Typography.Text type="secondary" className="font-medium whitespace-nowrap">Qtd.</Typography.Text>
          </div>
        </div>

        {/* Etapas */}
        {funilComPercent.map((etapa) => (
          <div key={etapa.label} className="flex items-center gap-3">
            <div className="w-[180px] shrink-0">
              <Tooltip title={`Evento: ${etapa.evento}`}>
                <Tag color="blue" className="cursor-help">{etapa.label}</Tag>
              </Tooltip>
            </div>
            <div className="flex-1 h-6 bg-(--ant-color-fill-tertiary) rounded overflow-hidden">
              <div
                className="h-full rounded transition-all min-w-1"
                style={{
                  width: `${etapa.topoFundo}%`,
                  backgroundColor: etapa.cor,
                }}
              />
            </div>
            <div className="w-[50px] text-right shrink-0">
              <Typography.Text strong>{etapa.topoFundo}%</Typography.Text>
            </div>
            <div className="w-[70px] text-right shrink-0">
              <Typography.Text type="secondary">{etapa.valor.toLocaleString('pt-BR')}</Typography.Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
