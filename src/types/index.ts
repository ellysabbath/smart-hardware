export type Role = 'admin' | 'seller' | 'warehouse' | 'owner'

export interface User {
  id: string
  name: string
  username: string
  password: string
  role: Role
  active: boolean
}

export type Unit = 'pcs' | 'kg' | 'm' | 'ft' | 'm3' | 'bag' | 'box'

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  unit: Unit
  alternateUnits?: { unit: Unit; factor: number }[]
  buyPrice: number
  sellPrice: number
  stock: number
  location: string
  supplier: string
  description?: string
  imageUrl?: string
  expiryDate?: string
  reorderLevel: number
  barcode: string
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  phone: string
  email: string
  balance: number
  lastPrice?: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  type: 'fundi' | 'mjenzi' | 'kampuni' | 'mteja'
  balance: number
  createdAt: string
}

export interface SaleItem {
  productId: string
  productName: string
  qty: number
  unit: Unit
  price: number
  buyPrice: number
}

export interface PaymentSplit {
  method: 'cash' | 'mpesa' | 'tigopesa' | 'bank' | 'credit'
  amount: number
}

export interface Sale {
  id: string
  receiptNo: string
  customerId?: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  payments: PaymentSplit[]
  createdBy: string
  createdAt: string
  status: 'completed' | 'returned' | 'partial_return'
}

export interface Quotation {
  id: string
  quotationNo: string
  customerId?: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  validUntil: string
  createdAt: string
  createdBy: string
  converted: boolean
}

export interface PurchaseItem {
  productId: string
  productName: string
  qty: number
  price: number
}

export interface Purchase {
  id: string
  lpoNo: string
  supplierId: string
  supplierName: string
  items: PurchaseItem[]
  total: number
  status: 'pending' | 'received' | 'partial'
  createdAt: string
  receivedAt?: string
}

export interface GRN {
  id: string
  grnNo: string
  purchaseId: string
  items: { productId: string; productName: string; ordered: number; received: number }[]
  createdAt: string
}

export interface Expense {
  id: string
  category: 'fixed' | 'variable' | 'capital'
  subCategory: string
  description: string
  amount: number
  date: string
  paidTo: string
  paymentMethod: string
  receiptNo?: string
  receiptImage?: string
  enteredBy: string
  status: 'pending' | 'approved' | 'rejected'
  recurring: boolean
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}

export interface ZakatRecord {
  id: string
  date: string
  type: 'daily' | 'weekly' | 'monthly'
  netProfit: number
  zakat: number
  sadaka: number
  total: number
  paid: boolean
  paidDate?: string
}

export interface ReturnRecord {
  id: string
  saleId: string
  items: { productId: string; qty: number; price: number }[]
  refundAmount: number
  createdAt: string
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: 'sale' | 'purchase' | 'return' | 'damage' | 'transfer' | 'adjust'
  qty: number
  fromLocation?: string
  toLocation?: string
  note?: string
  createdAt: string
  createdBy: string
}