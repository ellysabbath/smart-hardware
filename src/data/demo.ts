// ============================================================
// SMART HARDWARE - Demo Data (Central)
// ============================================================

import type {
  Bidhaa,
  BidhaaKamili,
  Mshahara,
  RipotiBidhaa,
  MauzoYaDuka,
  GharamaOpex,
  NjiaMalipoMshahara,
  AinaGharamaOpex,
  AkauntiMfanyakazi,
  MtejaKamili,
  OrderAdmin,
  Duka,
  Mtumiaji,
  OmbiMatumizi,
  AinaAkaunti,
  MtumiajiKamili,
  DukaKamili,
  AinaGharama,
  Deni,
  Gharama,
  FaidaKipindi,
  Notification,
  NjiaMalipo,
  Mteja,
  GRN,
  PendingCart,
  RipotiMauzo,
  RipotiStoki,
  RipotiMteja,
  UingizajiVifaa,
} from '../types'

// ============================================================
// BIDHAA (LAZIMA IWE KWANZA)
// ============================================================
export const bidhaa: Bidhaa[] = [
  { id: '1', sku: 'SAR-DAN-50', jina: 'Saruji Dangote 50kg', kundi: 'Saruji', beiMauzo: 18500, beiUnunuzi: 16000, uom: 'Mfuko', stoki: 120, duka: 'Kwembe', location: 'Shed A', expiry: '2027-02-15', iconKey: 'Saruji' },
  { id: '2', sku: 'SAR-TWI-50', jina: 'Saruji Twiga 50kg', kundi: 'Saruji', beiMauzo: 18000, beiUnunuzi: 15500, uom: 'Mfuko', stoki: 45, duka: 'Kwembe', location: 'Shed A', expiry: '2027-01-20', iconKey: 'Saruji' },
  { id: '3', sku: 'NON-D12', jina: 'Nondo D12', kundi: 'Nondo', beiMauzo: 2400, beiUnunuzi: 2100, uom: 'Kg', stoki: 800, duka: 'Kwembe', location: 'Raka 3', iconKey: 'Nondo' },
  { id: '4', sku: 'NON-D10', jina: 'Nondo D10', kundi: 'Nondo', beiMauzo: 2200, beiUnunuzi: 1900, uom: 'Kg', stoki: 650, duka: 'Pugu', location: 'Raka 1', iconKey: 'Nondo' },
  { id: '5', sku: 'MAB-G30', jina: 'Mabati G30', kundi: 'Mabati', beiMauzo: 32000, beiUnunuzi: 28000, uom: 'Mita', stoki: 200, duka: 'Kwembe', location: 'Shed B', iconKey: 'Mabati' },
  { id: '6', sku: 'MBA-2X4', jina: 'Mbao 2x4', kundi: 'Mbao', beiMauzo: 8500, beiUnunuzi: 7000, uom: 'Mita', stoki: 350, duka: 'Pugu', location: 'Shed C', iconKey: 'Mbao' },
  { id: '7', sku: 'RAN-WH-20', jina: 'Rangi Nyeupe 20L', kundi: 'Rangi', beiMauzo: 95000, beiUnunuzi: 82000, uom: 'Lita', stoki: 25, duka: 'Kwembe', location: 'Raka 2', expiry: '2026-12-01', iconKey: 'Rangi' },
  { id: '8', sku: 'BOM-PVC-1', jina: 'Bomba PVC 1"', kundi: 'Bomba', beiMauzo: 12000, beiUnunuzi: 9500, uom: 'Mita', stoki: 180, duka: 'Pugu', location: 'Raka 4', iconKey: 'Bomba' },
]

// ============================================================
// BIDHAA KAMILI (na maelezo ya FR4)
// ============================================================
export const bidhaaKamili: BidhaaKamili[] = [
  { ...bidhaa[0], mtengenezaji: 'Dangote', uzito: '50kg', pichaUrl: 'https://example.com/saruji-dangote.jpg' },
  { ...bidhaa[1], mtengenezaji: 'Twiga', uzito: '50kg', pichaUrl: 'https://example.com/saruji-twiga.jpg' },
  { ...bidhaa[2], mtengenezaji: 'Steel Masters', uzito: '12mm', pichaUrl: 'https://example.com/nondo-d12.jpg' },
  { ...bidhaa[3], mtengenezaji: 'Steel Masters', uzito: '10mm', pichaUrl: 'https://example.com/nondo-d10.jpg' },
  { ...bidhaa[4], mtengenezaji: 'Mabati Ya Simba', uzito: 'G30', pichaUrl: 'https://example.com/mabati-g30.jpg' },
  { ...bidhaa[5], mtengenezaji: 'Mbao Ltd', uzito: '2x4', pichaUrl: 'https://example.com/mbao-2x4.jpg' },
  { ...bidhaa[6], mtengenezaji: 'Crown Paints', uzito: '20L', pichaUrl: 'https://example.com/rangi-20l.jpg' },
  { ...bidhaa[7], mtengenezaji: 'PVC Co.', uzito: '1 inch', pichaUrl: 'https://example.com/bomba-pvc.jpg' },
]

// ============================================================
// RIPOTI ZA BIDHAA
// ============================================================
export const ripotiBidhaa: RipotiBidhaa[] = [
  {
    id: 'RIP-2026-001',
    bidhaaId: '2',
    jina: 'Saruji Twiga 50kg',
    sku: 'SAR-TWI-50',
    uom: 'Mfuko',
    kundi: 'Saruji',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'uharibifu',
    wingi: 5,
    beiUnunuzi: 15500,
    thamani: 77500,
    sababu: 'Saruji imekauka',
    maelezo: 'Saruji 5 zimekauka kwa sababu ya unyevu',
    pichaUrl: 'https://example.com/saruji-kauka.jpg',
    expiry: '2027-01-20',
    mtengenezaji: 'Twiga',
    uzito: '50kg',
    aliyeingiza: 'Juma Hassan',
    tarehe: '2026-11-09',
    hali: 'imethibitishwa',
  },
  {
    id: 'RIP-2026-002',
    bidhaaId: '7',
    jina: 'Rangi Nyeupe 20L',
    sku: 'RAN-WH-20',
    uom: 'Lita',
    kundi: 'Rangi',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'expiry',
    wingi: 3,
    beiUnunuzi: 82000,
    thamani: 246000,
    sababu: 'Rangi imeisha muda',
    maelezo: 'Rangi imeganda na haifai kutumika',
    expiry: '2026-12-01',
    mtengenezaji: 'Crown Paints',
    uzito: '20L',
    aliyeingiza: 'Juma Hassan',
    tarehe: '2026-11-10',
    hali: 'inasubiri',
  },
  {
    id: 'RIP-2026-003',
    bidhaaId: '5',
    jina: 'Mabati G30',
    sku: 'MAB-G30',
    uom: 'Mita',
    kundi: 'Mabati',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    aina: 'upotevu',
    wingi: 10,
    beiUnunuzi: 28000,
    thamani: 280000,
    sababu: 'Mabati yamepotea',
    maelezo: 'Mabati 10 hayakuonekana wakati wa hesabu',
    mtengenezaji: 'Mabati Ya Simba',
    uzito: 'G30',
    aliyeingiza: 'Asha Mwinyi',
    tarehe: '2026-11-08',
    hali: 'imekataliwa',
  },
  {
    id: 'RIP-2026-004',
    bidhaaId: '3',
    jina: 'Nondo D12',
    sku: 'NON-D12',
    uom: 'Kg',
    kundi: 'Nondo',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    aina: 'kurudisha_msambazaji',
    wingi: 200,
    beiUnunuzi: 2100,
    thamani: 420000,
    sababu: 'Nondo zilipinda',
    maelezo: 'Zinarudishwa kwa Steel Masters',
    mtengenezaji: 'Steel Masters',
    uzito: '12mm',
    aliyeingiza: 'Peter John',
    tarehe: '2026-11-09',
    hali: 'inasubiri',
  },
]

// ============================================================
// MTENGENEZAJI (kwa FR4)
// ============================================================
export const MTENGENEZAJI = [
  'Dangote',
  'Twiga',
  'Simba',
  'Steel Masters',
  'Mabati Ya Simba',
  'Crown Paints',
  'Mbao Ltd',
  'PVC Co.',
]

// ============================================================
// MADUKA
// ============================================================
export const maduka: Duka[] = [
  { id: 'd1', jina: 'Smart Hardware - Kwembe', mahali: 'Kwembe, Dar', mauzoLeo: 2500000, faidaLeo: 350000, wafanyakazi: 4 },
  { id: 'd2', jina: 'Smart Hardware - Pugu', mahali: 'Pugu, Dar', mauzoLeo: 1800000, faidaLeo: 220000, wafanyakazi: 3 },
  { id: 'd3', jina: 'Smart Hardware - Kariakoo', mahali: 'Kariakoo, Dar', mauzoLeo: 3200000, faidaLeo: 480000, wafanyakazi: 5 },
]

// ============================================================
// WAFANYAKAZI
// ============================================================
export const wafanyakazi: Mtumiaji[] = [
  { id: 'u1', jina: 'Juma Hassan', role: 'muuzaji', duka: 'Kwembe', simu: '0712-345-678', active: true },
  { id: 'u2', jina: 'Asha Mwinyi', role: 'mhazini', duka: 'Kwembe', simu: '0713-456-789', active: true },
  { id: 'u3', jina: 'Peter John', role: 'muuzaji', duka: 'Pugu', simu: '0714-567-890', active: true },
  { id: 'u4', jina: 'Fatuma Ali', role: 'mhazini', duka: 'Pugu', simu: '0715-678-901', active: true },
  { id: 'u5', jina: 'Moses Kimaro', role: 'muuzaji', duka: 'Kariakoo', simu: '0716-789-012', active: true },
  { id: 'u6', jina: 'Grace Mushi', role: 'admin', duka: 'Kwembe', simu: '0717-890-123', active: true },
]

// ============================================================
// MADENI
// ============================================================
export const madeni: Deni[] = [
  { mteja: 'Mjenzi Mwakyusa', simu: '0754-111-222', kiasi: 2500000, tareheMwisho: '2026-11-15', hali: 'hai' },
  { mteja: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', kiasi: 5200000, tareheMwisho: '2026-11-10', hali: 'imechelewa' },
  { mteja: 'Fundi Joseph', simu: '0754-555-666', kiasi: 850000, tareheMwisho: '2026-11-20', hali: 'hai' },
  { mteja: 'Mama Sarah', simu: '0754-777-888', kiasi: 1200000, tareheMwisho: '2026-11-05', hali: 'imelipwa' },
]

// ============================================================
// GHARAMA
// ============================================================
export const gharama: Gharama[] = [
  { tarehe: '2026-11-01', aina: 'Mafuta', kiasi: 80000, maelezo: 'Pikipiki', aliyeingiza: 'Juma' },
  { tarehe: '2026-11-02', aina: 'Kodi ya Duka', kiasi: 500000, maelezo: 'Novemba', aliyeingiza: 'Mmiliki' },
  { tarehe: '2026-11-03', aina: 'Mishahara', kiasi: 1200000, maelezo: 'Wafanyakazi 5', aliyeingiza: 'Mmiliki' },
  { tarehe: '2026-11-04', aina: 'Umeme (Luku)', kiasi: 150000, maelezo: 'Kwembe', aliyeingiza: 'Asha' },
]

// ============================================================
// FAIDA KWA VIPINDI
// ============================================================
export const faidaVipindi: FaidaKipindi[] = [
  { tarehe: '2026-11-01', mauzo: 2500000, manunuzi: 2000000, gharama: 150000, faidaHalisi: 350000, zaka: 35000, sadaka: 35000 },
  { tarehe: '2026-11-02', mauzo: 2800000, manunuzi: 2200000, gharama: 180000, faidaHalisi: 420000, zaka: 42000, sadaka: 42000 },
  { tarehe: '2026-11-03', mauzo: 3100000, manunuzi: 2400000, gharama: 200000, faidaHalisi: 500000, zaka: 50000, sadaka: 50000 },
  { tarehe: '2026-11-04', mauzo: 2200000, manunuzi: 1800000, gharama: 120000, faidaHalisi: 280000, zaka: 28000, sadaka: 28000 },
  { tarehe: '2026-11-05', mauzo: 3500000, manunuzi: 2700000, gharama: 250000, faidaHalisi: 550000, zaka: 55000, sadaka: 55000 },
  { tarehe: '2026-11-06', mauzo: 2900000, manunuzi: 2300000, gharama: 190000, faidaHalisi: 410000, zaka: 41000, sadaka: 41000 },
  { tarehe: '2026-11-07', mauzo: 4000000, manunuzi: 3100000, gharama: 300000, faidaHalisi: 600000, zaka: 60000, sadaka: 60000 },
]

// ============================================================
// NJIA ZA MALIPO
// ============================================================
export const NJIA_MALIPO: { key: NjiaMalipo; label: string }[] = [
  { key: 'mpesa', label: 'M-Pesa' },
  { key: 'tigopesa', label: 'Tigo Pesa' },
  { key: 'airtel', label: 'Airtel Money' },
  { key: 'halopesa', label: 'HaloPesa' },
  { key: 'cash', label: 'Cash' },
  { key: 'benki', label: 'Benki' },
]

// ============================================================
// WATEJA
// ============================================================
export const wateja: Mteja[] = [
  { id: 'c1', jina: 'Mjenzi Mwakyusa', simu: '0754-111-222', aina: 'mjenzi', mahali: 'Kwembe', deni: 2500000, jumlaManunuzi: 8450000, tareheSajili: '2025-01-15', active: true },
  { id: 'c2', jina: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', aina: 'kampuni', mahali: 'Kariakoo', tin: '123-456-789', deni: 5200000, jumlaManunuzi: 24500000, tareheSajili: '2024-06-10', active: true },
  { id: 'c3', jina: 'Fundi Joseph', simu: '0754-555-666', aina: 'fundi', mahali: 'Pugu', deni: 850000, jumlaManunuzi: 3200000, tareheSajili: '2025-03-20', active: true },
  { id: 'c4', jina: 'Mama Sarah', simu: '0754-777-888', aina: 'mteja', mahali: 'Kariakoo', deni: 0, jumlaManunuzi: 1200000, tareheSajili: '2025-05-01', active: true },
  { id: 'c5', jina: 'Fundi Hassan', simu: '0754-999-000', aina: 'fundi', mahali: 'Kwembe', deni: 450000, jumlaManunuzi: 2800000, tareheSajili: '2025-08-12', active: true },
]

// ============================================================
// GRN (Goods Received Note)
// ============================================================
export const grnList: GRN[] = [
  {
    id: 'GRN-2026-045',
    lpoId: 'LPO-2026-012',
    msambazaji: 'Dangote Cement',
    tarehe: '2026-11-08',
    hali: 'imepokelewa',
    aliyeingiza: 'Asha Mwinyi',
    bidhaa: [
      { bidhaaId: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', iliyoagizwa: 400, iliyopokelewa: 400, bei: 16000 },
    ],
  },
  {
    id: 'GRN-2026-046',
    lpoId: 'LPO-2026-013',
    msambazaji: 'Steel Masters',
    tarehe: '2026-11-09',
    hali: 'upungufu',
    aliyeingiza: 'Asha Mwinyi',
    maelezo: 'Upungufu wa Kg 200 - msambazaji',
    bidhaa: [
      { bidhaaId: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', iliyoagizwa: 2000, iliyopokelewa: 1800, bei: 2100 },
    ],
  },
  {
    id: 'GRN-2026-047',
    lpoId: 'LPO-2026-014',
    msambazaji: 'Mabati Ya Simba',
    tarehe: '2026-11-10',
    hali: 'inasubiri',
    aliyeingiza: 'Asha Mwinyi',
    bidhaa: [
      { bidhaaId: '5', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', iliyoagizwa: 500, iliyopokelewa: 0, bei: 28000 },
    ],
  },
]

// ============================================================
// PENDING CARTS (Quotations/Orders zinazosubiri)
// ============================================================
export const pendingCarts: PendingCart[] = [
  {
    id: 'CART-001',
    mtejaId: 'c1',
    mteja: 'Mjenzi Mwakyusa',
    simu: '0754-111-222',
    aina: 'quotation',
    jumla: 2500000,
    imelipwa: 0,
    tarehe: '2026-11-09',
    muda: '09:14',
    imetumwa: false,
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 100, jumla: 1850000 },
      { id: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 270, jumla: 648000 },
    ],
  },
  {
    id: 'CART-002',
    mtejaId: 'c2',
    mteja: 'Kampuni ya Nyati Ltd',
    simu: '0754-333-444',
    aina: 'order',
    jumla: 5200000,
    imelipwa: 2000000,
    tarehe: '2026-11-09',
    muda: '10:22',
    imetumwa: false,
    bidhaa: [
      { id: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1500, jumla: 3600000 },
      { id: '5', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 50, jumla: 1600000 },
    ],
  },
  {
    id: 'CART-003',
    mtejaId: 'c3',
    mteja: 'Fundi Joseph',
    simu: '0754-555-666',
    aina: 'malipo_sehemu',
    jumla: 850000,
    imelipwa: 400000,
    tarehe: '2026-11-09',
    muda: '11:05',
    imetumwa: false,
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 30, jumla: 555000 },
      { id: '6', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 35, jumla: 297500 },
    ],
  },
  {
    id: 'CART-004',
    mtejaId: 'c5',
    mteja: 'Fundi Hassan',
    simu: '0754-999-000',
    aina: 'quotation',
    jumla: 450000,
    imelipwa: 0,
    tarehe: '2026-11-10',
    muda: '08:30',
    imetumwa: true,
    bidhaa: [
      { id: '2', jina: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', uom: 'Mfuko', bei: 18000, wingi: 25, jumla: 450000 },
    ],
  },
]

// ============================================================
// RIPOTI ZA DUKA
// ============================================================
export const ripotiMauzo: RipotiMauzo[] = [
  { tarehe: '2026-11-04', mauzo: 1200000, faida: 180000, orders: 8 },
  { tarehe: '2026-11-05', mauzo: 1800000, faida: 250000, orders: 12 },
  { tarehe: '2026-11-06', mauzo: 2100000, faida: 310000, orders: 15 },
  { tarehe: '2026-11-07', mauzo: 1500000, faida: 220000, orders: 10 },
  { tarehe: '2026-11-08', mauzo: 2500000, faida: 380000, orders: 18 },
  { tarehe: '2026-11-09', mauzo: 2800000, faida: 410000, orders: 20 },
  { tarehe: '2026-11-10', mauzo: 3200000, faida: 480000, orders: 22 },
]

export const ripotiStoki: RipotiStoki[] = [
  { bidhaa: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', stoki: 120, kiwangoChini: 50, hali: 'sawa' },
  { bidhaa: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', stoki: 45, kiwangoChini: 50, hali: 'inaribia' },
  { bidhaa: 'Nondo D12', sku: 'NON-D12', stoki: 800, kiwangoChini: 200, hali: 'sawa' },
  { bidhaa: 'Mabati G30', sku: 'MAB-G30', stoki: 15, kiwangoChini: 50, hali: 'imeisha' },
  { bidhaa: 'Rangi Nyeupe 20L', sku: 'RAN-WH-20', stoki: 25, kiwangoChini: 30, hali: 'inaribia' },
  { bidhaa: 'Bomba PVC 1"', sku: 'BOM-PVC-1', stoki: 180, kiwangoChini: 50, hali: 'sawa' },
]

export const ripotiWateja: RipotiMteja[] = [
  { mteja: 'Mjenzi Mwakyusa', simu: '0754-111-222', manunuzi: 8450000, deni: 2500000, mwishoKununua: '2026-11-09' },
  { mteja: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', manunuzi: 24500000, deni: 5200000, mwishoKununua: '2026-11-09' },
  { mteja: 'Fundi Joseph', simu: '0754-555-666', manunuzi: 3200000, deni: 850000, mwishoKununua: '2026-11-08' },
  { mteja: 'Fundi Hassan', simu: '0754-999-000', manunuzi: 2800000, deni: 450000, mwishoKununua: '2026-11-10' },
]

// ============================================================
// MAOMBI YA MATUMIZI
// ============================================================
export const maombiMatumizi: OmbiMatumizi[] = [
  {
    id: 'EXP-2026-001',
    aina: 'mafuta',
    kiasi: 80000,
    maelezo: 'Mafuta ya pikipiki kwa siku 2',
    simu: '0754-123-456',
    sababu: 'Kusafirisha mizigo kwenda Pugu',
    aliyeomba: 'Juma Hassan',
    duka: 'Kwembe',
    tarehe: '2026-11-09',
    hali: 'imekubaliwa',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-09',
    maoni: 'Sawa, endelea',
  },
  {
    id: 'EXP-2026-002',
    aina: 'chakula',
    kiasi: 45000,
    maelezo: 'Chakula cha wafanyakazi 3',
    simu: '0754-123-456',
    sababu: 'Wafanyakazi walifanya kazi hadi usiku',
    aliyeomba: 'Juma Hassan',
    duka: 'Kwembe',
    tarehe: '2026-11-10',
    hali: 'inasubiri',
  },
  {
    id: 'EXP-2026-003',
    aina: 'matengenezo',
    kiasi: 250000,
    maelezo: 'Kutengeneza gari la mizigo',
    simu: '0754-123-456',
    sababu: 'Gari liliharibika njiani',
    aliyeomba: 'Juma Hassan',
    duka: 'Kwembe',
    tarehe: '2026-11-08',
    hali: 'imekataliwa',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-08',
    maoni: 'Tafadhali tumia gari lingine kwanza',
  },
]

// ============================================================
// AINA ZA GHARAMA
// ============================================================
export const AINA_GHARAMA: { key: AinaGharama; label: string }[] = [
  { key: 'mafuta', label: 'Mafuta' },
  { key: 'chakula', label: 'Chakula' },
  { key: 'usafiri', label: 'Usafiri' },
  { key: 'matengenezo', label: 'Matengenezo' },
  { key: 'vifaa', label: 'Vifaa vya Ofisi' },
  { key: 'mishahara', label: 'Mishahara' },
  { key: 'kodi', label: 'Kodi' },
  { key: 'umeme', label: 'Umeme' },
  { key: 'maji', label: 'Maji' },
  { key: 'nyingine', label: 'Nyingine' },
]

// ============================================================
// MADUKA KAMILI (na wasimamizi)
// ============================================================
export const madukaKamili: DukaKamili[] = [
  {
    id: 'd1',
    jina: 'Smart Hardware - Kwembe',
    mahali: 'Kwembe, Dar',
    simu: '0712-345-678',
    msimamiziId: 'u1',
    msimamiziJina: 'Juma Hassan',
    tareheKufunguliwa: '2024-01-15',
    hali: 'hai',
    mauzoLeo: 2500000,
    faidaLeo: 350000,
    wafanyakazi: 4,
    stokiJumla: 2450,
  },
  {
    id: 'd2',
    jina: 'Smart Hardware - Pugu',
    mahali: 'Pugu, Dar',
    simu: '0714-567-890',
    msimamiziId: 'u3',
    msimamiziJina: 'Peter John',
    tareheKufunguliwa: '2024-08-10',
    hali: 'hai',
    mauzoLeo: 1800000,
    faidaLeo: 220000,
    wafanyakazi: 3,
    stokiJumla: 1820,
  },
  {
    id: 'd3',
    jina: 'Smart Hardware - Kariakoo',
    mahali: 'Kariakoo, Dar',
    simu: '0716-789-012',
    msimamiziId: 'u5',
    msimamiziJina: 'Moses Kimaro',
    tareheKufunguliwa: '2025-03-20',
    hali: 'hai',
    mauzoLeo: 3200000,
    faidaLeo: 480000,
    wafanyakazi: 5,
    stokiJumla: 3100,
  },
]

// ============================================================
// WAFANYAKAZI KAMILI (na duka)
// ============================================================
export const wafanyakaziKamili: MtumiajiKamili[] = [
  { id: 'u1', jina: 'Juma Hassan', simu: '0712-345-678', role: 'muuzaji', dukaId: 'd1', dukaJina: 'Kwembe', active: true, tareheSajili: '2024-01-20' },
  { id: 'u2', jina: 'Asha Mwinyi', simu: '0713-456-789', role: 'mhazini', dukaId: 'd1', dukaJina: 'Kwembe', active: true, tareheSajili: '2024-02-15' },
  { id: 'u3', jina: 'Peter John', simu: '0714-567-890', role: 'muuzaji', dukaId: 'd2', dukaJina: 'Pugu', active: true, tareheSajili: '2024-08-15' },
  { id: 'u4', jina: 'Fatuma Ali', simu: '0715-678-901', role: 'mhazini', dukaId: 'd2', dukaJina: 'Pugu', active: true, tareheSajili: '2024-09-01' },
  { id: 'u5', jina: 'Moses Kimaro', simu: '0716-789-012', role: 'muuzaji', dukaId: 'd3', dukaJina: 'Kariakoo', active: true, tareheSajili: '2025-03-25' },
  { id: 'u6', jina: 'Grace Mushi', simu: '0717-890-123', role: 'admin', dukaId: 'd1', dukaJina: 'Kwembe', active: true, tareheSajili: '2024-05-10' },
  { id: 'u7', jina: 'Hassan Mwinyi', simu: '0718-901-234', role: 'muuzaji', active: true, tareheSajili: '2025-06-15' },
  { id: 'u8', jina: 'Rehema Said', simu: '0719-012-345', role: 'muuzaji', active: true, tareheSajili: '2025-09-20' },
]

// ============================================================
// UINGIZAJI WA VIFAA
// ============================================================
export const uingizajiVifaa: UingizajiVifaa[] = [
  {
    id: 'UING-2026-001',
    tarehe: '2026-11-08',
    aina: 'bulk',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    bidhaa: [
      { jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', kundi: 'Saruji', uom: 'Mfuko', stoki: 400, beiUnunuzi: 16000, beiMauzo: 18500, location: 'Shed A', expiry: '2027-02-15', iconKey: 'Saruji' },
      { jina: 'Nondo D12', sku: 'NON-D12', kundi: 'Nondo', uom: 'Kg', stoki: 2000, beiUnunuzi: 2100, beiMauzo: 2400, location: 'Raka 3', iconKey: 'Nondo' },
    ],
    jumlaBidhaa: 2400,
    jumlaThamani: 10600000,
    aliyeingiza: 'Moses Kimaro',
    nafasi: 'mmiliki',
    hali: 'imepokelewa',
    aliyepokea: 'Juma Hassan',
    tareheKupokea: '2026-11-08',
  },
  {
    id: 'UING-2026-002',
    tarehe: '2026-11-10',
    aina: 'moja',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    bidhaa: [
      { jina: 'Mabati G30', sku: 'MAB-G30', kundi: 'Mabati', uom: 'Mita', stoki: 500, beiUnunuzi: 28000, beiMauzo: 32000, location: 'Shed B', iconKey: 'Mabati' },
    ],
    jumlaBidhaa: 500,
    jumlaThamani: 14000000,
    aliyeingiza: 'Moses Kimaro',
    nafasi: 'mmiliki',
    hali: 'inasubiri',
  },
]

// ============================================================
// MAUZO YA DUKA
// ============================================================
export const mauzoYaDuka: MauzoYaDuka[] = [
  {
    id: 'SALE-2026-001',
    tarehe: '2026-11-10',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    muuzaji: 'Juma Hassan',
    jumlaMauzo: 5000000,
    cogs: 4000000,
    faidaGhafi: 1000000,
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 150, jumla: 2775000 },
      { id: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 500, jumla: 1200000 },
      { id: '5', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 32, jumla: 1024000 },
    ],
  },
  {
    id: 'SALE-2026-002',
    tarehe: '2026-11-10',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    muuzaji: 'Peter John',
    jumlaMauzo: 3200000,
    cogs: 2600000,
    faidaGhafi: 600000,
    bidhaa: [
      { id: '4', jina: 'Nondo D10', sku: 'NON-D10', uom: 'Kg', bei: 2200, wingi: 800, jumla: 1760000 },
      { id: '6', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 170, jumla: 1445000 },
    ],
  },
  {
    id: 'SALE-2026-003',
    tarehe: '2026-11-10',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    muuzaji: 'Juma Hassan',
    jumlaMauzo: 2800000,
    cogs: 2200000,
    faidaGhafi: 600000,
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 80, jumla: 1480000 },
      { id: '8', jina: 'Bomba PVC 1"', sku: 'BOM-PVC-1', uom: 'Mita', bei: 12000, wingi: 110, jumla: 1320000 },
    ],
  },
]

// ============================================================
// GHARAMA ZA UENDESHAJI (OPEX)
// ============================================================
export const gharamaOpex: GharamaOpex[] = [
  { id: 'OPEX-001', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'mishahara', maelezo: 'Mishahara ya wafanyakazi 4', kiasi: 1200000, aliyeingiza: 'Moses Kimaro' },
  { id: 'OPEX-002', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'kodi', maelezo: 'Kodi ya duka Novemba', kiasi: 500000, aliyeingiza: 'Moses Kimaro' },
  { id: 'OPEX-003', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'umeme', maelezo: 'Umeme wa Luku', kiasi: 150000, aliyeingiza: 'Juma Hassan' },
  { id: 'OPEX-004', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'mafuta', maelezo: 'Mafuta ya pikipiki', kiasi: 80000, aliyeingiza: 'Juma Hassan' },
  { id: 'OPEX-005', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'chakula', maelezo: 'Chakula cha wafanyakazi', kiasi: 45000, aliyeingiza: 'Juma Hassan' },
  { id: 'OPEX-006', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'matengenezo', maelezo: 'Matengenezo ya gari', kiasi: 250000, aliyeingiza: 'Moses Kimaro' },
  { id: 'OPEX-007', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'maji', maelezo: 'Maji ya duka', kiasi: 30000, aliyeingiza: 'Juma Hassan' },
  { id: 'OPEX-008', tarehe: '2026-11-10', dukaId: 'd2', dukaJina: 'Pugu', aina: 'mishahara', maelezo: 'Mishahara ya wafanyakazi 3', kiasi: 900000, aliyeingiza: 'Moses Kimaro' },
  { id: 'OPEX-009', tarehe: '2026-11-10', dukaId: 'd2', dukaJina: 'Pugu', aina: 'kodi', maelezo: 'Kodi ya duka Novemba', kiasi: 400000, aliyeingiza: 'Moses Kimaro' },
  { id: 'OPEX-010', tarehe: '2026-11-10', dukaId: 'd2', dukaJina: 'Pugu', aina: 'umeme', maelezo: 'Umeme wa Luku', kiasi: 100000, aliyeingiza: 'Peter John' },
]

// ============================================================
// AINA ZA GHARAMA ZA OPEX
// ============================================================
export const AINA_OPEX: { key: AinaGharamaOpex; label: string }[] = [
  { key: 'mishahara', label: 'Mishahara' },
  { key: 'kodi', label: 'Kodi' },
  { key: 'umeme', label: 'Umeme' },
  { key: 'mafuta', label: 'Mafuta' },
  { key: 'usafiri', label: 'Usafiri' },
  { key: 'chakula', label: 'Chakula' },
  { key: 'matengenezo', label: 'Matengenezo' },
  { key: 'vifaa', label: 'Vifaa vya Ofisi' },
  { key: 'bima', label: 'Bima' },
  { key: 'leseni', label: 'Leseni' },
  { key: 'maji', label: 'Maji' },
  { key: 'nyingine', label: 'Nyingine' },
]

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Saruji Twiga inaisha',
    message: 'Mifuko 45 imebaki - agiza tena',
    time: 'Dakika 5 zilizopita',
    type: 'warning',
    kundi: 'stoki',
    read: false,
    route: '/muuzaji/ripoti',
    maelezo: 'Saruji Twiga 50kg imebaki mifuko 45 tu. Kiwango cha chini ni mifuko 50. Tafadhali agiza tena kutoka kwa msambazaji ili kuepusha uhaba.',
  },
  {
    id: 'n2',
    title: 'Deni la Nyati Ltd',
    message: 'Tsh 5,200,000 limechelewa siku 2',
    time: 'Saa 1 iliyopita',
    type: 'danger',
    kundi: 'deni',
    read: false,
    route: '/mteja/deni',
    maelezo: 'Kampuni ya Nyati Ltd ina deni la Tsh 5,200,000 ambalo lilipaswa kulipwa tarehe 10 Nov 2026. Limechelewa siku 2. Tafadhali wasiliana na mteja.',
  },
  {
    id: 'n3',
    title: 'Mauzo ya leo',
    message: 'Tsh 2,500,000 - faida Tsh 350,000',
    time: 'Saa 2 zilizopita',
    type: 'success',
    kundi: 'mauzo',
    read: false,
    route: '/muuzaji/mauzo',
    maelezo: 'Mauzo ya leo yamefikia Tsh 2,500,000 na faida ghafi ya Tsh 350,000. Endelea kufuatilia faida safi kwenye ukurasa wa mauzo.',
  },
  {
    id: 'n4',
    title: 'GRN imepokelewa',
    message: 'Saruji Dangote tani 1.8 (upungufu 0.2)',
    time: 'Jana',
    type: 'info',
    kundi: 'stoki',
    read: true,
    route: '/muuzaji/pokea',
    maelezo: 'GRN-2026-046 imepokelewa. Ulipaswa kupokea tani 2 lakini umepokea tani 1.8. Upungufu wa tani 0.2 unatakiwa kuripotiwa kwa msambazaji.',
  },
  {
    id: 'n5',
    title: 'Zaka ya wiki',
    message: 'Tsh 305,000 inatakiwa kulipwa',
    time: 'Jana',
    type: 'warning',
    kundi: 'malipo',
    read: true,
    route: '/mmiliki/zaka',
    maelezo: 'Zaka ya wiki hii ni Tsh 305,000. Tafadhali lipa kabla ya Ijumaa na urekodi malipo kwenye system ili kufuatilia deni la zaka.',
  },
  {
    id: 'n6',
    title: 'Order mpya imekamilika',
    message: 'Mjenzi Mwakyusa amelipa Tsh 2,500,000',
    time: 'Saa 3 zilizopita',
    type: 'success',
    kundi: 'order',
    read: false,
    route: '/mteja/orders',
    maelezo: 'Order ORD-123456 ya Mjenzi Mwakyusa imekamilika. Malipo ya Tsh 2,500,000 yamethibitishwa kwa M-Pesa (kumbukumbu: QGR7XK2P9L).',
  },
  {
    id: 'n7',
    title: 'Ombi la matumizi',
    message: 'Juma Hassan ameomba Tsh 45,000 (chakula)',
    time: 'Dakika 30 zilizopita',
    type: 'info',
    kundi: 'gharama',
    read: false,
    route: '/muuzaji/matumizi',
    maelezo: 'Juma Hassan ameomba matumizi ya Tsh 45,000 kwa ajili ya chakula cha wafanyakazi. Ombi linasubiri idhini yako.',
  },
]

// ============================================================
// ORDERS ZA ADMIN
// ============================================================
export const ordersAdmin: OrderAdmin[] = [
  {
    id: 'ORD-2026-001',
    quotationId: 'Q-2026-0114',
    mteja: 'Mjenzi Mwakyusa',
    simu: '0754-111-222',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    muuzaji: 'Juma Hassan',
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 100, jumla: 1850000 },
      { id: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 270, jumla: 648000 },
    ],
    jumla: 2498000,
    hali: 'imekamilika',
    tarehe: '2026-11-09',
    muda: '09:14',
    malipo: [
      { id: 'M-001', njia: 'mpesa', simu: '0754-111-222', kumbukumbu: 'QGR7XK2P9L', kiasi: 2498000, tarehe: '2026-11-09', hali: 'imethibitishwa' },
    ],
  },
  {
    id: 'ORD-2026-002',
    quotationId: 'Q-2026-0115',
    mteja: 'Kampuni ya Nyati Ltd',
    simu: '0754-333-444',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    muuzaji: 'Peter John',
    bidhaa: [
      { id: '3', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1500, jumla: 3600000 },
      { id: '5', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 50, jumla: 1600000 },
    ],
    jumla: 5200000,
    hali: 'inasubiri_malipo',
    tarehe: '2026-11-09',
    muda: '10:22',
    malipo: [
      { id: 'M-002', njia: 'mpesa', simu: '0754-333-444', kumbukumbu: 'QGR7XK2P9M', kiasi: 2000000, tarehe: '2026-11-09', hali: 'imethibitishwa' },
    ],
  },
  {
    id: 'ORD-2026-003',
    quotationId: 'Q-2026-0116',
    mteja: 'Fundi Joseph',
    simu: '0754-555-666',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    muuzaji: 'Juma Hassan',
    bidhaa: [
      { id: '1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 30, jumla: 555000 },
      { id: '6', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 35, jumla: 297500 },
    ],
    jumla: 852500,
    hali: 'inasubiri_malipo',
    tarehe: '2026-11-09',
    muda: '11:05',
    malipo: [
      { id: 'M-003', njia: 'tigopesa', simu: '0754-555-666', kumbukumbu: 'TIG7XK2P9N', kiasi: 400000, tarehe: '2026-11-09', hali: 'imethibitishwa' },
    ],
  },
  {
    id: 'ORD-2026-004',
    quotationId: 'Q-2026-0117',
    mteja: 'Fundi Hassan',
    simu: '0754-999-000',
    dukaId: 'd3',
    dukaJina: 'Smart Hardware - Kariakoo',
    muuzaji: 'Moses Kimaro',
    bidhaa: [
      { id: '2', jina: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', uom: 'Mfuko', bei: 18000, wingi: 25, jumla: 450000 },
    ],
    jumla: 450000,
    hali: 'imekamilika',
    tarehe: '2026-11-10',
    muda: '08:30',
    malipo: [
      { id: 'M-004', njia: 'cash', simu: 'Fundi Hassan', kumbukumbu: 'CASH-001', kiasi: 450000, tarehe: '2026-11-10', hali: 'imethibitishwa' },
    ],
  },
  {
    id: 'ORD-2026-005',
    quotationId: 'Q-2026-0118',
    mteja: 'Mama Sarah',
    simu: '0754-777-888',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    muuzaji: 'Peter John',
    bidhaa: [
      { id: '4', jina: 'Nondo D10', sku: 'NON-D10', uom: 'Kg', bei: 2200, wingi: 200, jumla: 440000 },
      { id: '8', jina: 'Bomba PVC 1"', sku: 'BOM-PVC-1', uom: 'Mita', bei: 12000, wingi: 50, jumla: 600000 },
    ],
    jumla: 1040000,
    hali: 'imekataliwa',
    tarehe: '2026-11-10',
    muda: '12:15',
    maelezo: 'Mteja alibadilisha mawazo',
    malipo: [],
  },
]

// ============================================================
// WATEJA KAMILI
// ============================================================
export const watejaKamili: MtejaKamili[] = [
  {
    id: 'c1', jina: 'Mjenzi Mwakyusa', simu: '0754-111-222', aina: 'mjenzi',
    mahali: 'Kwembe', deni: 2500000, jumlaManunuzi: 8450000,
    tareheSajili: '2025-01-15', active: true, dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe', jumlaOrders: 12, mwishoKununua: '2026-11-09',
  },
  {
    id: 'c2', jina: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', aina: 'kampuni',
    mahali: 'Kariakoo', tin: '123-456-789', deni: 5200000, jumlaManunuzi: 24500000,
    tareheSajili: '2024-06-10', active: true, dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu', jumlaOrders: 35, mwishoKununua: '2026-11-09',
  },
  {
    id: 'c3', jina: 'Fundi Joseph', simu: '0754-555-666', aina: 'fundi',
    mahali: 'Pugu', deni: 850000, jumlaManunuzi: 3200000,
    tareheSajili: '2025-03-20', active: true, dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe', jumlaOrders: 8, mwishoKununua: '2026-11-08',
  },
  {
    id: 'c4', jina: 'Mama Sarah', simu: '0754-777-888', aina: 'mteja',
    mahali: 'Kariakoo', deni: 0, jumlaManunuzi: 1200000,
    tareheSajili: '2025-05-01', active: true, dukaId: 'd3',
    dukaJina: 'Smart Hardware - Kariakoo', jumlaOrders: 4, mwishoKununua: '2026-10-15',
  },
  {
    id: 'c5', jina: 'Fundi Hassan', simu: '0754-999-000', aina: 'fundi',
    mahali: 'Kwembe', deni: 450000, jumlaManunuzi: 2800000,
    tareheSajili: '2025-08-12', active: true, dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe', jumlaOrders: 6, mwishoKununua: '2026-11-10',
  },
  {
    id: 'c6', jina: 'Fundi Mwita', simu: '0754-222-333', aina: 'fundi',
    mahali: 'Pugu', deni: 0, jumlaManunuzi: 1800000,
    tareheSajili: '2025-10-01', active: true, dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu', jumlaOrders: 3, mwishoKununua: '2026-11-05',
  },
  {
    id: 'c7', jina: 'Jengo Group Ltd', simu: '0754-444-555', aina: 'kampuni',
    mahali: 'Kariakoo', tin: '987-654-321', deni: 1500000, jumlaManunuzi: 15600000,
    tareheSajili: '2024-08-20', active: true, dukaId: 'd3',
    dukaJina: 'Smart Hardware - Kariakoo', jumlaOrders: 20, mwishoKununua: '2026-11-09',
  },
  {
    id: 'c8', jina: 'Mama Amina', simu: '0754-666-777', aina: 'mteja',
    mahali: 'Kwembe', deni: 0, jumlaManunuzi: 850000,
    tareheSajili: '2025-12-10', active: true, dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe', jumlaOrders: 2, mwishoKununua: '2026-10-20',
  },
]

// ============================================================
// AKAUNTI ZA WAFANYAKAZI (kila mmoja anaweka yake)
// ============================================================
export const akauntiWafanyakazi: AkauntiMfanyakazi[] = [
  {
    id: 'acc-u1',
    mtumiajiId: 'u1',
    jinaMtumiaji: 'Juma Hassan',
    aina: 'mobile',
    jina: 'M-Pesa',
    namba: '0754-123-456',
    jinaMmiliki: 'Juma Hassan',
    ndiyoMsingi: true,
  },
  {
    id: 'acc-u2',
    mtumiajiId: 'u2',
    jinaMtumiaji: 'Asha Mwinyi',
    aina: 'mobile',
    jina: 'Tigo Pesa',
    namba: '0713-456-789',
    jinaMmiliki: 'Asha Mwinyi',
    ndiyoMsingi: true,
  },
  {
    id: 'acc-u3',
    mtumiajiId: 'u3',
    jinaMtumiaji: 'Peter John',
    aina: 'bank',
    jina: 'CRDB Bank',
    namba: '0150123456790',
    jinaMmiliki: 'Peter John',
    ndiyoMsingi: true,
  },
  {
    id: 'acc-u4',
    mtumiajiId: 'u4',
    jinaMtumiaji: 'Fatuma Ali',
    aina: 'mobile',
    jina: 'Airtel Money',
    namba: '0715-678-901',
    jinaMmiliki: 'Fatuma Ali',
    ndiyoMsingi: true,
  },
  {
    id: 'acc-u5',
    mtumiajiId: 'u5',
    jinaMtumiaji: 'Moses Kimaro',
    aina: 'mobile',
    jina: 'Tigo Pesa',
    namba: '0716-789-012',
    jinaMmiliki: 'Moses Kimaro',
    ndiyoMsingi: true,
  },
  {
    id: 'acc-u6',
    mtumiajiId: 'u6',
    jinaMtumiaji: 'Grace Mushi',
    aina: 'bank',
    jina: 'NMB Bank',
    namba: '2050123456789',
    jinaMmiliki: 'Grace Mushi',
    ndiyoMsingi: true,
  },
  // Mfanyakazi asiye na akaunti msingi (kwa demo ya "waliokosa akaunti")
  {
    id: 'acc-u7',
    mtumiajiId: 'u7',
    jinaMtumiaji: 'Hassan Mwinyi',
    aina: 'mobile',
    jina: 'M-Pesa',
    namba: '0718-901-234',
    jinaMmiliki: 'Hassan Mwinyi',
    ndiyoMsingi: false,
  },
]

// ============================================================
// MISHAHARA
// ============================================================
export const mishahara: Mshahara[] = [
  {
    id: 'SAL-2026-001',
    mtumiajiId: 'u1',
    jinaMtumiaji: 'Juma Hassan',
    nafasi: 'Muuzaji',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 450000,
    posho: 50000,
    overtime: 30000,
    mafao: 20000,
    makato: 25000,
    jumla: 525000,
    hali: 'imelipwa',
    tareheMalipo: '2026-11-05',
    njiaMalipo: 'mpesa',
    akauntiMalipo: '0754-123-456',
    kumbukumbu: 'MPESA-20261105-001',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-05',
    maelezo: 'Mshahara wa Novemba 2026',
  },
  {
    id: 'SAL-2026-002',
    mtumiajiId: 'u2',
    jinaMtumiaji: 'Asha Mwinyi',
    nafasi: 'Mhazini',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 400000,
    posho: 40000,
    overtime: 20000,
    mafao: 15000,
    makato: 20000,
    jumla: 455000,
    hali: 'inasubiri',
    maelezo: 'Inasubiri idhini',
  },
  {
    id: 'SAL-2026-003',
    mtumiajiId: 'u3',
    jinaMtumiaji: 'Peter John',
    nafasi: 'Muuzaji',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 450000,
    posho: 50000,
    overtime: 35000,
    mafao: 20000,
    makato: 25000,
    jumla: 530000,
    hali: 'imelipwa',
    tareheMalipo: '2026-11-05',
    njiaMalipo: 'crdb',
    akauntiMalipo: '0150123456790',
    kumbukumbu: 'BANK-20261105-001',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-05',
    maelezo: 'Mshahara wa Novemba 2026',
  },
  {
    id: 'SAL-2026-004',
    mtumiajiId: 'u4',
    jinaMtumiaji: 'Fatuma Ali',
    nafasi: 'Mhazini',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 400000,
    posho: 40000,
    overtime: 15000,
    mafao: 15000,
    makato: 20000,
    jumla: 450000,
    hali: 'inasubiri',
    maelezo: 'Inasubiri idhini',
  },
  {
    id: 'SAL-2026-005',
    mtumiajiId: 'u5',
    jinaMtumiaji: 'Moses Kimaro',
    nafasi: 'Muuzaji',
    dukaId: 'd3',
    dukaJina: 'Smart Hardware - Kariakoo',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 500000,
    posho: 60000,
    overtime: 40000,
    mafao: 25000,
    makato: 30000,
    jumla: 595000,
    hali: 'imelipwa',
    tareheMalipo: '2026-11-05',
    njiaMalipo: 'tigopesa',
    akauntiMalipo: '0716-789-012',
    kumbukumbu: 'TIGO-20261105-001',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-05',
    maelezo: 'Mshahara wa Novemba 2026',
  },
  {
    id: 'SAL-2026-006',
    mtumiajiId: 'u6',
    jinaMtumiaji: 'Grace Mushi',
    nafasi: 'Admin',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 600000,
    posho: 80000,
    overtime: 0,
    mafao: 30000,
    makato: 35000,
    jumla: 675000,
    hali: 'imelipwa',
    tareheMalipo: '2026-11-05',
    njiaMalipo: 'nmb',
    akauntiMalipo: '2050123456789',
    kumbukumbu: 'BANK-20261105-002',
    aliyeidhinisha: 'Moses Kimaro',
    tareheIdhini: '2026-11-05',
    maelezo: 'Mshahara wa Novemba 2026',
  },
  {
    id: 'SAL-2026-007',
    mtumiajiId: 'u7',
    jinaMtumiaji: 'Hassan Mwinyi',
    nafasi: 'Muuzaji',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 450000,
    posho: 50000,
    overtime: 25000,
    mafao: 20000,
    makato: 25000,
    jumla: 520000,
    hali: 'inasubiri',
    maelezo: 'Inasubiri idhini',
  },
  {
    id: 'SAL-2026-008',
    mtumiajiId: 'u8',
    jinaMtumiaji: 'Rehema Said',
    nafasi: 'Muuzaji',
    dukaId: 'd2',
    dukaJina: 'Smart Hardware - Pugu',
    mwezi: 'Novemba 2026',
    kipindi: '01 - 30 Nov 2026',
    mshaharaMsingi: 450000,
    posho: 50000,
    overtime: 20000,
    mafao: 20000,
    makato: 25000,
    jumla: 515000,
    hali: 'inasubiri',
    maelezo: 'Inasubiri idhini',
  },
]

// ============================================================
// NJIA ZA MALIPO YA MISHAHARA
// ============================================================
export const NJIA_MISHAHARA: {
  key: NjiaMalipoMshahara
  label: string
  aina: AinaAkaunti
}[] = [
  { key: 'mpesa', label: 'M-Pesa', aina: 'mobile' },
  { key: 'tigopesa', label: 'Tigo Pesa', aina: 'mobile' },
  { key: 'airtel', label: 'Airtel Money', aina: 'mobile' },
  { key: 'halopesa', label: 'HaloPesa', aina: 'mobile' },
  { key: 'crdb', label: 'CRDB Bank', aina: 'bank' },
  { key: 'nmb', label: 'NMB Bank', aina: 'bank' },
  { key: 'nbc', label: 'NBC Bank', aina: 'bank' },
  { key: 'stanbic', label: 'Stanbic Bank', aina: 'bank' },
  { key: 'other', label: 'Nyingine', aina: 'bank' },
]

// ============================================================
// AINA ZA AKAUNTI
// ============================================================
export const AINA_AKAUNTI: { key: AinaAkaunti; label: string }[] = [
  { key: 'mobile', label: 'Mobile Money' },
  { key: 'bank', label: 'Benki' },
]