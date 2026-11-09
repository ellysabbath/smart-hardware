import { useState } from 'react'
import {
  ShoppingCart, Search, Bell, BellOff, CheckCircle2,
  Smartphone, Package, Clock, X, MessageCircle,
} from 'lucide-react'
import { usePendingCarts } from '../../context/PendingCartContext'
import type { HaliCart } from '../../types'

const AINA_META: Record<
  HaliCart,
  { label: string; color: string; Icon: React.ElementType }
> = {
  quotation: { label: 'Quotation', color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Clock },
  order: { label: 'Order', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Package },
  malipo_sehemu: { label: 'Malipo Sehemu', color: 'bg-orange-50 text-orange-700 border-orange-200', Icon: Smartphone },
  imekamilika: { label: 'Imekamilika', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
}

export default function MuuzajiCarts() {
  const { carts, tumaNotify, kamilisha } = usePendingCarts()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<HaliCart | 'zote'>('zote')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = carts.filter((c) => {
    if (filter !== 'zote' && c.aina !== filter) return false
    const query = q.toLowerCase().trim()
    if (!query) return true
    return (
      c.mteja.toLowerCase().includes(query) ||
      c.simu.includes(query) ||
      c.id.toLowerCase().includes(query)
    )
  })

  const handleNotify = (id: string, mteja: string, simu: string) => {
    tumaNotify(id)
    setToast(`SMS imetumwa kwa ${mteja} (${simu}) kukamilisha cart`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Carts Zinazosubiri</h1>
        <p className="text-slate-500 text-sm">
          Quotations na Orders zote zinazosubiri mteja kukamilisha
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Zote</div>
          <div className="text-xl font-bold">{carts.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Quotations</div>
          <div className="text-xl font-bold text-brand-600">
            {carts.filter((c) => c.aina === 'quotation').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Orders</div>
          <div className="text-xl font-bold text-amber-600">
            {carts.filter((c) => c.aina === 'order').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Malipo Sehemu</div>
          <div className="text-xl font-bold text-orange-600">
            {carts.filter((c) => c.aina === 'malipo_sehemu').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta mteja, simu, cart ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('zote')}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              filter === 'zote'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Zote
          </button>
          {(Object.keys(AINA_META) as HaliCart[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                filter === k
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {AINA_META[k].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <ShoppingCart size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna cart inayolingana</div>
          <p className="text-sm text-slate-500 mt-1">Badilisha kichujio au utafutaji.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const meta = AINA_META[c.aina]
            const baki = c.jumla - c.imelipwa
            return (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 ${meta.color}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{c.id}</span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}>
                          {meta.label}
                        </span>
                        {c.imetumwa && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Bell size={10} /> Imetumwa
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.mteja} - {c.simu} - {c.tarehe} {c.muda}
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-base font-bold text-brand-700">
                      Tsh {c.jumla.toLocaleString()}
                    </div>
                    {baki > 0 && (
                      <div className="text-xs text-red-600">
                        Baki: Tsh {baki.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {c.bidhaa.map((b) => (
                      <span
                        key={b.id}
                        className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700"
                      >
                        {b.jina} ({b.wingi} {b.uom})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleNotify(c.id, c.mteja, c.simu)}
                    disabled={c.imetumwa || c.aina === 'imekamilika'}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {c.imetumwa ? <BellOff size={14} /> : <Bell size={14} />}
                    {c.imetumwa ? 'Imeshatumwa' : 'Notify Mteja'}
                  </button>
                  {c.aina !== 'imekamilika' && (
                    <button
                      onClick={() => {
                        kamilisha(c.id)
                        setToast(`Cart ${c.id} imekamilika`)
                        setTimeout(() => setToast(null), 3000)
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} />
                      Kamilisha
                    </button>
                  )}
                  <a
                    href={`https://wa.me/255${c.simu.replace(/[^0-9]/g, '').slice(1)}?text=${encodeURIComponent(
                      `Habari ${c.mteja}, cart yako ${c.id} ya Tsh ${c.jumla.toLocaleString()} iko tayari. Tafadhali kamilisha malipo.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
          {toast}
        </div>
      )}
    </div>
  )
}