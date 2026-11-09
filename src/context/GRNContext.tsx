import { createContext, useContext, useState, type ReactNode } from 'react'
import type { GRN, GRNItem, HaliGRN } from '../types'
import { grnList as grnDemo } from '../data/demo'

interface GRNCtx {
  grns: GRN[]
  ongezaGRN: (grn: Omit<GRN, 'id' | 'aliyeingiza'>) => GRN
  pokeaBidhaa: (id: string, items: GRNItem[]) => void
  getGRN: (id: string) => GRN | undefined
}

const GRNContext = createContext<GRNCtx | null>(null)

const ALIYEINGIZA = 'Juma Hassan'

function hesabuHali(items: GRNItem[]): HaliGRN {
  const zote = items.every((i) => i.iliyopokelewa >= i.iliyoagizwa)
  const hakuna = items.every((i) => i.iliyopokelewa === 0)
  if (hakuna) return 'inasubiri'
  if (zote) return 'imepokelewa'
  return 'upungufu'
}

export function GRNProvider({ children }: { children: ReactNode }) {
  const [grns, setGrns] = useState<GRN[]>(grnDemo)

  const ongezaGRN: GRNCtx['ongezaGRN'] = (data) => {
    const grn: GRN = {
      ...data,
      id: `GRN-${new Date().getFullYear()}-${String(grns.length + 48).padStart(3, '0')}`,
      aliyeingiza: ALIYEINGIZA,
      hali: hesabuHali(data.bidhaa),
    }
    setGrns((prev) => [grn, ...prev])
    return grn
  }

  const pokeaBidhaa = (id: string, items: GRNItem[]) => {
    setGrns((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, bidhaa: items, hali: hesabuHali(items) }
          : g
      )
    )
  }

  const getGRN = (id: string) => grns.find((g) => g.id === id)

  return (
    <GRNContext.Provider value={{ grns, ongezaGRN, pokeaBidhaa, getGRN }}>
      {children}
    </GRNContext.Provider>
  )
}

export function useGRN() {
  const ctx = useContext(GRNContext)
  if (!ctx) throw new Error('useGRN must be used within GRNProvider')
  return ctx
}