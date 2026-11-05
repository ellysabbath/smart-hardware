export const KEYS = {
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
} as const

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch (err) {
    console.error(`[storage] load failed for "${key}":`, err)
    localStorage.removeItem(key) // remove corrupt entry so it can't break again
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