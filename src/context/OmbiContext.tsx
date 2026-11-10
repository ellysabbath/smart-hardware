import { createContext, useContext, useState, type ReactNode } from 'react'
import type { OmbiMatumizi, HaliOmbi } from '../types'
import { maombiMatumizi as maombiDemo } from '../data/demo'

interface OngezaOmbiInput {
  aina: string
  kiasi: number
  maelezo: string
  simu: string
  sababu: string
  risitiUrl?: string
  aliyeomba: string
  duka: string
}

interface OmbiCtx {
  maombi: OmbiMatumizi[]
  ongezaOmbi: (data: OngezaOmbiInput) => OmbiMatumizi
  idhinisha: (id: string, maoni?: string) => void
  kataa: (id: string, maoni: string) => void
  futa: (id: string) => void
  hariri: (id: string, patch: Partial<OmbiMatumizi>) => void
  getOmbi: (id: string) => OmbiMatumizi | undefined
}

const OmbiContext = createContext<OmbiCtx | null>(null)

const MMILIKI = 'Moses Kimaro'

export function OmbiProvider({ children }: { children: ReactNode }) {
  const [maombi, setMaombi] = useState<OmbiMatumizi[]>(maombiDemo)

  const ongezaOmbi: OmbiCtx['ongezaOmbi'] = (data) => {
    const ombi: OmbiMatumizi = {
      ...data,
      id: `EXP-${new Date().getFullYear()}-${String(maombi.length + 1).padStart(3, '0')}`,
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
    }
    setMaombi((prev) => [ombi, ...prev])
    return ombi
  }

  const idhinisha = (id: string, maoni?: string) => {
    setMaombi((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              hali: 'imekubaliwa' as HaliOmbi,
              maoni,
              aliyeidhinisha: MMILIKI,
              tareheIdhini: new Date().toISOString().split('T')[0],
            }
          : m
      )
    )
  }

  const kataa = (id: string, maoni: string) => {
    setMaombi((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              hali: 'imekataliwa' as HaliOmbi,
              maoni,
              aliyeidhinisha: MMILIKI,
              tareheIdhini: new Date().toISOString().split('T')[0],
            }
          : m
      )
    )
  }

  const futa = (id: string) => {
    setMaombi((prev) => prev.filter((m) => m.id !== id))
  }

  const hariri = (id: string, patch: Partial<OmbiMatumizi>) => {
    setMaombi((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    )
  }

  const getOmbi = (id: string) => maombi.find((m) => m.id === id)

  return (
    <OmbiContext.Provider
      value={{ maombi, ongezaOmbi, idhinisha, kataa, futa, hariri, getOmbi }}
    >
      {children}
    </OmbiContext.Provider>
  )
}

export function useMaombi() {
  const ctx = useContext(OmbiContext)
  if (!ctx) throw new Error('useMaombi must be used within OmbiProvider')
  return ctx
}