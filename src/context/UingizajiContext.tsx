import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  UingizajiVifaa,
  BidhaaMpya,
  AinaUingizaji,
  HaliUingizaji,
} from '../types'
import { uingizajiVifaa as uingizajiDemo } from '../data/demo'

// ============================================================
// Input ya kuongeza uingizaji mpya
// ============================================================
interface OngezaInput {
  aina: AinaUingizaji
  dukaId: string
  dukaJina: string
  bidhaa: BidhaaMpya[]
  aliyeingiza: string
  nafasi: 'mmiliki' | 'admin'
  maelezo?: string
}

interface UingizajiCtx {
  uingizaji: UingizajiVifaa[]
  ongezaUingizaji: (data: OngezaInput) => UingizajiVifaa
  pokea: (id: string, aliyepokea: string) => void
  kataa: (id: string, aliyepokea: string, maelezo?: string) => void
  getUingizaji: (id: string) => UingizajiVifaa | undefined
}

const UingizajiContext = createContext<UingizajiCtx | null>(null)

export function UingizajiProvider({ children }: { children: ReactNode }) {
  const [uingizaji, setUingizaji] = useState<UingizajiVifaa[]>(uingizajiDemo)

  const ongezaUingizaji: UingizajiCtx['ongezaUingizaji'] = (data) => {
    const jumlaBidhaa = data.bidhaa.reduce((s, b) => s + b.stoki, 0)
    const jumlaThamani = data.bidhaa.reduce((s, b) => s + b.stoki * b.beiUnunuzi, 0)

    const u: UingizajiVifaa = {
      id: `INP-${new Date().getFullYear()}-${String(uingizaji.length + 1).padStart(3, '0')}`,
      aina: data.aina,
      dukaId: data.dukaId,
      dukaJina: data.dukaJina,
      bidhaa: data.bidhaa,
      jumlaBidhaa,
      jumlaThamani,
      aliyeingiza: data.aliyeingiza,
      nafasi: data.nafasi,
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
      maelezo: data.maelezo,
    }
    setUingizaji((prev) => [u, ...prev])
    return u
  }

  const pokea = (id: string, aliyepokea: string) => {
    setUingizaji((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              hali: 'imepokelewa' as HaliUingizaji,
              aliyepokea,
              tareheKupokea: new Date().toISOString().split('T')[0],
            }
          : u
      )
    )
  }

  const kataa = (id: string, aliyepokea: string, maelezo?: string) => {
    setUingizaji((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              hali: 'imekataliwa' as HaliUingizaji,
              aliyepokea,
              tareheKupokea: new Date().toISOString().split('T')[0],
              maelezo: maelezo || u.maelezo,
            }
          : u
      )
    )
  }

  const getUingizaji = (id: string) => uingizaji.find((u) => u.id === id)

  return (
    <UingizajiContext.Provider value={{ uingizaji, ongezaUingizaji, pokea, kataa, getUingizaji }}>
      {children}
    </UingizajiContext.Provider>
  )
}

export function useUingizaji() {
  const ctx = useContext(UingizajiContext)
  if (!ctx) throw new Error('useUingizaji must be used within UingizajiProvider')
  return ctx
}