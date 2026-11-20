
import {
  Package,
  Store,
  User,
  Wallet,
  Receipt,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import {
  bidhaa,
  maduka,
  wafanyakazi,
  madeni,
  gharama,
} from '../data/demo'

// ======================================================
// TYPES
// ======================================================

export type SearchRole = 'mmiliki' | 'muuzaji' | 'mteja'

export type SearchLanguage = 'sw' | 'en'

export type SearchType =
  | 'bidhaa'
  | 'duka'
  | 'mtumiaji'
  | 'deni'
  | 'gharama'

export interface SearchResult {
  type: SearchType
  title: string
  subtitle: string
  Icon: LucideIcon
  route?: string
}

// ======================================================
// ROLE PERMISSIONS
// ======================================================

const ROLE_PERMISSIONS: Record<SearchRole, SearchType[]> = {
  mmiliki: [
    'bidhaa',
    'duka',
    'mtumiaji',
    'deni',
    'gharama',
  ],

  muuzaji: [
    'bidhaa',
    'deni',
    'gharama',
  ],

  mteja: [
    'bidhaa',
    'deni',
  ],
}

// ======================================================
// ROLE ROUTES
// ======================================================

const ROLE_ROUTES: Record<
  SearchRole,
  Partial<Record<SearchType, string>>
> = {
  mmiliki: {
    duka: '/mmiliki/maduka',
    mtumiaji: '/mmiliki/wafanyakazi',
    gharama: '/mmiliki/matumizi',
  },

  muuzaji: {
    // Weka routes halisi za muuzaji hapa
    // baada ya kuthibitisha routes zako.
  },

  mteja: {
    bidhaa: '/mteja/bidhaa',
    deni: '/mteja/deni',
  },
}

// ======================================================
// TRANSLATIONS
// ======================================================

const TRANSLATIONS = {
  sw: {
    status: 'Hali',
  },

  en: {
    status: 'Status',
  },
}

// ======================================================
// ROLE VALIDATION
// ======================================================

function isValidRole(
  role: unknown
): role is SearchRole {
  return (
    role === 'mmiliki' ||
    role === 'muuzaji' ||
    role === 'mteja'
  )
}

// ======================================================
// PERMISSION CHECK
// ======================================================

function canSearch(
  role: SearchRole,
  type: SearchType
): boolean {
  const permissions = ROLE_PERMISSIONS[role]

  if (!permissions) {
    return false
  }

  return permissions.includes(type)
}

// ======================================================
// GET ROLE-SPECIFIC ROUTE
// ======================================================

function getRoute(
  role: SearchRole,
  type: SearchType
): string | undefined {
  if (!isValidRole(role)) {
    return undefined
  }

  return ROLE_ROUTES[role][type]
}

// ======================================================
// FORMAT CURRENCY
// ======================================================

function formatMoney(amount: number): string {
  return `Tsh ${Number(amount || 0).toLocaleString()}`
}

// ======================================================
// TRANSLATE STATUS
// ======================================================

function translateStatus(
  status: string,
  language: SearchLanguage
): string {
  if (language === 'sw') {
    return status
  }

  const translations: Record<string, string> = {
    inalipwa: 'Being paid',
    imelipwa: 'Paid',
    haijalipwa: 'Unpaid',
    inasubiri: 'Pending',
    imekubaliwa: 'Approved',
    imekataliwa: 'Rejected',
    imethibitishwa: 'Confirmed',
    imeisha: 'Out of stock',
    inaribia: 'Low stock',
    sawa: 'Good',
  }

  return translations[status.toLowerCase()] ?? status
}

// ======================================================
// MAIN SEARCH FUNCTION
// ======================================================

export function searchEverything(
  query: string,
  role?: SearchRole,
  language: SearchLanguage = 'sw'
): SearchResult[] {
  const q = query.trim().toLowerCase()

  // Empty search
  if (!q) {
    return []
  }

  // IMPORTANT:
  // Do not search when role is missing or invalid.
  // This prevents one role from accessing another
  // role's search results accidentally.
  if (!isValidRole(role)) {
    console.warn(
      'Search cancelled: valid user role was not provided.'
    )

    return []
  }

  const results: SearchResult[] = []

  const labels = TRANSLATIONS[language]

  // ====================================================
  // PRODUCTS
  // ====================================================

  if (canSearch(role, 'bidhaa')) {
    bidhaa.forEach((b) => {
      const jina = String(b.jina ?? '').toLowerCase()
      const sku = String(b.sku ?? '').toLowerCase()
      const kundi = String(b.kundi ?? '').toLowerCase()

      if (
        jina.includes(q) ||
        sku.includes(q) ||
        kundi.includes(q)
      ) {
        results.push({
          type: 'bidhaa',
          title: b.jina,
          subtitle: `${b.sku} - ${formatMoney(b.beiMauzo)} - ${b.duka}`,
          Icon: Package,
          route: getRoute(role, 'bidhaa'),
        })
      }
    })
  }

  // ====================================================
  // STORES
  // ====================================================

  if (canSearch(role, 'duka')) {
    maduka.forEach((d) => {
      const jina = String(d.jina ?? '').toLowerCase()
      const mahali = String(d.mahali ?? '').toLowerCase()

      if (
        jina.includes(q) ||
        mahali.includes(q)
      ) {
        results.push({
          type: 'duka',
          title: d.jina,
          subtitle: d.mahali,
          Icon: Store,
          route: getRoute(role, 'duka'),
        })
      }
    })
  }

  // ====================================================
  // USERS / EMPLOYEES
  // ====================================================

  if (canSearch(role, 'mtumiaji')) {
    wafanyakazi.forEach((w) => {
      const jina = String(w.jina ?? '').toLowerCase()
      const simu = String(w.simu ?? '')
      const userRole = String(w.role ?? '').toLowerCase()

      if (
        jina.includes(q) ||
        simu.includes(q) ||
        userRole.includes(q)
      ) {
        results.push({
          type: 'mtumiaji',
          title: w.jina,
          subtitle: `${w.role} - ${w.duka} - ${w.simu}`,
          Icon: User,
          route: getRoute(role, 'mtumiaji'),
        })
      }
    })
  }

  // ====================================================
  // DEBTS
  // ====================================================

  if (canSearch(role, 'deni')) {
    madeni.forEach((d) => {
      const mteja = String(d.mteja ?? '').toLowerCase()
      const simu = String(d.simu ?? '')

      if (
        mteja.includes(q) ||
        simu.includes(q)
      ) {
        results.push({
          type: 'deni',
          title: d.mteja,
          subtitle: `${formatMoney(d.kiasi)} - ${labels.status}: ${translateStatus(
            String(d.hali ?? ''),
            language
          )}`,
          Icon: Wallet,
          route: getRoute(role, 'deni'),
        })
      }
    })
  }

  // ====================================================
  // EXPENSES
  // ====================================================

  if (canSearch(role, 'gharama')) {
    gharama.forEach((g) => {
      const aina = String(g.aina ?? '').toLowerCase()
      const maelezo = String(g.maelezo ?? '').toLowerCase()

      if (
        aina.includes(q) ||
        maelezo.includes(q)
      ) {
        results.push({
          type: 'gharama',
          title: g.aina,
          subtitle: `${formatMoney(g.kiasi)} - ${g.maelezo}`,
          Icon: Receipt,
          route: getRoute(role, 'gharama'),
        })
      }
    })
  }

  // Return maximum 8 results
  return results.slice(0, 8)
}
