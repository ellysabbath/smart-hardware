import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import * as T from '../types'
import { load, save, KEYS } from '../lib/storage'
import { seedProducts, seedSuppliers, seedCustomers, seedExpenses } from '../lib/seed'
import { uid, now, today } from '../lib/utils'
import { useAuth } from './AuthContext'

interface DataCtx {
  products: T.Product[]
  suppliers: T.Supplier[]
  customers: T.Customer[]
  sales: T.Sale[]
  quotations: T.Quotation[]
  purchases: T.Purchase[]
  grns: T.GRN[]
  expenses: T.Expense[]
  audit: T.AuditLog[]
  zakat: T.ZakatRecord[]
  returns: T.ReturnRecord[]
  stockMovements: T.StockMovement[]

  addProduct: (p: Omit<T.Product, 'id' | 'createdAt'>) => void
  updateProduct: (p: T.Product) => void
  deleteProduct: (id: string) => void
  adjustStock: (id: string, delta: number, type: T.StockMovement['type'], note?: string, toLocation?: string) => void

  addSupplier: (s: Omit<T.Supplier, 'id'>) => void
  addCustomer: (c: Omit<T.Customer, 'id' | 'createdAt'>) => void
  updateCustomer: (c: T.Customer) => void

  addSale: (s: Omit<T.Sale, 'id' | 'createdAt' | 'receiptNo'>) => T.Sale
  addQuotation: (q: Omit<T.Quotation, 'id' | 'createdAt' | 'quotationNo'>) => T.Quotation
  convertQuotation: (q: T.Quotation) => T.Sale
  returnSale: (saleId: string, items: { productId: string; qty: number }[]) => void

  addPurchase: (p: Omit<T.Purchase, 'id' | 'createdAt' | 'lpoNo'>) => T.Purchase
  receivePurchase: (purchaseId: string, received: { productId: string; qty: number }[]) => void

  addExpense: (e: Omit<T.Expense, 'id'>) => void
  approveExpense: (id: string, approved: boolean) => void

  addZakatRecord: (z: Omit<T.ZakatRecord, 'id'>) => void
  markZakatPaid: (id: string) => void

  logAction: (action: string, details: string) => void
}

const Ctx = createContext<DataCtx>(null as any)

function useLocal<T>(key: string, seed: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    const stored = load<T | null>(key, null as any)
    if (stored === null || (Array.isArray(stored) && stored.length === 0 && Array.isArray(seed) && seed.length > 0)) {
      save(key, seed)
      return seed
    }
    return stored
  })
  const setter = useCallback((v: T) => {
    setState(v)
    save(key, v)
  }, [key])
  return [state, setter]
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [products, setProducts] = useLocal<T.Product[]>(KEYS.products, seedProducts)
  const [suppliers, setSuppliers] = useLocal<T.Supplier[]>(KEYS.suppliers, seedSuppliers)
  const [customers, setCustomers] = useLocal<T.Customer[]>(KEYS.customers, seedCustomers)
  const [sales, setSales] = useLocal<T.Sale[]>(KEYS.sales, [])
  const [quotations, setQuotations] = useLocal<T.Quotation[]>(KEYS.quotations, [])
  const [purchases, setPurchases] = useLocal<T.Purchase[]>(KEYS.purchases, [])
  const [grns, setGrns] = useLocal<T.GRN[]>(KEYS.grns, [])
  const [expenses, setExpenses] = useLocal<T.Expense[]>(KEYS.expenses, seedExpenses)
  const [audit, setAudit] = useLocal<T.AuditLog[]>(KEYS.audit, [])
  const [zakat, setZakat] = useLocal<T.ZakatRecord[]>(KEYS.zakat, [])
  const [returns, setReturns] = useLocal<T.ReturnRecord[]>(KEYS.returns, [])
  const [stockMovements, setStockMovements] = useLocal<T.StockMovement[]>(KEYS.stockMovements, [])

  const logAction = useCallback((action: string, details: string) => {
    const log: T.AuditLog = {
      id: uid(), userId: user?.id || 'system', userName: user?.name || 'System',
      action, details, timestamp: now(),
    }
    setAudit([log, ...audit].slice(0, 500))
  }, [audit, setAudit, user])

  const addProduct: DataCtx['addProduct'] = (p) => {
    const np: T.Product = { ...p, id: uid(), createdAt: now() }
    setProducts([...products, np])
    logAction('CREATE_PRODUCT', `Added product ${np.name}`)
  }

  const updateProduct: DataCtx['updateProduct'] = (p) => {
    setProducts(products.map(x => (x.id === p.id ? p : x)))
    logAction('UPDATE_PRODUCT', `Updated ${p.name}`)
  }

  const deleteProduct: DataCtx['deleteProduct'] = (id) => {
    const p = products.find(x => x.id === id)
    setProducts(products.filter(x => x.id !== id))
    logAction('DELETE_PRODUCT', `Deleted ${p?.name || id}`)
  }

  const adjustStock: DataCtx['adjustStock'] = (id, delta, type, note, toLocation) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: p.stock + delta } : p)))
    const p = products.find(x => x.id === id)
    const mv: T.StockMovement = {
      id: uid(), productId: id, productName: p?.name || '',
      type, qty: delta, note, toLocation, createdAt: now(), createdBy: user?.name || 'system',
    }
    setStockMovements([mv, ...stockMovements])
  }

  const addSupplier: DataCtx['addSupplier'] = (s) => {
    setSuppliers([...suppliers, { ...s, id: uid() }])
    logAction('CREATE_SUPPLIER', `Added supplier ${s.name}`)
  }

  const addCustomer: DataCtx['addCustomer'] = (c) => {
    setCustomers([...customers, { ...c, id: uid(), createdAt: now() }])
    logAction('CREATE_CUSTOMER', `Added customer ${c.name}`)
  }

  const updateCustomer: DataCtx['updateCustomer'] = (c) => {
    setCustomers(customers.map(x => (x.id === c.id ? c : x)))
  }

  const nextNo = (prefix: string, arr: { length: number }) =>
    `${prefix}-${String(arr.length + 1).padStart(5, '0')}`

  const addSale: DataCtx['addSale'] = (s) => {
    const sale: T.Sale = {
      ...s, id: uid(), createdAt: now(),
      receiptNo: nextNo('RCPT', sales),
    }
    // update stock
    setProducts(prev => prev.map(p => {
      const it = s.items.find(i => i.productId === p.id)
      return it ? { ...p, stock: p.stock - it.qty } : p
    }))
    // credit balance
    const creditPayment = s.payments.find(p => p.method === 'credit')
    if (creditPayment && s.customerId) {
      setCustomers(prev => prev.map(c =>
        c.id === s.customerId ? { ...c, balance: c.balance + creditPayment.amount } : c
      ))
    }
    // stock movements
    const moves: T.StockMovement[] = s.items.map(i => ({
      id: uid(), productId: i.productId, productName: i.productName,
      type: 'sale', qty: -i.qty, createdAt: now(), createdBy: user?.name || '',
      note: `Sale ${sale.receiptNo}`,
    }))
    setStockMovements([...moves, ...stockMovements])
    setSales([sale, ...sales])
    logAction('SALE', `Sale ${sale.receiptNo} - ${sale.total}`)
    return sale
  }

  const addQuotation: DataCtx['addQuotation'] = (q) => {
    const qq: T.Quotation = {
      ...q, id: uid(), createdAt: now(),
      quotationNo: nextNo('QUO', quotations),
    }
    setQuotations([qq, ...quotations])
    logAction('QUOTATION', `Created ${qq.quotationNo}`)
    return qq
  }

  const convertQuotation: DataCtx['convertQuotation'] = (q) => {
    const sale = addSale({
      customerId: q.customerId, customerName: q.customerName, items: q.items,
      subtotal: q.subtotal, discount: q.discount, total: q.total,
      payments: [{ method: 'cash', amount: q.total }],
      createdBy: user?.name || '', status: 'completed',
    })
    setQuotations(quotations.map(x => (x.id === q.id ? { ...x, converted: true } : x)))
    return sale
  }

  const returnSale: DataCtx['returnSale'] = (saleId, items) => {
    const sale = sales.find(s => s.id === saleId)
    if (!sale) return
    let refund = 0
    items.forEach(r => {
      const orig = sale.items.find(i => i.productId === r.productId)
      if (orig) refund += orig.price * r.qty
    })
    setProducts(prev => prev.map(p => {
      const r = items.find(i => i.productId === p.id)
      return r ? { ...p, stock: p.stock + r.qty } : p
    }))
    const ret: T.ReturnRecord = {
      id: uid(), saleId, items: items.map(i => {
        const orig = sale.items.find(o => o.productId === i.productId)!
        return { productId: i.productId, qty: i.qty, price: orig.price }
      }),
      refundAmount: refund, createdAt: now(),
    }
    setReturns([ret, ...returns])
    const allReturned = sale.items.every(i => {
      const r = items.find(x => x.productId === i.productId)
      return r && r.qty === i.qty
    })
    setSales(sales.map(s => s.id === saleId ? { ...s, status: allReturned ? 'returned' : 'partial_return' } : s))
    logAction('RETURN', `Return on ${sale.receiptNo} - refund ${refund}`)
  }

  const addPurchase: DataCtx['addPurchase'] = (p) => {
    const np: T.Purchase = {
      ...p, id: uid(), createdAt: now(),
      lpoNo: nextNo('LPO', purchases),
    }
    setPurchases([np, ...purchases])
    logAction('PURCHASE', `LPO ${np.lpoNo}`)
    return np
  }

  const receivePurchase: DataCtx['receivePurchase'] = (purchaseId, received) => {
    const purchase = purchases.find(p => p.id === purchaseId)
    if (!purchase) return
    const grn: T.GRN = {
      id: uid(), grnNo: nextNo('GRN', grns), purchaseId, createdAt: now(),
      items: purchase.items.map(pi => {
        const r = received.find(x => x.productId === pi.productId)
        return { productId: pi.productId, productName: pi.productName, ordered: pi.qty, received: r?.qty || 0 }
      }),
    }
    setGrns([grn, ...grns])
    received.forEach(r => {
      const pi = purchase.items.find(i => i.productId === r.productId)
      if (pi && r.qty > 0) {
        adjustStock(r.productId, r.qty, 'purchase', `GRN ${grn.grnNo}`)
      }
    })
    const allFull = grn.items.every(i => i.received >= i.ordered)
    setPurchases(purchases.map(p => p.id === purchaseId
      ? { ...p, status: allFull ? 'received' : 'partial', receivedAt: now() }
      : p))
    logAction('GRN', `Received ${grn.grnNo}`)
  }

  const addExpense: DataCtx['addExpense'] = (e) => {
    const ne: T.Expense = { ...e, id: uid() }
    setExpenses([ne, ...expenses])
    logAction('EXPENSE', `Added ${e.description} - ${e.amount}`)
  }

  const approveExpense: DataCtx['approveExpense'] = (id, approved) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, status: approved ? 'approved' : 'rejected' } : e))
    logAction('APPROVE_EXPENSE', `${approved ? 'Approved' : 'Rejected'} ${id}`)
  }

  const addZakatRecord: DataCtx['addZakatRecord'] = (z) => {
    setZakat([{ ...z, id: uid() }, ...zakat])
  }

  const markZakatPaid: DataCtx['markZakatPaid'] = (id) => {
    setZakat(zakat.map(z => z.id === id ? { ...z, paid: true, paidDate: today() } : z))
    logAction('ZAKAT_PAID', `Marked zakat ${id} as paid`)
  }

  return (
    <Ctx.Provider value={{
      products, suppliers, customers, sales, quotations, purchases, grns, expenses,
      audit, zakat, returns, stockMovements,
      addProduct, updateProduct, deleteProduct, adjustStock,
      addSupplier, addCustomer, updateCustomer,
      addSale, addQuotation, convertQuotation, returnSale,
      addPurchase, receivePurchase,
      addExpense, approveExpense,
      addZakatRecord, markZakatPaid, logAction,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useData = () => useContext(Ctx)