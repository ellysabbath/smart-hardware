import type {
  AinaDocument,
  Document,
  DocumentSnapshot,
  MauzoYaDuka,
  Bidhaa,
  Mteja,
  Order,
  GharamaOpex,
  Mshahara,
} from '../types'

// ============================================================
// Helpers
// ============================================================
function fmtTsh(n: number): string {
  return `Tsh ${Math.round(n).toLocaleString()}`
}

function kipindiLeo(): string {
  return new Date().toLocaleDateString('sw-TZ', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// ============================================================
// 1. Ripoti ya Mauzo
// ============================================================
export function generateRipotiMauzo(
  mauzo: MauzoYaDuka[],
  dukaId?: string
): DocumentSnapshot {
  const filtered = dukaId ? mauzo.filter((m) => m.dukaId === dukaId) : mauzo

  // Group kwa tarehe
  const map = new Map<string, { mauzo: number; faida: number; orders: number }>()
  for (const m of filtered) {
    const ex = map.get(m.tarehe)
    if (ex) {
      ex.mauzo += m.jumlaMauzo
      ex.faida += m.faidaGhafi
      ex.orders += 1
    } else {
      map.set(m.tarehe, { mauzo: m.jumlaMauzo, faida: m.faidaGhafi, orders: 1 })
    }
  }

  const safu = Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([tarehe, v]) => [tarehe, v.mauzo, v.faida, v.orders])

  const jumlaMauzo = filtered.reduce((s, m) => s + m.jumlaMauzo, 0)
  const jumlaFaida = filtered.reduce((s, m) => s + m.faidaGhafi, 0)
  const jumlaOrders = filtered.length

  return {
    kichwa: ['Tarehe', 'Mauzo (Tsh)', 'Faida Ghafi (Tsh)', 'Orders'],
    safu,
    jumla: {
      mauzo: jumlaMauzo,
      faida: jumlaFaida,
      orders: jumlaOrders,
    },
    metadata: {
      'Jumla ya Mauzo': fmtTsh(jumlaMauzo),
      'Jumla ya Faida': fmtTsh(jumlaFaida),
      'Orders': jumlaOrders,
    },
  }
}

// ============================================================
// 2. Ripoti ya Stoki
// ============================================================
export function generateRipotiStoki(bidhaa: Bidhaa[]): DocumentSnapshot {
  const safu = bidhaa.map((b) => {
    const hali = b.stoki <= 0 ? 'Imeisha' : b.stoki <= 20 ? 'Inaribia' : 'Sawa'
    return [
      b.jina,
      b.sku,
      b.stoki,
      b.uom,
      fmtTsh(b.beiUnunuzi),
      fmtTsh(b.stoki * b.beiUnunuzi),
      hali,
    ]
  })

  const jumlaThamani = bidhaa.reduce((s, b) => s + b.stoki * b.beiUnunuzi, 0)
  const jumlaStoki = bidhaa.reduce((s, b) => s + b.stoki, 0)

  return {
    kichwa: ['Bidhaa', 'SKU', 'Stoki', 'UoM', 'Bei Ununuzi', 'Thamani', 'Hali'],
    safu,
    jumla: {
      bidhaa: bidhaa.length,
      jumla_stoki: jumlaStoki,
      thamani: jumlaThamani,
    },
    metadata: {
      'Bidhaa Zote': bidhaa.length,
      'Jumla Stoki': jumlaStoki,
      'Thamani': fmtTsh(jumlaThamani),
    },
  }
}

// ============================================================
// 3. Ripoti ya Wateja
// ============================================================
export function generateRipotiWateja(
  wateja: Mteja[],
  orders: Order[]
): DocumentSnapshot {
  const safu = wateja.map((m) => {
    const ordersZake = orders.filter((o) => o.simu === m.simu)
    const jumlaManunuzi = ordersZake.reduce((s, o) => s + o.jumla, 0)
    const jumlaIlipwa = ordersZake.reduce(
      (s, o) =>
        s + o.malipo.filter((x) => x.hali === 'imethibitishwa').reduce((a, x) => a + x.kiasi, 0),
      0
    )
    const deni = Math.max(jumlaManunuzi - jumlaIlipwa, 0)
    const mwisho = ordersZake[0]?.tarehe ?? '—'
    return [m.jina, m.simu, fmtTsh(jumlaManunuzi), fmtTsh(deni), mwisho]
  })

  const jumlaDeni = wateja.reduce((s, m) => {
    const ordersZake = orders.filter((o) => o.simu === m.simu)
    const jumlaManunuzi = ordersZake.reduce((a, o) => a + o.jumla, 0)
    const jumlaIlipwa = ordersZake.reduce(
      (a, o) =>
        a + o.malipo.filter((x) => x.hali === 'imethibitishwa').reduce((b, x) => b + x.kiasi, 0),
      0
    )
    return s + Math.max(jumlaManunuzi - jumlaIlipwa, 0)
  }, 0)

  return {
    kichwa: ['Mteja', 'Simu', 'Manunuzi', 'Deni', 'Mwisho Kununua'],
    safu,
    jumla: { wateja: wateja.length, madeni: jumlaDeni },
    metadata: {
      'Wateja': wateja.length,
      'Jumla Madeni': fmtTsh(jumlaDeni),
    },
  }
}

// ============================================================
// 4. Ripoti ya Madeni
// ============================================================
export function generateRipotiMadeni(
  wateja: Mteja[],
  orders: Order[]
): DocumentSnapshot {
  const safu: (string | number)[][] = []

  for (const m of wateja) {
    const ordersZake = orders.filter((o) => o.simu === m.simu)
    for (const o of ordersZake) {
      const jumlaIlipwa = o.malipo
        .filter((x) => x.hali === 'imethibitishwa')
        .reduce((s, x) => s + x.kiasi, 0)
      const baki = o.jumla - jumlaIlipwa
      if (baki > 0) {
        safu.push([m.jina, m.simu, o.id, fmtTsh(o.jumla), fmtTsh(jumlaIlipwa), fmtTsh(baki), o.tarehe])
      }
    }
  }

  const jumlaBaki = safu.reduce((s, r) => {
    const val = String(r[5]).replace(/[^0-9]/g, '')
    return s + Number(val)
  }, 0)

  return {
    kichwa: ['Mteja', 'Simu', 'Order', 'Jumla', 'Iliyolipwa', 'Baki', 'Tarehe'],
    safu,
    jumla: { madeni: safu.length, jumlaBaki },
    metadata: {
      'Orders zenye Deni': safu.length,
      'Jumla ya Madeni': fmtTsh(jumlaBaki),
    },
  }
}

// ============================================================
// 5. Ripoti ya Gharama (Opex + Mishahara)
// ============================================================
export function generateRipotiGharama(
  opex: GharamaOpex[],
  mishahara: Mshahara[]
): DocumentSnapshot {
  const safu: (string | number)[][] = []

  for (const o of opex) {
    safu.push([o.tarehe, 'Opex', o.aina, o.maelezo, fmtTsh(o.kiasi)])
  }

  for (const m of mishahara) {
    safu.push([
      m.tareheMalipo ?? '—',
      'Mshahara',
      m.jinaMtumiaji,
      `${m.nafasi} — ${m.mwezi}`,
      fmtTsh(m.jumla),
    ])
  }

  const jumlaOpex = opex.reduce((s, o) => s + o.kiasi, 0)
  const jumlaMishahara = mishahara.reduce((s, m) => s + m.jumla, 0)

  return {
    kichwa: ['Tarehe', 'Aina', 'Kundi', 'Maelezo', 'Kiasi'],
    safu,
    jumla: {
      opex: jumlaOpex,
      mishahara: jumlaMishahara,
      jumlaGharama: jumlaOpex + jumlaMishahara,
    },
    metadata: {
      'Opex': fmtTsh(jumlaOpex),
      'Mishahara': fmtTsh(jumlaMishahara),
      'Jumla Gharama': fmtTsh(jumlaOpex + jumlaMishahara),
    },
  }
}

// ============================================================
// 6. Ripoti ya Jumla (muhtasari wa biashara)
// ============================================================
export function generateRipotiJumla(
  mauzo: MauzoYaDuka[],
  opex: GharamaOpex[],
  mishahara: Mshahara[],
  wateja: Mteja[],
  bidhaa: Bidhaa[]
): DocumentSnapshot {
  const jumlaMauzo = mauzo.reduce((s, m) => s + m.jumlaMauzo, 0)
  const jumlaCogs = mauzo.reduce((s, m) => s + m.cogs, 0)
  const faidaGhafi = jumlaMauzo - jumlaCogs
  const jumlaOpex = opex.filter((o) => o.aina !== 'mishahara').reduce((s, o) => s + o.kiasi, 0)
  const jumlaMishahara = mishahara.reduce((s, m) => s + m.jumla, 0)
  const gharamaZote = jumlaOpex + jumlaMishahara
  const faidaSafi = faidaGhafi - gharamaZote
  const faidaKwaMungu = faidaSafi > 0 ? faidaSafi : 0
  const zaka = faidaKwaMungu * 0.1
  const sadaka = faidaKwaMungu * 0.1
  const inayobaki = faidaSafi - (zaka + sadaka)

  const safu: (string | number)[][] = [
    ['Mauzo Yote', fmtTsh(jumlaMauzo)],
    ['COGS (Gharama ya Bidhaa)', fmtTsh(jumlaCogs)],
    ['Faida Ghafi', fmtTsh(faidaGhafi)],
    ['Opex (bila mishahara)', fmtTsh(jumlaOpex)],
    ['Mishahara', fmtTsh(jumlaMishahara)],
    ['Gharama Zote', fmtTsh(gharamaZote)],
    ['Faida Safi', fmtTsh(faidaSafi)],
    ['Zaka (10%)', fmtTsh(zaka)],
    ['Sadaka (10%)', fmtTsh(sadaka)],
    ['Inayobaki', fmtTsh(inayobaki)],
    ['Wateja', wateja.length],
    ['Bidhaa', bidhaa.length],
  ]

  return {
    kichwa: ['Kipengele', 'Thamani'],
    safu,
    jumla: {
      mauzo: jumlaMauzo,
      faidaSafi,
      zaka,
      sadaka,
    },
    metadata: {
      'Faida Safi': fmtTsh(faidaSafi),
      'Zaka': fmtTsh(zaka),
      'Sadaka': fmtTsh(sadaka),
    },
  }
}

// ============================================================
// BUILD DOCUMENT — kuchagua snapshot kulingana na aina
// ============================================================
export interface BuildDocumentInput {
  aina: AinaDocument
  format: 'pdf' | 'csv' | 'excel'
  dukaId: string
  dukaJina: string
  aliyezalisha: string
  mauzo: MauzoYaDuka[]
  bidhaa: Bidhaa[]
  wateja: Mteja[]
  orders: Order[]
  opex: GharamaOpex[]
  mishahara: Mshahara[]
}

export function buildDocument(data: BuildDocumentInput): Omit<Document, 'id'> {
  const { aina, format, dukaId, dukaJina, aliyezalisha } = data

  let snapshot: DocumentSnapshot
  let jina: string

  switch (aina) {
    case 'mauzo':
      snapshot = generateRipotiMauzo(data.mauzo, dukaId)
      jina = `Ripoti ya Mauzo — ${kipindiLeo()}`
      break
    case 'stoki':
      snapshot = generateRipotiStoki(data.bidhaa)
      jina = `Ripoti ya Stoki — ${kipindiLeo()}`
      break
    case 'wateja':
      snapshot = generateRipotiWateja(data.wateja, data.orders)
      jina = `Ripoti ya Wateja — ${kipindiLeo()}`
      break
    case 'madeni':
      snapshot = generateRipotiMadeni(data.wateja, data.orders)
      jina = `Ripoti ya Madeni — ${kipindiLeo()}`
      break
    case 'gharama':
      snapshot = generateRipotiGharama(data.opex, data.mishahara)
      jina = `Ripoti ya Gharama — ${kipindiLeo()}`
      break
    case 'jumla':
    default:
      snapshot = generateRipotiJumla(
        data.mauzo,
        data.opex,
        data.mishahara,
        data.wateja,
        data.bidhaa
      )
      jina = `Ripoti ya Jumla — ${kipindiLeo()}`
      break
  }

  // Hesabu ukubwa wa makadirio
  const jsonSize = JSON.stringify(snapshot).length
  const ukubwa = `${Math.max(1, Math.ceil(jsonSize / 1024))} KB`

  return {
    jina,
    aina,
    format,
    dukaId,
    dukaJina,
    ukubwa,
    tarehe: new Date().toLocaleDateString('sw-TZ', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
    muda: new Date().toLocaleTimeString('sw-TZ', {
      hour: '2-digit', minute: '2-digit',
    }),
    hali: 'tayari',
    aliyezalisha,
    kipindi: kipindiLeo(),
    snapshot,
  }
}