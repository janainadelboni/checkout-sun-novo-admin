import { useState } from 'react'
import { Typography, Tooltip, Segmented } from 'antd'



const parcelasData: Record<string, { label: string; percent: string }[]> = {
  'Cartão de crédito': [
    { label: '1x', percent: '100%' }, { label: '2x', percent: '45%' }, { label: '3x', percent: '39%' },
    { label: '4x', percent: '28%' }, { label: '5x', percent: '22%' }, { label: '6x', percent: '18%' },
    { label: '7x', percent: '14%' }, { label: '8x', percent: '10%' }, { label: '9x', percent: '8%' },
    { label: '10x', percent: '5%' }, { label: '11x', percent: '3%' }, { label: '12x', percent: '2%' },
  ],
  'PSL': [
    { label: '1x', percent: '100%' }, { label: '2x', percent: '60%' }, { label: '3x', percent: '45%' },
    { label: '4x', percent: '35%' }, { label: '5x', percent: '28%' }, { label: '6x', percent: '20%' },
    { label: '7x', percent: '15%' }, { label: '8x', percent: '10%' }, { label: '9x', percent: '8%' },
    { label: '10x', percent: '6%' }, { label: '11x', percent: '4%' }, { label: '12x', percent: '3%' },
  ],
  'Boleto parcelado': [
    { label: '1x', percent: '100%' }, { label: '2x', percent: '55%' }, { label: '3x', percent: '40%' },
    { label: '4x', percent: '30%' }, { label: '5x', percent: '20%' }, { label: '6x', percent: '12%' },
  ],
}

export function ParcelasSelecionadas() {
  const [tab, setTab] = useState('Cartão de crédito')
  const parcelas = parcelasData[tab] || []

  return (
    <div className="border border-(--ant-color-split) rounded-lg p-6">
      <Typography.Title level={5} className="mb-3">Parcelas mais selecionadas</Typography.Title>
      <Segmented size="small"
        value={tab}
        onChange={(v) => setTab(v as string)}
        options={['Cartão de crédito', 'PSL', 'Boleto parcelado']}
        className="mb-4"
      />
      <div className="flex items-center py-1 gap-3">
        <div className="w-[36px] shrink-0" />
        <div className="flex-1 min-w-[120px]" />
        <div className="w-[70px] text-right shrink-0"><Typography.Text type="secondary" className="whitespace-nowrap">Percentual</Typography.Text></div>
      </div>
      <div className="max-h-[250px] overflow-y-auto">
        {parcelas.map((p) => (
          <Tooltip key={p.label} title={`${p.label}: ${p.percent}`}>
          <div className="flex items-center py-2.5 gap-3 border-b border-(--ant-color-split) last:border-b-0 cursor-default hover:bg-(--ant-color-fill-quaternary) rounded transition-colors">
            <div className="w-[36px] shrink-0"><Typography.Text className="whitespace-nowrap">{p.label}</Typography.Text></div>
            <div className="flex-1 h-4 bg-(--ant-color-fill-tertiary) rounded overflow-hidden min-w-[120px]">
              <div className="h-full rounded min-w-1" style={{ width: p.percent, backgroundColor: '#2B4ACF' }} />
            </div>
            <div className="w-[70px] text-right shrink-0"><Typography.Text className="whitespace-nowrap">{p.percent}</Typography.Text></div>
          </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
