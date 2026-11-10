import type { BidhaaKamili } from '../types'

// ============================================================
// Hesabu siku zilizobaki kwa bidhaa
// ============================================================
export function sikuZilizobaki(expiry?: string): number | undefined {
  if (!expiry) return undefined
  const leo = new Date()
  const tarehe = new Date(expiry)
  const tofauti = Math.ceil((tarehe.getTime() - leo.getTime()) / (1000 * 60 * 60 * 24))
  return tofauti
}

// ============================================================
// Hali ya expiry (FR5)
// ============================================================
export type HaliExpiry = 'salama' | 'inaribia' | 'imeisha' | 'hakuna'

export function haliExpiry(expiry?: string): HaliExpiry {
  const siku = sikuZilizobaki(expiry)
  if (siku === undefined) return 'hakuna'
  if (siku <= 0) return 'imeisha'
  if (siku <= 30) return 'inaribia'
  return 'salama'
}

// ============================================================
// Rangi ya hali ya expiry
// ============================================================
export function rangiExpiry(hali: HaliExpiry): string {
  switch (hali) {
    case 'imeisha':
      return 'text-red-700 border-red-200'
    case 'inaribia':
      return 'text-amber-700 border-amber-200'
    case 'salama':
      return 'text-emerald-700 border-emerald-200'
    default:
      return 'text-slate-700 border-slate-200'
  }
}

// ============================================================
// Chuja bidhaa zinazokaribia kuisha (FR5)
// ============================================================
export function bidhaaZinazokaribiaKuisha(bidhaa: BidhaaKamili[]): BidhaaKamili[] {
  return bidhaa.filter((b) => {
    const hali = haliExpiry(b.expiry)
    return hali === 'inaribia' || hali === 'imeisha'
  })
}