import { useMemo, useState } from 'react'
import {
  Users, Search, Filter, Phone, MapPin, Wallet, Store,
  TrendingUp, User, Building2, Wrench, Hammer, Eye,
  ArrowRight, X, ShoppingBag, Receipt, AlertTriangle,
  CheckCircle2, Download, Mail,
} from 'lucide-react'
import { watejaKamili } from '../../data/demo'
import { useDuka } from '../../context/DukaContext'
import type { AinaMteja, MtejaKamili } from '../../types'

const AINA_META: Record<
  AinaMteja,
  { label: string; color: string; Icon: React.ElementType }
> = {
  fundi: { label: 'Fundi', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Wrench },
  mjenzi: { label: 'Mjenzi', color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Hammer },
  kampuni: { label: 'Kampuni', color: 'bg-purple-50 text-purple-700 border-purple-200', Icon: Building2 },
  mteja: { label: 'Mteja', color: 'bg-slate-50 text-slate-700 border-slate-200', Icon: User },
}

const AINA_FILTERS: { key: AinaMteja | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'fundi', label: 'Fundi' },
  { key: 'mjenzi', label: 'Mjenzi' },
  { key: 'kampuni', label: 'Kampuni' },
  { key: 'mteja', label: 'Mteja' },
]

export default function MmilikiWateja() {
  const { maduka } = useDuka()
  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<AinaMteja | 'zote'>('zote')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [showOnlyDeni, setShowOnlyDeni] = useState(false)
  const [selected, setSelected] = useState<MtejaKamili | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return watejaKamili.filter((m) => {
      if (filterAina !== 'zote' && m.aina !== filterAina) return false
      if (filterDuka !== 'zote' && m.dukaId !== filterDuka) return false
      if (showOnlyDeni && m.deni <= 0) return false
      if (!query) return true
      return (
        m.jina.toLowerCase().includes(query) ||
        m.simu.includes(query) ||
        (m.mahali?.toLowerCase().includes(query) ?? false) ||
        (m.tin?.includes(query) ?? false)
      )
    })
  }, [q, filterAina, filterDuka, showOnlyDeni])

  const stats = useMemo(() => {
    const zote = watejaKamili.length
    const wenyeDeni = watejaKamili.filter((m) => m.deni > 0).length
    const jumlaMadeni = watejaKamili.reduce((s, m) => s + m.deni, 0)
    const jumlaManunuzi = watejaKamili.reduce((s, m) => s + m.jumlaManunuzi, 0)
    const wapya = watejaKamili.filter((m) => m.tareheSajili >= '2025-08-01').length
    return { zote, wenyeDeni, jumlaMadeni, jumlaManunuzi, wapya }
  }, [])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={24} className="text-brand-600" />
            Wateja - Maduka Yote
          </h1>
          <p className="text-slate-500 text-sm">
            Wateja wote wa maduka yako - madeni, manunuzi, na historia
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 self-start sm:self-auto">
          <Download size={16} />
          Pakua Orodha
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Wateja Wote"
          value={String(stats.zote)}
          Icon={Users}
          tone="brand"
          sub={`${stats.wapya} wapya mwaka huu`}
        />
        <StatCard
          label="Wenye Deni"
          value={String(stats.wenyeDeni)}
          Icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          label="Jumla ya Madeni"
          value={`Tsh ${stats.jumlaMadeni.toLocaleString()}`}
          Icon={Wallet}
          tone="red"
        />
        <StatCard
          label="Jumla ya Manunuzi"
          value={`Tsh ${stats.jumlaManunuzi.toLocaleString()}`}
          Icon={TrendingUp}
          tone="emerald"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa jina, simu, mahali, au TIN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filterDuka}
            onChange={(e) => setFilterDuka(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
          >
            <option value="zote">Maduka Yote</option>
            {maduka.map((d) => (
              <option key={d.id} value={d.id}>{d.jina}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5">
            {AINA_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterAina(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                  filterAina === f.key
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOnlyDeni((v) => !v)}
            className={`ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition ${
              showOnlyDeni
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle size={12} />
            Wenye Deni ({stats.wenyeDeni})
          </button>
        </div>
      </div>

      {/* Wateja List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Users size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna wateja</div>
          <p className="text-sm text-slate-500 mt-1">Badilisha kichujio au utafutaji.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((m) => {
            const meta = AINA_META[m.aina]
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-500 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-bold shrink-0">
                    {m.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate">{m.jina}</span>
                      <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {m.simu}
                    </div>
                    {m.mahali && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {m.mahali}
                      </div>
                    )}
                  </div>
                </div>

                {m.dukaJina && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                    <Store size={10} />
                    {m.dukaJina.replace('Smart Hardware - ', '')}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <div className="text-slate-500">Manunuzi</div>
                    <div className="font-bold text-brand-700 truncate">
                      Tsh {m.jumlaManunuzi.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Deni</div>
                    <div className={`font-bold truncate ${m.deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      Tsh {m.deni.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Orders: {m.jumlaOrders ?? 0}</span>
                  <span>Mwisho: {m.mwishoKununua ?? '-'}</span>
                </div>

                <button
                  onClick={() => setSelected(m)}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  <Eye size={14} />
                  Ona Maelezo
                </button>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <MtejaDetailModal
          mteja={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Mteja Detail Modal
// ============================================================
function MtejaDetailModal({
  mteja,
  onClose,
}: {
  mteja: MtejaKamili
  onClose: () => void
}) {
  const meta = AINA_META[mteja.aina]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{mteja.jina}</div>
            <div className="text-xs text-slate-500">{mteja.simu}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Header ya mteja */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-bold shrink-0">
              {mteja.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate">{mteja.jina}</span>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone size={10} /> {mteja.simu}
              </div>
              {mteja.mahali && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={10} /> {mteja.mahali}
                </div>
              )}
              {mteja.tin && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Receipt size={10} /> TIN: {mteja.tin}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-brand-50">
              <div className="text-xs text-slate-600">Jumla ya Manunuzi</div>
              <div className="text-lg font-bold text-brand-700 truncate">
                Tsh {mteja.jumlaManunuzi.toLocaleString()}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${mteja.deni > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
              <div className="text-xs text-slate-600">Deni</div>
              <div className={`text-lg font-bold truncate ${mteja.deni > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                Tsh {mteja.deni.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Maelezo */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Duka</span>
              <span className="font-semibold">
                {mteja.dukaJina?.replace('Smart Hardware - ', '') ?? '-'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Orders</span>
              <span className="font-semibold">{mteja.jumlaOrders ?? 0}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Tarehe ya Kusajiliwa</span>
              <span className="font-semibold">{mteja.tareheSajili}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Mwisho Kununua</span>
              <span className="font-semibold">{mteja.mwishoKununua ?? '-'}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Hali</span>
              {mteja.active ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  <CheckCircle2 size={10} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-semibold">
                  <AlertTriangle size={10} /> Imezuiwa
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
            <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
              <ShoppingBag size={14} />
              Ona Orders
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200">
              <Phone size={14} />
              Piga Simu
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 sm:ml-auto"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Stat Card
// ============================================================
type Tone = 'brand' | 'emerald' | 'amber' | 'red'
const TONE: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
}

function StatCard({
  label,
  value,
  Icon,
  tone,
  sub,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: Tone
  sub?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`inline-flex w-9 h-9 rounded-lg items-center justify-center ${TONE[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-slate-500 mt-2">{label}</div>
      <div className="text-base md:text-lg font-bold mt-0.5 truncate">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 truncate">{sub}</div>}
    </div>
  )
}