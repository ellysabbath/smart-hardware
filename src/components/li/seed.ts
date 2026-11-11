// ============================================================
// DEMO SEED — data kamili yenye mahusiano
// ============================================================
import { db } from './db'
import type {
  Duka, Mtumiaji, Bidhaa, Mteja, MauzoYaDuka, GharamaOpex,
  Order, Malipo, OmbiMatumizi, RipotiBidhaa,
  MarekebishoStoki, Mshahara, AkauntiMfanyakazi, UingizajiVifaa,
  Document,
} from '../../types'

export function seedIfEmpty() {
  // ✅ Guard 1
  const meta = db.get('_meta') as any
  if (meta?.seeded) return

  // ✅ Guard 2: kama maduka yapo tayari, usiandike tena
  const madukaZilizopo = db.get('maduka') as any[]
  if (madukaZilizopo.length > 0) {
    db.set('_meta', { version: '1.0.0', seeded: true })
    return
  }

  // ---------- MADUKA ----------
  const maduka: Duka[] = [
    { id: 'd1', jina: 'Smart Hardware - Kwembe', mahali: 'Kwembe, Dar', mauzoLeo: 0, faidaLeo: 0, wafanyakazi: 3, stokiJumla: 0 },
    { id: 'd2', jina: 'Smart Hardware - Pugu', mahali: 'Pugu, Dar', mauzoLeo: 0, faidaLeo: 0, wafanyakazi: 2, stokiJumla: 0 },
    { id: 'd3', jina: 'Smart Hardware - Kariakoo', mahali: 'Kariakoo, Dar', mauzoLeo: 0, faidaLeo: 0, wafanyakazi: 2, stokiJumla: 0 },
  ]

  // ---------- WAFANYAKAZI ----------
  const wafanyakazi: Mtumiaji[] = [
    { id: 'u1', jina: 'Juma Hassan', role: 'muuzaji', duka: 'Kwembe', simu: '0712-345-678', active: true },
    { id: 'u2', jina: 'Asha Mwinyi', role: 'mhazini', duka: 'Kwembe', simu: '0713-456-789', active: true },
    { id: 'u3', jina: 'Peter John', role: 'muuzaji', duka: 'Pugu', simu: '0714-567-890', active: true },
    { id: 'u4', jina: 'Fatuma Ali', role: 'mhazini', duka: 'Pugu', simu: '0715-678-901', active: true },
    { id: 'u5', jina: 'Moses Kimaro', role: 'mmiliki', duka: 'Kwembe', simu: '0716-789-012', active: true },
    { id: 'u6', jina: 'Grace Mushi', role: 'admin', duka: 'Kariakoo', simu: '0717-890-123', active: true },
  ]

  // ---------- BIDHAA (12 — location = d.jina) ----------
  const bidhaa: Bidhaa[] = [
    { id: 'b1', sku: 'SAR-DAN-50', jina: 'Saruji Dangote 50kg', kundi: 'Saruji', beiMauzo: 18500, beiUnunuzi: 16000, uom: 'Mfuko', stoki: 120, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', expiry: '2027-02-15', iconKey: 'Saruji' },
    { id: 'b2', sku: 'NON-D12', jina: 'Nondo D12', kundi: 'Nondo', beiMauzo: 2400, beiUnunuzi: 2100, uom: 'Kg', stoki: 800, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', iconKey: 'Nondo' },
    { id: 'b3', sku: 'MAB-G30', jina: 'Mabati G30', kundi: 'Mabati', beiMauzo: 32000, beiUnunuzi: 28000, uom: 'Mita', stoki: 200, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', iconKey: 'Mabati' },
    { id: 'b4', sku: 'RAN-WH-20', jina: 'Rangi Nyeupe 20L', kundi: 'Rangi', beiMauzo: 95000, beiUnunuzi: 82000, uom: 'Lita', stoki: 25, duka: 'Pugu', location: 'Smart Hardware - Pugu', expiry: '2026-12-01', iconKey: 'Rangi' },
    { id: 'b5', sku: 'MBA-2X4', jina: 'Mbao 2x4', kundi: 'Mbao', beiMauzo: 8500, beiUnunuzi: 7000, uom: 'Mita', stoki: 350, duka: 'Pugu', location: 'Smart Hardware - Pugu', iconKey: 'Mbao' },
    { id: 'b6', sku: 'BOM-PVC-1', jina: 'Bomba PVC 1"', kundi: 'Bomba', beiMauzo: 12000, beiUnunuzi: 9500, uom: 'Mita', stoki: 180, duka: 'Kariakoo', location: 'Smart Hardware - Kariakoo', iconKey: 'Bomba' },
    { id: 'b7', sku: 'UME-WAY-2', jina: 'Wayar Umeme 2.5mm', kundi: 'Umeme', beiMauzo: 15000, beiUnunuzi: 12000, uom: 'Mita', stoki: 500, duka: 'Kariakoo', location: 'Smart Hardware - Kariakoo', iconKey: 'Umeme' },
    { id: 'b8', sku: 'ZAN-PAM-1', jina: 'Pamu ya Maji', kundi: 'Zana', beiMauzo: 250000, beiUnunuzi: 200000, uom: 'Kipande', stoki: 15, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', iconKey: 'Zana' },
    { id: 'b9', sku: 'SAR-TWI-50', jina: 'Saruji Twiga 50kg', kundi: 'Saruji', beiMauzo: 18000, beiUnunuzi: 15500, uom: 'Mfuko', stoki: 45, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', expiry: '2027-01-20', iconKey: 'Saruji' },
    { id: 'b10', sku: 'NON-D10', jina: 'Nondo D10', kundi: 'Nondo', beiMauzo: 2200, beiUnunuzi: 1900, uom: 'Kg', stoki: 650, duka: 'Pugu', location: 'Smart Hardware - Pugu', iconKey: 'Nondo' },
    { id: 'b11', sku: 'RAN-BL-20', jina: 'Rangi ya Blu 20L', kundi: 'Rangi', beiMauzo: 98000, beiUnunuzi: 85000, uom: 'Lita', stoki: 18, duka: 'Kariakoo', location: 'Smart Hardware - Kariakoo', expiry: '2026-11-25', iconKey: 'Rangi' },
    { id: 'b12', sku: 'ZAN-HAM-1', jina: 'Nyundo Kubwa', kundi: 'Zana', beiMauzo: 18000, beiUnunuzi: 14000, uom: 'Kipande', stoki: 40, duka: 'Pugu', location: 'Smart Hardware - Pugu', iconKey: 'Zana' },
  ]

  // ---------- WATEJA ----------
  const wateja: Mteja[] = [
    { id: 'c1', jina: 'Mjenzi Mwakyusa', simu: '0754-111-222', aina: 'mjenzi', mahali: 'Kwembe', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-01-15', active: true },
    { id: 'c2', jina: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', aina: 'kampuni', mahali: 'Kariakoo', tin: '123-456-789', deni: 0, jumlaManunuzi: 0, tareheSajili: '2024-06-10', active: true },
    { id: 'c3', jina: 'Fundi Joseph', simu: '0754-555-666', aina: 'fundi', mahali: 'Pugu', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-03-20', active: true },
    { id: 'c4', jina: 'Mama Sarah', simu: '0754-777-888', aina: 'mteja', mahali: 'Kariakoo', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-05-01', active: true },
    { id: 'c5', jina: 'Fundi Hassan', simu: '0754-999-000', aina: 'fundi', mahali: 'Kwembe', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-08-12', active: true },
    { id: 'c6', jina: 'Fundi Mwita', simu: '0754-222-333', aina: 'fundi', mahali: 'Pugu', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-10-01', active: true },
    { id: 'c7', jina: 'Jengo Group Ltd', simu: '0754-444-555', aina: 'kampuni', mahali: 'Kariakoo', tin: '987-654-321', deni: 0, jumlaManunuzi: 0, tareheSajili: '2024-08-20', active: true },
    { id: 'c8', jina: 'Mama Amina', simu: '0754-666-777', aina: 'mteja', mahali: 'Kwembe', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-12-10', active: true },
  ]

  // ---------- MALIPO ----------
  const malipo: Malipo[] = [
    { id: 'M-001', njia: 'mpesa', simu: '0754-111-222', kumbukumbu: 'MPESA-20261101-001', kiasi: 2498000, tarehe: '2026-11-01', hali: 'imethibitishwa' },
    { id: 'M-002', njia: 'tigopesa', simu: '0754-333-444', kumbukumbu: 'TIGO-20261102-001', kiasi: 2000000, tarehe: '2026-11-02', hali: 'imethibitishwa' },
    { id: 'M-003', njia: 'cash', simu: 'CASH', kumbukumbu: 'CASH-20261103-001', kiasi: 450000, tarehe: '2026-11-03', hali: 'imethibitishwa' },
    { id: 'M-004', njia: 'mpesa', simu: '0754-444-555', kumbukumbu: 'MPESA-20261104-001', kiasi: 3200000, tarehe: '2026-11-04', hali: 'imethibitishwa' },
    { id: 'M-005', njia: 'mpesa', simu: '0754-666-777', kumbukumbu: 'MPESA-20261105-001', kiasi: 320000, tarehe: '2026-11-05', hali: 'imethibitishwa' },
    { id: 'M-006', njia: 'tigopesa', simu: '0754-222-333', kumbukumbu: 'TIGO-20261105-002', kiasi: 620000, tarehe: '2026-11-05', hali: 'imethibitishwa' },
  ]

  // ---------- ORDERS ----------
  const orders: Order[] = [
    {
      id: 'ORD-2026-001', quotationId: 'Q-2026-001',
      mteja: 'Mjenzi Mwakyusa', simu: '0754-111-222',
      bidhaa: [
        { id: 'b1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 100, jumla: 1850000 },
        { id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 270, jumla: 648000 },
      ],
      jumla: 2498000,
      malipo: [malipo[0]],
      hali: 'imekamilika',
      tarehe: '2026-11-01',
    },
    {
      id: 'ORD-2026-002', quotationId: 'Q-2026-002',
      mteja: 'Kampuni ya Nyati Ltd', simu: '0754-333-444',
      bidhaa: [
        { id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1500, jumla: 3600000 },
        { id: 'b3', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 50, jumla: 1600000 },
      ],
      jumla: 5200000,
      malipo: [malipo[1]],
      hali: 'inasubiri_malipo',
      tarehe: '2026-11-02',
    },
    {
      id: 'ORD-2026-003', quotationId: 'Q-2026-003',
      mteja: 'Fundi Joseph', simu: '0754-555-666',
      bidhaa: [
        { id: 'b1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 30, jumla: 555000 },
        { id: 'b5', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 35, jumla: 297500 },
      ],
      jumla: 852500,
      malipo: [],
      hali: 'inasubiri_malipo',
      tarehe: '2026-11-03',
    },
    {
      id: 'ORD-2026-004', quotationId: 'Q-2026-004',
      mteja: 'Fundi Hassan', simu: '0754-999-000',
      bidhaa: [
        { id: 'b9', jina: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', uom: 'Mfuko', bei: 18000, wingi: 25, jumla: 450000 },
      ],
      jumla: 450000,
      malipo: [malipo[2]],
      hali: 'imekamilika',
      tarehe: '2026-11-03',
    },
    {
      id: 'ORD-2026-005', quotationId: 'Q-2026-005',
      mteja: 'Jengo Group Ltd', simu: '0754-444-555',
      bidhaa: [
        { id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1000, jumla: 2400000 },
        { id: 'b3', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 25, jumla: 800000 },
      ],
      jumla: 3200000,
      malipo: [malipo[3]],
      hali: 'imekamilika',
      tarehe: '2026-11-04',
    },
    {
      id: 'ORD-2026-006', quotationId: 'Q-2026-006',
      mteja: 'Fundi Mwita', simu: '0754-222-333',
      bidhaa: [
        { id: 'b5', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 40, jumla: 340000 },
        { id: 'b6', jina: 'Bomba PVC 1"', sku: 'BOM-PVC-1', uom: 'Mita', bei: 12000, wingi: 30, jumla: 360000 },
      ],
      jumla: 700000,
      malipo: [],
      hali: 'inasubiri_malipo',
      tarehe: '2026-11-05',
    },
    {
      id: 'ORD-2026-007', quotationId: 'Q-2026-007',
      mteja: 'Mama Amina', simu: '0754-666-777',
      bidhaa: [
        { id: 'b4', jina: 'Rangi Nyeupe 20L', sku: 'RAN-WH-20', uom: 'Lita', bei: 95000, wingi: 2, jumla: 190000 },
        { id: 'b11', jina: 'Rangi ya Blu 20L', sku: 'RAN-BL-20', uom: 'Lita', bei: 98000, wingi: 1, jumla: 98000 },
        { id: 'b12', jina: 'Nyundo Kubwa', sku: 'ZAN-HAM-1', uom: 'Kipande', bei: 18000, wingi: 1, jumla: 18000 },
      ],
      jumla: 306000,
      malipo: [malipo[4]],
      hali: 'imekamilika',
      tarehe: '2026-11-05',
    },
    {
      id: 'ORD-2026-008', quotationId: 'Q-2026-008',
      mteja: 'Fundi Mwita', simu: '0754-222-333',
      bidhaa: [
        { id: 'b3', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 20, jumla: 640000 },
      ],
      jumla: 640000,
      malipo: [malipo[5]],
      hali: 'imekamilika',
      tarehe: '2026-11-05',
    },
  ]

  // ---------- MAUZO YA DUKA ----------
  const mauzo: MauzoYaDuka[] = [
    { id: 'SALE-001', tarehe: '2026-11-01', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', muuzaji: 'Juma Hassan', bidhaa: [{ id: 'b1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 100, jumla: 1850000 }], jumlaMauzo: 1850000, cogs: 1600000, faidaGhafi: 250000 },
    { id: 'SALE-002', tarehe: '2026-11-02', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', muuzaji: 'Juma Hassan', bidhaa: [{ id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1500, jumla: 3600000 }], jumlaMauzo: 3600000, cogs: 3150000, faidaGhafi: 450000 },
    { id: 'SALE-003', tarehe: '2026-11-02', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', muuzaji: 'Peter John', bidhaa: [{ id: 'b5', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', bei: 8500, wingi: 40, jumla: 340000 }], jumlaMauzo: 340000, cogs: 280000, faidaGhafi: 60000 },
    { id: 'SALE-004', tarehe: '2026-11-03', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', muuzaji: 'Juma Hassan', bidhaa: [{ id: 'b9', jina: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', uom: 'Mfuko', bei: 18000, wingi: 25, jumla: 450000 }], jumlaMauzo: 450000, cogs: 387500, faidaGhafi: 62500 },
    { id: 'SALE-005', tarehe: '2026-11-04', dukaId: 'd3', dukaJina: 'Smart Hardware - Kariakoo', muuzaji: 'Moses Kimaro', bidhaa: [{ id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 1000, jumla: 2400000 }], jumlaMauzo: 2400000, cogs: 2100000, faidaGhafi: 300000 },
    { id: 'SALE-006', tarehe: '2026-11-04', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', muuzaji: 'Peter John', bidhaa: [{ id: 'b4', jina: 'Rangi Nyeupe 20L', sku: 'RAN-WH-20', uom: 'Lita', bei: 95000, wingi: 2, jumla: 190000 }], jumlaMauzo: 190000, cogs: 164000, faidaGhafi: 26000 },
    { id: 'SALE-007', tarehe: '2026-11-05', dukaId: 'd3', dukaJina: 'Smart Hardware - Kariakoo', muuzaji: 'Moses Kimaro', bidhaa: [{ id: 'b3', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 25, jumla: 800000 }], jumlaMauzo: 800000, cogs: 700000, faidaGhafi: 100000 },
    { id: 'SALE-008', tarehe: '2026-11-05', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', muuzaji: 'Juma Hassan', bidhaa: [{ id: 'b12', jina: 'Nyundo Kubwa', sku: 'ZAN-HAM-1', uom: 'Kipande', bei: 18000, wingi: 1, jumla: 18000 }], jumlaMauzo: 18000, cogs: 14000, faidaGhafi: 4000 },
    { id: 'SALE-009', tarehe: '2026-11-06', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', muuzaji: 'Juma Hassan', bidhaa: [{ id: 'b1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 50, jumla: 925000 }], jumlaMauzo: 925000, cogs: 800000, faidaGhafi: 125000 },
    { id: 'SALE-010', tarehe: '2026-11-07', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', muuzaji: 'Peter John', bidhaa: [{ id: 'b10', jina: 'Nondo D10', sku: 'NON-D10', uom: 'Kg', bei: 2200, wingi: 300, jumla: 660000 }], jumlaMauzo: 660000, cogs: 570000, faidaGhafi: 90000 },
  ]

  // ---------- OPEX ----------
  const opex: GharamaOpex[] = [
    { id: 'OPEX-001', tarehe: '2026-11-01', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', aina: 'kodi', maelezo: 'Kodi ya duka Novemba', kiasi: 500000, aliyeingiza: 'Moses Kimaro' },
    { id: 'OPEX-002', tarehe: '2026-11-01', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', aina: 'umeme', maelezo: 'Umeme wa Luku', kiasi: 150000, aliyeingiza: 'Juma Hassan' },
    { id: 'OPEX-003', tarehe: '2026-11-02', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', aina: 'mafuta', maelezo: 'Mafuta ya pikipiki', kiasi: 80000, aliyeingiza: 'Juma Hassan' },
    { id: 'OPEX-004', tarehe: '2026-11-02', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', aina: 'kodi', maelezo: 'Kodi ya duka Novemba', kiasi: 400000, aliyeingiza: 'Moses Kimaro' },
    { id: 'OPEX-005', tarehe: '2026-11-03', dukaId: 'd3', dukaJina: 'Smart Hardware - Kariakoo', aina: 'umeme', maelezo: 'Umeme wa Luku', kiasi: 100000, aliyeingiza: 'Moses Kimaro' },
    { id: 'OPEX-006', tarehe: '2026-11-04', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', aina: 'matengenezo', maelezo: 'Matengenezo ya gari', kiasi: 250000, aliyeingiza: 'Moses Kimaro' },
  ]

  // ---------- AKAUNTI ----------
  const akaunti: AkauntiMfanyakazi[] = [
    { id: 'ACC-001', mtumiajiId: 'u1', jinaMtumiaji: 'Juma Hassan', aina: 'mobile', jina: 'M-Pesa', namba: '0712-345-678', jinaMmiliki: 'Juma Hassan', ndiyoMsingi: true },
    { id: 'ACC-002', mtumiajiId: 'u2', jinaMtumiaji: 'Asha Mwinyi', aina: 'mobile', jina: 'Tigo Pesa', namba: '0713-456-789', jinaMmiliki: 'Asha Mwinyi', ndiyoMsingi: true },
    { id: 'ACC-003', mtumiajiId: 'u3', jinaMtumiaji: 'Peter John', aina: 'bank', jina: 'CRDB Bank', namba: '0150123456790', jinaMmiliki: 'Peter John', ndiyoMsingi: true },
    { id: 'ACC-004', mtumiajiId: 'u4', jinaMtumiaji: 'Fatuma Ali', aina: 'mobile', jina: 'Airtel Money', namba: '0715-678-901', jinaMmiliki: 'Fatuma Ali', ndiyoMsingi: true },
    { id: 'ACC-005', mtumiajiId: 'u5', jinaMtumiaji: 'Moses Kimaro', aina: 'mobile', jina: 'Tigo Pesa', namba: '0716-789-012', jinaMmiliki: 'Moses Kimaro', ndiyoMsingi: true },
    { id: 'ACC-006', mtumiajiId: 'u6', jinaMtumiaji: 'Grace Mushi', aina: 'bank', jina: 'NMB Bank', namba: '2050123456789', jinaMmiliki: 'Grace Mushi', ndiyoMsingi: true },
  ]

  // ---------- MISHAHARA ----------
  const mishahara: Mshahara[] = [
    { id: 'SAL-001', mtumiajiId: 'u1', jinaMtumiaji: 'Juma Hassan', nafasi: 'Muuzaji', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 450000, posho: 50000, overtime: 30000, mafao: 20000, makato: 25000, jumla: 525000, hali: 'imelipwa', tareheMalipo: '2026-11-05', njiaMalipo: 'mpesa', akauntiMalipo: '0712-345-678', kumbukumbu: 'PAY-001', aliyeidhinisha: 'Moses Kimaro', tareheIdhini: '2026-11-05' },
    { id: 'SAL-002', mtumiajiId: 'u2', jinaMtumiaji: 'Asha Mwinyi', nafasi: 'Mhazini', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 400000, posho: 40000, overtime: 20000, mafao: 15000, makato: 20000, jumla: 455000, hali: 'inasubiri' },
    { id: 'SAL-003', mtumiajiId: 'u3', jinaMtumiaji: 'Peter John', nafasi: 'Muuzaji', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 450000, posho: 50000, overtime: 35000, mafao: 20000, makato: 25000, jumla: 530000, hali: 'imelipwa', tareheMalipo: '2026-11-05', njiaMalipo: 'crdb', akauntiMalipo: '0150123456790', kumbukumbu: 'PAY-002', aliyeidhinisha: 'Moses Kimaro', tareheIdhini: '2026-11-05' },
    { id: 'SAL-004', mtumiajiId: 'u4', jinaMtumiaji: 'Fatuma Ali', nafasi: 'Mhazini', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 400000, posho: 40000, overtime: 15000, mafao: 15000, makato: 20000, jumla: 450000, hali: 'inasubiri' },
    { id: 'SAL-005', mtumiajiId: 'u5', jinaMtumiaji: 'Moses Kimaro', nafasi: 'Mmiliki', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 800000, posho: 100000, overtime: 0, mafao: 50000, makato: 50000, jumla: 900000, hali: 'imelipwa', tareheMalipo: '2026-11-05', njiaMalipo: 'tigopesa', akauntiMalipo: '0716-789-012', kumbukumbu: 'PAY-003', aliyeidhinisha: 'Moses Kimaro', tareheIdhini: '2026-11-05' },
    { id: 'SAL-006', mtumiajiId: 'u6', jinaMtumiaji: 'Grace Mushi', nafasi: 'Admin', dukaId: 'd3', dukaJina: 'Smart Hardware - Kariakoo', mwezi: 'Novemba 2026', kipindi: '01 - 30 Nov 2026', mshaharaMsingi: 600000, posho: 80000, overtime: 0, mafao: 30000, makato: 35000, jumla: 675000, hali: 'inasubiri' },
  ]

  // ---------- MAOMBI ----------
  const maombi: OmbiMatumizi[] = [
    { id: 'EXP-2026-001', aina: 'mafuta', kiasi: 80000, maelezo: 'Mafuta ya pikipiki', simu: '0754-123-456', sababu: 'Kusafirisha mizigo', aliyeomba: 'Juma Hassan', duka: 'Kwembe', tarehe: '2026-11-09', hali: 'imekubaliwa', maoni: 'Sawa, endelea', aliyeidhinisha: 'Moses Kimaro', tareheIdhini: '2026-11-09' },
    { id: 'EXP-2026-002', aina: 'chakula', kiasi: 45000, maelezo: 'Chakula cha wafanyakazi', simu: '0754-123-456', sababu: 'Wafanyakazi walifanya kazi hadi usiku', aliyeomba: 'Juma Hassan', duka: 'Kwembe', tarehe: '2026-11-10', hali: 'inasubiri' },
    { id: 'EXP-2026-003', aina: 'matengenezo', kiasi: 250000, maelezo: 'Kutengeneza gari la mizigo', simu: '0754-123-456', sababu: 'Gari liliharibika njiani', aliyeomba: 'Peter John', duka: 'Pugu', tarehe: '2026-11-08', hali: 'imekataliwa', maoni: 'Tafadhali tumia gari lingine kwanza', aliyeidhinisha: 'Moses Kimaro', tareheIdhini: '2026-11-08' },
  ]

  // ---------- RIPOTI ZA BIDHAA ----------
  const ripotiBidhaa: RipotiBidhaa[] = [
    { id: 'RIP-001', bidhaaId: 'b9', jina: 'Saruji Twiga 50kg', sku: 'SAR-TWI-50', uom: 'Mfuko', kundi: 'Saruji', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe', aina: 'uharibifu', wingi: 5, beiUnunuzi: 15500, thamani: 77500, sababu: 'Saruji imekauka', maelezo: 'Saruji 5 zimekauka', expiry: '2027-01-20', aliyeingiza: 'Juma Hassan', tarehe: '2026-11-09', hali: 'imethibitishwa' },
    { id: 'RIP-002', bidhaaId: 'b4', jina: 'Rangi Nyeupe 20L', sku: 'RAN-WH-20', uom: 'Lita', kundi: 'Rangi', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', aina: 'expiry', wingi: 3, beiUnunuzi: 82000, thamani: 246000, sababu: 'Rangi imeisha muda', maelezo: 'Rangi imeganda', expiry: '2026-12-01', aliyeingiza: 'Peter John', tarehe: '2026-11-10', hali: 'inasubiri' },
  ]

  // ---------- MAREKEBISHO YA STOKI ----------
  const marekebishoStoki: MarekebishoStoki[] = [
    { id: 'ADJ-001', bidhaaId: 'b5', jina: 'Mbao 2x4', sku: 'MBA-2X4', uom: 'Mita', kundi: 'Mbao', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu', aina: 'uharibifu', wingi: 3, beiUnunuzi: 7000, thamani: 21000, sababu: 'Mbao zimevunjika', aliyeingiza: 'Peter John', tarehe: '2026-11-09', hali: 'imethibitishwa' },
    { id: 'ADJ-002', bidhaaId: 'b6', jina: 'Bomba PVC 1"', sku: 'BOM-PVC-1', uom: 'Mita', kundi: 'Bomba', dukaId: 'd3', dukaJina: 'Smart Hardware - Kariakoo', aina: 'upotevu', wingi: 2, beiUnunuzi: 9500, thamani: 19000, sababu: 'Bomba zimepotea', aliyeingiza: 'Grace Mushi', tarehe: '2026-11-10', hali: 'inasubiri' },
  ]

  // ---------- UINGIZAJI VIFAA ----------
  const uingizaji: UingizajiVifaa[] = [
    {
      id: 'INP-001', aina: 'bulk', dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe',
      bidhaa: [
        { jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', kundi: 'Saruji', beiMauzo: 18500, beiUnunuzi: 16000, uom: 'Mfuko', stoki: 400, location: 'Smart Hardware - Kwembe', expiry: '2027-02-15', iconKey: 'Saruji' },
        { jina: 'Nondo D12', sku: 'NON-D12', kundi: 'Nondo', beiMauzo: 2400, beiUnunuzi: 2100, uom: 'Kg', stoki: 2000, location: 'Smart Hardware - Kwembe', iconKey: 'Nondo' },
      ],
      jumlaBidhaa: 2400, jumlaThamani: 10600000,
      aliyeingiza: 'Moses Kimaro', nafasi: 'mmiliki', tarehe: '2026-11-08', hali: 'imepokelewa', aliyepokea: 'Juma Hassan', tareheKupokea: '2026-11-08',
    },
    {
      id: 'INP-002', aina: 'moja', dukaId: 'd2', dukaJina: 'Smart Hardware - Pugu',
      bidhaa: [
        { jina: 'Mabati G30', sku: 'MAB-G30', kundi: 'Mabati', beiMauzo: 32000, beiUnunuzi: 28000, uom: 'Mita', stoki: 500, location: 'Smart Hardware - Pugu', iconKey: 'Mabati' },
      ],
      jumlaBidhaa: 500, jumlaThamani: 14000000,
      aliyeingiza: 'Moses Kimaro', nafasi: 'mmiliki', tarehe: '2026-11-10', hali: 'inasubiri',
    },
  ]

  // ---------- DOCUMENTS ----------
  const documents: Document[] = [
    {
      id: 'DOC-2026-001',
      jina: 'Ripoti ya Mauzo — Novemba 2026',
      aina: 'mauzo',
      format: 'pdf',
      dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe',
      ukubwa: '245 KB',
      tarehe: '2026-11-10', muda: '15:30',
      hali: 'tayari',
      aliyezalisha: 'Juma Hassan',
      kipindi: 'Novemba 2026',
      snapshot: {
        kichwa: ['Tarehe', 'Mauzo', 'Faida', 'Orders'],
        safu: [
          ['2026-11-01', 'Tsh 1,850,000', 'Tsh 250,000', 1],
          ['2026-11-02', 'Tsh 3,600,000', 'Tsh 450,000', 1],
        ],
        jumla: { mauzo: 'Tsh 5,450,000', faida: 'Tsh 700,000', orders: 2 },
      },
    },
    {
      id: 'DOC-2026-002',
      jina: 'Ripoti ya Stoki — Novemba 2026',
      aina: 'stoki',
      format: 'excel',
      dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe',
      ukubwa: '128 KB',
      tarehe: '2026-11-10', muda: '14:15',
      hali: 'tayari',
      aliyezalisha: 'Juma Hassan',
      kipindi: 'Novemba 2026',
      snapshot: {
        kichwa: ['Bidhaa', 'SKU', 'Stoki', 'Thamani'],
        safu: [
          ['Saruji Dangote 50kg', 'SAR-DAN-50', 120, 'Tsh 1,920,000'],
          ['Nondo D12', 'NON-D12', 800, 'Tsh 1,680,000'],
        ],
        jumla: { bidhaa: 2, thamani: 'Tsh 3,600,000' },
      },
    },
  ]

  // ---------- HESABU jumlaManunuzi na deni kwa wateja ----------
  const watejaKamili = wateja.map((m) => {
    const ordersZake = orders.filter((o) => o.simu === m.simu)
    const jumlaManunuzi = ordersZake.reduce((s, o) => s + o.jumla, 0)
    const jumlaMalipo = ordersZake.reduce(
      (s, o) =>
        s + o.malipo.filter((x) => x.hali === 'imethibitishwa').reduce((a, x) => a + x.kiasi, 0),
      0
    )
    return { ...m, jumlaManunuzi, deni: Math.max(jumlaManunuzi - jumlaMalipo, 0) }
  })

  // ---------- ANDIKA KILA KITU ----------
  const writes: { key: string; ok: boolean }[] = []
  const write = (key: any, data: any) => {
    const ok = db.set(key, data)
    writes.push({ key, ok })
    return ok
  }

  write('maduka', maduka)
  write('wafanyakazi', wafanyakazi)
  write('bidhaa', bidhaa)
  write('wateja', watejaKamili)
  write('mauzo', mauzo)
  write('opex', opex)
  write('orders', orders)
  write('malipo', malipo)
  write('madeni', [])
  write('zakaMalipo', [])
  write('maombi', maombi)
  write('ripotiBidhaa', ripotiBidhaa)
  write('marekebishoStoki', marekebishoStoki)
  write('mishahara', mishahara)
  write('akaunti', akaunti)
  write('uingizaji', uingizaji)
  write('grn', [])
  write('carts', [])
  write('notifications', [])
  write('documents', documents)

  const zoteZimefanikiwa = writes.every((r) => r.ok)
  if (zoteZimefanikiwa) {
    db.set('_meta', { version: '1.0.0', seeded: true })
    console.log('[seed] ',     'Demo data imeandikwa — maduka:', maduka.length, 'bidhaa:', bidhaa.length)
  } else {
    console.error(' Tables zilizoshindwa:', writes.filter((r) => !r.ok).map((r) => r.key))
  }
}