import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartButton() {
  const navigate = useNavigate()
  const { detailed, count, total, inc, dec, remove, clear } = useCart()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-brand-600 text-white text-[10px] rounded-full grid place-items-center font-bold">
              {count}
            </span>
          )}
        </div>
        {total > 0 && (
          <span className="hidden md:inline text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
            Tsh {total.toLocaleString()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-40">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Cart Yako</div>
              <div className="text-xs text-slate-500">{count} bidhaa • Tsh {total.toLocaleString()}</div>
            </div>
            {detailed.length > 0 && (
              <button onClick={clear} className="text-xs text-red-600 hover:underline">Ondoa zote</button>
            )}
          </div>

          <div className="max-h-80 overflow-auto divide-y divide-slate-100">
            {detailed.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                <ShoppingCart size={32} className="mx-auto mb-2 text-slate-300" />
                Cart yako ni tupu
              </div>
            ) : (
              detailed.map((l) => (
                <div key={l.id} className="p-3 flex gap-3">
                  <div className="text-2xl">{l.picha}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.jina}</div>
                    <div className="text-xs text-slate-500">Tsh {l.bei.toLocaleString()} / {l.uom}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dec(l.id)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{l.wingi}</span>
                      <button
                        onClick={() => inc(l.id)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => remove(l.id)}
                        className="ml-auto p-1 rounded-md text-red-500 hover:bg-red-50"
                        aria-label="Ondoa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold self-start">Tsh {l.jumla.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Jumla</span>
              <span className="font-bold">Tsh {total.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setOpen(false); navigate('/mteja') }}
                className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
              >
                Endelea Kununua
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/mteja/quotation') }}
                disabled={detailed.length === 0}
                className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nenda Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}