// ============================================================
// DEMO SEED — data chache tu, yenye mahusiano
// ============================================================
import { db } from './db'
import type {
  Duka, Mtumiaji, Bidhaa, Mteja, MauzoYaDuka, GharamaOpex,
} from '../../types'

export function seedIfEmpty() {
  // ✅ Guard 1: Kama _meta.seeded ipo, usiandike
  const meta = db.get('_meta') as any
  if (meta?.seeded) {
    return
  }

  // ✅ Guard 2: Kama maduka yapo tayari, usi-overwrite
  //    (inawezekana _meta haijaandikwa kwa sababu ya kosa la awali)
  const madukaZilizopo = db.get('maduka') as any[]
  if (madukaZilizopo.length > 0) {
    db.set('_meta', { version: '1.0.0', seeded: true })
    return
  }

  // ---------- MADUKA ----------
  const maduka: Duka[] = [
    { id: 'd1', jina: 'Smart Hardware - Kwembe', mahali: 'Kwembe, Dar', mauzoLeo: 0, faidaLeo: 0, wafanyakazi: 3 },
    { id: 'd2', jina: 'Smart Hardware - Pugu', mahali: 'Pugu, Dar', mauzoLeo: 0, faidaLeo: 0, wafanyakazi: 2 },
  ]

  // ---------- WAFANYAKAZI ----------
  const wafanyakazi: Mtumiaji[] = [
    { id: 'u1', jina: 'Juma Hassan', role: 'muuzaji', duka: 'Kwembe', simu: '0712-345-678', active: true },
    { id: 'u2', jina: 'Asha Mwinyi', role: 'mhazini', duka: 'Kwembe', simu: '0713-456-789', active: true },
    { id: 'u3', jina: 'Peter John', role: 'muuzaji', duka: 'Pugu', simu: '0714-567-890', active: true },
    { id: 'u4', jina: 'Moses Kimaro', role: 'mmiliki', duka: 'Kwembe', simu: '0716-789-012', active: true },
  ]

  // ---------- BIDHAA ----------
  const bidhaa: Bidhaa[] = [
    { id: 'b1', sku: 'SAR-DAN-50', jina: 'Saruji Dangote 50kg', kundi: 'Saruji', beiMauzo: 18500, beiUnunuzi: 16000, uom: 'Mfuko', stoki: 120, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', expiry: '2027-02-15', iconKey: 'Saruji' },
    { id: 'b2', sku: 'NON-D12', jina: 'Nondo D12', kundi: 'Nondo', beiMauzo: 2400, beiUnunuzi: 2100, uom: 'Kg', stoki: 800, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', iconKey: 'Nondo' },
    { id: 'b3', sku: 'MAB-G30', jina: 'Mabati G30', kundi: 'Mabati', beiMauzo: 32000, beiUnunuzi: 28000, uom: 'Mita', stoki: 200, duka: 'Kwembe', location: 'Smart Hardware - Kwembe', iconKey: 'Mabati' },
    { id: 'b4', sku: 'RAN-WH-20', jina: 'Rangi Nyeupe 20L', kundi: 'Rangi', beiMauzo: 95000, beiUnunuzi: 82000, uom: 'Lita', stoki: 25, duka: 'Pugu', location: 'Smart Hardware - Pugu', expiry: '2026-12-01', iconKey: 'Rangi' },
  ]

  // ---------- WATEJA ----------
  const wateja: Mteja[] = [
    { id: 'c1', jina: 'Mjenzi Mwakyusa', simu: '0754-111-222', aina: 'mjenzi', mahali: 'Kwembe', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-01-15', active: true },
    { id: 'c2', jina: 'Fundi Joseph', simu: '0754-555-666', aina: 'fundi', mahali: 'Pugu', deni: 0, jumlaManunuzi: 0, tareheSajili: '2025-03-20', active: true },
    { id: 'c3', jina: 'Kampuni ya Nyati Ltd', simu: '0754-333-444', aina: 'kampuni', mahali: 'Kariakoo', tin: '123-456-789', deni: 0, jumlaManunuzi: 0, tareheSajili: '2024-06-10', active: true },
  ]

  // ---------- MAUZO YA DEMO ----------
  const mauzo: MauzoYaDuka[] = [
    {
      id: 'SALE-001', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe',
      muuzaji: 'Juma Hassan',
      bidhaa: [
        { id: 'b1', jina: 'Saruji Dangote 50kg', sku: 'SAR-DAN-50', uom: 'Mfuko', bei: 18500, wingi: 100, jumla: 1850000 },
        { id: 'b2', jina: 'Nondo D12', sku: 'NON-D12', uom: 'Kg', bei: 2400, wingi: 270, jumla: 648000 },
      ],
      jumlaMauzo: 2498000, cogs: 1600000, faidaGhafi: 898000,
    },
    {
      id: 'SALE-002', tarehe: '2026-11-10', dukaId: 'd2', dukaJina: 'Pugu',
      muuzaji: 'Peter John',
      bidhaa: [
        { id: 'b3', jina: 'Mabati G30', sku: 'MAB-G30', uom: 'Mita', bei: 32000, wingi: 50, jumla: 1600000 },
      ],
      jumlaMauzo: 1600000, cogs: 1400000, faidaGhafi: 200000,
    },
  ]

  // ---------- OPEX YA DEMO ----------
  const opex: GharamaOpex[] = [
    { id: 'OPEX-001', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'mishahara', maelezo: 'Mishahara', kiasi: 1200000, aliyeingiza: 'Moses Kimaro' },
    { id: 'OPEX-002', tarehe: '2026-11-10', dukaId: 'd1', dukaJina: 'Kwembe', aina: 'kodi', maelezo: 'Kodi ya duka', kiasi: 500000, aliyeingiza: 'Moses Kimaro' },
    { id: 'OPEX-003', tarehe: '2026-11-10', dukaId: 'd2', dukaJina: 'Pugu', aina: 'mishahara', maelezo: 'Mishahara', kiasi: 900000, aliyeingiza: 'Moses Kimaro' },
  ]

  // ✅ Andika tables zote, angalia kama zote zimefanikiwa
  const results: { key: string; ok: boolean }[] = []

  const write = (key: any, data: any) => {
    const ok = db.set(key, data)
    results.push({ key, ok })
    return ok
  }

  write('maduka', maduka)
  write('wafanyakazi', wafanyakazi)
  write('bidhaa', bidhaa)
  write('wateja', wateja)
  write('mauzo', mauzo)
  write('opex', opex)
  write('orders', [])
  write('malipo', [])
  write('madeni', [])
  write('zakaMalipo', [])
  write('maombi', [])
  write('ripotiBidhaa', [])
  write('marekebishoStoki', [])
  write('mishahara', [])
  write('akaunti', [])
  write('uingizaji', [])
  write('grn', [])
  write('carts', [])
  write('notifications', [])
  write('documents', [])

  // ✅ Muhimu: Andika _meta MWISHO tu kama tables zote zimefanikiwa
  const zoteZimefanikiwa = results.every((r) => r.ok)
  if (zoteZimefanikiwa) {
    const metaOk = db.set('_meta', { version: '1.0.0', seeded: true })
    if (!metaOk) {
      console.error('[seed] _meta imeshindwa kuandikwa — data itarudi kila refresh')
    }
  } else {
    console.error(
      '[seed] Baadhi ya tables hazikuandikwa. _meta haijawekwa ili kuruhusu retry:',
      results.filter((r) => !r.ok).map((r) => r.key)
    )
  }
}