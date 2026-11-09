import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Minus, ShoppingCart, Check, Package } from 'lucide-react'
import { bidhaa } from '../../data/demo'
import { useCart } from '../../context/CartContext'
import { iconForKundi } from '../../utils/icons'

export default function MtejaBidhaa() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const { add, inc, dec, detailed, count, total } = useCart()

  const filtered = bidhaa.filter(
    (b) =>
      b.jina.toLowerCase().includes(q.toLowerCase()) ||
      b.sku.toLowerCase().includes(q.toLowerCase()) ||
      b.kundi.toLowerCase().includes(q.toLowerCase())
  )

  const wingiKwenyeCart = (id: string) =>
    detailed.find((l) => l.id === id)?.wingi ?? 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Bidhaa Zetu</h1>
          <p className="text-slate-500 text-sm">Tafuta kwa jina au SKU</p>
        </div>

        {count > 0 && (
          <button
            onClick={() => navigate('/mteja/quotation')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
          >
            <ShoppingCart size={16} />
            Cart ({count}) - Tsh {total.toLocaleString()}
          </button>
        )}
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tafuta bidhaa... (mfano: D12, saruji)"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          <Package size={32} className="mx-auto mb-2 text-slate-300" />
          Hakuna bidhaa iliyopatikana kwa "{q}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const c = wingiKwenyeCart(b.id)
            const inCart = c > 0
            const Icon = iconForKundi(b.iconKey)

            return (
              <div
                key={b.id}
                className={`bg-white rounded-xl border p-5 transition ${
                  inCart ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-600 grid place-items-center">
                    <Icon size={20} />
                  </div>
                  {inCart && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      <Check size={12} />
                      Kwenye Cart
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="font-semibold">{b.jina}</div>
                  <div className="text-xs text-slate-500">
                    {b.sku} - {b.duka}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <div className="text-lg font-bold text-brand-700">
                      Tsh {b.beiMauzo.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">kwa {b.uom}</div>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-brand-50 rounded-lg p-1">
                      <button
                        onClick={() => dec(b.id)}
                        className="w-7 h-7 rounded-md bg-white hover:bg-slate-100 grid place-items-center text-brand-700 shadow-sm"
                        aria-label="Punguza"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold text-brand-700">
                        {c}
                      </span>
                      <button
                        onClick={() => inc(b.id)}
                        className="w-7 h-7 rounded-md bg-brand-600 hover:bg-brand-700 grid place-items-center text-white shadow-sm"
                        aria-label="Ongeza"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(b.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
                    >
                      <Plus size={14} />
                      Ongeza
                    </button>
                  )}
                </div>

                {inCart && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                    <span className="text-slate-500">Jumla ndogo</span>
                    <span className="font-semibold">
                      Tsh {(b.beiMauzo * c).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}