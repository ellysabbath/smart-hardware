import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Smartphone,
  ChevronRight,
  Receipt,
  TrendingUp,
  Wallet,
  ArrowLeft,
  Inbox,
} from 'lucide-react'
import { useOrders } from '../../context/OrderContext'
import type { HaliOrder } from '../../types'

type FilterKey = 'zote' | HaliOrder

const FILTERS: { key: FilterKey; label: string; Icon: React.ElementType }[] = [
  { key: 'zote', label: 'Zote', Icon: Inbox },
  { key: 'imekamilika', label: 'Zilizokamilika', Icon: CheckCircle2 },
  { key: 'inasubiri_malipo', label: 'Zinasubiri Malipo', Icon: Clock },
  { key: 'imekataliwa', label: 'Zilizokataliwa', Icon: XCircle },
]

const HALI_META: Record<
  HaliOrder,
  { label: string; color: string; Icon: React.ElementType }
> = {
  imekamilika: {
    label: 'Imekamilika',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: CheckCircle2,
  },
  inasubiri_malipo: {
    label: 'Inasubiri Malipo',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    Icon: Clock,
  },
  imekataliwa: {
    label: 'Imekataliwa',
    color: 'bg-red-50 text-red-700 border-red-200',
    Icon: XCircle,
  },
}

export default function MtejaOrders() {
  const navigate = useNavigate()
  const { orders } = useOrders()

  const [filter, setFilter] = useState<FilterKey>('zote')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return orders.filter((o) => {
      if (filter !== 'zote' && o.hali !== filter) return false
      if (!query) return true
      if (o.id.toLowerCase().includes(query)) return true
      if (o.quotationId.toLowerCase().includes(query)) return true
      return o.bidhaa.some((b) => b.jina.toLowerCase().includes(query))
    })
  }, [orders, filter, q])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((s, o) => s + o.jumla, 0)
    const avg = totalOrders > 0 ? totalSpent / totalOrders : 0
    const completed = orders.filter((o) => o.hali === 'imekamilika').length
    return { totalOrders, totalSpent, avg, completed }
  }, [orders])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order Zangu</h1>
          <p className="text-slate-500 text-sm">
            Fuatilia orders zote ulizokamilisha
          </p>
        </div>
        <button
          onClick={() => navigate('/mteja/bidhaa')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          Nunua Tena
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Orders Zote"
          value={String(stats.totalOrders)}
          Icon={ShoppingBag}
          tone="brand"
        />
        <StatCard
          label="Zilizokamilika"
          value={String(stats.completed)}
          Icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Jumla ya Matumizi"
          value={`Tsh ${stats.totalSpent.toLocaleString()}`}
          Icon={Wallet}
          tone="amber"
        />
        <StatCard
          label="Wastani kwa Order"
          value={`Tsh ${Math.round(stats.avg).toLocaleString()}`}
          Icon={TrendingUp}
          tone="brand"
        />
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa Order ID, Quotation ID, au bidhaa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${
                  active
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <f.Icon size={14} />
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <EmptyState
          hasOrders={orders.length > 0}
          onShop={() => navigate('/mteja/bidhaa')}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const meta = HALI_META[o.hali]
            const totalItems = o.bidhaa.reduce((s, b) => s + b.wingi, 0)
            const firstPayment = o.malipo[0]

            return (
              <button
                key={o.id}
                onClick={() => navigate(`/mteja/order/${o.id}`)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:border-brand-500 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                      <Receipt size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{o.id}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}
                        >
                          <meta.Icon size={10} />
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {o.tarehe} - Quotation {o.quotationId}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-lg font-bold text-brand-700">
                      Tsh {o.jumla.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Bidhaa {o.bidhaa.length} ({totalItems} pcs)
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Package size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">
                      {o.bidhaa.map((b) => b.jina).join(', ')}
                    </span>
                  </div>
                  {firstPayment && (
                    <div className="flex items-center gap-1.5 sm:justify-end">
                      <Smartphone size={14} className="text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {firstPayment.njia.toUpperCase()} - {firstPayment.kumbukumbu}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-brand-600">
                  Ona Maelezo
                  <ChevronRight size={14} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------- Sub-components ----------

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
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: Tone
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`inline-flex w-9 h-9 rounded-lg items-center justify-center ${TONE[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-slate-500 mt-2">{label}</div>
      <div className="text-base md:text-lg font-bold mt-0.5 truncate">{value}</div>
    </div>
  )
}

function EmptyState({
  hasOrders,
  onShop,
}: {
  hasOrders: boolean
  onShop: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
      <ShoppingBag size={40} className="mx-auto mb-3 text-slate-300" />
      <div className="font-semibold">
        {hasOrders ? 'Hakuna order inayolingana' : 'Hakuna order bado'}
      </div>
      <p className="text-sm text-slate-500 mt-1">
        {hasOrders
          ? 'Jaribu kubadilisha kichujio au utafutaji.'
          : 'Ukinunua bidhaa na kulipa, order yako itaonekana hapa.'}
      </p>
      <button
        onClick={onShop}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
      >
        <Package size={16} />
        Nenda Bidhaa
      </button>
    </div>
  )
}