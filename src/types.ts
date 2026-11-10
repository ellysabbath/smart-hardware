// ============================================================
// SMART HARDWARE - Central Types
// ============================================================

// ---------- Roles ----------
export type Role = 'mteja' | 'muuzaji' | 'mmiliki'

// ---------- Notifications ----------
export interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'warning' | 'success' | 'danger'
  read: boolean
}

// ---------- Malipo ----------
export type NjiaMalipo =
  | 'mpesa'
  | 'tigopesa'
  | 'airtel'
  | 'halopesa'
  | 'cash'
  | 'benki'

export type HaliMalipo = 'inasubiri' | 'imethibitishwa' | 'imekataliwa'

export interface Malipo {
  id: string
  njia: NjiaMalipo
  simu: string
  kumbukumbu: string
  kiasi: number
  tarehe: string
  hali: HaliMalipo
}

// ---------- Order ----------
export type HaliOrder = 'inasubiri_malipo' | 'imekamilika' | 'imekataliwa'

export interface OrderItem {
  id: string
  jina: string
  sku: string
  uom: string
  bei: number
  wingi: number
  jumla: number
}

export interface Order {
  id: string
  quotationId: string
  mteja: string
  simu: string
  bidhaa: OrderItem[]
  jumla: number
  malipo: Malipo[]
  hali: HaliOrder
  tarehe: string
}

// ---------- Bidhaa ----------
export type KundiBidhaa =
  | 'Saruji'
  | 'Nondo'
  | 'Mabati'
  | 'Mbao'
  | 'Rangi'
  | 'Bomba'
  | 'Umeme'
  | 'Zana'

export interface Bidhaa {
  id: string
  sku: string
  jina: string
  kundi: KundiBidhaa
  beiMauzo: number
  beiUnunuzi: number
  uom: string
  stoki: number
  duka: string
  location: string
  expiry?: string
  iconKey?: KundiBidhaa
}

// ---------- Duka ----------
export interface Duka {
  id: string
  jina: string
  mahali: string
  mauzoLeo: number
  faidaLeo: number
  wafanyakazi: number
}

// ---------- Mtumiaji ----------
export type NafasiMtumiaji = 'muuzaji' | 'mhazini' | 'admin' | 'mmiliki'

export interface Mtumiaji {
  id: string
  jina: string
  role: NafasiMtumiaji
  duka: string
  simu: string
  active: boolean
}

// ---------- Mauzo ----------
export interface MauzoItem {
  bidhaaId: string
  jina: string
  wingi: number
  bei: number
}

// ---------- Deni ----------
export type HaliDeni = 'hai' | 'imechelewa' | 'imelipwa'

export interface Deni {
  mteja: string
  simu: string
  kiasi: number
  tareheMwisho: string
  hali: HaliDeni
}

// ---------- Gharama ----------
export interface Gharama {
  tarehe: string
  aina: string
  kiasi: number
  maelezo: string
  aliyeingiza: string
}

// ---------- Faida ----------
export interface FaidaKipindi {
  tarehe: string
  mauzo: number
  manunuzi: number
  gharama: number
  faidaHalisi: number
  zaka: number
  sadaka: number
}

// ---------- Mteja ----------
export type AinaMteja = 'fundi' | 'mjenzi' | 'kampuni' | 'mteja'

export interface Mteja {
  id: string
  jina: string
  simu: string
  aina: AinaMteja
  mahali?: string
  tin?: string
  deni: number
  jumlaManunuzi: number
  tareheSajili: string
  active: boolean
}

// ---------- GRN ----------
export interface GRNItem {
  bidhaaId: string
  jina: string
  sku: string
  uom: string
  iliyoagizwa: number
  iliyopokelewa: number
  bei: number
}

export type HaliGRN = 'inasubiri' | 'imepokelewa' | 'upungufu'

export interface GRN {
  id: string
  lpoId: string
  msambazaji: string
  tarehe: string
  bidhaa: GRNItem[]
  hali: HaliGRN
  aliyeingiza: string
  maelezo?: string
}

// ---------- Pending Cart ----------
export type HaliCart = 'quotation' | 'order' | 'malipo_sehemu' | 'imekamilika'

export interface PendingCart {
  id: string
  mtejaId: string
  mteja: string
  simu: string
  aina: HaliCart
  bidhaa: OrderItem[]
  jumla: number
  imelipwa: number
  tarehe: string
  muda: string
  imetumwa?: boolean
}

// ---------- Ripoti ----------
export interface RipotiMauzo {
  tarehe: string
  mauzo: number
  faida: number
  orders: number
}

export interface RipotiStoki {
  bidhaa: string
  sku: string
  stoki: number
  kiwangoChini: number
  hali: 'sawa' | 'inaribia' | 'imeisha'
}

export interface RipotiMteja {
  mteja: string
  simu: string
  manunuzi: number
  deni: number
  mwishoKununua: string
}

// ---------- Ombi la Matumizi ----------
export type HaliOmbi = 'inasubiri' | 'imekubaliwa' | 'imekataliwa'

export interface OmbiMatumizi {
  id: string
  aina: string
  kiasi: number
  maelezo: string
  simu: string
  sababu: string
  risitiUrl?: string
  aliyeomba: string
  duka: string
  tarehe: string
  hali: HaliOmbi
  maoni?: string
  aliyeidhinisha?: string
  tareheIdhini?: string
}

export type AinaGharama =
  | 'mafuta'
  | 'chakula'
  | 'usafiri'
  | 'matengenezo'
  | 'vifaa'
  | 'mishahara'
  | 'kodi'
  | 'umeme'
  | 'maji'
  | 'nyingine'

// ---------- Duka Kamili (Mmiliki) ----------
export type HaliDuka = 'hai' | 'imesimamishwa' | 'imefungwa'

export interface DukaKamili {
  id: string
  jina: string
  mahali: string
  simu: string
  msimamiziId?: string
  msimamiziJina?: string
  tareheKufunguliwa: string
  hali: HaliDuka
  mauzoLeo: number
  faidaLeo: number
  wafanyakazi: number
  stokiJumla: number
}

export interface MtumiajiKamili {
  id: string
  jina: string
  simu: string
  role: NafasiMtumiaji
  dukaId?: string
  dukaJina?: string
  active: boolean
  tareheSajili: string
}

// ---------- Uingizaji wa Vifaa ----------
export type AinaUingizaji = 'moja' | 'bulk'

export type HaliUingizaji = 'inasubiri' | 'imepokelewa' | 'imekataliwa'

export interface BidhaaMpya {
  jina: string
  sku: string
  kundi: KundiBidhaa
  beiMauzo: number
  beiUnunuzi: number
  uom: string
  stoki: number
  location: string
  expiry?: string
  iconKey: KundiBidhaa
}

export interface UingizajiVifaa {
  id: string
  aina: AinaUingizaji
  dukaId: string
  dukaJina: string
  bidhaa: BidhaaMpya[]
  jumlaBidhaa: number
  jumlaThamani: number
  aliyeingiza: string
  nafasi: 'mmiliki' | 'admin'
  tarehe: string
  hali: HaliUingizaji
  aliyepokea?: string
  tareheKupokea?: string
  maelezo?: string
}

// ============================================================
// Ongeza kwenye types zilizopo
// ============================================================

// ---------- Mauzo ya Duka ----------
export interface MauzoYaDuka {
  id: string
  tarehe: string
  dukaId: string
  dukaJina: string
  muuzaji: string
  bidhaa: OrderItem[]
  jumlaMauzo: number
  cogs: number // Gharama ya Bidhaa Zilizouzwa
  faidaGhafi: number
}

// ---------- Gharama za Uendeshaji (OPEX) ----------
export type AinaGharamaOpex =
  | 'mishahara'
  | 'kodi'
  | 'umeme'
  | 'mafuta'
  | 'usafiri'
  | 'chakula'
  | 'matengenezo'
  | 'vifaa'
  | 'bima'
  | 'leseni'
  | 'maji'
  | 'nyingine'

export interface GharamaOpex {
  id: string
  tarehe: string
  dukaId: string
  dukaJina: string
  aina: AinaGharamaOpex
  maelezo: string
  kiasi: number
  aliyeingiza: string
}

// ---------- Faida Kamili ----------
export interface FaidaKamili {
  mauzo: number
  cogs: number
  faidaGhafi: number
  jumlaOpex: number
  faidaSafi: number
  zaka: number
  sadaka: number
  jumlaYaMungu: number
  inayobaki: number
  hasara: boolean
}

// ---------- Gharama Zote (kwa UI) ----------
export interface GharamaZote {
  mishahara: number
  kodi: number
  umeme: number
  mafuta: number
  usafiri: number
  chakula: number
  matengenezo: number
  vifaa: number
  bima: number
  leseni: number
  maji: number
  nyingine: number
  jumla: number
}

// ============================================================
// Ongeza kwenye types zilizopo
// ============================================================

export type AinaKipindi = 'siku' | 'wiki' | 'mwezi' | 'mwaka'

export interface MalipoZaka {
  id: string
  tarehe: string
  kiasi: number
  aina: 'zaka' | 'sadaka'
  risiti: string
  maelezo?: string
}

export interface ZakaKipindi {
  tarehe: string
  faidaHalisi: number
  zaka: number
  sadaka: number
  jumlaYaMungu: number
  salioLako: number
}

// ============================================================
// Badilisha Notification kuwa hivi
// ============================================================

export type AinaNotification = 'info' | 'warning' | 'success' | 'danger'

export type KundiNotification =
  | 'mauzo'
  | 'stoki'
  | 'deni'
  | 'malipo'
  | 'order'
  | 'gharama'
  | 'mtumiaji'
  | 'mengine'

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: AinaNotification
  kundi: KundiNotification
  read: boolean
  route?: string
  maelezo?: string
}


export interface MtejaKamili {
  id: string
  jina: string
  simu: string
  aina: AinaMteja
  mahali?: string
  tin?: string
  deni: number
  jumlaManunuzi: number
  tareheSajili: string
  active: boolean
  dukaId?: string
  dukaJina?: string
  jumlaOrders?: number
  mwishoKununua?: string
}

export type HaliOrderAdmin =
  | 'inasubiri_malipo'
  | 'imekamilika'
  | 'imekataliwa'
  | 'imesafirishwa'

export interface OrderAdmin {
  id: string
  quotationId: string
  mteja: string
  simu: string
  dukaId: string
  dukaJina: string
  muuzaji: string
  bidhaa: OrderItem[]
  jumla: number
  malipo: Malipo[]
  hali: HaliOrderAdmin
  tarehe: string
  muda: string
  maelezo?: string
}