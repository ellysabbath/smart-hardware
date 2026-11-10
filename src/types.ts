
// ============================================================
// SMART HARDWARE - Central Types
// ============================================================

// ---------- Roles ----------
export type Role = 'mteja' | 'muuzaji' | 'mmiliki'

// ---------- Notifications ----------
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

export interface BidhaaKamili extends Bidhaa {
  mtengenezaji?: string
  uzito?: string
  pichaUrl?: string
  sikuZilizobaki?: number
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

export interface MtejaKamili extends Mteja {
  dukaId?: string
  dukaJina?: string
  jumlaOrders?: number
  mwishoKununua?: string
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

// ---------- Duka Kamili ----------
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

// ---------- Mauzo ya Duka ----------
export interface MauzoYaDuka {
  id: string
  tarehe: string
  dukaId: string
  dukaJina: string
  muuzaji: string
  bidhaa: OrderItem[]
  jumlaMauzo: number
  cogs: number
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

// ---------- Gharama Zote ----------
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

// ---------- Zaka ----------
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

// ---------- Order Admin ----------
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

// ---------- Ripoti ya Bidhaa ----------
export type AinaRipotiBidhaa =
  | 'uharibifu'
  | 'expiry'
  | 'upotevu'
  | 'kurudisha_msambazaji'

export type HaliRipoti = 'inasubiri' | 'imethibitishwa' | 'imekataliwa'

export interface RipotiBidhaa {
  id: string
  bidhaaId: string
  jina: string
  sku: string
  uom: string
  kundi: KundiBidhaa
  dukaId: string
  dukaJina: string
  aina: AinaRipotiBidhaa
  wingi: number
  beiUnunuzi: number
  thamani: number
  sababu: string
  maelezo?: string
  pichaUrl?: string
  expiry?: string
  mtengenezaji?: string
  uzito?: string
  aliyeingiza: string
  tarehe: string
  hali: HaliRipoti
}

// ---------- Marekebisho ya Stoki ----------
export type AinaMarekebishoStoki =
  | 'mauzo'
  | 'uharibifu'
  | 'expiry'
  | 'upotevu'
  | 'kurudisha_msambazaji'
  | 'marekebisho'

export type HaliMarekebisho = 'inasubiri' | 'imethibitishwa' | 'imekataliwa'

export interface MarekebishoStoki {
  id: string
  bidhaaId: string
  jina: string
  sku: string
  uom: string
  kundi: KundiBidhaa
  dukaId: string
  dukaJina: string
  aina: AinaMarekebishoStoki
  wingi: number
  beiUnunuzi: number
  thamani: number
  sababu: string
  maelezo?: string
  pichaUrl?: string
  expiry?: string
  mtengenezaji?: string
  uzito?: string
  aliyeingiza: string
  tarehe: string
  hali: HaliMarekebisho
}

// ---------- Document ----------
export type AinaDocument =
  | 'mauzo'
  | 'stoki'
  | 'wateja'
  | 'madeni'
  | 'gharama'
  | 'jumla'

export type HaliDocument = 'tayari' | 'inasindika' | 'imeshindwa'

export interface Document {
  id: string
  jina: string
  aina: AinaDocument
  format: 'pdf' | 'csv' | 'excel'
  dukaId: string
  dukaJina: string
  ukubwa: string
  tarehe: string
  muda: string
  hali: HaliDocument
  aliyezalisha: string
  kipindi: string
}

// ============================================================
// MISHAHARA (types zote hapa - mara moja tu)
// ============================================================

export type AinaAkaunti = 'bank' | 'mobile'

export type NjiaMalipoMshahara =
  | 'mpesa'
  | 'tigopesa'
  | 'airtel'
  | 'halopesa'
  | 'crdb'
  | 'nmb'
  | 'nbc'
  | 'stanbic'
  | 'other'

export type HaliMshahara =
  | 'inasubiri'
  | 'imelipwa'
  | 'imeshindwa'
  | 'imekataliwa'

// Akaunti ya kampuni (mmiliki anaiweka, sio mfanyakazi)
export interface AkauntiKampuni {
  id: string
  aina: AinaAkaunti
  jina: string
  namba: string
  jinaMmiliki: string
  ndiyoMsingi: boolean
}

// Akaunti ya mfanyakazi (kila mfanyakazi anaweka yake)
export interface AkauntiMfanyakazi {
  id: string
  mtumiajiId: string
  jinaMtumiaji: string
  aina: AinaAkaunti
  jina: string
  namba: string
  jinaMmiliki: string
  ndiyoMsingi: boolean
}

export interface Mshahara {
  id: string
  mtumiajiId: string
  jinaMtumiaji: string
  nafasi: string
  dukaId: string
  dukaJina: string
  mwezi: string
  kipindi: string
  mshaharaMsingi: number
  posho: number
  overtime: number
  mafao: number
  makato: number
  jumla: number
  hali: HaliMshahara
  tareheMalipo?: string
  njiaMalipo?: NjiaMalipoMshahara
  akauntiMalipo?: string
  kumbukumbu?: string
  aliyeidhinisha?: string
  tareheIdhini?: string
  maelezo?: string
}

export interface MalipoMshahara {
  id: string
  mshaharaId: string
  mtumiajiId: string
  jinaMtumiaji: string
  kiasi: number
  njia: NjiaMalipoMshahara
  akaunti: string
  kumbukumbu: string
  tarehe: string
  muda: string
  hali: HaliMshahara
  maelezo?: string
}

export interface BulkPaymentResult {
  jumla: number
  zilizofanikiwa: number
  zilizoshindwa: number
  malipo: MalipoMshahara[]
  waliokosaAkaunti: string[]
}