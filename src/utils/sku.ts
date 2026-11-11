import type { KundiBidhaa } from '../types'

const KUNDI_PREFIX: Record<KundiBidhaa, string> = {
  Saruji: 'SAR',
  Nondo: 'NON',
  Mabati: 'MAB',
  Mbao: 'MBA',
  Rangi: 'RAN',
  Bomba: 'BOM',
  Umeme: 'UME',
  Zana: 'ZAN',
}

export function generateSku(jina: string, kundi: KundiBidhaa): string {
  const prefix = KUNDI_PREFIX[kundi] ?? 'BID'
  const words = jina
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
  const middle = words[1] ?? words[0] ?? 'X'
  const code = middle.slice(0, 4)
  const seq = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}-${code}-${seq}`
}