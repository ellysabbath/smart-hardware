import type { Product, Supplier, Customer, User, Expense, ZakatRecord } from '../types'
import { today, uid, now } from './utils'

export const seedUsers: User[] = [
  { id: 'u1', name: 'Admin Mkuu', username: 'admin', password: 'admin', role: 'admin', active: true },
  { id: 'u2', name: 'Juma Muuzaji', username: 'seller', password: 'seller', role: 'seller', active: true },
  { id: 'u3', name: 'Ali Ghala', username: 'warehouse', password: 'warehouse', role: 'warehouse', active: true },
  { id: 'u4', name: 'Mmiliki', username: 'owner', password: 'owner', role: 'owner', active: true },
]

export const seedSuppliers: Supplier[] = [
  { id: 's1', name: 'Dangote Cement', phone: '0754000001', email: 'dangote@tz.com', balance: 0 },
  { id: 's2', name: 'Steel Masters', phone: '0754000002', email: 'steel@tz.com', balance: 0 },
  { id: 's3', name: 'Twiga Cement', phone: '0754000003', email: 'twiga@tz.com', balance: 0 },
]

export const seedCustomers: Customer[] = [
  { id: 'c1', name: 'Juma Fundi', phone: '0712000001', type: 'fundi', balance: 0, createdAt: now() },
  { id: 'c2', name: 'Mjenzi Build Co.', phone: '0712000002', type: 'kampuni', balance: 0, createdAt: now() },
  { id: 'c3', name: 'Baba Ali', phone: '0712000003', type: 'mteja', balance: 0, createdAt: now() },
]

export const seedProducts: Product[] = [
  {
    id: 'p1', sku: 'SAR-DAN-50', name: 'Saruji Dangote 50kg', category: 'Saruji',
    unit: 'bag', buyPrice: 16000, sellPrice: 18500, stock: 120, location: 'Shed A',
    supplier: 'Dangote Cement', reorderLevel: 50, barcode: 'SAR001',
    expiryDate: '2026-06-30', description: 'Saruji ya ujenzi 32.5N', createdAt: now(),
  },
  {
    id: 'p2', sku: 'SAR-TWI-50', name: 'Saruji Twiga 50kg', category: 'Saruji',
    unit: 'bag', buyPrice: 15500, sellPrice: 18000, stock: 80, location: 'Shed A',
    supplier: 'Twiga Cement', reorderLevel: 40, barcode: 'SAR002',
    expiryDate: '2026-04-15', description: 'Saruji Twiga 32.5R', createdAt: now(),
  },
  {
    id: 'p3', sku: 'NON-D12', name: 'Nondo D12', category: 'Nondo',
    unit: 'kg', alternateUnits: [{ unit: 'm', factor: 0.89 }, { unit: 'ft', factor: 0.27 }],
    buyPrice: 2200, sellPrice: 2800, stock: 500, location: 'Raka 3',
    supplier: 'Steel Masters', reorderLevel: 100, barcode: 'NON001',
    description: 'Nondo ya ujenzi D12 - 12m', createdAt: now(),
  },
  {
    id: 'p4', sku: 'MAB-G28', name: 'Mabati G28', category: 'Mabati',
    unit: 'm', buyPrice: 8000, sellPrice: 10500, stock: 200, location: 'Shed B',
    supplier: 'Steel Masters', reorderLevel: 50, barcode: 'MAB001',
    description: 'Mabati ya kuezekea G28', createdAt: now(),
  },
  {
    id: 'p5', sku: 'MBA-M2', name: 'Mbao Mita za Ujazo', category: 'Mbao',
    unit: 'm3', buyPrice: 350000, sellPrice: 420000, stock: 30, location: 'Shed C',
    supplier: 'Steel Masters', reorderLevel: 10, barcode: 'MBA001',
    description: 'Mbao za ujenzi', createdAt: now(),
  },
  {
    id: 'p6', sku: 'RAN-WH-20', name: 'Rangi Nyeupe 20L', category: 'Rangi',
    unit: 'pcs', buyPrice: 45000, sellPrice: 58000, stock: 40, location: 'Duka',
    supplier: 'Dangote Cement', reorderLevel: 15, barcode: 'RAN001',
    expiryDate: '2026-08-01', description: 'Rangi ya kupaka ukutani', createdAt: now(),
  },
]

export const seedExpenses: Expense[] = [
  {
    id: 'e1', category: 'fixed', subCategory: 'Kodi ya Duka', description: 'Kodi ya mwezi Nov 2026',
    amount: 500000, date: today(), paidTo: 'Mwenye Nyumba', paymentMethod: 'Cash',
    enteredBy: 'Admin Mkuu', status: 'approved', recurring: true,
  },
  {
    id: 'e2', category: 'variable', subCategory: 'Mafuta ya Gari', description: 'Mafuta ya pikipiki',
    amount: 80000, date: today(), paidTo: 'Shell Station', paymentMethod: 'M-Pesa',
    enteredBy: 'Juma Muuzaji', status: 'pending', recurring: false,
  },
]

export const seedZakat: ZakatRecord[] = []