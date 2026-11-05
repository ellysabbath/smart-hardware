export type Role = 'admin' | 'seller' | 'warehouse' | 'owner'

export interface Branch {
  id: string
  name: string
  location: string
  phone: string
  active: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  username: string
  password: string
  role: Role
  active: boolean
  branchId?: string // Seller na Warehouse ni lazima wawe na hii
}

export type Unit = 'pcs' | 'kg' | 'm' | 'ft' | 'm3' | 'bag' | 'box'

export interface Product {
  id: string
  branchId: string
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
  branchId: string
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
  branchId: string
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
  branchId: string
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
  branchId: string
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
  branchId: string
  grnNo: string
  purchaseId: string
  items: { productId: string; productName: string; ordered: number; received: number }[]
  createdAt: string
}

export interface Expense {
  id: string
  branchId: string
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
  requestedBy: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
}

export interface AuditLog {
  id: string
  branchId?: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}

export interface ZakatRecord {
  id: string
  branchId: string
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
  branchId: string
  saleId: string
  items: { productId: string; qty: number; price: number }[]
  refundAmount: number
  createdAt: string
}

export interface StockMovement {
  id: string
  branchId: string
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

export interface WorkingPeriod {
  id: string
  branchId: string
  year: number
  month: number
  status: 'open' | 'closed' | 'locked'
  openedAt: string
  closedAt?: string
  closedBy?: string
  reportDeadline: string
  createdBy: string
}

export interface MonthlyReportEditRequest {
  reason: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  decidedAt?: string
  decidedBy?: string
  adminNote?: string
}

export interface MonthlyReport {
  id: string
  branchId: string
  periodId: string
  year: number
  month: number
  sellerId: string
  sellerName: string
  salesCount: number
  salesTotal: number
  cogs: number
  grossProfit: number
  expensesTotal: number
  netProfit: number
  notes: string
  status: 'draft' | 'submitted' | 'auto_submitted' | 'approved' | 'edit_requested' | 'edited'
  submittedAt?: string
  autoSubmittedAt?: string
  approvedAt?: string
  approvedBy?: string
  editRequest?: MonthlyReportEditRequest
}