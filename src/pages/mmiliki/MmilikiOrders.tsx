import { useMemo, useState } from 'react'
import {
  ShoppingBag, Search, Filter, Store, Phone, CheckCircle2,
  Clock, XCircle, Truck, Trash2, X, Save, Receipt,
  Package, CreditCard, AlertTriangle, ChevronRight,
  TrendingUp, Download, Building2,
} from 'lucide-react'
import { useOrderAdmin } from '../../context/OrderAdminContext'
import { useDuka } from '../../context/DukaContext'
import { iconForKundi } from '../../utils/icons'
import type { HaliOrderAdmin, OrderAdmin } from '../../types'

const HALI_META: Record<
  HaliOrderAdmin,
  { label: string; color: string; Icon: React.ElementType }
> = {
  inasubiri_malipo: { label: 'Inasubiri Malipo', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  imekamilika: { label: 'Imekamilika', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
  imesafirishwa: { label: 'Imesafirishwa', color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Truck },
}

const HALI_FILTERS: { key: HaliOrderAdmin | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'inasubiri_malipo', label: 'Zinasubiri' },
  { key: 'imekamilika', label: 'Zilizokamilika' },
  { key: 'imesafirishwa', label: 'Zimesafirishwa' },
  { key: 'imekataliwa', label: 'Zilizokataliwa' },
]

export default function MmilikiOrders() {
  const { orders, badilishaHali, thibitishaMalipo, futa } = useOrderAdmin()
  const { maduka } = useDuka()

  const [q, setQ] = useState('')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [filterHali, setFilterHali] = useState<HaliOrderAdmin | 'zote'>('zote')
  const [selected, setSelected] = useState<OrderAdmin | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return orders.filter((o) => {
      if (filterDuka !== 'zote' && o.dukaId !== filterDuka) return false
      if (filterHali !== 'zote' && o.hali !== filterHali) return false
      if (!query) return true
      return (
        o.id.toLowerCase().includes(query) ||
        o.mteja.toLowerCase().includes(query) ||
        o.simu.includes(query) ||
        o.dukaJina.toLowerCase().includes(query) ||
        o.bidhaa.some((b) => b.jina.toLowerCase().includes(query))
      )
    })
  }, [orders, q, filterDuka, filterHali])

  const stats = useMemo(() => {
    const zote = orders.length
    const zinazosubiri = orders.filter((o) => o.hali === 'inasubiri_malipo').length
    const zilizokamilika = orders.filter((o) => o.hali === 'imekamilika').length
    const jumlaMapato = orders
      .filter((o) => o.hali === 'imekamilika')
      .reduce((s, o) => s + o.jumla, 0)
    const jumlaInayosubiri = orders
      .filter((o) => o.hali === 'inasubiri_malipo')
      .reduce((s, o) => s + o.jumla, 0)
    return { zote, zinazosubiri, zilizokamilika, jumlaMapato, jumlaInayosubiri }
  }, [orders])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} className="text-brand-600" />
            Orders - Maduka Yote
          </h1>
          <p className="text-slate-500 text-sm">
            Simamia orders zote za maduka yako
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 self-start sm:self-auto">
          <Download size={16} />
          Pakua Ripoti
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Orders Zote" value={String(stats.zote)} Icon={ShoppingBag} tone="brand" />
        <StatCard
          label="Zinasubiri Malipo"
          value={String(stats.zinazosubiri)}
          Icon={Clock}
          tone="amber"
          sub={`Tsh ${stats.jumlaInayosubiri.toLocaleString()}`}
        />
        <StatCard label="Zilizokamilika" value={String(stats.zilizokamilika)} Icon={CheckCircle2} tone="emerald" />
        <StatCard
          label="Mapato Yote"
          value={`Tsh ${stats.jumlaMapato.toLocaleString()}`}
          Icon={TrendingUp}
          tone="brand"
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
            placeholder="Tafuta kwa Order ID, mteja, simu, au bidhaa..."
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
            {HALI_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterHali(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                  filterHali === f.key
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <ShoppingBag size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna orders</div>
          <p className="text-sm text-slate-500 mt-1">Badilisha kichujio au utafutaji.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const meta = HALI_META[o.hali]
            const jumlaIlipwa = o.malipo
              .filter((m) => m.hali === 'imethibitishwa')
              .reduce((s, m) => s + m.kiasi, 0)
            const baki = o.jumla - jumlaIlipwa

            return (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-500 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 ${meta.color}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{o.id}</span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {o.dukaJina.replace('Smart Hardware - ', '')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {o.mteja} - {o.simu}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {o.tarehe} {o.muda} - {o.bidhaa.length} bidhaa - Muuzaji: {o.muuzaji}
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-brand-700">
                      Tsh {o.jumla.toLocaleString()}
                    </div>
                    {baki > 0 && (
                      <div className="text-xs text-amber-700">
                        Baki: Tsh {baki.toLocaleString()}
                      </div>
                    )}
                    {baki <= 0 && (
                      <div className="text-xs text-emerald-700 font-semibold">
                        Imelipwa Yote
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                  {o.bidhaa.slice(0, 3).map((b) => (
                    <span key={b.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.jina} ({b.wingi} {b.uom})
                    </span>
                  ))}
                  {o.bidhaa.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                      +{o.bidhaa.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-brand-600">
                  Simamia
                  <ChevronRight size={14} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onBadilishaHali={badilishaHali}
          onThibitishaMalipo={thibitishaMalipo}
          onFuta={futa}
        />
      )}
    </div>
  )
}

// ============================================================
// Order Detail Modal
// ============================================================
function OrderDetailModal({
  order,
  onClose,
  onBadilishaHali,
  onThibitishaMalipo,
  onFuta,
}: {
  order: OrderAdmin
  onClose: () => void
  onBadilishaHali: (id: string, hali: HaliOrderAdmin) => void
  onThibitishaMalipo: (orderId: string, malipoId: string) => void
  onFuta: (id: string) => void
}) {
  const jumlaIlipwa = order.malipo
    .filter((m) => m.hali === 'imethibitishwa')
    .reduce((s, m) => s + m.kiasi, 0)
  const baki = order.jumla - jumlaIlipwa

  const [hali, setHali] = useState<HaliOrderAdmin>(order.hali)
  const [confirmFuta, setConfirmFuta] = useState(false)

  const handleSave = () => {
    if (hali !== order.hali) onBadilishaHali(order.id, hali)
    onClose()
  }

  const handleFuta = () => {
    onFuta(order.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{order.id}</div>
            <div className="text-xs text-slate-500">
              {order.tarehe} {order.muda} - {order.dukaJina}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Mteja */}
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="text-xs text-slate-500 mb-1">Mteja</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white grid place-items-center text-[10px] font-bold shrink-0">
                {order.mteja.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{order.mteja}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone size={10} /> {order.simu}
                </div>
              </div>
            </div>
          </div>

          {/* Bidhaa */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Package size={14} className="text-brand-600" />
              Bidhaa ({order.bidhaa.length})
            </h3>
            <div className="space-y-1.5">
              {order.bidhaa.map((b) => {
                const Icon = iconForKundi(
                  b.jina.includes('Saruji') ? 'Saruji'
                  : b.jina.includes('Nondo') ? 'Nondo'
                  : b.jina.includes('Mabati') ? 'Mabati'
                  : 'Mbao'
                )
                return (
                  <div key={b.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm">
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 grid place-items-center text-slate-600 shrink-0">
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{b.jina}</div>
                      <div className="text-xs text-slate-500">
                        {b.wingi} {b.uom} x Tsh {b.bei.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-semibold whitespace-nowrap">
                      Tsh {b.jumla.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Malipo */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CreditCard size={14} className="text-brand-600" />
              Malipo ({order.malipo.length})
            </h3>
            {order.malipo.length === 0 ? (
              <div className="text-sm text-slate-500 p-3 rounded-lg bg-slate-50 text-center">
                Hakuna malipo bado
              </div>
            ) : (
              <div className="space-y-1.5">
                {order.malipo.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      m.hali === 'imethibitishwa'
                        ? 'bg-emerald-50 border border-emerald-100'
                        : 'bg-amber-50 border border-amber-100'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md grid place-items-center shrink-0 ${
                      m.hali === 'imethibitishwa'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {m.hali === 'imethibitishwa' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium uppercase text-xs">{m.njia} - {m.simu}</div>
                      <div className="text-xs text-slate-600 font-mono">{m.kumbukumbu}</div>
                    </div>
                    <div className="font-semibold whitespace-nowrap">
                      Tsh {m.kiasi.toLocaleString()}
                    </div>
                    {m.hali !== 'imethibitishwa' && (
                      <button
                        onClick={() => onThibitishaMalipo(order.id, m.id)}
                        className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
                      >
                        Thibitisha
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Jumla</span>
                <span className="font-semibold">Tsh {order.jumla.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Iliyolipwa</span>
                <span className="font-semibold text-emerald-700">
                  Tsh {jumlaIlipwa.toLocaleString()}
                </span>
              </div>
              {baki > 0 && (
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="font-medium">Baki</span>
                  <span className="font-bold text-amber-700">
                    Tsh {baki.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badilisha Hali */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Receipt size={14} className="text-brand-600" />
              Hali ya Order
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(HALI_META) as HaliOrderAdmin[]).map((h) => {
                const m = HALI_META[h]
                return (
                  <button
                    key={h}
                    onClick={() => setHali(h)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium ${
                      hali === h
                        ? `${m.color} font-semibold`
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <m.Icon size={12} />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
            {confirmFuta ? (
              <>
                <div className="flex-1 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  Una uhakika unataka kufuta order hii?
                </div>
                <button
                  onClick={handleFuta}
                  className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Ndiyo, Futa
                </button>
                <button
                  onClick={() => setConfirmFuta(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setConfirmFuta(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
                >
                  <Trash2 size={14} />
                  Futa
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 sm:ml-auto"
                >
                  Funga
                </button>
                <button
                  onClick={handleSave}
                  disabled={hali === order.hali}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  Hifadhi
                </button>
              </>
            )}
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