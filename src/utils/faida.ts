import type {
  MauzoYaDuka,
  GharamaOpex,
  FaidaKamili,
  GharamaZote,
  Mshahara,
} from '../types'

// ============================================================
// Hesabu ya Faida Ghafi kwa mauzo moja
// ============================================================
export function hesabuFaidaGhafi(mauzo: MauzoYaDuka) {
  return mauzo.jumlaMauzo - mauzo.cogs
}

// ============================================================
// Jumla ya gharama za OPEX kwa duka
// (bila mishahara, kwa kuwa mishahara inahesabiwa tofauti)
// ============================================================
export function jumlaOpex(gharama: GharamaOpex[], dukaId?: string) {
  return gharama
    .filter((g) => !dukaId || g.dukaId === dukaId)
    .filter((g) => g.aina !== 'mishahara')
    .reduce((s, g) => s + g.kiasi, 0)
}

// ============================================================
// Gharama kwa aina
// ============================================================
export function gharamaKwaAina(
  gharama: GharamaOpex[],
  dukaId?: string
): GharamaZote {
  const filtered = gharama.filter((g) => !dukaId || g.dukaId === dukaId)
  const sum = (aina: string) =>
    filtered.filter((g) => g.aina === aina).reduce((s, g) => s + g.kiasi, 0)

  const result: GharamaZote = {
    mishahara: sum('mishahara'),
    kodi: sum('kodi'),
    umeme: sum('umeme'),
    mafuta: sum('mafuta'),
    usafiri: sum('usafiri'),
    chakula: sum('chakula'),
    matengenezo: sum('matengenezo'),
    vifaa: sum('vifaa'),
    bima: sum('bima'),
    leseni: sum('leseni'),
    maji: sum('maji'),
    nyingine: sum('nyingine'),
    jumla: 0,
  }

  result.jumla =
    result.mishahara +
    result.kodi +
    result.umeme +
    result.mafuta +
    result.usafiri +
    result.chakula +
    result.matengenezo +
    result.vifaa +
    result.bima +
    result.leseni +
    result.maji +
    result.nyingine

  return result
}

// ============================================================
// Hesabu Kamili ya Faida (mishahara ni optional)
// ============================================================
export function hesabuFaidaKamili(
  mauzo: MauzoYaDuka[],
  opex: GharamaOpex[],
  mishahara: Mshahara[] = [],
  dukaId?: string
): FaidaKamili {
  const filteredMauzo = mauzo.filter((m) => !dukaId || m.dukaId === dukaId)
  const filteredOpex = opex.filter((g) => !dukaId || g.dukaId === dukaId)
  const filteredMishahara = mishahara.filter(
    (m) => !dukaId || m.dukaId === dukaId
  )

  const jumlaMauzo = filteredMauzo.reduce((s, m) => s + m.jumlaMauzo, 0)
  const jumlaCogs = filteredMauzo.reduce((s, m) => s + m.cogs, 0)
  const faidaGhafi = jumlaMauzo - jumlaCogs

  const opexBilaMishahara = filteredOpex.filter((g) => g.aina !== 'mishahara')
  const jumlaOpexZote = opexBilaMishahara.reduce((s, g) => s + g.kiasi, 0)

  const jumlaMishahara = filteredMishahara.reduce((s, m) => s + m.jumla, 0)

  const jumlaGharama = jumlaOpexZote + jumlaMishahara
  const faidaSafi = faidaGhafi - jumlaGharama

  const faidaKwaMungu = faidaSafi > 0 ? faidaSafi : 0
  const zaka = faidaKwaMungu * 0.1
  const sadaka = faidaKwaMungu * 0.1
  const jumlaYaMungu = zaka + sadaka
  const inayobaki = faidaSafi - jumlaYaMungu

  return {
    mauzo: jumlaMauzo,
    cogs: jumlaCogs,
    faidaGhafi,
    jumlaOpex: jumlaOpexZote,
    jumlaMishahara,
    jumlaGharama,
    faidaSafi,
    zaka,
    sadaka,
    jumlaYaMungu,
    inayobaki,
    hasara: faidaSafi < 0,
  }
}

// ============================================================
// Faida kwa kila bidhaa
// ============================================================
export function faidaKwaBidhaa(mauzo: MauzoYaDuka[]) {
  const map = new Map<
    string,
    { jina: string; sku: string; wingi: number; mauzo: number; cogs: number; faida: number }
  >()

  for (const m of mauzo) {
    const ratio = m.jumlaMauzo > 0 ? m.cogs / m.jumlaMauzo : 0
    for (const b of m.bidhaa) {
      const ex = map.get(b.id)
      if (ex) {
        ex.wingi += b.wingi
        ex.mauzo += b.jumla
        ex.cogs += b.jumla * ratio
        ex.faida = ex.mauzo - ex.cogs
      } else {
        const cogs = b.jumla * ratio
        map.set(b.id, {
          jina: b.jina,
          sku: b.sku,
          wingi: b.wingi,
          mauzo: b.jumla,
          cogs,
          faida: b.jumla - cogs,
        })
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.faida - a.faida)
}

// ============================================================
// Format pesa
// ============================================================
export function formatTsh(kiasi: number): string {
  return `Tsh ${Math.round(kiasi).toLocaleString()}`
}