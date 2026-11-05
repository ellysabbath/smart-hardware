import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  Branch, Product, Supplier, Customer, Sale, SaleItem, PaymentSplit,
  Quotation, Purchase, PurchaseItem, GRN, Expense, AuditLog,
  ZakatRecord, StockMovement, ReturnRecord,
  WorkingPeriod, MonthlyReport,
} from '../types'
import { useAuth } from './AuthContext'
import {
  KEYS, load, save,
  seedProducts, seedSuppliers, seedCustomers, seedExpenses,
  seedZakat, seedWorkingPeriods, seedMonthlyReports, seedBranches,
} from '../lib/storage'
import { uid, now, today, addDays, monthKey } from '../lib/utils'

interface DataContextType {
  branches: Branch[]
  products: Product[]
  suppliers: Supplier[]
  customers: Customer[]
  sales: Sale[]
  quotations: Quotation[]
  purchases: Purchase[]
  grns: GRN[]
  expenses: Expense[]
  audit: AuditLog[]
  zakat: ZakatRecord[]
  returns: ReturnRecord[]
  stockMovements: StockMovement[]
  workingPeriods: WorkingPeriod[]
  monthlyReports: MonthlyReport[]
  activePeriod: WorkingPeriod | null

  addBranch: (b: Omit<Branch, 'id' | 'createdAt'>) => void
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: string) => void

  addSupplier: (s: Omit<Supplier, 'id'>) => void
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void
  updateCustomer: (c: Customer) => void

  addSale: (s: Omit<Sale, 'id' | 'receiptNo' | 'createdAt'>) => Sale
  returnSale: (saleId: string, items: { productId: string; qty: number }[]) => void

  addQuotation: (q: Omit<Quotation, 'id' | 'quotationNo' | 'createdAt'>) => void
  convertQuotation: (q: Quotation) => void

  addPurchase: (p: Omit<Purchase, 'id' | 'lpoNo' | 'createdAt'>) => void
  receivePurchase: (purchaseId: string, received: { productId: string; qty: number }[]) => void

  addExpense: (e: Omit<Expense, 'id'>) => void
  approveExpense: (id: string, approved: boolean, adminName: string, reason?: string) => void

  addZakatRecord: (z: Omit<ZakatRecord, 'id'>) => void
  markZakatPaid: (id: string) => void

  adjustStock: (productId: string, qty: number, type: StockMovement['type'], note?: string, toLocation?: string) => void
  addAudit: (action: string, details: string) => void

  openPeriod: (year: number, month: number, deadline?: string) => void
  closePeriod: (id: string) => void
  isPeriodOpen: (dateStr?: string) => boolean

  getOrCreateMonthlyReport: (sellerId: string, sellerName: string, year: number, month: number) => MonthlyReport | null
  updateMonthlyReport: (id: string, patch: Partial<MonthlyReport>) => void
  submitMonthlyReport: (id: string) => void
  requestReportEdit: (id: string, reason: string) => void
  decideReportEdit: (reportId: string, approve: boolean, adminNote?: string) => void
  approveMonthlyReport: (id: string) => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [branches, setBranches] = useState<Branch[]>(() => load(KEYS.branches, seedBranches))
  const [products, setProducts] = useState<Product[]>(() => load(KEYS.products, seedProducts))
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => load(KEYS.suppliers, seedSuppliers))
  const [customers, setCustomers] = useState<Customer[]>(() => load(KEYS.customers, seedCustomers))
  const [sales, setSales] = useState<Sale[]>(() => load(KEYS.sales, []))
  const [quotations, setQuotations] = useState<Quotation[]>(() => load(KEYS.quotations, []))
  const [purchases, setPurchases] = useState<Purchase[]>(() => load(KEYS.purchases, []))
  const [grns, setGrns] = useState<GRN[]>(() => load(KEYS.grns, []))
  const [expenses, setExpenses] = useState<Expense[]>(() => load(KEYS.expenses, seedExpenses))
  const [audit, setAudit] = useState<AuditLog[]>(() => load(KEYS.audit, []))
  const [zakat, setZakat] = useState<ZakatRecord[]>(() => load(KEYS.zakat, seedZakat))
  const [returns, setReturns] = useState<ReturnRecord[]>(() => load(KEYS.returns, []))
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => load(KEYS.stockMovements, []))
  const [workingPeriods, setWorkingPeriods] = useState<WorkingPeriod[]>(() => load(KEYS.workingPeriods, seedWorkingPeriods))
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(() => load(KEYS.monthlyReports, seedMonthlyReports))

  useEffect(() => save(KEYS.branches, branches), [branches])
  useEffect(() => save(KEYS.products, products), [products])
  useEffect(() => save(KEYS.suppliers, suppliers), [suppliers])
  useEffect(() => save(KEYS.customers, customers), [customers])
  useEffect(() => save(KEYS.sales, sales), [sales])
  useEffect(() => save(KEYS.quotations, quotations), [quotations])
  useEffect(() => save(KEYS.purchases, purchases), [purchases])
  useEffect(() => save(KEYS.grns, grns), [grns])
  useEffect(() => save(KEYS.expenses, expenses), [expenses])
  useEffect(() => save(KEYS.audit, audit), [audit])
  useEffect(() => save(KEYS.zakat, zakat), [zakat])
  useEffect(() => save(KEYS.returns, returns), [returns])
  useEffect(() => save(KEYS.stockMovements, stockMovements), [stockMovements])
  useEffect(() => save(KEYS.workingPeriods, workingPeriods), [workingPeriods])
  useEffect(() => save(KEYS.monthlyReports, monthlyReports), [monthlyReports])

  // ==== FILTERING BY BRANCH ====
  const currentBranchId = user?.branchId
  const isSuperUser = user?.role === 'admin' || user?.role === 'owner'

  // Branch filter logic: Superusers see all. Sellers/Warehouse see their branch only.
  const filterBranch = <T extends { branchId?: string }>(items: T[]): T[] => {
    if (isSuperUser || !currentBranchId) return items
    return items.filter(i => i.branchId === currentBranchId)
  }

  const filteredProducts = useMemo(() => filterBranch(products), [products, isSuperUser, currentBranchId])
  const filteredSales = useMemo(() => filterBranch(sales), [sales, isSuperUser, currentBranchId])
  const filteredCustomers = useMemo(() => filterBranch(customers), [customers, isSuperUser, currentBranchId])
  const filteredExpenses = useMemo(() => filterBranch(expenses), [expenses, isSuperUser, currentBranchId])
  const filteredPurchases = useMemo(() => filterBranch(purchases), [purchases, isSuperUser, currentBranchId])
  const filteredQuotations = useMemo(() => filterBranch(quotations), [quotations, isSuperUser, currentBranchId])
  const filteredZakat = useMemo(() => filterBranch(zakat), [zakat, isSuperUser, currentBranchId])
  const filteredReports = useMemo(() => filterBranch(monthlyReports), [monthlyReports, isSuperUser, currentBranchId])

  // Work period logic (Seller needs active period of their branch)
  const activePeriod = useMemo(() => {
    if (isSuperUser) {
      return workingPeriods.find(p => p.status === 'open') || null
    }
    return workingPeriods.find(p => p.branchId === currentBranchId && p.status === 'open') || null
  }, [workingPeriods, currentBranchId, isSuperUser])

  // ==== ACTIONS ====
  const addAudit = (action: string, details: string) => {
    const entry: AuditLog = {
      id: uid(),
      branchId: user?.branchId,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      action,
      details,
      timestamp: now(),
    }
    setAudit(prev => [entry, ...prev])
  }

  const addBranch = (b: Omit<Branch, 'id' | 'createdAt'>) => {
    const nb: Branch = { ...b, id: uid(), createdAt: now() }
    setBranches(prev => [nb, ...prev])
    addAudit('CREATE_BRANCH', `Duka jipya: ${b.name}`)
  }

  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    const np: Product = { ...p, id: uid(), createdAt: now() }
    setProducts(prev => [np, ...prev])
    addAudit('CREATE_PRODUCT', `Bidhaa mpya: ${p.name}`)
  }

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x))
    addAudit('UPDATE_PRODUCT', `Bidhaa imebadilishwa: ${p.name}`)
  }

  const deleteProduct = (id: string) => {
    const p = products.find(x => x.id === id)
    setProducts(prev => prev.filter(x => x.id !== id))
    addAudit('DELETE_PRODUCT', `Bidhaa imefutwa: ${p?.name || id}`)
  }

  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    const ns: Supplier = { ...s, id: uid() }
    setSuppliers(prev => [ns, ...prev])
    addAudit('CREATE_SUPPLIER', `Msambazaji mpya: ${s.name}`)
  }

  const addCustomer = (c: Omit<Customer, 'id' | 'createdAt'>) => {
    const nc: Customer = { ...c, id: uid(), createdAt: now() }
    setCustomers(prev => [nc, ...prev])
    addAudit('CREATE_CUSTOMER', `Mteja mpya: ${c.name}`)
  }

  const updateCustomer = (c: Customer) => {
    setCustomers(prev => prev.map(x => x.id === c.id ? c : x))
    addAudit('UPDATE_CUSTOMER', `Mteja imebadilishwa: ${c.name}`)
  }

  const adjustStock = (productId: string, qty: number, type: StockMovement['type'], note?: string, toLocation?: string) => {
    const p = products.find(x => x.id === productId)
    if (!p) return
    setProducts(prev => prev.map(x => x.id === productId ? { ...x, stock: Math.max(0, x.stock + qty) } : x))
    const m: StockMovement = {
      id: uid(), branchId: p.branchId, productId, productName: p.name, type, qty,
      fromLocation: p.location, toLocation, note, createdAt: now(), createdBy: user?.name || 'System',
    }
    setStockMovements(prev => [m, ...prev])
  }

  const addSale = (s: Omit<Sale, 'id' | 'receiptNo' | 'createdAt'>): Sale => {
    const receiptNo = 'R-' + Date.now().toString().slice(-8)
    const sale: Sale = { ...s, id: uid(), receiptNo, createdAt: now() }
    setSales(prev => [sale, ...prev])

    sale.items.forEach(i => {
      setProducts(prev => prev.map(p => p.id === i.productId ? { ...p, stock: Math.max(0, p.stock - i.qty) } : p))
      const prod = products.find(p => p.id === i.productId)
      if (prod) {
        const m: StockMovement = {
          id: uid(), branchId: sale.branchId, productId: i.productId, productName: i.productName,
          type: 'sale', qty: -i.qty, note: `Mauzo ${receiptNo}`, createdAt: now(), createdBy: user?.name || 'System',
        }
        setStockMovements(prev => [m, ...prev])
      }
    })

    const credit = sale.payments.find(p => p.method === 'credit')
    if (credit && sale.customerId) {
      setCustomers(prev => prev.map(c => c.id === sale.customerId ? { ...c, balance: c.balance + credit.amount } : c))
    }

    addAudit('SALE', `Mauzo ${receiptNo} - ${sale.customerName} - ${sale.total}`)
    return sale
  }

  const returnSale = (saleId: string, items: { productId: string; qty: number }[]) => {
    const sale = sales.find(s => s.id === saleId)
    if (!sale) return
    let refund = 0
    items.forEach(r => {
      const si = sale.items.find(i => i.productId === r.productId)
      if (si) {
        refund += si.price * r.qty
        adjustStock(r.productId, r.qty, 'return', `Kurudisha ${sale.receiptNo}`)
      }
    })
    const rec: ReturnRecord = {
      id: uid(), branchId: sale.branchId, saleId,
      items: items.map(r => {
        const si = sale.items.find(i => i.productId === r.productId)
        return { productId: r.productId, qty: r.qty, price: si?.price || 0 }
      }),
      refundAmount: refund, createdAt: now(),
    }
    setReturns(prev => [rec, ...prev])
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: 'partial_return' } : s))
    addAudit('RETURN', `Kurudisha ${sale.receiptNo} - ${refund}`)
  }

  const addQuotation = (q: Omit<Quotation, 'id' | 'quotationNo' | 'createdAt'>) => {
    const quotationNo = 'Q-' + Date.now().toString().slice(-6)
    const nq: Quotation = { ...q, id: uid(), quotationNo, createdAt: now() }
    setQuotations(prev => [nq, ...prev])
    addAudit('CREATE_QUOTATION', `Nukuu ${quotationNo}`)
  }

  const convertQuotation = (q: Quotation) => {
    addSale({
      branchId: q.branchId,
      customerId: q.customerId,
      customerName: q.customerName,
      items: q.items,
      subtotal: q.subtotal,
      discount: q.discount,
      total: q.total,
      payments: [{ method: 'cash', amount: q.total }],
      createdBy: user?.name || '',
      status: 'completed',
    })
    setQuotations(prev => prev.map(x => x.id === q.id ? { ...x, converted: true } : x))
    addAudit('CONVERT_QUOTATION', `Nukuu ${q.quotationNo} -> Invoice`)
  }

  const addPurchase = (p: Omit<Purchase, 'id' | 'lpoNo' | 'createdAt'>) => {
    const lpoNo = 'LPO-' + Date.now().toString().slice(-6)
    const np: Purchase = { ...p, id: uid(), lpoNo, createdAt: now() }
    setPurchases(prev => [np, ...prev])
    addAudit('CREATE_PURCHASE', `LPO ${lpoNo}`)
  }

  const receivePurchase = (purchaseId: string, received: { productId: string; qty: number }[]) => {
    const purch = purchases.find(p => p.id === purchaseId)
    if (!purch) return
    const grnItems = purch.items.map(i => {
      const rec = received.find(r => r.productId === i.productId)?.qty || 0
      return { productId: i.productId, productName: i.productName, ordered: i.qty, received: rec }
    })
    const grn: GRN = { id: uid(), branchId: purch.branchId, grnNo: 'GRN-' + Date.now().toString().slice(-6), purchaseId, items: grnItems, createdAt: now() }
    setGrns(prev => [grn, ...prev])

    grnItems.forEach(i => {
      if (i.received > 0) adjustStock(i.productId, i.received, 'purchase', `GRN ${grn.grnNo}`)
    })

    const totalRec = grnItems.reduce((s, x) => s + x.received, 0)
    const totalOrd = grnItems.reduce((s, x) => s + x.ordered, 0)
    const status: Purchase['status'] = totalRec === totalOrd ? 'received' : totalRec > 0 ? 'partial' : 'pending'
    setPurchases(prev => prev.map(p => p.id === purchaseId ? { ...p, status, receivedAt: now() } : p))
    addAudit('RECEIVE_GRN', `GRN ${grn.grnNo}`)
  }

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const ne: Expense = { ...e, id: uid() }
    setExpenses(prev => [ne, ...prev])
    addAudit('CREATE_EXPENSE', `Gharama: ${e.description} - ${e.amount}`)
  }

  const approveExpense = (id: string, approved: boolean, adminName: string, reason?: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id !== id) return e
      return { ...e, status: approved ? 'approved' : 'rejected', approvedBy: approved ? adminName : undefined, approvedAt: approved ? now() : undefined, rejectionReason: approved ? undefined : (reason || 'Imekataliwa na admin') }
    }))
    addAudit(approved ? 'APPROVE_EXPENSE' : 'REJECT_EXPENSE', `Gharama ${approved ? 'imeidhinishwa' : 'imekataliwa'}`)
  }

  const addZakatRecord = (z: Omit<ZakatRecord, 'id'>) => {
    const nz: ZakatRecord = { ...z, id: uid() }
    setZakat(prev => [nz, ...prev])
    addAudit('CREATE_ZAKAT', `Zaka ${z.total}`)
  }

  const markZakatPaid = (id: string) => {
    setZakat(prev => prev.map(z => z.id === id ? { ...z, paid: true, paidDate: today() } : z))
    addAudit('PAY_ZAKAT', `Zaka imelipwa`)
  }

  const isPeriodOpen = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : new Date()
    const p = workingPeriods.find(x => x.year === d.getFullYear() && x.month === d.getMonth() + 1 && (isSuperUser || x.branchId === currentBranchId))
    return !!p && p.status === 'open'
  }

  const openPeriod = (year: number, month: number, deadline?: string) => {
    const branchId = currentBranchId || branches[0]?.id // Admin anaweza kuwa hawana branch, default kwa b1
    setWorkingPeriods(prev => {
      const closed = prev.map(p => p.status === 'open' && (isSuperUser || p.branchId === branchId) ? { ...p, status: 'closed' as const, closedAt: now(), closedBy: user?.name || 'admin' } : p)
      const newP: WorkingPeriod = { id: uid(), branchId, year, month, status: 'open', openedAt: now(), reportDeadline: deadline || addDays(today(), 7), createdBy: user?.name || 'admin' }
      return [...closed, newP]
    })
    addAudit('OPEN_PERIOD', `Kipindi ${month}/${year} kimefunguliwa`)
  }

  const closePeriod = (id: string) => {
    const period = workingPeriods.find(p => p.id === id)
    if (!period) return
    setWorkingPeriods(prev => prev.map(p => p.id === id ? { ...p, status: 'closed' as const, closedAt: now(), closedBy: user?.name || 'admin' } : p))
    setMonthlyReports(prev => prev.map(r => r.periodId === id && (r.status === 'draft' || r.status === 'edit_requested') ? { ...r, status: 'auto_submitted' as const, autoSubmittedAt: now() } : r))
    addAudit('CLOSE_PERIOD', `Kipindi ${period.month}/${period.year} kimefungwa`)
  }

  useEffect(() => {
    const checkAutoSubmit = () => {
      const nowTs = new Date()
      workingPeriods.forEach(p => {
        if (p.status === 'closed') {
          const deadline = new Date(p.reportDeadline)
          if (nowTs > deadline) {
            setMonthlyReports(prev => prev.map(r => r.periodId === p.id && r.status === 'draft' ? { ...r, status: 'auto_submitted' as const, autoSubmittedAt: now() } : r))
          }
        }
      })
    }
    checkAutoSubmit()
  }, [workingPeriods.length])

  const getOrCreateMonthlyReport = (sellerId: string, sellerName: string, year: number, month: number): MonthlyReport | null => {
    const period = workingPeriods.find(p => p.year === year && p.month === month && (isSuperUser || p.branchId === currentBranchId))
    if (!period) return null
    const existing = monthlyReports.find(r => r.sellerId === sellerId && r.year === year && r.month === month)
    if (existing) return existing
    const mKey = monthKey(year, month)
    const monthSales = sales.filter(s => s.createdBy === sellerName && s.createdAt.slice(0, 7) === mKey && s.branchId === period.branchId)
    const salesTotal = monthSales.reduce((s, x) => s + x.total, 0)
    const cogs = monthSales.reduce((s, x) => s + x.items.reduce((y, i) => y + i.buyPrice * i.qty, 0), 0)
    const expensesTotal = expenses.filter(e => e.status === 'approved' && e.date.slice(0, 7) === mKey && e.enteredBy === sellerName && e.branchId === period.branchId).reduce((s, e) => s + e.amount, 0)
    const report: MonthlyReport = {
      id: uid(), branchId: period.branchId, periodId: period.id, year, month, sellerId, sellerName,
      salesCount: monthSales.length, salesTotal, cogs, grossProfit: salesTotal - cogs,
      expensesTotal, netProfit: salesTotal - cogs - expensesTotal, notes: '', status: 'draft',
    }
    setMonthlyReports(prev => [...prev, report])
    return report
  }

  const updateMonthlyReport = (id: string, patch: Partial<MonthlyReport>) => setMonthlyReports(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  const submitMonthlyReport = (id: string) => { updateMonthlyReport(id, { status: 'submitted', submittedAt: now() }); addAudit('SUBMIT_REPORT', `Ripoti ya mwezi imewasilishwa`) }
  const requestReportEdit = (id: string, reason: string) => {
    updateMonthlyReport(id, { status: 'edit_requested', editRequest: { reason, requestedAt: now(), status: 'pending' } })
    addAudit('REQUEST_REPORT_EDIT', `Ombi la kubadilisha ripoti: ${reason}`)
  }
  const decideReportEdit = (reportId: string, approve: boolean, adminNote?: string) => {
    setMonthlyReports(prev => prev.map(r => r.id !== reportId ? r : {
      ...r, status: approve ? 'edited' : 'approved',
      editRequest: r.editRequest ? { ...r.editRequest, status: approve ? 'approved' : 'rejected', decidedAt: now(), decidedBy: user?.name || 'admin', adminNote } : undefined,
    }))
    addAudit('DECIDE_REPORT_EDIT', `Admin ${approve ? 'amekubali' : 'amekataa'} ombi`)
  }
  const approveMonthlyReport = (id: string) => { updateMonthlyReport(id, { status: 'approved', approvedAt: now(), approvedBy: user?.name || 'admin' }); addAudit('APPROVE_REPORT', `Ripoti imeidhinishwa`) }

  return (
    <DataContext.Provider value={{
      branches,
      products: filteredProducts,
      suppliers,
      customers: filteredCustomers,
      sales: filteredSales,
      quotations: filteredQuotations,
      purchases: filteredPurchases,
      grns: filterBranch(grns),
      expenses: filteredExpenses,
      audit: filterBranch(audit),
      zakat: filteredZakat,
      returns: filterBranch(returns),
      stockMovements: filterBranch(stockMovements),
      workingPeriods,
      monthlyReports: filteredReports,
      activePeriod,

      addBranch, addProduct, updateProduct, deleteProduct,
      addSupplier, addCustomer, updateCustomer,
      addSale, returnSale, addQuotation, convertQuotation,
      addPurchase, receivePurchase, addExpense, approveExpense,
      addZakatRecord, markZakatPaid, adjustStock, addAudit,

      openPeriod, closePeriod, isPeriodOpen,
      getOrCreateMonthlyReport, updateMonthlyReport,
      submitMonthlyReport, requestReportEdit,
      decideReportEdit, approveMonthlyReport,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be inside DataProvider')
  return ctx
}

// silence unused type warning
void ((null as unknown) as SaleItem)
void ((null as unknown) as PaymentSplit)
void ((null as unknown) as PurchaseItem)