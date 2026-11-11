// ============================================================
// SMART HARDWARE - LocalStorage Database (Relational)
// ============================================================

import type {
  Duka, Mtumiaji, Bidhaa, Mteja, MauzoYaDuka, GharamaOpex,
  Order, Malipo, Deni, MalipoZaka, OmbiMatumizi, RipotiBidhaa,
  MarekebishoStoki, Mshahara, AkauntiMfanyakazi, UingizajiVifaa,
  GRN, PendingCart, Notification, Document,
} from '../../types'

const DB_PREFIX = 'sh_db_'

export interface Tables {
  maduka: Duka[]
  wafanyakazi: Mtumiaji[]
  bidhaa: Bidhaa[]
  wateja: Mteja[]
  mauzo: MauzoYaDuka[]
  opex: GharamaOpex[]
  orders: Order[]
  malipo: Malipo[]
  madeni: Deni[]
  zakaMalipo: MalipoZaka[]
  maombi: OmbiMatumizi[]
  ripotiBidhaa: RipotiBidhaa[]
  marekebishoStoki: MarekebishoStoki[]
  mishahara: Mshahara[]
  akaunti: AkauntiMfanyakazi[]
  uingizaji: UingizajiVifaa[]
  grn: GRN[]
  carts: PendingCart[]
  notifications: Notification[]
  documents: Document[]
  _meta: { version: string; seeded: boolean }
}

function readTable<K extends keyof Tables>(key: K): Tables[K] {
  try {
    const raw = localStorage.getItem(DB_PREFIX + key)
    if (!raw) return [] as unknown as Tables[K]
    return JSON.parse(raw)
  } catch (e) {
    console.error('[db] read error', key, e)
    return [] as unknown as Tables[K]
  }
}

function writeTable<K extends keyof Tables>(key: K, data: Tables[K]): boolean {
  try {
    localStorage.setItem(DB_PREFIX + key, JSON.stringify(data))
    return true
  } catch (e: any) {
    console.error('[db] write error', key, e?.name, e?.message)
    return false
  }
}

export const db = {
  get: readTable,
  set: writeTable,
  has(key: keyof Tables): boolean {
    return localStorage.getItem(DB_PREFIX + key) !== null
  },
  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(DB_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
  usage(): { bytes: number; mb: number } {
    let bytes = 0
    Object.keys(localStorage)
      .filter((k) => k.startsWith(DB_PREFIX))
      .forEach((k) => {
        bytes += (localStorage.getItem(k) || '').length
      })
    return { bytes, mb: +(bytes / (1024 * 1024)).toFixed(2) }
  },
}

export function makeId(prefix: string): string {
  const yr = new Date().getFullYear()
  const seq = Math.floor(Math.random() * 90000) + 10000
  return `${prefix}-${yr}-${seq}`
}