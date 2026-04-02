import { useState } from 'react'
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Modal,
  Pagination,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd'
import { HomeOutlined, EyeOutlined, SettingOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons'
import { EduzzLogo, CheckoutSunLogo } from './Logos'
import ConfigurarPixelModal, { type ModalMode, type PixelProvider } from './ConfigurarPixelModal'

const { Sider, Content } = Layout
const { Title, Text } = Typography

interface PaginaRastreamentoProps {
  onVerDetalhes: (pixelProvider: string) => void
}

type PixelCard = {
  key: string
  provider: string
  providerKey: string
  logo: string
  pixelId: string
  label?: string
  createdAt: string | null
  historico?: { data: string; descricao: string }[]
  produtosCount: number | null
  configured: boolean
  detailsLabel?: string
}

const pixelCardsIniciais: PixelCard[] = [
  {
    key: 'meta-1',
    provider: 'Facebook',
    providerKey: 'meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
    pixelId: '7644657994596',
    label: 'Facebook - Principal',
    createdAt: '09/01/2026',
    historico: [
      { data: '09/01/2026 10:30', descricao: 'Pixel criado' },
      { data: '12/01/2026 09:15', descricao: 'Adicionado evento PageView' },
      { data: '15/01/2026 14:12', descricao: 'Adicionado evento Purchase' },
      { data: '18/01/2026 11:00', descricao: 'Configurado valor customizado para Purchase' },
      { data: '25/01/2026 16:45', descricao: 'Adicionado evento Lead' },
      { data: '02/02/2026 08:30', descricao: 'Ativada API de conversões' },
      { data: '10/02/2026 13:20', descricao: 'Adicionados produtos Academia 360 e Curso de Marketing' },
      { data: '15/02/2026 10:00', descricao: 'Adicionado evento FormInteraction' },
      { data: '22/02/2026 09:45', descricao: 'Token da API de conversões atualizado' },
      { data: '01/03/2026 14:30', descricao: 'Removido evento AddPaymentInfo' },
      { data: '05/03/2026 11:10', descricao: 'Adicionado evento InitiateCheckout' },
      { data: '10/03/2026 16:20', descricao: 'Adicionados 3 novos produtos' },
      { data: '18/03/2026 09:00', descricao: 'Configuração de boleto diferenciado ativada' },
      { data: '25/03/2026 15:40', descricao: 'Token da API renovado' },
    ],
    produtosCount: 10,
    configured: true,
    detailsLabel: 'Ver detalhes',
  },
  {
    key: 'meta-2',
    provider: 'Facebook',
    providerKey: 'meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
    pixelId: '9988776655443',
    label: 'Facebook - Remarketing',
    createdAt: '15/02/2026',
    historico: [
      { data: '15/02/2026 11:00', descricao: 'Pixel criado' },
      { data: '20/02/2026 08:30', descricao: 'Adicionado evento PageView' },
    ],
    produtosCount: 3,
    configured: true,
    detailsLabel: 'Ver detalhes',
  },
  {
    key: 'ga4-1',
    provider: 'Google Analytics 4',
    providerKey: 'ga4',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    pixelId: '7644657994596',
    createdAt: '09/01/2026',
    historico: [
      { data: '09/01/2026 10:30', descricao: 'Pixel criado' },
      { data: '05/02/2026 15:00', descricao: 'Eventos Lead e Purchase configurados' },
      { data: '18/03/2026 11:22', descricao: 'Removido evento FormInteraction' },
    ],
    produtosCount: 12,
    configured: true,
    detailsLabel: 'Ver detalhes',
  },
  {
    key: 'gtm-1',
    provider: 'Google Tag Manager',
    providerKey: 'gtm',
    logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
    pixelId: '7644657994596',
    createdAt: '09/01/2026',
    historico: [
      { data: '09/01/2026 10:30', descricao: 'Pixel criado' },
    ],
    produtosCount: 1,
    configured: true,
    detailsLabel: 'Ver todos',
  },
  {
    key: 'hubspot-1',
    provider: 'HubSpot',
    providerKey: 'hubspot',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    pixelId: '7644657994596',
    createdAt: '09/01/2026',
    historico: [
      { data: '09/01/2026 10:30', descricao: 'Pixel criado' },
      { data: '28/01/2026 17:45', descricao: 'ID do pixel atualizado' },
    ],
    produtosCount: 1,
    configured: true,
    detailsLabel: 'Ver detalhes',
  },
  {
    key: 'google_ads-1',
    provider: 'Google AdWords',
    providerKey: 'google_ads',
    logo: 'https://www.gstatic.com/adx/doubleclick.ico',
    pixelId: '0000000000000',
    createdAt: null,
    produtosCount: null,
    configured: false,
  },
]

function BrandLogo({ card }: { card: PixelCard }) {
  if (card.providerKey === 'meta') {
    return (
      <span
        className="text-2xl font-bold leading-none"
        style={{ color: '#1877F2', fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        facebook.
      </span>
    )
  }
  if (card.providerKey === 'ga4') {
    return (
      <div className="flex items-center gap-2">
        <img src={card.logo} alt={card.provider} className="h-8 w-8 object-contain" />
        <span className="text-base font-medium text-gray-800 leading-tight">
          Google <span className="text-gray-800">Analytics</span>{' '}
          <span style={{ color: '#E37400' }}>4</span>
        </span>
      </div>
    )
  }
  if (card.providerKey === 'gtm') {
    return (
      <div className="flex items-center gap-2">
        <img src={card.logo} alt={card.provider} className="h-8 w-8 object-contain" />
        <span className="text-base font-medium text-gray-800 leading-tight">
          Google Tag Manager
        </span>
      </div>
    )
  }
  if (card.providerKey === 'hubspot') {
    return (
      <div className="flex items-center gap-2">
        <img src={card.logo} alt={card.provider} className="h-8 w-8 object-contain" />
        <span
          className="text-xl font-bold leading-none"
          style={{ color: '#FF7A59', fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          HubSpot
        </span>
      </div>
    )
  }
  if (card.providerKey === 'google_ads') {
    return (
      <div className="flex items-center gap-2">
        <img src={card.logo} alt={card.provider} className="h-8 w-8 object-contain" />
        <span className="text-base font-medium text-gray-400 leading-tight">
          Google AdWords
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <img src={card.logo} alt={card.provider} className="h-8 object-contain" />
      <span className="text-base font-medium text-gray-800">{card.provider}</span>
    </div>
  )
}

export default function PaginaRastreamento({
  onVerDetalhes,
}: PaginaRastreamentoProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>({ type: 'new' })
  const [pixelCards] = useState<PixelCard[]>(pixelCardsIniciais)
  const [historicoModal, setHistoricoModal] = useState<{ open: boolean; card: PixelCard | null }>({ open: false, card: null })
  const [historicoPagina, setHistoricoPagina] = useState(1)
  const HISTORICO_POR_PAGINA = 10

  const providerKeyMap: Record<string, PixelProvider> = {
    meta: 'meta',
    ga4: 'ga4',
    gtm: 'gtm',
    hubspot: 'meta',
    google_ads: 'google_ads',
  }

  const handleConfigurar = (providerKey: string) => {
    setModalMode({ type: 'configure', provider: providerKeyMap[providerKey] || 'meta' })
    setModalOpen(true)
  }

  const handleAddPixel = () => {
    setModalMode({ type: 'new' })
    setModalOpen(true)
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0d2772' } }}>
      <Layout className="min-h-screen bg-white">
        {/* Header */}
        <div className="h-[78px] bg-[#fafafa] flex items-center justify-center border-b border-[rgba(0,0,0,0.06)]">
          <EduzzLogo />
        </div>

        <Layout>
          {/* Sidebar */}
          <Sider width={288} className="!bg-white border-r border-[rgba(0,0,0,0.06)]">
            <div className="px-4 py-[10px]">
              <CheckoutSunLogo />
            </div>
            <Menu
              mode="inline"
              selectedKeys={['rastreamento']}
              className="border-none"
              items={[
                { key: 'visao-geral', label: 'Visão geral' },
                { key: 'produtos', label: 'Produtos' },
                { key: 'rastreamento', label: 'Rastreamento' },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content className="p-8 bg-white flex flex-col gap-8 max-w-[1280px] mx-auto w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { title: <HomeOutlined /> },
                { title: 'Checkout Sun' },
                { title: 'Rastreamento' },
              ]}
            />

            {/* Title + Subtitle + Add button */}
            <div className="flex items-start justify-between">
              <div>
                <Title level={3} className="!mb-1">
                  Rastreamento
                </Title>
                <Text type="secondary">
                  Acompanhe e crie campanhas de pixel e rastreamento
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddPixel}
              >
                Adicionar pixel
              </Button>
            </div>

            {/* Tabs */}
            <Tabs
              defaultActiveKey="pixel"
              items={[
                {
                  key: 'pixel',
                  label: 'Pixel',
                  children: (
                    <div className="flex flex-col gap-4">
                      {pixelCards.map((card) => (
                        <div
                          key={card.key}
                          className={`flex items-center p-4 border rounded-lg w-full transition-all ${
                            card.configured
                              ? 'border-[#d9d9d9] hover:border-[#0d2772]/40 hover:shadow-sm cursor-pointer'
                              : 'border-dashed border-[#d9d9d9] bg-[#fafafa]'
                          }`}
                          onClick={() => card.configured && onVerDetalhes(card.providerKey)}
                        >
                          {/* Left: Brand logo + label + created date */}
                          <div className="w-[260px] shrink-0 flex flex-col gap-1">
                            <BrandLogo card={card} />
                            {card.label && (
                              <Text className="!text-xs !text-[#0d2772] font-medium">
                                {card.label}
                              </Text>
                            )}
                            {card.historico && card.historico.length > 0 && (
                              <span
                                className="text-xs text-[rgba(0,0,0,0.45)] hover:text-[#0d2772] cursor-pointer inline-flex items-center gap-1"
                                onClick={(e) => { e.stopPropagation(); setHistoricoPagina(1); setHistoricoModal({ open: true, card }) }}
                              >
                                <HistoryOutlined />
                                Última edição: {card.historico[card.historico.length - 1].data.split(' ')[0]}
                              </span>
                            )}
                          </div>

                          {/* Middle: ID + Status */}
                          <div className="w-[200px] shrink-0 flex flex-col gap-1">
                            <Text
                              className="text-sm"
                              style={{
                                opacity: card.configured ? 1 : 0.35,
                              }}
                            >
                              ID: {card.pixelId}
                            </Text>
                            {card.configured ? (
                              <Tag color="success" className="!text-xs !w-fit !m-0">Ativo</Tag>
                            ) : (
                              <Tag className="!text-xs !w-fit !m-0 !text-[rgba(0,0,0,0.25)]">Não configurado</Tag>
                            )}
                          </div>

                          {/* Right: Products badge + actions */}
                          <div className="flex-1 flex items-center justify-end gap-3">
                            {card.produtosCount !== null && (
                              <Tag className="!border-[#d9d9d9] !bg-transparent !m-0">
                                {card.produtosCount} Produto(s) / Evento(s)
                              </Tag>
                            )}

                            {!card.configured && (
                              <Button
                                icon={<SettingOutlined />}
                                onClick={(e) => { e.stopPropagation(); handleConfigurar(card.providerKey) }}
                              >
                                Configurar
                              </Button>
                            )}

                            {card.configured && (
                              <Button
                                type="primary"
                                ghost
                                icon={<EyeOutlined />}
                                onClick={(e) => { e.stopPropagation(); onVerDetalhes(card.providerKey) }}
                              >
                                Ver detalhes
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'utm',
                  label: 'Criação de UTM',
                  children: (
                    <div className="py-12 text-center">
                      <Text type="secondary">
                        Em breve
                      </Text>
                    </div>
                  ),
                },
                {
                  key: 'encurtador',
                  label: 'Encurtador de URL',
                  children: (
                    <div className="py-12 text-center">
                      <Text type="secondary">
                        Em breve
                      </Text>
                    </div>
                  ),
                },
              ]}
            />
          </Content>
        </Layout>
      </Layout>
      <ConfigurarPixelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(config) => console.log('Pixel configurado:', config)}
        mode={modalMode}
      />

      <Modal
        open={historicoModal.open}
        onCancel={() => setHistoricoModal({ open: false, card: null })}
        footer={null}
        title={`Histórico de alterações — ${historicoModal.card?.label || historicoModal.card?.provider || ''}`}
        width={480}
      >
        {historicoModal.card?.historico && (() => {
          const todos = [...historicoModal.card.historico].reverse()
          const total = todos.length
          const inicio = (historicoPagina - 1) * HISTORICO_POR_PAGINA
          const paginados = todos.slice(inicio, inicio + HISTORICO_POR_PAGINA)

          return (
            <div className="flex flex-col gap-4">
              <div className="h-[400px] overflow-y-auto">
                <Timeline
                  className="!mt-6"
                  items={paginados.map((h) => ({
                    children: (
                      <div>
                        <Text className="!text-sm">{h.descricao}</Text>
                        <br />
                        <Text type="secondary" className="!text-xs">{h.data}</Text>
                      </div>
                    ),
                  }))}
                />
              </div>
              {total > HISTORICO_POR_PAGINA && (
                <div className="flex justify-center border-t border-[#f0f0f0] pt-3">
                  <Pagination
                    current={historicoPagina}
                    pageSize={HISTORICO_POR_PAGINA}
                    total={total}
                    onChange={(page) => setHistoricoPagina(page)}
                    size="small"
                    showTotal={(total) => <Text type="secondary" className="!text-xs">{total} alterações</Text>}
                  />
                </div>
              )}
            </div>
          )
        })()}
      </Modal>
    </ConfigProvider>
  )
}
