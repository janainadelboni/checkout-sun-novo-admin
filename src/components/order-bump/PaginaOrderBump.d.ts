import type { ComponentType } from 'react'

declare const PaginaOrderBump: ComponentType<{
  onNavigate: (key: 'analytics' | 'rastreamento' | 'order-bump') => void
}>

export default PaginaOrderBump
