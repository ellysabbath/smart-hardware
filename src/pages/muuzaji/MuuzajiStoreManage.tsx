
import { useMemo, useState } from 'react'
import {
  Package, AlertTriangle, Calendar, RotateCcw, PackageX, RefreshCcw,
  Search, CheckCircle2, Clock, XCircle, Store, User,
  Layers, Truck, Eye, X, ListFilter,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { iconForKundi } from '../../utils/icons'
import { useLanguage } from '../../i18n/LanguageContext'
import type {
  AinaMarekebishoStoki,
  HaliMarekebisho,
  HaliUingizaji,
} from '../../types'

type MetaLabel = {
  sw: string
  en: string
  tone: string
  Icon: React.ElementType
}

const AINA_ADJ_META: Record<AinaMarekebishoStoki, MetaLabel> = {
  mauzo: { sw: 'Mauzo', en: 'Sales', tone: 'text-blue-700', Icon: Package },
  uharibifu: { sw: 'Uharibifu', en: 'Damage', tone: 'text-red-700', Icon: AlertTriangle },
  expiry: { sw: 'Muda kuisha', en: 'Expiry', tone: 'text-amber-700', Icon: Calendar },
  upotevu: { sw: 'Upotevu', en: 'Loss', tone: 'text-orange-700', Icon: PackageX },
  kurudisha_msambazaji: { sw: 'Kurudisha', en: 'Return', tone: 'text-purple-700', Icon: RotateCcw },
  marekebisho: { sw: 'Marekebisho', en: 'Adjustment', tone: 'text-slate-700', Icon: RefreshCcw },
}

const HALI_ADJ_META: Record<HaliMarekebisho, MetaLabel> = {
  inasubiri: { sw: 'Inasubiri', en: 'Pending', tone: 'text-amber-600', Icon: Clock },
  imethibitishwa: { sw: 'Imethibitishwa', en: 'Approved', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { sw: 'Imekataliwa', en: 'Rejected', tone: 'text-red-600', Icon: XCircle },
}

const HALI_UING_META: Record<HaliUingizaji, MetaLabel> = {
  inasubiri: { sw: 'Inasubiri', en: 'Pending', tone: 'text-amber-600', Icon: Clock },
  imepokelewa: { sw: 'Imepokelewa', en: 'Received', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { sw: 'Imekataliwa', en: 'Rejected', tone: 'text-red-600', Icon: XCircle },
}

const DUKA_JINA = 'Kwembe'

export default function MuuzajiStoreManage() {
  const { bidhaa, marekebishoStoki, thibitishaMarekebisho, uingizaji } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const bidhaaZaDuka = useMemo(
    () => bidhaa.filter((b) => b.duka === DUKA_JINA),
    [bidhaa]
  )

  const marekebishoYaDuka = useMemo(
    () => marekebishoStoki.filter((m) => m.dukaJina.includes(DUKA_JINA)),
    [marekebishoStoki]
  )

  const uingizajiWaDuka = useMemo(
    () => uingizaji.filter((u) => u.dukaJina.includes(DUKA_JINA)),
    [uingizaji]
  )

  const stats = useMemo(() => {
    const jumla = bidhaaZaDuka.length
    const jumlaStoki = bidhaaZaDuka.reduce((s, b) => s + b.stoki, 0)
    const thamani = bidhaaZaDuka.reduce((s, b) => s + b.stoki * b.beiUnunuzi, 0)
    const chini = bidhaaZaDuka.filter((b) => b.stoki <= 20 && b.stoki > 0).length
    const imeisha = bidhaaZaDuka.filter((b) => b.stoki <= 0).length
    return { jumla, jumlaStoki, thamani, chini, imeisha }
  }, [bidhaaZaDuka])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Store size={26} className="text-brand-600" />
          {isSwahili ? 'Usimamizi wa Stoki' : 'Inventory Management'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isSwahili ? 'Duka la' : 'Store'} {DUKA_JINA} —{' '}
          {isSwahili ? 'bidhaa, marekebisho, na uingizaji' : 'products, adjustments, and stock receipts'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat
          label={isSwahili ? 'Bidhaa' : 'Products'}
          value={String(stats.jumla)}
          Icon={Package}
          tone="text-blue-600"
        />
        <MiniStat
          label={isSwahili ? 'Jumla ya Stoki' : 'Total Stock'}
          value={`${stats.jumlaStoki} pcs`}
          Icon={Layers}
          tone="text-emerald-600"
        />
        <MiniStat
          label={isSwahili ? 'Thamani' : 'Value'}
          value={formatTsh(stats.thamani)}
          Icon={PackageX}
          tone="text-purple-600"
        />
        <MiniStat
          label={isSwahili ? 'Chini / Imeisha' : 'Low / Out of Stock'}
          value={`${stats.chini} / ${stats.imeisha}`}
          Icon={AlertTriangle}
          tone={stats.imeisha > 0 ? 'text-red-600' : 'text-amber-600'}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Layers size={18} className="text-brand-600" />
            {isSwahili ? 'Stoki' : 'Stock'} ({bidhaaZaDuka.length})
          </h2>
        </div>
        <StokiTable bidhaa={bidhaaZaDuka} isSwahili={isSwahili} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold flex items-center gap-2">
            <RefreshCcw size={18} className="text-brand-600" />
            {isSwahili ? 'Marekebisho ya Stoki' : 'Stock Adjustments'} ({marekebishoYaDuka.length})
          </h2>
        </div>
        <MarekebishoTable
          marekebisho={marekebishoYaDuka}
          onThibitisha={thibitishaMarekebisho}
          isSwahili={isSwahili}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold flex items-center gap-2">
            <Truck size={18} className="text-brand-600" />
            {isSwahili ? 'Uingizaji wa Vifaa' : 'Stock Receipts'} ({uingizajiWaDuka.length})
          </h2>
        </div>
        <UingizajiTable uingizaji={uingizajiWaDuka} isSwahili={isSwahili} />
      </div>
    </div>
  )
}

// ============================================================
// TABLE 1: Stoki
// ============================================================
function StokiTable({
  bidhaa,
  isSwahili,
}: {
  bidhaa: ReturnType<typeof useStore>['bidhaa']
  isSwahili: boolean
}) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    if (!query) return bidhaa

    return bidhaa.filter(
      (b) =>
        b.jina.toLowerCase().includes(query) ||
        b.sku.toLowerCase().includes(query) ||
        b.kundi.toLowerCase().includes(query)
    )
  }, [bidhaa, q])

  return (
    <div>
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isSwahili ? 'Tafuta bidhaa...' : 'Search products...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <Package size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">
            {isSwahili ? 'Hakuna bidhaa' : 'No products found'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Bidhaa' : 'Product'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Kundi' : 'Category'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Stoki' : 'Stock'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Bei ya Mauzo' : 'Selling Price'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Bei ya Ununuzi' : 'Buying Price'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Thamani' : 'Value'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Expiry</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Hali' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const Icon = iconForKundi(b.iconKey)
                const hali = b.stoki <= 0 ? 'imeisha' : b.stoki <= 20 ? 'inaribia' : 'sawa'

                return (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
                          {b.pichaUrl ? (
                            <img src={b.pichaUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Icon size={16} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{b.jina}</div>
                          <div className="text-xs text-slate-500">{b.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {b.kundi}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {b.stoki} <span className="text-xs text-slate-500">{b.uom}</span>
                    </td>
                    <td className="p-3 text-right text-brand-700 font-semibold">
                      {formatTsh(b.beiMauzo)}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      {formatTsh(b.beiUnunuzi)}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatTsh(b.stoki * b.beiUnunuzi)}
                    </td>
                    <td className="p-3 text-slate-600 text-xs">
                      {b.expiry ?? '—'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                          hali === 'sawa'
                            ? 'text-emerald-700 bg-emerald-50'
                            : hali === 'inaribia'
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-red-700 bg-red-50'
                        }`}
                      >
                        {hali === 'sawa'
                          ? isSwahili ? 'Sawa' : 'Good'
                          : hali === 'inaribia'
                          ? isSwahili ? 'Inaribia kuisha' : 'Low Stock'
                          : isSwahili ? 'Imeisha' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TABLE 2: Marekebisho
// ============================================================
function MarekebishoTable({
  marekebisho,
  onThibitisha,
  isSwahili,
}: {
  marekebisho: ReturnType<typeof useStore>['marekebishoStoki']
  onThibitisha: (id: string) => void
  isSwahili: boolean
}) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<HaliMarekebisho | 'zote'>('zote')

  const filtered = useMemo(() => {
    return marekebisho.filter((m) => {
      if (filter !== 'zote' && m.hali !== filter) return false

      const query = q.toLowerCase().trim()
      if (!query) return true

      return (
        m.id.toLowerCase().includes(query) ||
        m.jina.toLowerCase().includes(query) ||
        m.sku.toLowerCase().includes(query) ||
        m.sababu.toLowerCase().includes(query)
      )
    })
  }, [marekebisho, q, filter])

  return (
    <div>
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isSwahili ? 'Tafuta kwa ID, bidhaa, au sababu...' : 'Search by ID, product, or reason...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <ListFilter size={14} className="text-slate-400" />
          {(['zote', 'inasubiri', 'imethibitishwa', 'imekataliwa'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                filter === k
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {k === 'zote'
                ? isSwahili ? 'Zote' : 'All'
                : isSwahili ? HALI_ADJ_META[k].sw : HALI_ADJ_META[k].en}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <RefreshCcw size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">
            {marekebisho.length === 0
              ? isSwahili ? 'Hakuna marekebisho' : 'No adjustments found'
              : isSwahili ? 'Hakuna marekebisho yanayolingana' : 'No matching adjustments'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">ID</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Bidhaa' : 'Product'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Aina' : 'Type'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Sababu' : 'Reason'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Wingi' : 'Quantity'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Thamani' : 'Value'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Tarehe' : 'Date'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Hali' : 'Status'}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => {
                const aina = AINA_ADJ_META[m.aina]
                const hali = HALI_ADJ_META[m.hali]

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-xs">{m.id}</td>
                    <td className="p-3">
                      <div className="font-medium truncate max-w-[180px]">{m.jina}</div>
                      <div className="text-xs text-slate-500">{m.sku}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${aina.tone}`}>
                        <aina.Icon size={12} />
                        {isSwahili ? aina.sw : aina.en}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-xs max-w-[160px] truncate">
                      {m.sababu}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {m.wingi} <span className="text-xs text-slate-500">{m.uom}</span>
                    </td>
                    <td className="p-3 text-right text-slate-900">{formatTsh(m.thamani)}</td>
                    <td className="p-3 text-xs text-slate-500">{m.tarehe}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${hali.tone}`}>
                        <hali.Icon size={12} />
                        {isSwahili ? hali.sw : hali.en}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {m.hali === 'inasubiri' && (
                        <button
                          onClick={() => onThibitisha(m.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={12} />
                          {isSwahili ? 'Thibitisha' : 'Approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TABLE 3: Uingizaji
// ============================================================
function UingizajiTable({
  uingizaji,
  isSwahili,
}: {
  uingizaji: ReturnType<typeof useStore>['uingizaji']
  isSwahili: boolean
}) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<HaliUingizaji | 'zote'>('zote')
  const [selected, setSelected] = useState<ReturnType<typeof useStore>['uingizaji'][0] | null>(null)

  const filtered = useMemo(() => {
    return uingizaji.filter((u) => {
      if (filter !== 'zote' && u.hali !== filter) return false

      const query = q.toLowerCase().trim()
      if (!query) return true

      return (
        u.id.toLowerCase().includes(query) ||
        u.aliyeingiza.toLowerCase().includes(query) ||
        u.bidhaa.some((b) => b.jina.toLowerCase().includes(query))
      )
    })
  }, [uingizaji, q, filter])

  return (
    <div>
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isSwahili ? 'Tafuta kwa ID, msambazaji, au bidhaa...' : 'Search by ID, supplier, or product...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <ListFilter size={14} className="text-slate-400" />
          {(['zote', 'inasubiri', 'imepokelewa', 'imekataliwa'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                filter === k
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {k === 'zote'
                ? isSwahili ? 'Zote' : 'All'
                : isSwahili ? HALI_UING_META[k].sw : HALI_UING_META[k].en}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <Truck size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">
            {uingizaji.length === 0
              ? isSwahili ? 'Hakuna uingizaji bado' : 'No stock receipts yet'
              : isSwahili ? 'Hakuna uingizaji unaolingana' : 'No matching stock receipts'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">ID</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Msambazaji' : 'Supplier'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Nafasi' : 'Role'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Aina' : 'Type'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Bidhaa' : 'Products'}</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Thamani' : 'Value'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Tarehe' : 'Date'}</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">{isSwahili ? 'Hali' : 'Status'}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const meta = HALI_UING_META[u.hali]

                return (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-xs">{u.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 grid place-items-center shrink-0 text-slate-600">
                          <User size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{u.aliyeingiza}</div>
                          <div className="text-xs text-slate-500">
                            {u.bidhaa.length} {isSwahili ? 'bidhaa' : 'products'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 capitalize text-xs text-slate-600">{u.nafasi}</td>
                    <td className="p-3 capitalize text-xs text-slate-600">{u.aina}</td>
                    <td className="p-3 text-right font-semibold">{u.jumlaBidhaa} pcs</td>
                    <td className="p-3 text-right text-brand-700 font-semibold">
                      {formatTsh(u.jumlaThamani)}
                    </td>
                    <td className="p-3 text-xs text-slate-500">{u.tarehe}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${meta.tone}`}>
                        <meta.Icon size={12} />
                        {isSwahili ? meta.sw : meta.en}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelected(u)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                      >
                        <Eye size={12} />
                        {isSwahili ? 'Ona' : 'View'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <UingizajiDetail
          uingizaji={selected}
          onClose={() => setSelected(null)}
          isSwahili={isSwahili}
        />
      )}
    </div>
  )
}

// ============================================================
// Uingizaji Detail Modal
// ============================================================
function UingizajiDetail({
  uingizaji,
  onClose,
  isSwahili,
}: {
  uingizaji: ReturnType<typeof useStore>['uingizaji'][0]
  onClose: () => void
  isSwahili: boolean
}) {
  const meta = HALI_UING_META[uingizaji.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{uingizaji.id}</div>
            <div className="text-xs text-slate-500">{uingizaji.tarehe}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            aria-label={isSwahili ? 'Funga' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${meta.tone} bg-slate-50 border border-slate-200`}>
            <meta.Icon size={12} />
            {isSwahili ? meta.sw : meta.en}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 space-y-1">
            <div className="text-xs text-slate-500">
              {isSwahili ? 'Msambazaji' : 'Supplier'}
            </div>
            <div className="font-medium flex items-center gap-1.5">
              <User size={14} /> {uingizaji.aliyeingiza}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              {isSwahili ? 'Nafasi' : 'Role'}: {uingizaji.nafasi} —{' '}
              {isSwahili ? 'Aina' : 'Type'}: {uingizaji.aina}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">
                {isSwahili ? 'Jumla ya Bidhaa' : 'Total Products'}
              </div>
              <div className="font-bold">{uingizaji.jumlaBidhaa} pcs</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">
                {isSwahili ? 'Thamani' : 'Value'}
              </div>
              <div className="font-bold text-brand-700">
                {formatTsh(uingizaji.jumlaThamani)}
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Package size={14} className="text-brand-600" />
              {isSwahili ? 'Bidhaa' : 'Products'} ({uingizaji.bidhaa.length})
            </div>

            <div className="space-y-1.5">
              {uingizaji.bidhaa.map((b, i) => {
                const Icon = iconForKundi(b.iconKey)

                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
                      {b.pichaUrl ? (
                        <img src={b.pichaUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{b.jina}</div>
                      <div className="text-xs text-slate-500">
                        {b.sku} — {b.stoki} {b.uom}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-700">
                      {formatTsh(b.beiUnunuzi)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {uingizaji.hali === 'imepokelewa' && uingizaji.aliyepokea && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              {isSwahili ? 'Imepokelewa na' : 'Received by'} {uingizaji.aliyepokea} ({uingizaji.tareheKupokea})
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MiniStat
// ============================================================
function MiniStat({
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
      <div className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-slate-500 mt-2.5">{label}</div>
      <div className="text-sm md:text-base font-bold text-slate-900 mt-0.5 truncate">
        {value}
      </div>
    </div>
  )
}
