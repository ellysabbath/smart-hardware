
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Minus, ShoppingCart, Check, Package, Store } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useCart } from '../../context/CartContext'
import { iconForKundi } from '../../utils/icons'
import { formatTsh } from '../../utils/faida'
import { useLanguage } from '../../i18n/LanguageContext'
import type { KundiBidhaa } from '../../types'

const KUNDI_FILTERS: { key: KundiBidhaa | 'zote'; labelSw: string; labelEn: string }[] = [
  { key: 'zote', labelSw: 'Zote', labelEn: 'All' },
  { key: 'Saruji', labelSw: 'Saruji', labelEn: 'Cement' },
  { key: 'Nondo', labelSw: 'Nondo', labelEn: 'Reinforcement Bars' },
  { key: 'Mabati', labelSw: 'Mabati', labelEn: 'Roofing Sheets' },
  { key: 'Mbao', labelSw: 'Mbao', labelEn: 'Timber' },
  { key: 'Rangi', labelSw: 'Rangi', labelEn: 'Paint' },
  { key: 'Bomba', labelSw: 'Bomba', labelEn: 'Pipes' },
  { key: 'Umeme', labelSw: 'Umeme', labelEn: 'Electrical' },
  { key: 'Zana', labelSw: 'Zana', labelEn: 'Tools' },
]

export default function MtejaBidhaa() {
  const navigate = useNavigate()
  const { bidhaa } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [q, setQ] = useState('')
  const [filterKundi, setFilterKundi] = useState<KundiBidhaa | 'zote'>('zote')
  const { add, inc, dec, detailed, count, total } = useCart()

  const filtered = bidhaa.filter((b) => {
    if (filterKundi !== 'zote' && b.kundi !== filterKundi) return false

    const query = q.toLowerCase().trim()
    if (!query) return true

    return (
      b.jina.toLowerCase().includes(query) ||
      b.sku.toLowerCase().includes(query) ||
      b.kundi.toLowerCase().includes(query) ||
      b.duka.toLowerCase().includes(query)
    )
  })

  const wingi = (id: string) => detailed.find((l) => l.id === id)?.wingi ?? 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {isSwahili ? 'Bidhaa Zetu' : 'Our Products'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {bidhaa.length} {isSwahili ? 'bidhaa zipo sokoni' : 'products available'}
          </p>
        </div>

        {count > 0 && (
          <button
            onClick={() => navigate('/mteja/quotation')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition self-start sm:self-auto"
          >
            <ShoppingCart size={16} />
            {isSwahili ? 'Kikapu' : 'Cart'} ({count}) — {formatTsh(total)}
          </button>
        )}
      </div>

      {/* Search + Filter */}
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
                ? 'Tafuta bidhaa... (mfano: D12, saruji)'
                : 'Search products... (e.g. D12, cement)'
            }
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {KUNDI_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterKundi(f.key)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                filterKundi === f.key
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSwahili ? f.labelSw : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />

          <h3 className="font-semibold">
            {bidhaa.length === 0
              ? isSwahili
                ? 'Hakuna bidhaa bado'
                : 'No products yet'
              : isSwahili
                ? 'Hakuna bidhaa iliyopatikana'
                : 'No products found'}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {bidhaa.length === 0
              ? isSwahili
                ? 'Mmiliki bado hajaingiza bidhaa kwenye duka.'
                : 'The owner has not added any products to the store yet.'
              : isSwahili
                ? `Jaribu "${q}" au badilisha kichujio.`
                : `Try "${q}" or change the filter.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const c = wingi(b.id)
            const inCart = c > 0
            const Icon = iconForKundi(b.iconKey)

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border p-5 transition ${
                  inCart
                    ? 'border-brand-500 ring-2 ring-brand-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
                    {b.pichaUrl ? (
                      <img
                        src={b.pichaUrl}
                        alt={b.jina}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>

                  {inCart ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      <Check size={10} />
                      {isSwahili ? 'Kikapuni' : 'In Cart'}
                    </span>
                  ) : b.stoki <= 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                      {isSwahili ? 'Imeisha' : 'Out of Stock'}
                    </span>
                  ) : b.stoki <= 20 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      {b.stoki} {b.uom}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-sm">{b.jina}</div>

                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    {b.sku}
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Store size={10} /> {b.duka}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <div className="text-lg font-bold text-brand-700">
                      {formatTsh(b.beiMauzo)}
                    </div>

                    <div className="text-xs text-slate-500">
                      {isSwahili ? 'kwa' : 'per'} {b.uom}
                    </div>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => dec(b.id)}
                        className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 grid place-items-center text-slate-700"
                        aria-label={isSwahili ? 'Punguza idadi' : 'Decrease quantity'}
                      >
                        <Minus size={12} />
                      </button>

                      <span className="min-w-6 text-center text-sm font-bold text-slate-900">
                        {c}
                      </span>

                      <button
                        onClick={() => inc(b.id)}
                        className="w-7 h-7 rounded-md bg-brand-600 hover:bg-brand-700 grid place-items-center text-white"
                        aria-label={isSwahili ? 'Ongeza idadi' : 'Increase quantity'}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(b.id)}
                      disabled={b.stoki <= 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} />
                      {isSwahili ? 'Ongeza' : 'Add'}
                    </button>
                  )}
                </div>

                {inCart && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                    <span className="text-slate-500">
                      {isSwahili ? 'Jumla ndogo' : 'Subtotal'}
                    </span>

                    <span className="font-semibold">
                      {formatTsh(b.beiMauzo * c)}
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
