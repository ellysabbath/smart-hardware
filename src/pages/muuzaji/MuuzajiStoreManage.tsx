import { useMemo, useState } from 'react'
import {
  Package, AlertTriangle, Calendar, RotateCcw, PackageX, RefreshCcw,
  Search, CheckCircle2, Clock, XCircle, Store, User,
  Layers, Truck, Eye, X, ListFilter,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { iconForKundi } from '../../utils/icons'
import type {
  AinaMarekebishoStoki,
  HaliMarekebisho,
  HaliUingizaji,
} from '../../types'

// ============================================================
// Meta
// ============================================================
const AINA_ADJ_META: Record<
  AinaMarekebishoStoki,
  { label: string; tone: string; Icon: React.ElementType }
> = {
  mauzo: { label: 'Mauzo', tone: 'text-blue-700', Icon: Package },
  uharibifu: { label: 'Uharibifu', tone: 'text-red-700', Icon: AlertTriangle },
  expiry: { label: 'Expiry', tone: 'text-amber-700', Icon: Calendar },
  upotevu: { label: 'Upotevu', tone: 'text-orange-700', Icon: PackageX },
  kurudisha_msambazaji: { label: 'Kurudisha', tone: 'text-purple-700', Icon: RotateCcw },
  marekebisho: { label: 'Marekebisho', tone: 'text-slate-700', Icon: RefreshCcw },
}

const HALI_ADJ_META: Record<
  HaliMarekebisho,
  { label: string; tone: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', tone: 'text-amber-600', Icon: Clock },
  imethibitishwa: { label: 'Imethibitishwa', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-600', Icon: XCircle },
}

const HALI_UING_META: Record<
  HaliUingizaji,
  { label: string; tone: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', tone: 'text-amber-600', Icon: Clock },
  imepokelewa: { label: 'Imepokelewa', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-600', Icon: XCircle },
}

const DUKA_JINA = 'Kwembe'

export default function MuuzajiStoreManage() {
  const { bidhaa, marekebishoStoki, thibitishaMarekebisho, uingizaji } = useStore()

  // Bidhaa za duka
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

  // Stats
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
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Package size={26} className="text-brand-600" /> Usimamizi wa Stoki
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Duka la {DUKA_JINA} — bidhaa, marekebisho, na uingizaji
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Bidhaa" value={String(stats.jumla)} Icon={Package} tone="text-blue-600" />
        <MiniStat label="Stoki Jumla" value={`${stats.jumlaStoki} pcs`} Icon={Layers} tone="text-emerald-600" />
        <MiniStat label="Thamani" value={formatTsh(stats.thamani)} Icon={PackageX} tone="text-purple-600" />
        <MiniStat
          label="Chini / Imeisha"
          value={`${stats.chini} / ${stats.imeisha}`}
          Icon={AlertTriangle}
          tone={stats.imeisha > 0 ? 'text-red-600' : 'text-amber-600'}
        />
      </div>

      {/* ============================================================ */}
      {/* SEHEMU 1: STOKI */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Layers size={18} className="text-brand-600" />
            Stoki ({bidhaaZaDuka.length})
          </h2>
        </div>
        <StokiTable bidhaa={bidhaaZaDuka} />
      </div>

      {/* ============================================================ */}
      {/* SEHEMU 2: MAREKEBISHO */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold flex items-center gap-2">
            <RefreshCcw size={18} className="text-brand-600" />
            Marekebisho ya Stoki ({marekebishoYaDuka.length})
          </h2>
        </div>
        <MarekebishoTable
          marekebisho={marekebishoYaDuka}
          onThibitisha={thibitishaMarekebisho}
        />
      </div>

      {/* ============================================================ */}
      {/* SEHEMU 3: UINGIZAJI */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold flex items-center gap-2">
            <Truck size={18} className="text-brand-600" />
            Uingizaji wa Vifaa ({uingizajiWaDuka.length})
          </h2>
        </div>
        <UingizajiTable uingizaji={uingizajiWaDuka} />
      </div>
    </div>
  )
}

// ============================================================
// TABLE 1: Stoki
// ============================================================
function StokiTable({ bidhaa }: { bidhaa: ReturnType<typeof useStore>['bidhaa'] }) {
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
            placeholder="Tafuta bidhaa..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <Package size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">Hakuna bidhaa</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Bidhaa</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Kundi</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Stoki</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Bei Mauzo</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Bei Ununuzi</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Thamani</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Expiry</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Hali</th>
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
                        {hali === 'sawa' ? 'Sawa' : hali === 'inaribia' ? 'Inaribia' : 'Imeisha'}
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
  marekebisho, onThibitisha,
}: {
  marekebisho: ReturnType<typeof useStore>['marekebishoStoki']
  onThibitisha: (id: string) => void
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
            placeholder="Tafuta kwa ID, bidhaa, au sababu..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
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
              {k === 'zote' ? 'Zote' : HALI_ADJ_META[k].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <RefreshCcw size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">
            {marekebisho.length === 0
              ? 'Hakuna marekebisho'
              : 'Hakuna marekebisho yanayolingana'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">ID</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Bidhaa</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Aina</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Sababu</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Wingi</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Thamani</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Tarehe</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Hali</th>
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
                        {aina.label}
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
                        {hali.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {m.hali === 'inasubiri' && (
                        <button
                          onClick={() => onThibitisha(m.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={12} />
                          Thibitisha
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
function UingizajiTable({ uingizaji }: { uingizaji: ReturnType<typeof useStore>['uingizaji'] }) {
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
            placeholder="Tafuta kwa ID, supplier, au bidhaa..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
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
              {k === 'zote' ? 'Zote' : HALI_UING_META[k].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <Truck size={32} className="mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">
            {uingizaji.length === 0
              ? 'Hakuna uingizaji bado'
              : 'Hakuna uingizaji unaolingana'}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">ID</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Supplier</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Nafasi</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Aina</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Bidhaa</th>
                <th className="p-3 text-right font-medium text-xs uppercase tracking-wide">Thamani</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Tarehe</th>
                <th className="p-3 font-medium text-xs uppercase tracking-wide">Hali</th>
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
                            {u.bidhaa.length} bidhaa
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
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelected(u)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                      >
                        <Eye size={12} />
                        Ona
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && <UingizajiDetail uingizaji={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ============================================================
// Uingizaji Detail Modal
// ============================================================
function UingizajiDetail({
  uingizaji, onClose,
}: {
  uingizaji: ReturnType<typeof useStore>['uingizaji'][0]
  onClose: () => void
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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${meta.tone} bg-slate-50 border border-slate-200`}>
            <meta.Icon size={12} />
            {meta.label}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 space-y-1">
            <div className="text-xs text-slate-500">Supplier</div>
            <div className="font-medium flex items-center gap-1.5">
              <User size={14} /> {uingizaji.aliyeingiza}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              Nafasi: {uingizaji.nafasi} — Aina: {uingizaji.aina}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Jumla Bidhaa</div>
              <div className="font-bold">{uingizaji.jumlaBidhaa} pcs</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Thamani</div>
              <div className="font-bold text-brand-700">
                {formatTsh(uingizaji.jumlaThamani)}
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Package size={14} className="text-brand-600" /> Bidhaa ({uingizaji.bidhaa.length})
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
              Imepokelewa na {uingizaji.aliyepokea} ({uingizaji.tareheKupokea})
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
  label, value, Icon, tone,
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