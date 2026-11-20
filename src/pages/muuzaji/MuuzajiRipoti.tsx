
import { useMemo, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Search,
  Trash2,
  X,
  Eye,
  Plus,
  Clock,
  ArrowDownToLine,
  Sheet,
  Table,
  File,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { iconForKundi } from '../../utils/icons'
import { buildDocument } from '../../utils/documentGenerator'
import { useLanguage } from '../../i18n/LanguageContext'
import type {
  AinaDocument,
  Document,
  HaliDocument,
} from '../../types'

// ============================================================
// Meta
// ============================================================

const AINA_DOC_META: Record<
  AinaDocument,
  {
    labelSw: string
    labelEn: string
    Icon: React.ElementType
    tone: string
  }
> = {
  mauzo: {
    labelSw: 'Mauzo',
    labelEn: 'Sales',
    Icon: TrendingUp,
    tone: 'text-blue-600',
  },
  stoki: {
    labelSw: 'Stoki',
    labelEn: 'Inventory',
    Icon: Package,
    tone: 'text-emerald-600',
  },
  wateja: {
    labelSw: 'Wateja',
    labelEn: 'Customers',
    Icon: Users,
    tone: 'text-purple-600',
  },
  madeni: {
    labelSw: 'Madeni',
    labelEn: 'Debts',
    Icon: Wallet,
    tone: 'text-red-600',
  },
  gharama: {
    labelSw: 'Gharama',
    labelEn: 'Expenses',
    Icon: FileText,
    tone: 'text-amber-600',
  },
  jumla: {
    labelSw: 'Jumla',
    labelEn: 'Summary',
    Icon: BarChart3,
    tone: 'text-slate-600',
  },
}

const FORMAT_META: Record<
  'pdf' | 'csv' | 'excel',
  { Icon: React.ElementType; tone: string }
> = {
  pdf: { Icon: File, tone: 'text-red-600' },
  csv: { Icon: Table, tone: 'text-blue-600' },
  excel: { Icon: Sheet, tone: 'text-emerald-600' },
}

const HALI_DOC_META: Record<
  HaliDocument,
  {
    labelSw: string
    labelEn: string
    Icon: React.ElementType
    tone: string
  }
> = {
  tayari: {
    labelSw: 'Tayari',
    labelEn: 'Ready',
    Icon: CheckCircle2,
    tone: 'text-emerald-600',
  },
  inasindika: {
    labelSw: 'Inasindika',
    labelEn: 'Processing',
    Icon: Clock,
    tone: 'text-amber-600',
  },
  imeshindwa: {
    labelSw: 'Imeshindwa',
    labelEn: 'Failed',
    Icon: X,
    tone: 'text-red-600',
  },
}

type Tab = 'mauzo' | 'stoki' | 'wateja' | 'documents'

const TABS: {
  key: Tab
  labelSw: string
  labelEn: string
  Icon: React.ElementType
}[] = [
  {
    key: 'mauzo',
    labelSw: 'Mauzo',
    labelEn: 'Sales',
    Icon: TrendingUp,
  },
  {
    key: 'stoki',
    labelSw: 'Stoki',
    labelEn: 'Inventory',
    Icon: Package,
  },
  {
    key: 'wateja',
    labelSw: 'Wateja',
    labelEn: 'Customers',
    Icon: Users,
  },
  {
    key: 'documents',
    labelSw: 'Nyaraka',
    labelEn: 'Documents',
    Icon: FileText,
  },
]

// ============================================================
// Main Component
// ============================================================

export default function MuuzajiRipoti() {
  const [tab, setTab] = useState<Tab>('mauzo')
  const { documents } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 size={26} className="text-brand-600" />
            {isSwahili ? 'Ripoti za Duka' : 'Store Reports'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Duka la Kwembe — Muuzaji: Juma Hassan'
              : 'Kwembe Store — Seller: Juma Hassan'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
              tab === t.key
                ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.Icon size={14} />
            {isSwahili ? t.labelSw : t.labelEn}

            {t.key === 'documents' && documents.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  tab === t.key ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                {documents.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'mauzo' && <RipotiMauzoTab />}
      {tab === 'stoki' && <RipotiStokiTab />}
      {tab === 'wateja' && <RipotiWatejaTab />}
      {tab === 'documents' && <DocumentsTab />}
    </div>
  )
}

// ============================================================
// Ripoti ya Mauzo
// ============================================================

function RipotiMauzoTab() {
  const { mauzo } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const ripotiKwaTarehe = useMemo(() => {
    const map = new Map<
      string,
      {
        tarehe: string
        mauzo: number
        faida: number
        orders: number
      }
    >()

    for (const m of mauzo) {
      const ex = map.get(m.tarehe)

      if (ex) {
        ex.mauzo += m.jumlaMauzo
        ex.faida += m.faidaGhafi
        ex.orders += 1
      } else {
        map.set(m.tarehe, {
          tarehe: m.tarehe,
          mauzo: m.jumlaMauzo,
          faida: m.faidaGhafi,
          orders: 1,
        })
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.tarehe < b.tarehe ? -1 : 1
    )
  }, [mauzo])

  const jumla = useMemo(
    () =>
      ripotiKwaTarehe.reduce(
        (a, r) => ({
          mauzo: a.mauzo + r.mauzo,
          faida: a.faida + r.faida,
          orders: a.orders + r.orders,
        }),
        { mauzo: 0, faida: 0, orders: 0 }
      ),
    [ripotiKwaTarehe]
  )

  const downloadCsv = () => {
    const rows = [
      [
        isSwahili ? 'Tarehe' : 'Date',
        isSwahili ? 'Mauzo' : 'Sales',
        isSwahili ? 'Faida' : 'Profit',
        'Orders',
      ],
      ...ripotiKwaTarehe.map((r) => [
        r.tarehe,
        r.mauzo,
        r.faida,
        r.orders,
      ]),
      [
        isSwahili ? 'JUMLA' : 'TOTAL',
        jumla.mauzo,
        jumla.faida,
        jumla.orders,
      ],
    ]

    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = `ripoti-mauzo-${Date.now()}.csv`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <RipotiStat
          label={isSwahili ? 'Mauzo Yote' : 'Total Sales'}
          value={formatTsh(jumla.mauzo)}
          Icon={TrendingUp}
          tone="text-blue-600"
        />

        <RipotiStat
          label={isSwahili ? 'Faida Ghafi' : 'Gross Profit'}
          value={formatTsh(jumla.faida)}
          Icon={CheckCircle2}
          tone="text-emerald-600"
        />

        <RipotiStat
          label="Orders"
          value={String(jumla.orders)}
          Icon={Package}
          tone="text-blue-600"
        />

        <RipotiStat
          label={isSwahili ? 'Wastani kwa Order' : 'Average per Order'}
          value={formatTsh(
            jumla.orders
              ? Math.round(jumla.mauzo / jumla.orders)
              : 0
          )}
          Icon={BarChart3}
          tone="text-amber-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-600" />
            {isSwahili ? 'Mauzo kwa Siku' : 'Daily Sales'}
          </h3>
        </div>

        <div className="w-full h-64">
          {ripotiKwaTarehe.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-slate-500">
              {isSwahili ? 'Hakuna mauzo bado' : 'No sales yet'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ripotiKwaTarehe}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="tarehe"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />

                <Tooltip
                  formatter={(v) => formatTsh(Number(v ?? 0))}
                />

                <Line
                  type="monotone"
                  dataKey="mauzo"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name={isSwahili ? 'Mauzo' : 'Sales'}
                />

                <Line
                  type="monotone"
                  dataKey="faida"
                  stroke="#10b981"
                  strokeWidth={2}
                  name={isSwahili ? 'Faida' : 'Profit'}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText size={16} className="text-brand-600" />
            {isSwahili ? 'Jedwali la Mauzo' : 'Sales Table'}
          </h3>

          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium"
          >
            <Download size={12} />
            {isSwahili ? 'Pakua CSV' : 'Download CSV'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium">
                  {isSwahili ? 'Tarehe' : 'Date'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Mauzo' : 'Sales'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Faida' : 'Profit'}
                </th>
                <th className="p-3 text-right font-medium">
                  Orders
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {ripotiKwaTarehe.map((r) => (
                <tr key={r.tarehe} className="hover:bg-slate-50/50">
                  <td className="p-3">{r.tarehe}</td>
                  <td className="p-3 text-right">
                    {r.mauzo.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-emerald-600 font-medium">
                    {r.faida.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">{r.orders}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td className="p-3 font-bold">
                  {isSwahili ? 'JUMLA' : 'TOTAL'}
                </td>
                <td className="p-3 text-right font-bold">
                  {jumla.mauzo.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  {jumla.faida.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold">
                  {jumla.orders}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Ripoti ya Stoki
// ============================================================

function RipotiStokiTab() {
  const { bidhaa } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const ripotiStoki = useMemo(() => {
    return bidhaa.map((b) => {
      const hali: 'sawa' | 'inaribia' | 'imeisha' =
        b.stoki <= 0
          ? 'imeisha'
          : b.stoki <= 20
            ? 'inaribia'
            : 'sawa'

      return {
        id: b.id,
        bidhaa: b.jina,
        sku: b.sku,
        stoki: b.stoki,
        kiwangoChini: 20,
        hali,
        pichaUrl: b.pichaUrl,
        iconKey: b.iconKey,
      }
    })
  }, [bidhaa])

  const jumlaImeisha = ripotiStoki.filter(
    (r) => r.hali === 'imeisha'
  ).length

  const jumlaInaribia = ripotiStoki.filter(
    (r) => r.hali === 'inaribia'
  ).length

  const haliLabel = (hali: string) => {
    if (hali === 'sawa') return isSwahili ? 'Sawa' : 'Normal'
    if (hali === 'inaribia') return isSwahili ? 'Inakaribia kuisha' : 'Low Stock'
    if (hali === 'imeisha') return isSwahili ? 'Imeisha' : 'Out of Stock'
    return hali
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label={isSwahili ? 'Bidhaa Zote' : 'Total Products'}
          value={String(ripotiStoki.length)}
          Icon={Package}
          tone="text-blue-600"
        />

        <RipotiStat
          label={isSwahili ? 'Zimeisha' : 'Out of Stock'}
          value={String(jumlaImeisha)}
          Icon={AlertTriangle}
          tone="text-red-600"
        />

        <RipotiStat
          label={isSwahili ? 'Zinakaribia Kuisha' : 'Low Stock'}
          value={String(jumlaInaribia)}
          Icon={Clock}
          tone="text-amber-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <Package size={16} className="text-brand-600" />
            {isSwahili ? 'Jedwali la Stoki' : 'Inventory Table'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium">
                  {isSwahili ? 'Bidhaa' : 'Product'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Stoki' : 'Stock'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Kiwango cha Chini' : 'Minimum Level'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Hali' : 'Status'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {ripotiStoki.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-slate-500"
                  >
                    {isSwahili ? 'Hakuna bidhaa bado' : 'No products yet'}
                  </td>
                </tr>
              ) : (
                ripotiStoki.map((r) => {
                  const Icon = iconForKundi(r.iconKey)

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
                            {r.pichaUrl ? (
                              <img
                                src={r.pichaUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon size={14} />
                            )}
                          </div>

                          <div>
                            <div className="font-medium">
                              {r.bidhaa}
                            </div>
                            <div className="text-xs text-slate-500">
                              {r.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-right font-semibold">
                        {r.stoki}
                      </td>

                      <td className="p-3 text-right text-slate-500">
                        {r.kiwangoChini}
                      </td>

                      <td className="p-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                            r.hali === 'sawa'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.hali === 'inaribia'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {r.hali === 'sawa' && (
                            <CheckCircle2 size={12} />
                          )}

                          {(r.hali === 'inaribia' ||
                            r.hali === 'imeisha') && (
                            <AlertTriangle size={12} />
                          )}

                          {haliLabel(r.hali)}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Ripoti ya Wateja
// ============================================================

function RipotiWatejaTab() {
  const { wateja, orders, deniLaMteja } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const ripotiWateja = useMemo(() => {
    return wateja.map((m) => {
      const ordersZake = orders.filter(
        (o) => o.simu === m.simu
      )

      const jumlaManunuzi = ordersZake.reduce(
        (s, o) => s + o.jumla,
        0
      )

      const deni = deniLaMteja(m.id)
      const mwisho = ordersZake[0]?.tarehe ?? '—'

      return {
        id: m.id,
        mteja: m.jina,
        simu: m.simu,
        manunuzi: jumlaManunuzi,
        deni,
        mwishoKununua: mwisho,
      }
    })
  }, [wateja, orders, deniLaMteja])

  const jumlaDeni = ripotiWateja.reduce(
    (s, w) => s + w.deni,
    0
  )

  const jumlaManunuzi = ripotiWateja.reduce(
    (s, w) => s + w.manunuzi,
    0
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label={isSwahili ? 'Wateja' : 'Customers'}
          value={String(ripotiWateja.length)}
          Icon={Users}
          tone="text-blue-600"
        />

        <RipotiStat
          label={isSwahili ? 'Jumla ya Madeni' : 'Total Debts'}
          value={formatTsh(jumlaDeni)}
          Icon={Wallet}
          tone="text-red-600"
        />

        <RipotiStat
          label={isSwahili ? 'Jumla ya Manunuzi' : 'Total Purchases'}
          value={formatTsh(jumlaManunuzi)}
          Icon={TrendingUp}
          tone="text-emerald-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <Users size={16} className="text-brand-600" />
            {isSwahili ? 'Jedwali la Wateja' : 'Customer Table'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium">
                  {isSwahili ? 'Mteja' : 'Customer'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Manunuzi' : 'Purchases'}
                </th>
                <th className="p-3 text-right font-medium">
                  {isSwahili ? 'Deni' : 'Debt'}
                </th>
                <th className="p-3 font-medium">
                  {isSwahili ? 'Mwisho Kununua' : 'Last Purchase'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {ripotiWateja.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-slate-500"
                  >
                    {isSwahili ? 'Hakuna wateja bado' : 'No customers yet'}
                  </td>
                </tr>
              ) : (
                ripotiWateja.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-medium">{w.mteja}</div>
                      <div className="text-xs text-slate-500">
                        {w.simu}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      {w.manunuzi.toLocaleString()}
                    </td>

                    <td
                      className={`p-3 text-right font-semibold ${
                        w.deni > 0
                          ? 'text-red-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {w.deni.toLocaleString()}
                    </td>

                    <td className="p-3 text-slate-500">
                      {w.mwishoKununua}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Documents Tab
// ============================================================

function DocumentsTab() {
  const {
    documents,
    setDocuments,
    bidhaa,
    wateja,
    mauzo,
    opex,
    mishahara,
    orders,
  } = useStore()

  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<
    AinaDocument | 'zote'
  >('zote')
  const [selected, setSelected] = useState<Document | null>(null)
  const [zalisha, setZalisha] = useState(false)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()

    return documents.filter((d) => {
      if (filterAina !== 'zote' && d.aina !== filterAina) {
        return false
      }

      if (!query) return true

      return (
        d.jina.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.dukaJina.toLowerCase().includes(query)
      )
    })
  }, [documents, q, filterAina])

  const stats = useMemo(() => {
    const zote = documents.length

    const tayari = documents.filter(
      (d) => d.hali === 'tayari'
    ).length

    const inasindika = documents.filter(
      (d) => d.hali === 'inasindika'
    ).length

    return { zote, tayari, inasindika }
  }, [documents])

  const futa = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id))
  }

  const handleZalisha = (aina: AinaDocument) => {
    // Tumia buildDocument — snapshot inajazwa kutoka data halisi
    const docData = buildDocument({
      aina,
      format: 'pdf',
      dukaId: 'd1',
      dukaJina: 'Smart Hardware - Kwembe',
      aliyezalisha: 'Juma Hassan',
      mauzo,
      bidhaa,
      wateja,
      orders,
      opex,
      mishahara,
    })

    const doc: Document = {
      ...docData,
      id: `DOC-${Date.now()}`,
    }

    setDocuments([doc, ...documents])
    setZalisha(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label={isSwahili ? 'Nyaraka Zote' : 'Total Documents'}
          value={String(stats.zote)}
          Icon={FileText}
          tone="text-blue-600"
        />

        <RipotiStat
          label={isSwahili ? 'Tayari' : 'Ready'}
          value={String(stats.tayari)}
          Icon={CheckCircle2}
          tone="text-emerald-600"
        />

        <RipotiStat
          label={isSwahili ? 'Zinasindika' : 'Processing'}
          value={String(stats.inasindika)}
          Icon={Clock}
          tone="text-amber-600"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setZalisha(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
        >
          <Plus size={16} />
          {isSwahili ? 'Zalisha Ripoti' : 'Generate Report'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              isSwahili
                ? 'Tafuta kwa jina, ID, au duka...'
                : 'Search by name, ID, or store...'
            }
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterAina('zote')}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
              filterAina === 'zote'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isSwahili ? 'Zote' : 'All'}
          </button>

          {(Object.keys(AINA_DOC_META) as AinaDocument[]).map((a) => {
            const meta = AINA_DOC_META[a]

            return (
              <button
                key={a}
                onClick={() => setFilterAina(a)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition ${
                  filterAina === a
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <meta.Icon size={10} />
                {isSwahili ? meta.labelSw : meta.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText size={40} className="mx-auto text-slate-300 mb-3" />

          <h3 className="font-semibold">
            {isSwahili ? 'Hakuna nyaraka' : 'No documents'}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Bofya "Zalisha Ripoti" kuanza.'
              : 'Click "Generate Report" to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => {
            const aina = AINA_DOC_META[d.aina]
            const format = FORMAT_META[d.format]
            const hali = HALI_DOC_META[d.hali]

            return (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${format.tone}`}
                  >
                    <format.Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelected(d)}
                      className="text-sm font-semibold text-left truncate hover:text-brand-600 w-full"
                    >
                      {d.jina}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
                      <span className={`inline-flex items-center gap-1 ${aina.tone}`}>
                        <aina.Icon size={10} />
                        {isSwahili ? aina.labelSw : aina.labelEn}
                      </span>

                      <span className="text-slate-300">|</span>

                      <span className="uppercase font-semibold text-slate-600">
                        {d.format}
                      </span>

                      <span className="text-slate-300">|</span>

                      <span className="text-slate-500">
                        {d.ukubwa}
                      </span>

                      <span className="text-slate-300">|</span>

                      <span className={`inline-flex items-center gap-1 ${hali.tone}`}>
                        <hali.Icon size={10} />
                        {isSwahili ? hali.labelSw : hali.labelEn}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {d.tarehe} — {d.muda} — {d.kipindi}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelected(d)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                      title={isSwahili ? 'Ona' : 'View'}
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      className="p-2 rounded-lg text-brand-600 hover:bg-brand-50 disabled:opacity-40"
                      disabled={d.hali !== 'tayari'}
                      title={isSwahili ? 'Pakua' : 'Download'}
                    >
                      <ArrowDownToLine size={14} />
                    </button>

                    <button
                      onClick={() => futa(d.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title={isSwahili ? 'Futa' : 'Delete'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <DocumentDetailModal
          document={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {zalisha && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setZalisha(false)}
          />

          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="font-semibold">
                {isSwahili ? 'Zalisha Ripoti Mpya' : 'Generate New Report'}
              </div>

              <button
                onClick={() => setZalisha(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {(Object.keys(AINA_DOC_META) as AinaDocument[]).map((a) => {
                const meta = AINA_DOC_META[a]
                const label = isSwahili ? meta.labelSw : meta.labelEn

                return (
                  <button
                    key={a}
                    onClick={() => handleZalisha(a)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}
                    >
                      <meta.Icon size={16} />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {label}
                      </div>

                      <div className="text-xs text-slate-500">
                        {isSwahili
                          ? `Tengeneza ripoti ya ${meta.labelSw.toLowerCase()}`
                          : `Generate ${meta.labelEn.toLowerCase()} report`}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Document Detail Modal
// ============================================================

function DocumentDetailModal({
  document,
  onClose,
}: {
  document: Document
  onClose: () => void
}) {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const aina = AINA_DOC_META[document.aina]
  const format = FORMAT_META[document.format]
  const hali = HALI_DOC_META[document.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{document.id}</div>
            <div className="text-xs text-slate-500">
              {document.tarehe} {document.muda}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold ${format.tone}`}
            >
              <format.Icon size={12} />
              {document.format.toUpperCase()}
            </span>

            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${hali.tone}`}>
              <hali.Icon size={12} />
              {isSwahili ? hali.labelSw : hali.labelEn}
            </span>

            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${aina.tone}`}>
              <aina.Icon size={12} />
              {isSwahili ? aina.labelSw : aina.labelEn}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              {isSwahili ? 'Jina la Nyaraka' : 'Document Name'}
            </div>
            <div className="font-semibold">{document.jina}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">
                {isSwahili ? 'Ukubwa' : 'Size'}
              </div>
              <div className="font-semibold">{document.ukubwa}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Format</div>
              <div className="font-semibold uppercase">
                {document.format}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              {isSwahili ? 'Kipindi' : 'Period'}
            </div>
            <div className="font-medium">{document.kipindi}</div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <FileText size={12} />
            {document.dukaJina}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users size={12} />
            {document.aliyezalisha}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              disabled={document.hali !== 'tayari'}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownToLine size={14} />
              {isSwahili ? 'Pakua' : 'Download'}
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              {isSwahili ? 'Funga' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// RipotiStat
// ============================================================

function RipotiStat({
  label,
  value,
  Icon,
  tone,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div
        className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}
      >
        <Icon size={18} />
      </div>

      <div className="text-xs text-slate-500 mt-3">
        {label}
      </div>

      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">
        {value}
      </div>
    </div>
  )
}
