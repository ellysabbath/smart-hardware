import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  MarekebishoStoki,
  AinaMarekebishoStoki,
  HaliMarekebisho,
} from '../types'

interface OngezaMarekebishoInput {
  bidhaaId: string
  jina: string
  sku: string
  uom: string
  kundi: string
  dukaId: string
  dukaJina: string
  aina: AinaMarekebishoStoki
  wingi: number
  beiUnunuzi: number
  sababu: string
  maelezo?: string
  pichaUrl?: string
  expiry?: string
  mtengenezaji?: string
  uzito?: string
  aliyeingiza: string
}

interface StokiCtx {
  marekebisho: MarekebishoStoki[]
  ongezaMarekebisho: (data: OngezaMarekebishoInput) => MarekebishoStoki
  thibitisha: (id: string) => void
  kataa: (id: string, maelezo?: string) => void
  futa: (id: string) => void
  getMarekebisho: (id: string) => MarekebishoStoki | undefined
}

const StokiContext = createContext<StokiCtx | null>(null)

const MAREKEBISHO_DEMO: MarekebishoStoki[] = [
  {
    id: 'ADJ-2026-001',
    bidhaaId: '2',
    jina: 'Saruji Twiga 50kg',
    sku: 'SAR-TWI-50',
    uom: 'Mfuko',
    kundi: 'Saruji',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'uharibifu',
    wingi: 5,
    beiUnunuzi: 15500,
    thamani: 77500,
    sababu: 'Saruji imekauka',
    maelezo: 'Saruji 5 zimekauka kwa sababu ya unyevu',
    expiry: '2027-01-20',
    mtengenezaji: 'Twiga',
    uzito: '50kg',
    aliyeingiza: 'Juma Hassan',
    tarehe: '2026-11-09',
    hali: 'imethibitishwa',
  },
  {
    id: 'ADJ-2026-002',
    bidhaaId: '5',
    jina: 'Mabati G30',
    sku: 'MAB-G30',
    uom: 'Mita',
    kundi: 'Mabati',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'mauzo',
    wingi: 32,
    beiUnunuzi: 28000,
    thamani: 896000,
    sababu: 'Mauzo ya leo',
    aliyeingiza: 'Juma Hassan',
    tarehe: '2026-11-10',
    hali: 'imethibitishwa',
  },
  {
    id: 'ADJ-2026-003',
    bidhaaId: '7',
    jina: 'Rangi Nyeupe 20L',
    sku: 'RAN-WH-20',
    uom: 'Lita',
    kundi: 'Rangi',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'expiry',
    wingi: 2,
    beiUnunuzi: 82000,
    thamani: 164000,
    sababu: 'Rangi imeisha muda',
    aliyeingiza: 'Asha Mwinyi',
    tarehe: '2026-11-08',
    hali: 'imethibitishwa',
  },
  {
    id: 'ADJ-2026-004',
    bidhaaId: '3',
    jina: 'Nondo D12',
    sku: 'NON-D12',
    uom: 'Kg',
    kundi: 'Nondo',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    aina: 'kurudisha_msambazaji',
    wingi: 200,
    beiUnunuzi: 2100,
    thamani: 420000,
    sababu: 'Nondo zilipinda',
    aliyeingiza: 'Peter John',
    tarehe: '2026-11-09',
    hali: 'inasubiri',
    maelezo: 'Zinarudishwa kwa Steel Masters',
  },
]

export function StokiProvider({ children }: { children: ReactNode }) {
  const [marekebisho, setMarekebisho] = useState<MarekebishoStoki[]>(MAREKEBISHO_DEMO)

  const ongezaMarekebisho: StokiCtx['ongezaMarekebisho'] = (data) => {
    const m: MarekebishoStoki = {
      ...data,
      id: `ADJ-${new Date().getFullYear()}-${String(marekebisho.length + 5).padStart(3, '0')}`,
      thamani: data.wingi * data.beiUnunuzi,
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
    } as MarekebishoStoki
    setMarekebisho((prev) => [m, ...prev])
    return m
  }

  const thibitisha = (id: string) => {
    setMarekebisho((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, hali: 'imethibitishwa' as HaliMarekebisho } : m
      )
    )
  }

  const kataa = (id: string, maelezo?: string) => {
    setMarekebisho((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, hali: 'imekataliwa' as HaliMarekebisho, maelezo: maelezo || m.maelezo }
          : m
      )
    )
  }

  const futa = (id: string) => {
    setMarekebisho((prev) => prev.filter((m) => m.id !== id))
  }

  const getMarekebisho = (id: string) => marekebisho.find((m) => m.id === id)

  return (
    <StokiContext.Provider
      value={{ marekebisho, ongezaMarekebisho, thibitisha, kataa, futa, getMarekebisho }}
    >
      {children}
    </StokiContext.Provider>
  )
}

export function useStoki() {
  const ctx = useContext(StokiContext)
  if (!ctx) throw new Error('useStoki must be used within StokiProvider')
  return ctx
}