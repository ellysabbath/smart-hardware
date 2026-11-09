import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Order, Malipo, OrderItem } from '../types'

interface OrderCtx {
  orders: Order[]
  createOrder: (items: OrderItem[], total: number, malipo: Malipo[]) => Order
  getOrder: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderCtx | null>(null)

const MTEOA_DEMO = 'Mjenzi Mwakyusa'
const SIMU_DEMO = '0754-111-222'

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const createOrder = (
    items: OrderItem[],
    total: number,
    malipo: Malipo[]
  ): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      quotationId: `Q-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      mteja: MTEOA_DEMO,
      simu: SIMU_DEMO,
      bidhaa: items,
      jumla: total,
      malipo,
      hali: 'imekamilika',
      tarehe: new Date().toLocaleString('sw-TZ'),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const getOrder = (id: string) => orders.find((o) => o.id === id)

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}