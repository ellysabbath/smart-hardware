import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { db, makeId } from '../components/li/db'
import { seedIfEmpty } from '../components/li/seed'
import type {
  Duka,
  Mtumiaji,
  Bidhaa,
  Mteja,
  MauzoYaDuka,
  GharamaOpex,
  Order,
  Malipo,
  MalipoZaka,
  OmbiMatumizi,
  RipotiBidhaa,
  MarekebishoStoki,
  Mshahara,
  AkauntiMfanyakazi,
  UingizajiVifaa,
  GRN,
  PendingCart,
  Notification,
  Document,
} from '../types'

// ============================================================
// Helpers za kukokotoa (automatic)
// ============================================================
export function cogsForOrder(order: Order, bidhaa: Bidhaa[]): number {
  return order.bidhaa.reduce((s, b) => {
    const bh = bidhaa.find((x) => x.id === b.id)
    return s + (bh?.beiUnunuzi ?? 0) * b.wingi
  }, 0)
}

export function computeFaida(
  mauzo: MauzoYaDuka[],
  opex: GharamaOpex[],
  mishahara: Mshahara[],
  dukaId?: string
) {
  const fm = dukaId ? mauzo.filter((m) => m.dukaId === dukaId) : mauzo
  const fo = dukaId ? opex.filter((o) => o.dukaId === dukaId) : opex
  const fmish = dukaId ? mishahara.filter((m) => m.dukaId === dukaId) : mishahara

  const jumlaMauzo = fm.reduce((s, m) => s + m.jumlaMauzo, 0)
  const jumlaCogs = fm.reduce((s, m) => s + m.cogs, 0)
  const faidaGhafi = jumlaMauzo - jumlaCogs

  // OPEX = gharama za uendeshaji (bila mishahara ili kuepuka double count)
  const opexBilaMishahara = fo.filter((o) => o.aina !== 'mishahara')
  const jumlaOpex = opexBilaMishahara.reduce((s, o) => s + o.kiasi, 0)

  // Mishahara
  const jumlaMishahara = fmish.reduce((s, m) => s + m.jumla, 0)

  const jumlaGharama = jumlaOpex + jumlaMishahara
  const faidaSafi = faidaGhafi - jumlaGharama
  const faidaKwaMungu = faidaSafi > 0 ? faidaSafi : 0
  const zaka = faidaKwaMungu * 0.1
  const sadaka = faidaKwaMungu * 0.1

  return {
    mauzo: jumlaMauzo,
    cogs: jumlaCogs,
    faidaGhafi,
    jumlaOpex,
    jumlaMishahara,
    jumlaGharama,
    faidaSafi,
    zaka,
    sadaka,
    jumlaYaMungu: zaka + sadaka,
    inayobaki: faidaSafi - (zaka + sadaka),
    hasara: faidaSafi < 0,
  }
}

// ============================================================
// Store Context Interface
// ============================================================
interface StoreCtx {
  // data (read)
  maduka: Duka[]
  wafanyakazi: Mtumiaji[]
  bidhaa: Bidhaa[]
  wateja: Mteja[]
  mauzo: MauzoYaDuka[]
  opex: GharamaOpex[]
  orders: Order[]
  malipo: Malipo[]
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

  // mutations (write)
  ongezaDuka: (data: Omit<Duka, 'id'>) => Duka
  ongezaMtumiaji: (data: Omit<Mtumiaji, 'id'>) => Mtumiaji
  ongezaBidhaa: (data: Omit<Bidhaa, 'id'>) => Bidhaa
  ongezaMteja: (data: Omit<Mteja, 'id'>) => Mteja

  createOrder: (data: {
    mtejaId: string
    dukaId: string
    muuzaji: string
    items: { id: string; wingi: number }[]
  }) => Order

  ongezaMalipo: (data: {
    orderId: string
    njia: 'cash' | 'mpesa' | 'tigopesa' | 'benki'
    simu: string
    kumbukumbu: string
    kiasi: number
    hali: 'imethibitishwa' | 'inasubiri'
  }) => void

  ongezaOpex: (data: Omit<GharamaOpex, 'id' | 'tarehe'>) => GharamaOpex
  rekodiZaka: (data: Omit<MalipoZaka, 'id'>) => MalipoZaka
  ongezaOmbi: (
    data: Omit<OmbiMatumizi, 'id' | 'tarehe' | 'hali'>
  ) => OmbiMatumizi
  idhinishaOmbi: (id: string, maoni?: string) => void
  kataaOmbi: (id: string, maoni: string) => void
  ongezaRipotiBidhaa: (
    data: Omit<RipotiBidhaa, 'id' | 'tarehe' | 'hali' | 'thamani'>
  ) => RipotiBidhaa
  thibitishaRipotiBidhaa: (id: string) => void
  ongezaMarekebisho: (
    data: Omit<MarekebishoStoki, 'id' | 'tarehe' | 'hali' | 'thamani'>
  ) => MarekebishoStoki
  thibitishaMarekebisho: (id: string) => void
  ongezaMshahara: (
    data: Omit<Mshahara, 'id' | 'jumla' | 'hali'>
  ) => Mshahara
  lipaMshahara: (id: string) => void
  ongezaAkaunti: (data: Omit<AkauntiMfanyakazi, 'id'>) => AkauntiMfanyakazi
  ongezaUingizaji: (
    data: Omit<
      UingizajiVifaa,
      'id' | 'tarehe' | 'hali' | 'jumlaBidhaa' | 'jumlaThamani'
    >
  ) => UingizajiVifaa
  pokeaUingizaji: (id: string, aliyepokea: string) => void

  // documents (auto-generated kutoka data halisi)
  setDocuments: (v: Document[]) => void
  ongezaDocument: (data: Omit<Document, 'id'>) => Document
  futaDocument: (id: string) => void

  // sms simulation
  smsLog: { id: string; to: string; message: string; time: string }[]
  sendSms: (to: string, message: string) => void

  // convenience
  getBidhaa: (id: string) => Bidhaa | undefined
  getMteja: (id: string) => Mteja | undefined
  getDuka: (id: string) => Duka | undefined
  deniLaMteja: (mtejaId: string) => number
  faida: (dukaId?: string) => ReturnType<typeof computeFaida>
}

const Ctx = createContext<StoreCtx | null>(null)

// ============================================================
// Provider
// ============================================================
export function StoreProvider({ children }: { children: ReactNode }) {
  seedIfEmpty()

  const [maduka, setMaduka] = useState<Duka[]>(() => db.get('maduka'))
  const [wafanyakazi, setWafanyakazi] = useState<Mtumiaji[]>(() =>
    db.get('wafanyakazi')
  )
  const [bidhaa, setBidhaa] = useState<Bidhaa[]>(() => db.get('bidhaa'))
  const [wateja, setWateja] = useState<Mteja[]>(() => db.get('wateja'))
  const [mauzo, setMauzo] = useState<MauzoYaDuka[]>(() => db.get('mauzo'))
  const [opex, setOpex] = useState<GharamaOpex[]>(() => db.get('opex'))
  const [orders, setOrders] = useState<Order[]>(() => db.get('orders'))
  const [malipo, setMalipo] = useState<Malipo[]>(() => db.get('malipo'))
  const [zakaMalipo, setZakaMalipo] = useState<MalipoZaka[]>(() =>
    db.get('zakaMalipo')
  )
  const [maombi, setMaombi] = useState<OmbiMatumizi[]>(() => db.get('maombi'))
  const [ripotiBidhaa, setRipotiBidhaa] = useState<RipotiBidhaa[]>(() =>
    db.get('ripotiBidhaa')
  )
  const [marekebishoStoki, setMarekebishoStoki] = useState<MarekebishoStoki[]>(
    () => db.get('marekebishoStoki')
  )
  const [mishahara, setMishahara] = useState<Mshahara[]>(() =>
    db.get('mishahara')
  )
  const [akaunti, setAkaunti] = useState<AkauntiMfanyakazi[]>(() =>
    db.get('akaunti')
  )
  const [uingizaji, setUingizaji] = useState<UingizajiVifaa[]>(() =>
    db.get('uingizaji')
  )
  const [grn, setGrn] = useState<GRN[]>(() => db.get('grn'))
  const [carts, setCarts] = useState<PendingCart[]>(() => db.get('carts'))
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    db.get('notifications')
  )
  const [documents, setDocuments] = useState<Document[]>(() =>
    db.get('documents')
  )
  const [smsLog, setSmsLog] = useState<
    { id: string; to: string; message: string; time: string }[]
  >([])

  // ============================================================
  // PERSIST
  // ============================================================
  const persist = useCallback(
    (key: string, data: any, setter: (v: any) => void) => {
      setter(data)
      db.set(key as any, data as any)
    },
    []
  )

  // ============================================================
  // SMS
  // ============================================================
  const sendSms = useCallback((to: string, message: string) => {
    const log = {
      id: makeId('SMS'),
      to,
      message,
      time: new Date().toLocaleTimeString('sw-TZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setSmsLog((prev) => [log, ...prev])
  }, [])

  // ============================================================
  // MUTATIONS ZA MSINGI
  // ============================================================
  const ongezaDuka: StoreCtx['ongezaDuka'] = (data) => {
    const d: Duka = { ...data, id: makeId('d') }
    persist('maduka', [d, ...maduka], setMaduka)
    return d
  }

  const ongezaMtumiaji: StoreCtx['ongezaMtumiaji'] = (data) => {
    const u: Mtumiaji = { ...data, id: makeId('u') }
    persist('wafanyakazi', [u, ...wafanyakazi], setWafanyakazi)
    return u
  }

  const ongezaBidhaa: StoreCtx['ongezaBidhaa'] = (data) => {
    const b: Bidhaa = { ...data, id: makeId('b') }
    persist('bidhaa', [b, ...bidhaa], setBidhaa)
    return b
  }

  const ongezaMteja: StoreCtx['ongezaMteja'] = (data) => {
    const m: Mteja = { ...data, id: makeId('c') }
    persist('wateja', [m, ...wateja], setWateja)
    return m
  }

  // ============================================================
  // CREATE ORDER
  // ============================================================
  const createOrder: StoreCtx['createOrder'] = ({
    mtejaId,
    dukaId,
    muuzaji,
    items,
  }) => {
    const mteja = wateja.find((c) => c.id === mtejaId)
    const duka = maduka.find((d) => d.id === dukaId)
    if (!mteja || !duka) throw new Error('Mteja au duka haipo')

    const orderItems = items.map((it) => {
      const b = bidhaa.find((x) => x.id === it.id)!
      return {
        id: b.id,
        jina: b.jina,
        sku: b.sku,
        uom: b.uom,
        bei: b.beiMauzo,
        wingi: it.wingi,
        jumla: b.beiMauzo * it.wingi,
      }
    })
    const jumla = orderItems.reduce((s, b) => s + b.jumla, 0)

    const order: Order = {
      id: makeId('ORD'),
      quotationId: makeId('Q'),
      mteja: mteja.jina,
      simu: mteja.simu,
      bidhaa: orderItems,
      jumla,
      malipo: [],
      hali: 'inasubiri_malipo',
      tarehe: new Date().toISOString().split('T')[0],
    }

    // Punguza stock
    const bidhaaMpya = bidhaa.map((b) => {
      const it = items.find((x) => x.id === b.id)
      return it ? { ...b, stoki: Math.max(b.stoki - it.wingi, 0) } : b
    })

    // Ongeza mauzo record
    const cogs = cogsForOrder(order, bidhaa)
    const sale: MauzoYaDuka = {
      id: makeId('SALE'),
      tarehe: order.tarehe,
      dukaId: duka.id,
      dukaJina: duka.jina,
      muuzaji,
      bidhaa: orderItems,
      jumlaMauzo: jumla,
      cogs,
      faidaGhafi: jumla - cogs,
    }

    // Sasisha mteja
    const watejaMpya = wateja.map((c) =>
      c.id === mtejaId ? { ...c, jumlaManunuzi: c.jumlaManunuzi + jumla } : c
    )

    persist('bidhaa', bidhaaMpya, setBidhaa)
    persist('orders', [order, ...orders], setOrders)
    persist('mauzo', [sale, ...mauzo], setMauzo)
    persist('wateja', watejaMpya, setWateja)

    sendSms(
      mteja.simu,
      `Habari ${mteja.jina}, order yako ${order.id} ya Tsh ${jumla.toLocaleString()} imepokelewa. Asante!`
    )

    return order
  }

  // ============================================================
  // ONGEZA MALIPO
  // ============================================================
  const ongezaMalipo: StoreCtx['ongezaMalipo'] = (data) => {
    const order = orders.find((o) => o.id === data.orderId)
    if (!order) return

    const m: Malipo = {
      id: makeId('M'),
      njia: data.njia as any,
      simu: data.simu,
      kumbukumbu: data.kumbukumbu,
      kiasi: data.kiasi,
      tarehe: new Date().toISOString().split('T')[0],
      hali: data.hali as any,
    }

    const malipoYote = [...order.malipo, m]
    const jumlaIliyolipwa = malipoYote
      .filter((x) => x.hali === 'imethibitishwa')
      .reduce((s, x) => s + x.kiasi, 0)

    const orderMpya: Order = {
      ...order,
      malipo: malipoYote,
      hali: jumlaIliyolipwa >= order.jumla ? 'imekamilika' : order.hali,
    }

    persist(
      'orders',
      orders.map((o) => (o.id === order.id ? orderMpya : o)),
      setOrders
    )

    persist('malipo', [m, ...malipo], setMalipo)

    sendSms(
      data.simu,
      `Malipo ya Tsh ${data.kiasi.toLocaleString()} kwa order ${order.id} yamepokelewa. Asante!`
    )
  }

  // ============================================================
  // OPEX
  // ============================================================
  const ongezaOpex: StoreCtx['ongezaOpex'] = (data) => {
    const o: GharamaOpex = {
      ...data,
      id: makeId('OPEX'),
      tarehe: new Date().toISOString().split('T')[0],
    }
    persist('opex', [o, ...opex], setOpex)
    return o
  }

  // ============================================================
  // ZAKA
  // ============================================================
  const rekodiZaka: StoreCtx['rekodiZaka'] = (data) => {
    const z: MalipoZaka = { ...data, id: makeId('ZAKA') }
    persist('zakaMalipo', [z, ...zakaMalipo], setZakaMalipo)
    return z
  }

  // ============================================================
  // MAOMBI
  // ============================================================
  const ongezaOmbi: StoreCtx['ongezaOmbi'] = (data) => {
    const om: OmbiMatumizi = {
      ...data,
      id: makeId('EXP'),
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
    }
    persist('maombi', [om, ...maombi], setMaombi)
    sendSms(
      '0716-789-012',
      `Ombi jipya ${om.id} la Tsh ${om.kiasi.toLocaleString()} kutoka ${om.aliyeomba}.`
    )
    return om
  }

  const idhinishaOmbi = (id: string, maoni?: string) => {
    persist(
      'maombi',
      maombi.map((m) =>
        m.id === id
          ? {
              ...m,
              hali: 'imekubaliwa',
              maoni,
              aliyeidhinisha: 'Moses Kimaro',
              tareheIdhini: new Date().toISOString().split('T')[0],
            }
          : m
      ),
      setMaombi
    )
    const om = maombi.find((m) => m.id === id)
    if (om)
      sendSms(
        om.simu,
        `Ombi lako ${om.id} la Tsh ${om.kiasi.toLocaleString()} limekubaliwa.`
      )
  }

  const kataaOmbi = (id: string, maoni: string) => {
    persist(
      'maombi',
      maombi.map((m) =>
        m.id === id
          ? {
              ...m,
              hali: 'imekataliwa',
              maoni,
              aliyeidhinisha: 'Moses Kimaro',
              tareheIdhini: new Date().toISOString().split('T')[0],
            }
          : m
      ),
      setMaombi
    )
    const om = maombi.find((m) => m.id === id)
    if (om)
      sendSms(
        om.simu,
        `Ombi lako ${om.id} limekataliwa. Sababu: ${maoni}`
      )
  }

  // ============================================================
  // RIPOTI BIDHAA
  // ============================================================
  const ongezaRipotiBidhaa: StoreCtx['ongezaRipotiBidhaa'] = (data) => {
    const b = bidhaa.find((x) => x.id === data.bidhaaId)
    const r: RipotiBidhaa = {
      ...data,
      id: makeId('RIP'),
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
      thamani: data.wingi * (b?.beiUnunuzi ?? 0),
    }
    persist('ripotiBidhaa', [r, ...ripotiBidhaa], setRipotiBidhaa)
    return r
  }

  const thibitishaRipotiBidhaa = (id: string) => {
    const r = ripotiBidhaa.find((x) => x.id === id)
    if (!r) return
    const bidhaaMpya = bidhaa.map((b) =>
      b.id === r.bidhaaId ? { ...b, stoki: Math.max(b.stoki - r.wingi, 0) } : b
    )
    persist('bidhaa', bidhaaMpya, setBidhaa)
    persist(
      'ripotiBidhaa',
      ripotiBidhaa.map((x) =>
        x.id === id ? { ...x, hali: 'imethibitishwa' } : x
      ),
      setRipotiBidhaa
    )
  }

  // ============================================================
  // MAREKEBISHO STOKI
  // ============================================================
  const ongezaMarekebisho: StoreCtx['ongezaMarekebisho'] = (data) => {
    const b = bidhaa.find((x) => x.id === data.bidhaaId)
    const m: MarekebishoStoki = {
      ...data,
      id: makeId('ADJ'),
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
      thamani: data.wingi * (b?.beiUnunuzi ?? 0),
    }
    persist('marekebishoStoki', [m, ...marekebishoStoki], setMarekebishoStoki)
    return m
  }

  const thibitishaMarekebisho = (id: string) => {
    const m = marekebishoStoki.find((x) => x.id === id)
    if (!m) return
    if (
      ['uharibifu', 'expiry', 'upotevu', 'kurudisha_msambazaji'].includes(
        m.aina
      )
    ) {
      const bidhaaMpya = bidhaa.map((b) =>
        b.id === m.bidhaaId
          ? { ...b, stoki: Math.max(b.stoki - m.wingi, 0) }
          : b
      )
      persist('bidhaa', bidhaaMpya, setBidhaa)
    }
    persist(
      'marekebishoStoki',
      marekebishoStoki.map((x) =>
        x.id === id ? { ...x, hali: 'imethibitishwa' } : x
      ),
      setMarekebishoStoki
    )
  }

  // ============================================================
  // MISHAHARA
  // ============================================================
  const ongezaMshahara: StoreCtx['ongezaMshahara'] = (data) => {
    const jumla =
      data.mshaharaMsingi +
      data.posho +
      data.overtime +
      data.mafao -
      data.makato
    const m: Mshahara = {
      ...data,
      id: makeId('SAL'),
      jumla,
      hali: 'inasubiri',
    }
    persist('mishahara', [m, ...mishahara], setMishahara)
    return m
  }

  const lipaMshahara = (id: string) => {
    const m = mishahara.find((x) => x.id === id)
    if (!m) return
    const acc = akaunti.find(
      (a) => a.mtumiajiId === m.mtumiajiId && a.ndiyoMsingi
    )
    if (!acc) {
      sendSms(
        '—',
        `Mshahara ${m.id} wa ${m.jinaMtumiaji} haujalipwa: hana akaunti msingi.`
      )
      return
    }
    persist(
      'mishahara',
      mishahara.map((x) =>
        x.id === id
          ? {
              ...x,
              hali: 'imelipwa',
              tareheMalipo: new Date().toISOString().split('T')[0],
              akauntiMalipo: acc.namba,
              kumbukumbu: makeId('PAY'),
            }
          : x
      ),
      setMishahara
    )
    sendSms(
      acc.namba,
      `Mshahara wa ${m.jinaMtumiaji} wa ${m.mwezi} kiasi Tsh ${m.jumla.toLocaleString()} umelipwa kwenye ${acc.jina}.`
    )
  }

  const ongezaAkaunti: StoreCtx['ongezaAkaunti'] = (data) => {
    const a: AkauntiMfanyakazi = { ...data, id: makeId('ACC') }
    persist('akaunti', [...akaunti, a], setAkaunti)
    return a
  }

  // ============================================================
  // UINGIZAJI VIFAA
  // ============================================================
  const ongezaUingizaji: StoreCtx['ongezaUingizaji'] = (data) => {
    const jumlaBidhaa = data.bidhaa.reduce((s, b) => s + b.stoki, 0)
    const jumlaThamani = data.bidhaa.reduce(
      (s, b) => s + b.stoki * b.beiUnunuzi,
      0
    )
    const u: UingizajiVifaa = {
      ...data,
      id: makeId('INP'),
      tarehe: new Date().toISOString().split('T')[0],
      hali: 'inasubiri',
      jumlaBidhaa,
      jumlaThamani,
    }
    persist('uingizaji', [u, ...uingizaji], setUingizaji)
    return u
  }

  // ✅ SAHIHI: sasa iko ndani ya Provider, si nje
  const pokeaUingizaji: StoreCtx['pokeaUingizaji'] = (id, aliyepokea) => {
    const u = uingizaji.find((x) => x.id === id)
    if (!u) return

    // Ingiza bidhaa kwenye stock halisi
    const bidhaaMpya: Bidhaa[] = u.bidhaa.map((b) => ({
      id: makeId('b'),
      sku: b.sku,
      jina: b.jina,
      kundi: b.kundi,
      beiMauzo: b.beiMauzo,
      beiUnunuzi: b.beiUnunuzi,
      uom: b.uom,
      stoki: b.stoki,
      duka: u.dukaJina,
      location: b.location,
      expiry: b.expiry,
      iconKey: b.iconKey,
      pichaUrl: b.pichaUrl,
    }))

    persist('bidhaa', [...bidhaaMpya, ...bidhaa], setBidhaa)
    persist(
      'uingizaji',
      uingizaji.map((x) =>
        x.id === id
          ? {
              ...x,
              hali: 'imepokelewa',
              aliyepokea,
              tareheKupokea: new Date().toISOString().split('T')[0],
            }
          : x
      ),
      setUingizaji
    )
    sendSms(
      '0716-789-012',
      `Uingizaji ${id} umepokelewa na ${aliyepokea}. Bidhaa ${u.bidhaa.length}.`
    )
  }

  // ============================================================
  // DOCUMENTS (auto-generated kutoka data halisi)
  // ============================================================
  const setDocumentsSafe: StoreCtx['setDocuments'] = (v) => {
    persist('documents', v, setDocuments)
  }

  const ongezaDocument: StoreCtx['ongezaDocument'] = (data) => {
    const doc: Document = {
      ...data,
      id: makeId('DOC'),
    }
    persist('documents', [doc, ...documents], setDocuments)
    return doc
  }

  const futaDocument = (id: string) => {
    persist(
      'documents',
      documents.filter((d) => d.id !== id),
      setDocuments
    )
  }

  // ============================================================
  // CONVENIENCE
  // ============================================================
  const getBidhaa = (id: string) => bidhaa.find((b) => b.id === id)
  const getMteja = (id: string) => wateja.find((m) => m.id === id)
  const getDuka = (id: string) => maduka.find((d) => d.id === id)

  const deniLaMteja = (mtejaId: string) => {
    const mteja = wateja.find((c) => c.id === mtejaId)
    if (!mteja) return 0
    const ordersZake = orders.filter((o) => o.simu === mteja.simu)
    const jumlaOrder = ordersZake.reduce((s, o) => s + o.jumla, 0)
    const jumlaMalipo = ordersZake.reduce((s, o) => {
      return (
        s +
        o.malipo
          .filter((m) => m.hali === 'imethibitishwa')
          .reduce((a, m) => a + m.kiasi, 0)
      )
    }, 0)
    return Math.max(jumlaOrder - jumlaMalipo, 0)
  }

  // ✅ Pitisha mishahara kama parameter ya 3
  const faida = (dukaId?: string) =>
    computeFaida(mauzo, opex, mishahara, dukaId)

  // ============================================================
  // VALUE
  // ============================================================
  const value: StoreCtx = {
    maduka,
    wafanyakazi,
    bidhaa,
    wateja,
    mauzo,
    opex,
    orders,
    malipo,
    zakaMalipo,
    maombi,
    ripotiBidhaa,
    marekebishoStoki,
    mishahara,
    akaunti,
    uingizaji,
    grn,
    carts,
    notifications,
    documents,
    smsLog,
    ongezaDuka,
    ongezaMtumiaji,
    ongezaBidhaa,
    ongezaMteja,
    createOrder,
    ongezaMalipo,
    ongezaOpex,
    rekodiZaka,
    ongezaOmbi,
    idhinishaOmbi,
    kataaOmbi,
    ongezaRipotiBidhaa,
    thibitishaRipotiBidhaa,
    ongezaMarekebisho,
    thibitishaMarekebisho,
    ongezaMshahara,
    lipaMshahara,
    ongezaAkaunti,
    ongezaUingizaji,
    pokeaUingizaji,
    setDocuments: setDocumentsSafe,
    ongezaDocument,
    futaDocument,
    sendSms,
    getBidhaa,
    getMteja,
    getDuka,
    deniLaMteja,
    faida,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}