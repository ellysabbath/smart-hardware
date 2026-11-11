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
  NjiaMalipo,
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

  const opexBilaMishahara = fo.filter((o) => o.aina !== 'mishahara')
  const jumlaOpex = opexBilaMishahara.reduce((s, o) => s + o.kiasi, 0)

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

  // setters
  setMaduka: (v: Duka[]) => void
  setWafanyakazi: (v: Mtumiaji[]) => void
  setBidhaa: (v: Bidhaa[]) => void
  setWateja: (v: Mteja[]) => void
  setMauzo: (v: MauzoYaDuka[]) => void
  setOpex: (v: GharamaOpex[]) => void
  setOrders: (v: Order[]) => void
  setMalipo: (v: Malipo[]) => void
  setZakaMalipo: (v: MalipoZaka[]) => void
  setMaombi: (v: OmbiMatumizi[]) => void
  setRipotiBidhaa: (v: RipotiBidhaa[]) => void
  setMarekebishoStoki: (v: MarekebishoStoki[]) => void
  setMishahara: (v: Mshahara[]) => void
  setAkaunti: (v: AkauntiMfanyakazi[]) => void
  setUingizaji: (v: UingizajiVifaa[]) => void
  setGrn: (v: GRN[]) => void
  setCarts: (v: PendingCart[]) => void
  setNotifications: (v: Notification[]) => void
  setDocuments: (v: Document[]) => void

  // mutations
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
    njia: NjiaMalipo
    simu: string
    kumbukumbu: string
    kiasi: number
    hali: 'imethibitishwa' | 'inasubiri'
  }) => void

  thibitishaMalipo: (orderId: string, malipoId: string) => void
  kataaMalipo: (orderId: string, malipoId: string) => void

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

  ongezaDocument: (data: Omit<Document, 'id'>) => Document
  futaDocument: (id: string) => void

  smsLog: { id: string; to: string; message: string; time: string }[]
  sendSms: (to: string, message: string) => void

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

  const [maduka, setMadukaState] = useState<Duka[]>(() => db.get('maduka'))
  const [wafanyakazi, setWafanyakaziState] = useState<Mtumiaji[]>(() =>
    db.get('wafanyakazi')
  )
  const [bidhaa, setBidhaaState] = useState<Bidhaa[]>(() => db.get('bidhaa'))
  const [wateja, setWatejaState] = useState<Mteja[]>(() => db.get('wateja'))
  const [mauzo, setMauzoState] = useState<MauzoYaDuka[]>(() => db.get('mauzo'))
  const [opex, setOpexState] = useState<GharamaOpex[]>(() => db.get('opex'))
  const [orders, setOrdersState] = useState<Order[]>(() => db.get('orders'))
  const [malipo, setMalipoState] = useState<Malipo[]>(() => db.get('malipo'))
  const [zakaMalipo, setZakaMalipoState] = useState<MalipoZaka[]>(() =>
    db.get('zakaMalipo')
  )
  const [maombi, setMaombiState] = useState<OmbiMatumizi[]>(() => db.get('maombi'))
  const [ripotiBidhaa, setRipotiBidhaaState] = useState<RipotiBidhaa[]>(() =>
    db.get('ripotiBidhaa')
  )
  const [marekebishoStoki, setMarekebishoStokiState] = useState<
    MarekebishoStoki[]
  >(() => db.get('marekebishoStoki'))
  const [mishahara, setMishaharaState] = useState<Mshahara[]>(() =>
    db.get('mishahara')
  )
  const [akaunti, setAkauntiState] = useState<AkauntiMfanyakazi[]>(() =>
    db.get('akaunti')
  )
  const [uingizaji, setUingizajiState] = useState<UingizajiVifaa[]>(() =>
    db.get('uingizaji')
  )
  const [grn, setGrnState] = useState<GRN[]>(() => db.get('grn'))
  const [carts, setCartsState] = useState<PendingCart[]>(() => db.get('carts'))
  const [notifications, setNotificationsState] = useState<Notification[]>(() =>
    db.get('notifications')
  )
  const [documents, setDocumentsState] = useState<Document[]>(() =>
    db.get('documents')
  )
  const [smsLog, setSmsLog] = useState<
    { id: string; to: string; message: string; time: string }[]
  >([])

  // ============================================================
  // PERSIST
  // ============================================================
  const persist = useCallback(
    (key: string, data: any, setter: (v: any) => void): boolean => {
      setter(data)
      const ok = db.set(key as any, data as any)
      if (!ok) {
        console.error('[store] Imeshindwa kuhifadhi', key)
      }
      return ok
    },
    []
  )

  // ============================================================
  // SETTERS
  // ============================================================
  const setMaduka = (v: Duka[]) => persist('maduka', v, setMadukaState)
  const setWafanyakazi = (v: Mtumiaji[]) =>
    persist('wafanyakazi', v, setWafanyakaziState)
  const setBidhaa = (v: Bidhaa[]) => persist('bidhaa', v, setBidhaaState)
  const setWateja = (v: Mteja[]) => persist('wateja', v, setWatejaState)
  const setMauzo = (v: MauzoYaDuka[]) => persist('mauzo', v, setMauzoState)
  const setOpex = (v: GharamaOpex[]) => persist('opex', v, setOpexState)
  const setOrders = (v: Order[]) => persist('orders', v, setOrdersState)
  const setMalipo = (v: Malipo[]) => persist('malipo', v, setMalipoState)
  const setZakaMalipo = (v: MalipoZaka[]) =>
    persist('zakaMalipo', v, setZakaMalipoState)
  const setMaombi = (v: OmbiMatumizi[]) => persist('maombi', v, setMaombiState)
  const setRipotiBidhaa = (v: RipotiBidhaa[]) =>
    persist('ripotiBidhaa', v, setRipotiBidhaaState)
  const setMarekebishoStoki = (v: MarekebishoStoki[]) =>
    persist('marekebishoStoki', v, setMarekebishoStokiState)
  const setMishahara = (v: Mshahara[]) =>
    persist('mishahara', v, setMishaharaState)
  const setAkaunti = (v: AkauntiMfanyakazi[]) =>
    persist('akaunti', v, setAkauntiState)
  const setUingizaji = (v: UingizajiVifaa[]) =>
    persist('uingizaji', v, setUingizajiState)
  const setGrn = (v: GRN[]) => persist('grn', v, setGrnState)
  const setCarts = (v: PendingCart[]) => persist('carts', v, setCartsState)
  const setNotifications = (v: Notification[]) =>
    persist('notifications', v, setNotificationsState)
  const setDocuments = (v: Document[]) =>
    persist('documents', v, setDocumentsState)

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
    persist('maduka', [d, ...maduka], setMadukaState)
    return d
  }

  const ongezaMtumiaji: StoreCtx['ongezaMtumiaji'] = (data) => {
    const u: Mtumiaji = { ...data, id: makeId('u') }
    persist('wafanyakazi', [u, ...wafanyakazi], setWafanyakaziState)
    return u
  }

  const ongezaBidhaa: StoreCtx['ongezaBidhaa'] = (data) => {
    const b: Bidhaa = { ...data, id: makeId('b') }
    persist('bidhaa', [b, ...bidhaa], setBidhaaState)
    return b
  }

  const ongezaMteja: StoreCtx['ongezaMteja'] = (data) => {
    const m: Mteja = { ...data, id: makeId('c') }
    persist('wateja', [m, ...wateja], setWatejaState)
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

    const bidhaaMpya = bidhaa.map((b) => {
      const it = items.find((x) => x.id === b.id)
      return it ? { ...b, stoki: Math.max(b.stoki - it.wingi, 0) } : b
    })

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

    const watejaMpya = wateja.map((c) =>
      c.id === mtejaId ? { ...c, jumlaManunuzi: c.jumlaManunuzi + jumla } : c
    )

    persist('bidhaa', bidhaaMpya, setBidhaaState)
    persist('orders', [order, ...orders], setOrdersState)
    persist('mauzo', [sale, ...mauzo], setMauzoState)
    persist('wateja', watejaMpya, setWatejaState)

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
      njia: data.njia,
      simu: data.simu,
      kumbukumbu: data.kumbukumbu,
      kiasi: data.kiasi,
      tarehe: new Date().toISOString().split('T')[0],
      hali: data.hali,
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
      setOrdersState
    )

    persist('malipo', [m, ...malipo], setMalipoState)

    sendSms(
      data.simu,
      `Malipo ya Tsh ${data.kiasi.toLocaleString()} kwa order ${order.id} yamepokelewa. Asante!`
    )
  }

  // ============================================================
  // THIBITISHA / KATAA MALIPO (kwa mmiliki)
  // ============================================================
  const thibitishaMalipo: StoreCtx['thibitishaMalipo'] = (orderId, malipoId) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const malipoMpya = order.malipo.map((m) =>
      m.id === malipoId ? { ...m, hali: 'imethibitishwa' as const } : m
    )

    const jumlaIliyolipwa = malipoMpya
      .filter((m) => m.hali === 'imethibitishwa')
      .reduce((s, m) => s + m.kiasi, 0)

    const orderMpya: Order = {
      ...order,
      malipo: malipoMpya,
      hali: jumlaIliyolipwa >= order.jumla ? 'imekamilika' : order.hali,
    }

    persist(
      'orders',
      orders.map((o) => (o.id === orderId ? orderMpya : o)),
      setOrdersState
    )
    persist(
      'malipo',
      malipo.map((m) =>
        m.id === malipoId ? { ...m, hali: 'imethibitishwa' as const } : m
      ),
      setMalipoState
    )

    const malipoThibitisha = malipoMpya.find((m) => m.id === malipoId)
    if (malipoThibitisha) {
      sendSms(
        malipoThibitisha.simu,
        `Malipo yako ya Tsh ${malipoThibitisha.kiasi.toLocaleString()} yamethibitishwa. Order ${orderId} imekamilika.`
      )
    }
  }

  const kataaMalipo: StoreCtx['kataaMalipo'] = (orderId, malipoId) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const malipoMpya = order.malipo.map((m) =>
      m.id === malipoId ? { ...m, hali: 'imekataliwa' as const } : m
    )

    persist(
      'orders',
      orders.map((o) => (o.id === orderId ? { ...o, malipo: malipoMpya } : o)),
      setOrdersState
    )
    persist(
      'malipo',
      malipo.map((m) =>
        m.id === malipoId ? { ...m, hali: 'imekataliwa' as const } : m
      ),
      setMalipoState
    )

    const malipoKataa = malipoMpya.find((m) => m.id === malipoId)
    if (malipoKataa) {
      sendSms(
        malipoKataa.simu,
        `Malipo yako ya Tsh ${malipoKataa.kiasi.toLocaleString()} yamekataliwa. Tafadhali wasiliana na duka.`
      )
    }
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
    persist('opex', [o, ...opex], setOpexState)
    return o
  }

  // ============================================================
  // ZAKA
  // ============================================================
  const rekodiZaka: StoreCtx['rekodiZaka'] = (data) => {
    const z: MalipoZaka = { ...data, id: makeId('ZAKA') }
    persist('zakaMalipo', [z, ...zakaMalipo], setZakaMalipoState)
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
    persist('maombi', [om, ...maombi], setMaombiState)
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
      setMaombiState
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
      setMaombiState
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
    persist('ripotiBidhaa', [r, ...ripotiBidhaa], setRipotiBidhaaState)
    return r
  }

  const thibitishaRipotiBidhaa = (id: string) => {
    const r = ripotiBidhaa.find((x) => x.id === id)
    if (!r) return
    const bidhaaMpya = bidhaa.map((b) =>
      b.id === r.bidhaaId ? { ...b, stoki: Math.max(b.stoki - r.wingi, 0) } : b
    )
    persist('bidhaa', bidhaaMpya, setBidhaaState)
    persist(
      'ripotiBidhaa',
      ripotiBidhaa.map((x) =>
        x.id === id ? { ...x, hali: 'imethibitishwa' } : x
      ),
      setRipotiBidhaaState
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
    persist('marekebishoStoki', [m, ...marekebishoStoki], setMarekebishoStokiState)
    return m
  }

  const thibitishaMarekebisho = (id: string) => {
    const m = marekebishoStoki.find((x) => x.id === id)
    if (!m) return
    if (
      ['uharibifu', 'expiry', 'upotevu', 'kurudisha_msambazaji'].includes(m.aina)
    ) {
      const bidhaaMpya = bidhaa.map((b) =>
        b.id === m.bidhaaId
          ? { ...b, stoki: Math.max(b.stoki - m.wingi, 0) }
          : b
      )
      persist('bidhaa', bidhaaMpya, setBidhaaState)
    }
    persist(
      'marekebishoStoki',
      marekebishoStoki.map((x) =>
        x.id === id ? { ...x, hali: 'imethibitishwa' } : x
      ),
      setMarekebishoStokiState
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
    persist('mishahara', [m, ...mishahara], setMishaharaState)
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
      setMishaharaState
    )
    sendSms(
      acc.namba,
      `Mshahara wa ${m.jinaMtumiaji} wa ${m.mwezi} kiasi Tsh ${m.jumla.toLocaleString()} umelipwa kwenye ${acc.jina}.`
    )
  }

  const ongezaAkaunti: StoreCtx['ongezaAkaunti'] = (data) => {
    const a: AkauntiMfanyakazi = { ...data, id: makeId('ACC') }
    persist('akaunti', [...akaunti, a], setAkauntiState)
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
    persist('uingizaji', [u, ...uingizaji], setUingizajiState)
    return u
  }

  const pokeaUingizaji: StoreCtx['pokeaUingizaji'] = (id, aliyepokea) => {
    const u = uingizaji.find((x) => x.id === id)
    if (!u) return

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

    persist('bidhaa', [...bidhaaMpya, ...bidhaa], setBidhaaState)
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
      setUingizajiState
    )
    sendSms(
      '0716-789-012',
      `Uingizaji ${id} umepokelewa na ${aliyepokea}. Bidhaa ${u.bidhaa.length}.`
    )
  }

  // ============================================================
  // DOCUMENTS
  // ============================================================
  const ongezaDocument: StoreCtx['ongezaDocument'] = (data) => {
    const doc: Document = {
      ...data,
      id: makeId('DOC'),
    }
    persist('documents', [doc, ...documents], setDocumentsState)
    return doc
  }

  const futaDocument = (id: string) => {
    persist(
      'documents',
      documents.filter((d) => d.id !== id),
      setDocumentsState
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

    setMaduka,
    setWafanyakazi,
    setBidhaa,
    setWateja,
    setMauzo,
    setOpex,
    setOrders,
    setMalipo,
    setZakaMalipo,
    setMaombi,
    setRipotiBidhaa,
    setMarekebishoStoki,
    setMishahara,
    setAkaunti,
    setUingizaji,
    setGrn,
    setCarts,
    setNotifications,
    setDocuments,

    ongezaDuka,
    ongezaMtumiaji,
    ongezaBidhaa,
    ongezaMteja,
    createOrder,
    ongezaMalipo,
    thibitishaMalipo,
    kataaMalipo,
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