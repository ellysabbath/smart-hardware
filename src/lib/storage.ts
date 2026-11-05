import type {
  Product, Supplier, Customer, User, Expense, ZakatRecord,
  WorkingPeriod, MonthlyReport, Branch
} from '../types'
import { today, uid, now, addDays } from './utils'

export const seedBranches: Branch[] = [
  { id: 'b1', name: 'Duka Kuu (Kariakoo)', location: 'Kariakoo', phone: '0712000000', active: true, createdAt: now() },
  { id: 'b2', name: 'Duka la Mbezi', location: 'Mbezi', phone: '0712000001', active: true, createdAt: now() },
]

export const seedUsers: User[] = [
  { id: 'u1', name: 'Admin Mkuu', username: 'admin', password: 'admin', role: 'admin', active: true },
  { id: 'u2', name: 'Juma (Kariakoo)', username: 'seller1', password: 'seller1', role: 'seller', active: true, branchId: 'b1' },
  { id: 'u3', name: 'Ali Ghala (Kariakoo)', username: 'warehouse1', password: 'warehouse1', role: 'warehouse', active: true, branchId: 'b1' },
  { id: 'u4', name: 'Mmiliki', username: 'owner', password: 'owner', role: 'owner', active: true },
  { id: 'u5', name: 'Fatuma (Mbezi)', username: 'seller2', password: 'seller2', role: 'seller', active: true, branchId: 'b2' },
]

export const seedSuppliers: Supplier[] = [
  { id: 's1', name: 'Dangote Cement', phone: '0754000001', email: 'dangote@tz.com', balance: 0 },
  { id: 's2', name: 'Steel Masters', phone: '0754000002', email: 'steel@tz.com', balance: 0 },
  { id: 's3', name: 'Twiga Cement', phone: '0754000003', email: 'twiga@tz.com', balance: 0 },
]

export const seedCustomers: Customer[] = [
  { id: 'c1', branchId: 'b1', name: 'Juma Fundi (Kariakoo)', phone: '0712000001', type: 'fundi', balance: 0, createdAt: now() },
  { id: 'c2', branchId: 'b2', name: 'Mjenzi Build Co. (Mbezi)', phone: '0712000002', type: 'kampuni', balance: 0, createdAt: now() },
]

export const seedProducts: Product[] = [
  {
    id: 'p1', branchId: 'b1', sku: 'SAR-DAN-50', name: 'Saruji Dangote 50kg', category: 'Saruji',
    unit: 'bag', buyPrice: 16000, sellPrice: 18500, stock: 120, location: 'Shed A',
    supplier: 'Dangote Cement', reorderLevel: 50, barcode: 'SAR001',
    expiryDate: '2026-06-30', description: 'Saruji ya ujenzi 32.5N', createdAt: now(),
  },
  {
    id: 'p2', branchId: 'b2', sku: 'SAR-TWI-50', name: 'Saruji Twiga 50kg', category: 'Saruji',
    unit: 'bag', buyPrice: 15500, sellPrice: 18000, stock: 80, location: 'Shed A',
    supplier: 'Twiga Cement', reorderLevel: 40, barcode: 'SAR002',
    expiryDate: '2026-04-15', description: 'Saruji Twiga 32.5R', createdAt: now(),
  },
]

export const seedExpenses: Expense[] = [
  {
    id: 'e1', branchId: 'b1', category: 'fixed', subCategory: 'Kodi ya Duka', description: 'Kodi ya mwezi',
    amount: 500000, date: today(), paidTo: 'Mwenye Nyumba', paymentMethod: 'Cash',
    enteredBy: 'Admin Mkuu', status: 'approved', recurring: true,
    requestedBy: 'Admin Mkuu', approvedBy: 'Admin Mkuu', approvedAt: now(),
  },
]

export const seedZakat: ZakatRecord[] = []

const d = new Date()
export const seedWorkingPeriods: WorkingPeriod[] = [
  {
    id: 'wp1',
    branchId: 'b1',
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    status: 'open',
    openedAt: now(),
    reportDeadline: addDays(today(), 7),
    createdBy: 'Admin Mkuu',
  },
  {
    id: 'wp2',
    branchId: 'b2',
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    status: 'open',
    openedAt: now(),
    reportDeadline: addDays(today(), 7),
    createdBy: 'Admin Mkuu',
  }
]

export const seedMonthlyReports: MonthlyReport[] = []

export const KEYS = {
  branches: 'sh_branches',
  users: 'sh_users',
  products: 'sh_products',
  suppliers: 'sh_suppliers',
  customers: 'sh_customers',
  sales: 'sh_sales',
  quotations: 'sh_quotations',
  purchases: 'sh_purchases',
  grns: 'sh_grns',
  expenses: 'sh_expenses',
  audit: 'sh_audit',
  zakat: 'sh_zakat',
  returns: 'sh_returns',
  stockMovements: 'sh_stock_movements',
  currentUser: 'sh_current_user',
  workingPeriods: 'sh_working_periods',
  monthlyReports: 'sh_monthly_reports',
} as const

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch (err) {
    console.error(`[storage] load failed for "${key}":`, err)
    localStorage.removeItem(key)
    return fallback
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`[storage] save failed for "${key}":`, err)
  }
}

// silence unused import error
void uid