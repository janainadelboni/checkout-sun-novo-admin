import { useState } from 'react'
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Tag,
  Typography,
} from 'antd'
import {
  HomeOutlined,
  LeftOutlined,
  CaretRightOutlined,
} from '@ant-design/icons'

const { Sider, Content } = Layout
const { Title, Text } = Typography

type HistoricoItem = {
  evento: string
  origem: string
  dataHora: string
  status: 'success' | 'error'
}

const historico: HistoricoItem[] = [
  { evento: 'Pageview', origem: 'Navegador', dataHora: '11/03/2026 às 12:45', status: 'success' },
  { evento: 'Pageview', origem: 'Celular', dataHora: '11/03/2026 às 11:45', status: 'error' },
  { evento: 'Pageview', origem: 'Tablet', dataHora: '11/03/2026 às 10:45', status: 'success' },
  { evento: 'Pageview', origem: 'Navegador', dataHora: '11/03/2026 às 09:56', status: 'success' },
]

const eventos = [
  { tag: 'Pageview', descricao: 'Comprador acessou a página de checkout' },
  { tag: 'FormInteraction', descricao: 'Preencheu o formulário de primeiro nome' },
  { tag: 'Lead', descricao: 'Preenchimento do formulário de nome, email e documento' },
  { tag: 'AddPaymentInfo', descricao: 'Interação com formas de pagamento' },
  { tag: 'InitiateCheckout', descricao: 'Clicou no botão de pagar' },
  { tag: 'Purchase', descricao: 'Pagamento confirmado' },
]

export default function TesteDeEvento() {
  const [logs, setLogs] = useState<HistoricoItem[]>(historico)

  const handleTestar = (tag: string) => {
    const novoLog: HistoricoItem = {
      evento: tag,
      origem: 'Navegador',
      dataHora: new Date()
        .toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', ' às'),
      status: 'success',
    }
    setLogs((prev) => [novoLog, ...prev])
  }

  const handleLimpar = () => {
    setLogs([])
  }

  const sucessos = logs.filter((l) => l.status === 'success').length
  const erros = logs.filter((l) => l.status === 'error').length

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0d2772' } }}>
    <Layout className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-[78px] bg-[#fafafa] flex items-center justify-center border-b border-[rgba(0,0,0,0.06)]">
        <img
          src="https://www.figma.com/api/mcp/asset/f3a95eae-e8e0-48cc-b54d-388ec81eb3a7"
          alt="Eduzz"
          className="h-[30px]"
        />
      </div>

      <Layout>
        {/* Sidebar */}
        <Sider width={288} className="!bg-white border-r border-[rgba(0,0,0,0.06)]">
          <div className="px-4 py-[10px]">
            <img
              src="https://www.figma.com/api/mcp/asset/e045d090-b979-4ee3-b74b-c1986d859fce"
              alt="Checkout Sun"
              className="h-[25px]"
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={['monitoramento']}
            className="border-none"
            items={[
              { key: 'visao-geral', label: 'Visão geral' },
              { key: 'produtos', label: 'Produtos' },
              { key: 'monitoramento', label: 'Monitoramento' },
            ]}
          />
        </Sider>

        {/* Main Content */}
        <Content className="p-8 bg-white flex flex-col gap-8 min-w-0">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { title: <HomeOutlined /> },
              { title: 'Breadcrumb Link' },
              { title: 'Breadcrumb Link' },
              { title: 'Breadcrumb Link' },
            ]}
          />

          {/* Back button */}
          <div>
            <Button icon={<LeftOutlined />}>Voltar</Button>
          </div>

          {/* Title */}
          <div>
            <Title level={3} className="!mb-1">Teste de evento</Title>
            <Text type="secondary">
              Envie um evento de teste sem realizar uma compra real e confira no histórico abaixo.
            </Text>
          </div>

          {/* Event cards */}
          <div className="flex flex-col gap-4 ">
            {Array.from({ length: Math.ceil(eventos.length / 2) }, (_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {eventos.slice(rowIndex * 2, rowIndex * 2 + 2).map((ev) => (
                  <div
                    key={ev.tag}
                    className="flex-1 bg-white border border-[#d9d9d9] rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <Tag className="py-[7px] text-sm">{ev.tag}</Tag>
                      <Button
                        type="text"
                        icon={<CaretRightOutlined />}
                        onClick={() => handleTestar(ev.tag)}
                        className="text-[rgba(0,0,0,0.65)]"
                      >
                        Testar
                      </Button>
                    </div>
                    <Text>{ev.descricao}</Text>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary bar */}
          <div className=" border border-[#d9d9d9] rounded-lg px-2 py-4 flex items-center justify-end gap-6 bg-white">
            <Text type="secondary">Últimos 30 minutos</Text>
            <Tag>{logs.length} evento(s)</Tag>
            <Tag color="success">{sucessos} sucesso(s)</Tag>
            <Tag color="error">{erros} erro(s)</Tag>
            <Button onClick={handleLimpar}>Limpar</Button>
          </div>

          {/* History table */}
          <div className=" border border-[#f0f0f0] rounded-lg overflow-hidden bg-white">
            {/* Table header */}
            <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <div className="flex-[2] px-4 h-[46px] flex items-center border-r border-[#f0f0f0]">
                <Text strong className="text-sm">Histórico de envios</Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center border-r border-[#f0f0f0]">
                <Text strong className="text-sm">Origem</Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center border-r border-[#f0f0f0]">
                <Text strong className="text-sm">Data e hora</Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center">
                <Text strong className="text-sm">Status</Text>
              </div>
            </div>

            {/* Table rows */}
            {logs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Text type="secondary">Nenhum evento registrado.</Text>
              </div>
            ) : (
              logs.map((item, i) => (
                <div
                  key={i}
                  className="flex border-b border-[#f0f0f0] h-16 items-center"
                >
                  <div className="flex-[2] px-4">
                    <Tag>{item.evento}</Tag>
                  </div>
                  <div className="flex-1 px-4 text-center">
                    <Text>{item.origem}</Text>
                  </div>
                  <div className="flex-1 px-4 text-center">
                    <Text>{item.dataHora}</Text>
                  </div>
                  <div className="flex-1 px-4 flex justify-center">
                    {item.status === 'success' ? (
                      <Tag color="success">Success</Tag>
                    ) : (
                      <Tag color="error">Error</Tag>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
  )
}
