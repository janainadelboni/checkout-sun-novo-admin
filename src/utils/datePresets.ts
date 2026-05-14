import dayjs from 'dayjs'

export type RangePreset = {
  key: string
  label: string
  value: [dayjs.Dayjs, dayjs.Dayjs]
}

export const buildRangePresets = (): RangePreset[] => [
  { key: 'hoje', label: 'Hoje', value: [dayjs().startOf('day'), dayjs().startOf('day')] },
  { key: 'ultimos_7', label: 'Últimos 7 dias', value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().startOf('day')] },
  { key: 'ultimos_15', label: 'Últimos 15 dias', value: [dayjs().subtract(14, 'day').startOf('day'), dayjs().startOf('day')] },
  { key: 'ultimos_30', label: 'Últimos 30 dias', value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().startOf('day')] },
  { key: 'ultimos_90', label: 'Últimos 90 dias', value: [dayjs().subtract(89, 'day').startOf('day'), dayjs().startOf('day')] },
]
