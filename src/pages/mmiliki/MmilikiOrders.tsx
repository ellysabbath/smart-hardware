import { useMemo, useState } from 'react'
import {
  ShoppingBag, Search, Filter, CheckCircle2, Clock, Truck, XCircle,
  X, Package, Phone, CreditCard, AlertTriangle, Loader2, Check, Ban,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { Order } from '../../types'

const HALI_META: Record<
  Order['hali'],
  { label: string; tone: string; Icon: React.ElementType }
> = {
  inasubiri_malipo: { label: 'Inasubiri Malipo', tone: 'text-amber-700', Icon: Clock },
  imekamilika: { label: 'Imekamilika', tone: 'text-emerald-700', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-700', Icon: XCircle },
}

const MALIPO_HALI_META: Record<string, { label: string; tone: string; bg: string; border: string; Icon: React.ElementType }> = {
  inasubiri: {
    label: 'Inasubiri Uthibitisho',
    tone: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    Icon: Clock,
  },
  imethibitishwa: {
    label: 'Imethibitishwa',
    tone: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    Icon: CheckCircle2,
  },
  imekataliwa: {
    label: 'Imekataliwa',
    tone: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    Icon: XCircle,
  },
}

export default function MmilikiOrders() {
  const { orders, thibitishaMalipo, kataaMalipo } = useStore()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Order['hali'] | 'zote'>('zote')
  const [selected, setSelected] = useState<Order | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return orders.filter((o) => {
      if (filter !== 'zote' && o.hali !== filter) return false
      if (!query) return true
      return (
        o.id.toLowerCase().includes(query) ||
        o.mteja.toLowerCase().includes(query) ||
        o.simu.includes(query)
      )
    })
  }, [orders, q, filter])

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
    const malipoYanasubiri = orders.reduce(
      (s, o) => s + o.malipo.filter((m) => m.hali === 'inasubiri').length,
      0
    )
    return {
      zote,
      zinazosubiri,
      zilizokamilika,
      jumlaMapato,
      jumlaInayosubiri,
      malipoYanasubiri,
    }
  }, [orders])

  // ============================================================
  // Thibitisha malipo
  // ============================================================
  const handleThibitisha = async (orderId: string, malipoId: string) => {
    setProcessing(malipoId)
    await new Promise((r) => setTimeout(r, 400))
    thibitishaMalipo(orderId, malipoId)
    setProcessing(null)
    setToast({ msg: 'Malipo yamethibitishwa. Order imekamilika.', ok: true })
    setTimeout(() => setToast(null), 4000)

    // Sasisha order iliyo kwenye modal
    const updated = orders.find((o) => o.id === orderId)
    if (updated && selected?.id === orderId) {
      const jumlaIlipwa = updated.malipo
        .filter((m) => m.hali === 'imethibitishwa')
        .reduce((s, m) => s + m.kiasi, 0)
      setSelected({
        ...updated,
        hali: jumlaIlipwa >= updated.jumla ? 'imekamilika' : updated.hali,
      })
    }
  }

  // ============================================================
  // Kataa malipo
  // ============================================================
  const handleKataa = async (orderId: string, malipoId: string) => {
    if (!confirm('Una uhakika unataka kukataa malipo haya?')) return
    setProcessing(malipoId)
    await new Promise((r) => setTimeout(r, 400))
    kataaMalipo(orderId, malipoId)
    setProcessing(null)
    setToast({ msg: 'Malipo yamekataliwa.', ok: false })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ShoppingBag size={26} className="text-brand-600" />
          Orders Zote
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simamia orders na uthibitishe malipo ya mobile
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Orders Zote" value={String(stats.zote)} Icon={ShoppingBag} tone="text-blue-600" />
        <Stat
          label="Zinasubiri"
          value={String(stats.zinazosubiri)}
          Icon={Clock}
          tone="text-amber-600"
          sub={formatTsh(stats.jumlaInayosubiri)}
        />
        <Stat
          label="Zilizokamilika"
          value={String(stats.zilizokamilika)}
          Icon={CheckCircle2}
          tone="text-emerald-600"
        />
        <Stat
          label="Malipo Yanasubiri"
          value={String(stats.malipoYanasubiri)}
          Icon={CreditCard}
          tone={stats.malipoYanasubiri > 0 ? 'text-amber-600' : 'text-slate-500'}
        />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa order ID, mteja, au simu..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-slate-400" />
          {(['zote', 'inasubiri_malipo', 'imekamilika', 'imekataliwa'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                filter === k
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {k === 'zote' ? 'Zote' : HALI_META[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna orders</h3>
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
            const malipoYanasubiri = o.malipo.filter((m) => m.hali === 'inasubiri').length

            return (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-brand-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{o.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>
                          {meta.label}
                        </span>
                        {malipoYanasubiri > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <AlertTriangle size={10} />
                            {malipoYanasubiri} yanasubiri
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {o.mteja} — {o.simu}
                      </div>
                      <div className="text-xs text-slate-500">
                        {o.tarehe} — {o.bidhaa.length} bidhaa
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(o.jumla)}
                    </div>
                    {baki > 0 ? (
                      <div className="text-xs text-amber-700">
                        Baki: {formatTsh(baki)}
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-700 font-semibold">
                        Imelipwa Yote
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onThibitisha={handleThibitisha}
          onKataa={handleKataa}
          processing={processing}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-md ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Stat
// ============================================================
function Stat({
  label, value, sub, Icon, tone,
}: {
  label: string
  value: string
  sub?: string
  Icon: React.ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5 truncate">{sub}</div>}
    </div>
  )
}

// ============================================================
// OrderDetail
// ============================================================
function OrderDetail({
  order, onClose, onThibitisha, onKataa, processing,
}: {
  order: Order
  onClose: () => void
  onThibitisha: (orderId: string, malipoId: string) => void
  onKataa: (orderId: string, malipoId: string) => void
  processing: string | null
}) {
  const jumlaIlipwa = order.malipo
    .filter((m) => m.hali === 'imethibitishwa')
    .reduce((s, m) => s + m.kiasi, 0)
  const baki = order.jumla - jumlaIlipwa
  const meta = HALI_META[order.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{order.id}</div>
            <div className="text-xs text-slate-500">{order.tarehe}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Hali ya order */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${meta.tone} bg-slate-50 border border-slate-200`}>
            <meta.Icon size={16} />
            <span className="text-xs font-semibold uppercase">{meta.label}</span>
          </div>

          {/* Mteja */}
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="text-xs text-slate-500 mb-1">Mteja</div>
            <div className="font-medium">{order.mteja}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Phone size={10} /> {order.simu}
            </div>
          </div>

          {/* Bidhaa */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Package size={14} className="text-brand-600" /> Bidhaa ({order.bidhaa.length})
            </h3>
            <div className="space-y-1.5">
              {order.bidhaa.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{b.jina}</div>
                    <div className="text-xs text-slate-500">
                      {b.wingi} {b.uom} × {formatTsh(b.bei)}
                    </div>
                  </div>
                  <div className="font-semibold whitespace-nowrap">
                    {formatTsh(b.jumla)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Malipo */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CreditCard size={14} className="text-brand-600" /> Malipo ({order.malipo.length})
            </h3>
            {order.malipo.length === 0 ? (
              <div className="text-sm text-slate-500 p-3 rounded-lg bg-slate-50 text-center">
                Hakuna malipo bado
              </div>
            ) : (
              <div className="space-y-1.5">
                {order.malipo.map((m) => {
                  const mMeta = MALIPO_HALI_META[m.hali] ?? MALIPO_HALI_META.inasubiri
                  const isProcessing = processing === m.id
                  return (
                    <div
                      key={m.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg text-sm border ${mMeta.bg} ${mMeta.border}`}
                    >
                      <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${mMeta.tone}`}>
                        <mMeta.Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium uppercase text-xs">
                          {m.njia} — {m.simu}
                        </div>
                        <div className="text-xs text-slate-600 font-mono truncate">
                          {m.kumbukumbu}
                        </div>
                        <div className={`text-[10px] uppercase font-semibold ${mMeta.tone}`}>
                          {mMeta.label}
                        </div>
                      </div>
                      <div className="font-semibold whitespace-nowrap">
                        {formatTsh(m.kiasi)}
                      </div>
                      {m.hali === 'inasubiri' && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => onThibitisha(order.id, m.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Check size={10} />
                            )}
                            Thibitisha
                          </button>
                          <button
                            onClick={() => onKataa(order.id, m.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 text-[10px] font-semibold hover:bg-red-100 disabled:opacity-50"
                          >
                            <Ban size={10} />
                            Kataa
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Jumla */}
            <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Jumla</span>
                <span className="font-semibold">{formatTsh(order.jumla)}</span>
              </div>
              <div className="flex justify-between">
                <span>Iliyolipwa</span>
                <span className="font-semibold text-emerald-700">
                  {formatTsh(jumlaIlipwa)}
                </span>
              </div>
              {baki > 0 && (
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="font-medium">Baki</span>
                  <span className="font-bold text-amber-700">{formatTsh(baki)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}