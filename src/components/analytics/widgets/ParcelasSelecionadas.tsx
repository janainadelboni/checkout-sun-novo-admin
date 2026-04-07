import { Typography, Tooltip } from 'antd'

const { Title, Text } = Typography

const parcelas = [
  { label: '1x', percent: '100%' },
  { label: '2x', percent: '45%' },
  { label: '3x', percent: '39%' },
  { label: '4x', percent: '28%' },
  { label: '5x', percent: '22%' },
  { label: '6x', percent: '18%' },
  { label: '7x', percent: '14%' },
  { label: '8x', percent: '10%' },
  { label: '9x', percent: '8%' },
  { label: '10x', percent: '5%' },
  { label: '11x', percent: '3%' },
  { label: '12x', percent: '2%' },
]

export function ParcelasSelecionadas() {
  return (
    <div className="border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <Title level={5} className="!mb-4">Parcelas mais selecionadas</Title>
      <div className="flex items-center py-1">
        <div className="w-[40px] shrink-0" /><div className="flex-1" />
        <div className="w-[70px] text-right shrink-0 pl-4"><Text type="secondary" className="text-[11px] whitespace-nowrap">Percentual</Text></div>
      </div>
      <div className="max-h-[250px] overflow-y-auto">
        {parcelas.map((p) => (
          <Tooltip key={p.label} title={`${p.label}: ${p.percent}`}>
          <div className="flex items-center py-2.5 border-b border-[rgba(0,0,0,0.06)] last:border-b-0 cursor-default hover:bg-[rgba(0,0,0,0.02)] rounded transition-colors">
            <div className="w-[40px] shrink-0"><Text className="text-sm whitespace-nowrap">{p.label}</Text></div>
            <div className="flex-1 h-4 bg-[#f5f5f5] rounded overflow-hidden mx-2">
              <div className="h-full rounded" style={{ width: p.percent, backgroundColor: '#1890FF', minWidth: '4px' }} />
            </div>
            <div className="w-[70px] text-right shrink-0 pl-4"><Text className="text-xs whitespace-nowrap">{p.percent}</Text></div>
          </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
