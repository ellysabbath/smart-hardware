import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Trash2, Plus, Minus, Smartphone, ArrowLeft, CheckCircle2, ShoppingBag,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useStore } from '../../store/StoreContext'
import { iconForKundi } from '../../utils/icons'
import { formatTsh } from '../../utils/faida'

export default function MtejaQuotation() {
  const navigate = useNavigate()
  const { detailed, total, count, inc, dec, remove, clear } = useCart()
  const { wateja, createOrder, ongezaMalipo } = useStore()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const mtejaId = wateja[0]?.id ?? ''

  const lipa = () => {
    if (detailed.length === 0 || !mtejaId) return
    setLoading(true)
    setTimeout(() => {
      const order = createOrder({
        mtejaId,
        dukaId: 'd1',
        muuzaji: 'Online',
        items: detailed.map((l) => ({ id: l.id, wingi: l.wingi })),
      })
      ongezaMalipo({
        orderId: order.id,
        njia: 'mpesa',
        simu: order.simu,
        kumbukumbu: `MPESA-${Date.now().toString().slice(-6)}`,
        kiasi: total,
        hali: 'imethibitishwa',
      })
      clear()
      setToast(`Malipo yamekamilika! Order ${order.id}`)
      setTimeout(() => navigate(`/mteja/order/${order.id}`), 1200)
    }, 1000)
  }

  if (detailed.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Quotation</h1>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Cart yako ni tupu</h3>
          <p className="text-sm text-slate-500 mt-1">Ongeza bidhaa kwanza.</p>
          <button onClick={() => navigate('/mteja/bidhaa')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
            <ArrowLeft size={16} /> Nenda Bidhaa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Quotation</h1>
          <p className="text-sm text-slate-500 mt-1">{count} bidhaa kwenye cart</p>
        </div>
        <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 self-start sm:self-auto">
          <Trash2 size={14} /> Futa Cart
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-3 pl-4 md:pl-0 font-medium">Bidhaa</th>
                <th className="py-3 text-right font-medium">Bei</th>
                <th className="py-3 text-center font-medium">Wingi</th>
                <th className="py-3 text-right font-medium">Jumla</th>
                <th className="py-3 pr-4 md:pr-0"></th>
              </tr>
            </thead>
            <tbody>
              {detailed.map((l) => {
                const Icon = iconForKundi(l.iconKey)
                return (
                  <tr key={l.id} className="border-b border-slate-100">
                    <td className="py-3 pl-4 md:pl-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 grid place-items-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{l.jina}</div>
                          <div className="text-xs text-slate-500">{l.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">{formatTsh(l.bei)}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => dec(l.id)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-semibold">{l.wingi}</span>
                        <button onClick={() => inc(l.id)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center">
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold whitespace-nowrap">{formatTsh(l.jumla)}</td>
                    <td className="py-3 pr-4 md:pr-0 text-right">
                      <button onClick={() => remove(l.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 text-right font-semibold">JUMLA</td>
                <td className="py-3 text-right font-bold text-brand-700 text-lg whitespace-nowrap">{formatTsh(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button
            onClick={lipa}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            <Smartphone size={16} />
            {loading ? 'Inathibitisha...' : `Lipa ${formatTsh(total)}`}
          </button>
          <button onClick={() => navigate('/mteja/bidhaa')} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 sm:ml-auto">
            <ArrowLeft size={16} /> Endelea Kununua
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  )
}