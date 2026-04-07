import { useState } from 'react'
import { Tooltip, Typography, Tag, Segmented } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const funilEtapas = [
  { label: 'Visitou a página', evento: 'PageView', valor: 10200, cor: '#1890FF' },
  { label: 'Preencheu dados', evento: 'FormInteraction', valor: 4590, cor: '#FAAD14' },
  { label: 'Dados de pagamento', evento: 'AddPaymentInfo', valor: 2856, cor: '#52C41A' },
  { label: 'Compra finalizada', evento: 'Purchase', valor: 1224, cor: '#EB2F96' },
]

export default function FunilDeConversao() {
  const [dispositivo, setDispositivo] = useState<string>('Desktop')

  const funilTopo = funilEtapas[0].valor || 1
  const funilComPercent = funilEtapas.map((etapa) => {
    const topoFundo = ((etapa.valor / funilTopo) * 100).toFixed(0)
    return { ...etapa, topoFundo }
  })

  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Title level={5} className="!mb-0">Funil de conversão</Title>
        <Tooltip title="Taxa calculada com base em 'Visitou a página' (base = 100%).">
          <QuestionCircleOutlined className="text-[rgba(0,0,0,0.45)] text-sm cursor-help" />
        </Tooltip>
        <Segmented
          value={dispositivo}
          onChange={(value) => setDispositivo(value as string)}
          options={['Desktop', 'Celular']}
          size="small"
        />
      </div>

      {/* Funil */}
      <div className="flex flex-col gap-4">
        {/* Header do funil */}
        <div className="flex items-center justify-end gap-0 mb-1">
          <div className="w-[50px] text-right">
            <Text type="secondary" className="text-[11px] font-medium whitespace-nowrap">Taxa</Text>
          </div>
          <div className="w-[70px] text-right">
            <Text type="secondary" className="text-[11px] font-medium whitespace-nowrap">Qtd.</Text>
          </div>
        </div>

        {/* Etapas */}
        {funilComPercent.map((etapa) => (
          <div key={etapa.label} className="flex items-center gap-2">
            <div className="w-[140px] shrink-0">
              <Tooltip title={`Evento: ${etapa.evento}`}>
                <Tag
                  className="!text-xs !font-semibold !px-2 !py-0.5 !rounded cursor-help"
                  style={{
                    color: '#0d2772',
                    borderColor: '#0d2772',
                    backgroundColor: 'transparent',
                  }}
                >
                  {etapa.label}
                </Tag>
              </Tooltip>
            </div>
            <div className="flex-1 h-6 bg-[#f5f5f5] rounded overflow-hidden">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${etapa.topoFundo}%`,
                  backgroundColor: etapa.cor,
                  minWidth: '4px',
                }}
              />
            </div>
            <div className="w-[50px] text-right shrink-0 pl-4">
              <Text strong className="text-xs">{etapa.topoFundo}%</Text>
            </div>
            <div className="w-[70px] text-right shrink-0 pl-4">
              <Text type="secondary" className="text-xs">{etapa.valor.toLocaleString('pt-BR')}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
