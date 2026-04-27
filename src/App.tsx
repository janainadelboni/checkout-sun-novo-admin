import { useState } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import PaginaRastreamento from './components/rastreamento/PaginaRastreamento'
import PaginaDoPixel from './components/rastreamento/PaginaDoPixel'
import PaginaAnalytics from './components/analytics/PaginaAnalytics'
import PaginaOrderBump from './components/order-bump/PaginaOrderBump'
import antdTheme from './theme/antd'

type NavKey = 'analytics' | 'rastreamento' | 'order-bump'
type Page =
  | { type: 'rastreamento' }
  | { type: 'pixel'; provider: string }
  | { type: 'analytics' }
  | { type: 'order-bump' }

export default function App() {
  const [page, setPage] = useState<Page>({ type: 'rastreamento' })
  const navigate = (key: NavKey) => setPage({ type: key } as Page)

  return (
    <ConfigProvider theme={antdTheme(false)}>
      <AntdApp>
        {page.type === 'rastreamento' && (
          <PaginaRastreamento
            onVerDetalhes={(provider) => setPage({ type: 'pixel', provider })}
            onNavigate={navigate}
          />
        )}
        {page.type === 'pixel' && (
          <PaginaDoPixel
            provider={page.provider}
            onVoltar={() => setPage({ type: 'rastreamento' })}
            onNavigate={navigate}
          />
        )}
        {page.type === 'analytics' && (
          <PaginaAnalytics
            onVoltar={() => setPage({ type: 'rastreamento' })}
            onNavigate={navigate}
          />
        )}
        {page.type === 'order-bump' && (
          <PaginaOrderBump onNavigate={navigate} />
        )}
      </AntdApp>
    </ConfigProvider>
  )
}
