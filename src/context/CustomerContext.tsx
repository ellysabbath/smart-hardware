import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Mteja } from '../types'
import { wateja as watejaDemo } from '../data/demo'

interface CustomerCtx {
  wateja: Mteja[]
  ongezaMteja: (m: Omit<Mteja, 'id' | 'tareheSajili' | 'deni' | 'jumlaManunuzi' | 'active'>) => Mteja
  tafutaMteja: (q: string) => Mteja[]
  getMteja: (id: string) => Mteja | undefined
}

const CustomerContext = createContext<CustomerCtx | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [wateja, setWateja] = useState<Mteja[]>(watejaDemo)

  const ongezaMteja: CustomerCtx['ongezaMteja'] = (data) => {
    const mteja: Mteja = {
      ...data,
      id: `c${Date.now()}`,
      deni: 0,
      jumlaManunuzi: 0,
      tareheSajili: new Date().toISOString().split('T')[0],
      active: true,
    }
    setWateja((prev) => [mteja, ...prev])
    return mteja
  }

  const tafutaMteja = (q: string) => {
    const query = q.toLowerCase().trim()
    if (!query) return wateja
    return wateja.filter(
      (m) =>
        m.jina.toLowerCase().includes(query) ||
        m.simu.includes(query) ||
        m.aina.includes(query)
    )
  }

  const getMteja = (id: string) => wateja.find((m) => m.id === id)

  return (
    <CustomerContext.Provider value={{ wateja, ongezaMteja, tafutaMteja, getMteja }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider')
  return ctx
}