import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PendingCart } from '../types'
import { pendingCarts as cartsDemo } from '../data/demo'

interface PendingCartCtx {
  carts: PendingCart[]
  tumaNotify: (id: string) => void
  kamilisha: (id: string) => void
  getCart: (id: string) => PendingCart | undefined
}

const PendingCartContext = createContext<PendingCartCtx | null>(null)

export function PendingCartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<PendingCart[]>(cartsDemo)

  const tumaNotify = (id: string) => {
    setCarts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, imetumwa: true } : c))
    )
  }

  const kamilisha = (id: string) => {
    setCarts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, aina: 'imekamilika', imelipwa: c.jumla }
          : c
      )
    )
  }

  const getCart = (id: string) => carts.find((c) => c.id === id)

  return (
    <PendingCartContext.Provider value={{ carts, tumaNotify, kamilisha, getCart }}>
      {children}
    </PendingCartContext.Provider>
  )
}

export function usePendingCarts() {
  const ctx = useContext(PendingCartContext)
  if (!ctx) throw new Error('usePendingCarts must be used within PendingCartProvider')
  return ctx
}