import { createContext, useContext, useState, type ReactNode } from 'react'
import type { OmbiMatumizi, HaliOmbi } from '../types'
import { maombiMatumizi as maombiDemo } from '../data/demo'

interface OmbiCtx {
  maombi: OmbiMatumizi[]
  ongezaOmbi: (data: Omit<OmbiMatumizi, 'id' | 'tarehe' | 'hali' | 'aliyeomba' | 'duka'>) => OmbiMatumizi
  idhinisha: (id: string, hali: HaliOmbi, maoni?: string) => void
  getOmbi: (id: string) => OmbiMatumizi | undefined
}

const OmbiContext = createContext<OmbiCtx | null>(null)

const MTUMIAJI_DEMO = 'Juma Hassan'
const DUKA_DEMO = 'Kwembe'

export function OmbiProvider({ children }: { children: ReactNode }) {
  const [maombi, setMaombi] = useState<OmbiMatumizi[]>(maombiDemo)

  const ongezaOmbi: OmbiCtx['ongezaOmbi'] = (data) => {
    const ombi: OmbiMatumizi = {
      ...data,
      id: `EXP-${new Date().getFullYear()}-${String(maombi.length + 1).padStart(3, '0')}`,
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
      aliyeomba: MTUMIAJI_DEMO,
      duka: DUKA_DEMO,
    }
    setMaombi((prev) => [ombi, ...prev])
    return ombi
  }

  const idhinisha = (id: string, hali: HaliOmbi, maoni?: string) => {
    setMaombi((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              hali,
              maoni,
              aliyeidhinisha: 'Moses Kimaro',
              tareheIdhini: new Date().toISOString().split('T')[0],
            }
          : m
      )
    )
  }

  const getOmbi = (id: string) => maombi.find((m) => m.id === id)

  return (
    <OmbiContext.Provider value={{ maombi, ongezaOmbi, idhinisha, getOmbi }}>
      {children}
    </OmbiContext.Provider>
  )
}

export function useMaombi() {
  const ctx = useContext(OmbiContext)
  if (!ctx) throw new Error('useMaombi must be used within OmbiProvider')
  return ctx
}