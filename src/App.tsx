import { useState } from 'react'
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import PaginaRastreamento from './components/rastreamento/PaginaRastreamento'
import PaginaDoPixel from './components/rastreamento/PaginaDoPixel'
import PaginaAnalytics from './components/analytics/PaginaAnalytics'
import PaginaOrderBump from './components/order-bump/PaginaOrderBump'
import themeConfig from './theme/theme.json'

dayjs.locale('pt-br')

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
      locale={ptBR}
      theme={{
        cssVar: { key: 'ant' },
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
            ...themeConfig.components.Segmented,
            ...(isDark ? themeConfig.componentsDark.Segmented : themeConfig.componentsLight.Segmented),
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
