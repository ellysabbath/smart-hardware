import { createContext, useContext, useState, type ReactNode } from 'react'
import type { OrderAdmin, HaliOrderAdmin } from '../types'
import { ordersAdmin as ordersDemo } from '../data/demo'

interface OrderAdminCtx {
  orders: OrderAdmin[]
  badilishaHali: (id: string, hali: HaliOrderAdmin) => void
  thibitishaMalipo: (orderId: string, malipoId: string) => void
  futa: (id: string) => void
  getOrder: (id: string) => OrderAdmin | undefined
}

const OrderAdminContext = createContext<OrderAdminCtx | null>(null)

export function OrderAdminProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderAdmin[]>(ordersDemo)

  const badilishaHali = (id: string, hali: HaliOrderAdmin) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, hali } : o)))
  }

  const thibitishaMalipo = (orderId: string, malipoId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        return {
          ...o,
          malipo: o.malipo.map((m) =>
            m.id === malipoId ? { ...m, hali: 'imethibitishwa' } : m
          ),
        }
      })
    )
  }

  const futa = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const getOrder = (id: string) => orders.find((o) => o.id === id)

  return (
    <OrderAdminContext.Provider
      value={{ orders, badilishaHali, thibitishaMalipo, futa, getOrder }}
    >
      {children}
    </OrderAdminContext.Provider>
  )
}

export function useOrderAdmin() {
  const ctx = useContext(OrderAdminContext)
  if (!ctx) throw new Error('useOrderAdmin must be used within OrderAdminProvider')
  return ctx
}