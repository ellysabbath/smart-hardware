import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { useStore } from '../store/StoreContext'
import type { KundiBidhaa } from '../types'

export interface CartLine {
  id: string
  wingi: number
}

export interface CartDetailedLine {
  id: string
  jina: string
  sku: string
  uom: string
  bei: number
  wingi: number
  jumla: number
  stoki: number
  iconKey?: KundiBidhaa
  pichaUrl?: string
}

interface CartCtx {
  lines: CartLine[]
  detailed: CartDetailedLine[]
  count: number
  total: number
  add: (id: string, wingi?: number) => void
  remove: (id: string) => void
  setWingi: (id: string, wingi: number) => void
  inc: (id: string) => void
  dec: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { bidhaa } = useStore()
  const [lines, setLines] = useState<CartLine[]>([])

  const add = (id: string, wingi = 1) => {
    setLines((prev) => {
      const ex = prev.find((x) => x.id === id)
      if (ex) return prev.map((x) => (x.id === id ? { ...x, wingi: x.wingi + wingi } : x))
      return [...prev, { id, wingi }]
    })
  }

  const remove = (id: string) => setLines((prev) => prev.filter((x) => x.id !== id))

  const setWingi = (id: string, wingi: number) => {
    if (wingi <= 0) return remove(id)
    setLines((prev) => prev.map((x) => (x.id === id ? { ...x, wingi } : x)))
  }

  const inc = (id: string) =>
    setLines((prev) => prev.map((x) => (x.id === id ? { ...x, wingi: x.wingi + 1 } : x)))

  const dec = (id: string) =>
    setLines((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, wingi: x.wingi - 1 } : x))
        .filter((x) => x.wingi > 0)
    )

  const clear = () => setLines([])

  // ✅ Sasisha detailed kutoka bidhaa halisi (useStore)
  const detailed = useMemo<CartDetailedLine[]>(() => {
    const result: CartDetailedLine[] = []
    for (const l of lines) {
      const b = bidhaa.find((x) => x.id === l.id)
      if (!b) continue
      result.push({
        id: b.id,
        jina: b.jina,
        sku: b.sku,
        uom: b.uom,
        bei: b.beiMauzo,
        wingi: l.wingi,
        jumla: b.beiMauzo * l.wingi,
        stoki: b.stoki,
        iconKey: b.iconKey,
        pichaUrl: b.pichaUrl,
      })
    }
    return result
  }, [lines, bidhaa])

  const count = useMemo(() => detailed.reduce((s, l) => s + l.wingi, 0), [detailed])
  const total = useMemo(() => detailed.reduce((s, l) => s + l.jumla, 0), [detailed])

  const value: CartCtx = {
    lines, detailed, count, total,
    add, remove, setWingi, inc, dec, clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}