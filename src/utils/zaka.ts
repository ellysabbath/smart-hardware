import type { MauzoYaDuka, GharamaOpex, ZakaKipindi, Mshahara } from '../types'
import { hesabuFaidaKamili } from './faida'

// ============================================================
// Hesabu ya Zaka kwa Kipindi
// ============================================================
export function hesabuZakaKwaKipindi(
  mauzo: MauzoYaDuka[],
  opex: GharamaOpex[],
  mishahara: Mshahara[] = []
): ZakaKipindi[] {
  // Kundi kwa tarehe
  const map = new Map<
    string,
    { mauzo: MauzoYaDuka[]; opex: GharamaOpex[]; mishahara: Mshahara[] }
  >()

  for (const m of mauzo) {
    const entry = map.get(m.tarehe) || { mauzo: [], opex: [], mishahara: [] }
    entry.mauzo.push(m)
    map.set(m.tarehe, entry)
  }

  for (const o of opex) {
    const entry = map.get(o.tarehe) || { mauzo: [], opex: [], mishahara: [] }
    entry.opex.push(o)
    map.set(o.tarehe, entry)
  }

  for (const ms of mishahara) {
    const tarehe = ms.tareheMalipo ?? new Date().toISOString().split('T')[0]
    const entry = map.get(tarehe) || { mauzo: [], opex: [], mishahara: [] }
    entry.mishahara.push(ms)
    map.set(tarehe, entry)
  }

  // Hesabu kwa kila tarehe
  const result: ZakaKipindi[] = []
  const tareheZote = Array.from(map.keys()).sort()

  for (const tarehe of tareheZote) {
    const { mauzo: m, opex: o, mishahara: ms } = map.get(tarehe)!
    const f = hesabuFaidaKamili(m, o, ms)
    result.push({
      tarehe,
      faidaHalisi: f.faidaSafi,
      zaka: f.zaka,
      sadaka: f.sadaka,
      jumlaYaMungu: f.jumlaYaMungu,
      salioLako: f.inayobaki,
    })
  }

  return result
}

// ============================================================
// Jumla ya Zaka kwa Kipindi
// ============================================================
export function jumlaZaka(vipindi: ZakaKipindi[]) {
  return vipindi.reduce(
    (a, f) => ({
      faida: a.faida + f.faidaHalisi,
      zaka: a.zaka + f.zaka,
      sadaka: a.sadaka + f.sadaka,
      jumlaYaMungu: a.jumlaYaMungu + f.jumlaYaMungu,
      salioLako: a.salioLako + f.salioLako,
    }),
    { faida: 0, zaka: 0, sadaka: 0, jumlaYaMungu: 0, salioLako: 0 }
  )
}

// ============================================================
// Chuja kwa kipindi
// ============================================================
export function chujaKwaKipindi(
  vipindi: ZakaKipindi[],
  kipindi: 'siku' | 'wiki' | 'mwezi' | 'mwaka',
  tarehe?: string
): ZakaKipindi[] {
  if (kipindi === 'siku') {
    if (!tarehe) return vipindi
    return vipindi.filter((v) => v.tarehe === tarehe)
  }

  const ref = tarehe ? new Date(tarehe) : new Date()
  const year = ref.getFullYear()
  const month = ref.getMonth()
  const day = ref.getDate()

  if (kipindi === 'mwaka') {
    return vipindi.filter((v) => {
      const d = new Date(v.tarehe)
      return d.getFullYear() === year
    })
  }

  if (kipindi === 'mwezi') {
    return vipindi.filter((v) => {
      const d = new Date(v.tarehe)
      return d.getFullYear() === year && d.getMonth() === month
    })
  }

  if (kipindi === 'wiki') {
    const weekStart = new Date(ref)
    weekStart.setDate(day - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    return vipindi.filter((v) => {
      const d = new Date(v.tarehe)
      return d >= weekStart && d < weekEnd
    })
  }

  return vipindi
}