import type { ReactNode } from 'react'
import { Typography } from 'antd'

/**
 * Barra fixa no rodapé com controles de demo (não fazem parte da UI).
 * Usada para alternar estados visuais durante apresentação e handoff.
 * z-index alto (9999) fica acima do Modal/Drawer do antd (1000).
 */
export default function DemoBar({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="fixed bottom-0 left-0 right-0 border-t-2 border-dashed border-slate-300 bg-slate-50 px-8 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      style={{ zIndex: 9999 }}
    >
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center gap-x-6 gap-y-2">
        <Typography.Text
          type="secondary"
          className="text-[10px] uppercase tracking-wider font-semibold"
        >
          ⚙️ Demo (fora da UI):
        </Typography.Text>
        {children}
      </div>
    </div>
  )
}
