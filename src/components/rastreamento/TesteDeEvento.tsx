import { useRef, useState } from 'react'
import {
  Breadcrumb,
  Button,
  Input,
  Layout,
  Menu,
  Tag,
  Typography,
} from 'antd'
import { Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { EduzzLogo, CheckoutSunLogo } from '../Logos'

const { Sider, Content } = Layout


type HistoricoItem = {
  evento: string
  origem: string
  dataHora: string
  status: 'success' | 'error'
}

const eventos = [
  { tag: 'PageView', descricao: 'Quando o comprador acessa a página do checkout' },
  { tag: 'FormInteraction', descricao: 'Ao preencher nome, e-mail ou outro campo inicial' },
  { tag: 'Lead', descricao: 'Ao preencher nome, email e telefone' },
  { tag: 'AddPaymentInfo', descricao: 'Ao interagir com formas de pagamento' },
  { tag: 'Purchase', descricao: 'Quando o pagamento é confirmado' },
  { tag: 'ViewBoleto', descricao: 'Quando o boleto gerado for visualizado' },
]

interface TesteDeEventoProps {
  produtoId?: number
  produtoNome?: string
  onVoltar?: () => void
}

export default function TesteDeEvento({ produtoId, produtoNome, onVoltar }: TesteDeEventoProps) {
  const [logs, setLogs] = useState<HistoricoItem[]>([])
  const [codigoTeste, setCodigoTeste] = useState('')
  const tabelaRef = useRef<HTMLDivElement>(null)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)

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
    setHighlightIndex(0)
    setTimeout(() => {
      const el = tabelaRef.current
      if (!el) return
      // Tenta todos os possíveis containers de scroll
      el.scrollIntoView({ behavior: 'smooth', block: 'end' })
      // Fallback: encontra o container com scroll e scrolla manualmente
      let parent = el.parentElement
      while (parent) {
        const style = getComputedStyle(parent)
        if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
          const elTop = el.getBoundingClientRect().top - parent.getBoundingClientRect().top + parent.scrollTop
          parent.scrollTo({ top: elTop - 80, behavior: 'smooth' })
          break
        }
        parent = parent.parentElement
      }
      // Fallback final: window
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' })
    }, 50)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const handleLimpar = () => {
    setLogs([])
  }

  const sucessos = logs.filter((l) => l.status === 'success').length
  const erros = logs.filter((l) => l.status === 'error').length

  const getOrigemTag = (origem: string) => {
    if (origem === 'Navegador') {
      return <Tag color="cyan">Pixel</Tag>
    }
    return <Tag color="purple">API</Tag>
  }

  return (
    <Layout className="min-h-screen bg-(--ant-color-bg-container)">
      {/* Header */}
      <div className="h-[78px] bg-(--ant-color-fill-quaternary) flex items-center justify-center border-b border-(--ant-color-split)">
        <EduzzLogo />
      </div>

      <Layout>
        {/* Sidebar */}
        <Sider theme="light" width={288} className="border-r border-(--ant-color-split)">
          <div className="px-4 py-2.5">
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
        <Content className="p-8 bg-white flex flex-col gap-8 min-w-0">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { title: <Home size={14} /> },
              { title: 'Checkout Sun' },
              { title: 'Rastreamento' },
              { title: 'Teste de evento' },
            ]}
          />

          {/* Back button */}
          <div>
            <Button icon={<ChevronLeft size={14} />} onClick={onVoltar}>Voltar</Button>
          </div>

          {/* Title */}
          <div>
            <Typography.Title level={3} className="mb-1">
              Teste de evento {produtoNome ? `- ${produtoId} - ${produtoNome}` : ''}
            </Typography.Title>
            <Typography.Text type="secondary">
              Envie um evento de teste sem realizar uma compra real e confira no histórico abaixo.
            </Typography.Text>
          </div>

          {/* Código de teste da Meta */}
          <div className="bg-(--ant-color-fill-quaternary) border border-(--ant-color-border) rounded-lg p-6 flex flex-col gap-3">
            <Typography.Text strong >Código de teste da Meta</Typography.Text>
            <Typography.Text type="secondary">
              Copie o código de teste do Gerenciador da Meta e cole aqui. O botão &quot;testar&quot; ficará disponível após o preenchimento. O código será enviado como parâmetro no link do checkout para que a Meta identifique o evento como teste.
            </Typography.Text>
            <Input
              placeholder="Cole o código de teste da Meta aqui (ex: TESTE1234)"
              value={codigoTeste}
              onChange={(e) => setCodigoTeste(e.target.value)}
              className="max-w-[480px]"
            />
          </div>

          {/* Event cards */}
          <div className={`flex flex-col gap-4 ${!codigoTeste ? 'opacity-50 pointer-events-none' : ''}`}>
            {!codigoTeste && (
              <div className="flex items-center gap-2 px-4 py-3 bg-(--ant-color-warning-bg) border border-(--ant-color-warning-border) rounded-lg">
                <Typography.Text className="!text-(--ant-color-warning-text)">
                  Insira o código de teste acima para habilitar os botões de teste.
                </Typography.Text>
              </div>
            )}
            {Array.from({ length: Math.ceil(eventos.length / 2) }, (_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {eventos.slice(rowIndex * 2, rowIndex * 2 + 2).map((ev) => (
                  <div
                    key={ev.tag}
                    className="flex-1 bg-white border border-(--ant-color-border) rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <Tag className="py-2 text-sm">{ev.tag}</Tag>
                      <Button
                        type="text"
                        icon={<ChevronRight size={14} />}
                        onClick={() => handleTestar(ev.tag)}
                        disabled={!codigoTeste}
                        className="text-(--ant-color-text-secondary)"
                      >
                        Testar
                      </Button>
                    </div>
                    <Typography.Text>{ev.descricao}</Typography.Text>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary bar */}
          <div className="border border-(--ant-color-border) rounded-lg px-2 py-4 flex items-center justify-end gap-6 bg-white">
            <Typography.Text type="secondary">Últimos 30 minutos</Typography.Text>
            <Tag>{logs.length} evento(s)</Tag>
            <Tag color="success">{sucessos} sucesso(s)</Tag>
            <Tag color="error">{erros} erro(s)</Tag>
            <Button onClick={handleLimpar}>Limpar</Button>
          </div>

          {/* History table */}
          <div id="tabela-resultados" ref={tabelaRef} className="border border-(--ant-color-split) rounded-lg overflow-hidden bg-white">
            {/* Table header */}
            <div className="flex bg-[rgba(0,0,0,0.02)] border-b border-(--ant-color-split)">
              <div className="flex-[2] px-4 h-[46px] flex items-center border-r border-(--ant-color-split)">
                <Typography.Text strong >Evento</Typography.Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center border-r border-(--ant-color-split)">
                <Typography.Text strong >Origem</Typography.Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center border-r border-(--ant-color-split)">
                <Typography.Text strong >Data e hora</Typography.Text>
              </div>
              <div className="flex-1 px-4 h-[46px] flex items-center justify-center">
                <Typography.Text strong >Status</Typography.Text>
              </div>
            </div>

            {/* Table rows */}
            {logs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Typography.Text type="secondary">Nenhum evento registrado.</Typography.Text>
              </div>
            ) : (
              logs.map((item, i) => (
                <div
                  key={i}
                  className={`flex border-b border-(--ant-color-split) h-16 items-center transition-colors duration-700 ${i === highlightIndex ? 'bg-(--ant-color-info-bg)' : ''}`}
                >
                  <div className="flex-[2] px-4">
                    <Tag>{item.evento}</Tag>
                  </div>
                  <div className="flex-1 px-4 flex justify-center">
                    {getOrigemTag(item.origem)}
                  </div>
                  <div className="flex-1 px-4 text-center">
                    <Typography.Text>{item.dataHora}</Typography.Text>
                  </div>
                  <div className="flex-1 px-4 flex justify-center">
                    {item.status === 'success' ? (
                      <Tag color="success">Sucesso</Tag>
                    ) : (
                      <Tag color="error">Não enviado</Tag>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
