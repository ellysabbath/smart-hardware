import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  RipotiBidhaa,
  AinaRipotiBidhaa,
  HaliRipoti,
} from '../types'
import { ripotiBidhaa as ripotiDemo } from '../data/demo'

interface OngezaRipotiInput {
  bidhaaId: string
  jina: string
  sku: string
  uom: string
  kundi: string
  dukaId: string
  dukaJina: string
  aina: AinaRipotiBidhaa
  wingi: number
  beiUnunuzi: number
  sababu: string
  maelezo?: string
  pichaUrl?: string
  expiry?: string
  mtengenezaji?: string
  uzito?: string
}

interface RipotiBidhaaCtx {
  ripoti: RipotiBidhaa[]
  ongezaRipoti: (data: OngezaRipotiInput) => RipotiBidhaa
  thibitisha: (id: string) => void
  kataa: (id: string, maelezo?: string) => void
  futa: (id: string) => void
  getRipoti: (id: string) => RipotiBidhaa | undefined
}

const RipotiBidhaaContext = createContext<RipotiBidhaaCtx | null>(null)

const ALIYEINGIZA = 'Juma Hassan'
const DUKA_ID = 'd1'
const DUKA_JINA = 'Smart Hardware - Kwembe'

export function RipotiBidhaaProvider({ children }: { children: ReactNode }) {
  const [ripoti, setRipoti] = useState<RipotiBidhaa[]>(ripotiDemo)

  const ongezaRipoti: RipotiBidhaaCtx['ongezaRipoti'] = (data) => {
    const r: RipotiBidhaa = {
      ...data,
      id: `RIP-${new Date().getFullYear()}-${String(ripoti.length + 5).padStart(3, '0')}`,
      thamani: data.wingi * data.beiUnunuzi,
      aliyeingiza: ALIYEINGIZA,
      dukaId: DUKA_ID,
      dukaJina: DUKA_JINA,
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
    } as RipotiBidhaa
    setRipoti((prev) => [r, ...prev])
    return r
  }

  const thibitisha = (id: string) => {
    setRipoti((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hali: 'imethibitishwa' as HaliRipoti } : r))
    )
  }

  const kataa = (id: string, maelezo?: string) => {
    setRipoti((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, hali: 'imekataliwa' as HaliRipoti, maelezo: maelezo || r.maelezo }
          : r
      )
    )
  }

  const futa = (id: string) => {
    setRipoti((prev) => prev.filter((r) => r.id !== id))
  }

  const getRipoti = (id: string) => ripoti.find((r) => r.id === id)

  return (
    <RipotiBidhaaContext.Provider
      value={{ ripoti, ongezaRipoti, thibitisha, kataa, futa, getRipoti }}
    >
      {children}
    </RipotiBidhaaContext.Provider>
  )
}

export function useRipotiBidhaa() {
  const ctx = useContext(RipotiBidhaaContext)
  if (!ctx) throw new Error('useRipotiBidhaa must be used within RipotiBidhaaProvider')
  return ctx
}