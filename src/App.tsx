import { useState } from 'react'
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import PaginaRastreamento from './components/rastreamento/PaginaRastreamento'
import PaginaDoPixel from './components/rastreamento/PaginaDoPixel'
import PaginaAnalytics from './components/analytics/PaginaAnalytics'
import PaginaOrderBump from './components/order-bump/PaginaOrderBump'
import themeConfig from './theme/theme.json'

type NavKey = 'analytics' | 'rastreamento' | 'order-bump'
type Page =
  | { type: 'rastreamento' }
  | { type: 'pixel'; provider: string }
  | { type: 'analytics' }
  | { type: 'order-bump' }

export default function App() {
  const [page, setPage] = useState<Page>({ type: 'rastreamento' })
  const [isDark] = useState(false)
  const navigate = (key: NavKey) => setPage({ type: key } as Page)

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        hashed: false,
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          ...(isDark ? themeConfig.darkToken : themeConfig.token),
          // Card / section titles (Typography.Title level={5})
          fontSizeHeading5: 18,
        },
        components: {
          ...themeConfig.components,
          Segmented: {
            // Aligns visual with DS demo: light track, white selected pill with shadow
            trackBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,19,36,0.06)',
            itemColor: isDark ? 'rgba(255,255,255,0.68)' : 'rgba(15,19,36,0.75)',
            itemHoverBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,19,36,0.04)',
            itemHoverColor: isDark ? '#ffffff' : '#0F1324',
            itemSelectedBg: isDark ? '#262626' : '#ffffff',
            itemSelectedColor: isDark ? '#ffffff' : '#0F1324',
            trackPadding: 4,
          },
        },
      }}
    >
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
