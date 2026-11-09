import { Package, Store, User, Wallet, Receipt } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { bidhaa, maduka, wafanyakazi, madeni, gharama } from '../data/demo'

export type SearchType = 'bidhaa' | 'duka' | 'mtumiaji' | 'deni' | 'gharama'

export interface SearchResult {
  type: SearchType
  title: string
  subtitle: string
  Icon: LucideIcon
  route?: string
}

export function searchEverything(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  bidhaa.forEach((b) => {
    if (
      b.jina.toLowerCase().includes(q) ||
      b.sku.toLowerCase().includes(q) ||
      b.kundi.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'bidhaa',
        title: b.jina,
        subtitle: `${b.sku} - Tsh ${b.beiMauzo.toLocaleString()} - ${b.duka}`,
        Icon: Package,
        route: '/mteja/bidhaa',
      })
    }
  })

  maduka.forEach((d) => {
    if (d.jina.toLowerCase().includes(q) || d.mahali.toLowerCase().includes(q)) {
      results.push({
        type: 'duka',
        title: d.jina,
        subtitle: d.mahali,
        Icon: Store,
        route: '/mmiliki/maduka',
      })
    }
  })

  wafanyakazi.forEach((w) => {
    if (
      w.jina.toLowerCase().includes(q) ||
      w.simu.includes(q) ||
      w.role.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'mtumiaji',
        title: w.jina,
        subtitle: `${w.role} - ${w.duka} - ${w.simu}`,
        Icon: User,
        route: '/mmiliki/wafanyakazi',
      })
    }
  })

  madeni.forEach((d) => {
    if (d.mteja.toLowerCase().includes(q) || d.simu.includes(q)) {
      results.push({
        type: 'deni',
        title: d.mteja,
        subtitle: `Tsh ${d.kiasi.toLocaleString()} - ${d.hali}`,
        Icon: Wallet,
        route: '/mteja/deni',
      })
    }
  })

  gharama.forEach((g) => {
    if (g.aina.toLowerCase().includes(q) || g.maelezo.toLowerCase().includes(q)) {
      results.push({
        type: 'gharama',
        title: g.aina,
        subtitle: `Tsh ${g.kiasi.toLocaleString()} - ${g.maelezo}`,
        Icon: Receipt,
      })
    }
  })

  return results.slice(0, 8)
}