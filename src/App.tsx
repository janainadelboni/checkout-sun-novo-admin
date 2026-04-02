import { useState } from 'react'
import { App as AntdApp } from 'antd'
import PaginaRastreamento from './components/PaginaRastreamento'
import PaginaDoPixel from './components/PaginaDoPixel'

/* ─── Navegação simples por estado ─── */
type Page =
  | { type: 'rastreamento' }
  | { type: 'pixel'; provider: string }

export default function App() {
  const [page, setPage] = useState<Page>({ type: 'rastreamento' })

  return (
    <AntdApp>
      {page.type === 'rastreamento' && (
        <PaginaRastreamento
          onVerDetalhes={(provider) => setPage({ type: 'pixel', provider })}
        />
      )}
      {page.type === 'pixel' && (
        <PaginaDoPixel
          provider={page.provider}
          onVoltar={() => setPage({ type: 'rastreamento' })}
        />
      )}
    </AntdApp>
  )
}
