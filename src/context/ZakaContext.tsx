import { createContext, useContext, useState, type ReactNode } from 'react'
import type { MalipoZaka } from '../types'

interface ZakaCtx {
  malipo: MalipoZaka[]
  rekodiMalipo: (data: Omit<MalipoZaka, 'id'>) => MalipoZaka
  futaMalipo: (id: string) => void
}

const ZakaContext = createContext<ZakaCtx | null>(null)

const MALIPO_DEMO: MalipoZaka[] = [
  {
    id: 'ZAKA-001',
    tarehe: '2026-11-08',
    kiasi: 50000,
    aina: 'zaka',
    risiti: 'RIS-001',
    maelezo: 'Zaka ya wiki iliyopita',
  },
]

export function ZakaProvider({ children }: { children: ReactNode }) {
  const [malipo, setMalipo] = useState<MalipoZaka[]>(MALIPO_DEMO)

  const rekodiMalipo: ZakaCtx['rekodiMalipo'] = (data) => {
    const m: MalipoZaka = {
      ...data,
      id: `ZAKA-${Date.now()}`,
    }
    setMalipo((prev) => [m, ...prev])
    return m
  }

  const futaMalipo = (id: string) => {
    setMalipo((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <ZakaContext.Provider value={{ malipo, rekodiMalipo, futaMalipo }}>
      {children}
    </ZakaContext.Provider>
  )
}

export function useZaka() {
  const ctx = useContext(ZakaContext)
  if (!ctx) throw new Error('useZaka must be used within ZakaProvider')
  return ctx
}