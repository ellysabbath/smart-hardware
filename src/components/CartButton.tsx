import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Plus, Minus, Trash2, X, Package, ArrowRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { iconForKundi } from '../utils/icons'

export default function CartButton() {
  const navigate = useNavigate()
  const { detailed, count, total, inc, dec, remove, clear } = useCart()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* ============ BUTTON ============ */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-brand-600 text-white text-[10px] rounded-full grid place-items-center font-bold">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
        {total > 0 && (
          <span className="hidden md:inline text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-md whitespace-nowrap">
            Tsh {total.toLocaleString()}
          </span>
        )}
      </button>

      {/* ============ DROPDOWN ============ */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-40">
          {/* Header */}
          <div className="p-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <ShoppingCart size={14} className="text-brand-600" />
                Cart Yako
                {count > 0 && (
                  <span className="text-[10px] font-bold bg-brand-600 text-white px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Tsh {total.toLocaleString()}
              </div>
            </div>
            {detailed.length > 0 && (
              <button
                onClick={clear}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Ondoa zote
              </button>
            )}
          </div>

          {/* Items */}
          <div className="max-h-80 overflow-auto divide-y divide-slate-100">
            {detailed.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                <ShoppingCart size={32} className="mx-auto mb-2 text-slate-300" />
                <div className="font-medium">Cart yako ni tupu</div>
                <div className="text-xs text-slate-400 mt-1">
                  Ongeza bidhaa kuanza
                </div>
              </div>
            ) : (
              detailed.map((l) => {
                const Icon = iconForKundi(l.iconKey)
                return (
                  <div key={l.id} className="p-3 flex gap-3">
                    {/* Picha */}
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center shrink-0 text-slate-600">
                      {l.pichaUrl ? (
                        <img
                          src={l.pichaUrl}
                          alt={l.jina}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>

                    {/* Info + actions */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{l.jina}</div>
                      <div className="text-xs text-slate-500">
                        Tsh {l.bei.toLocaleString()} / {l.uom}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => dec(l.id)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                          aria-label="Punguza"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">
                          {l.wingi}
                        </span>
                        <button
                          onClick={() => inc(l.id)}
                          className="w-6 h-6 rounded-md bg-brand-600 text-white hover:bg-brand-700 grid place-items-center"
                          aria-label="Ongeza"
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

                    {/* Jumla */}
                    <div className="text-sm font-bold self-start whitespace-nowrap">
                      Tsh {l.jumla.toLocaleString()}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Jumla</span>
              <span className="font-bold text-base">
                Tsh {total.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/mteja/bidhaa')
                }}
                className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 font-medium"
              >
                Endelea
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/mteja/quotation')
                }}
                disabled={detailed.length === 0}
                className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
              >
                Quotation
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}