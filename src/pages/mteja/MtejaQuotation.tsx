import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Send,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Smartphone,
  BadgeCheck,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrderContext'
import PaymentModal from '../../components/PaymentModal'
import { iconForKundi } from '../../utils/icons'
import type { Malipo, OrderItem } from '../../types'

export default function MtejaQuotation() {
  const navigate = useNavigate()
  const { detailed, total, count, inc, dec, remove, clear } = useCart()
  const { createOrder, orders } = useOrders()

  const [payOpen, setPayOpen] = useState(false)
  const [malipo, setMalipo] = useState<Malipo[]>([])

  const lines = detailed
  const jumlaIliyolipwa = malipo.reduce((s, m) => s + m.kiasi, 0)
  const baki = total - jumlaIliyolipwa

  const handlePaymentSuccess = (m: Malipo) => {
    const malipoYote = [...malipo, m]
    setMalipo(malipoYote)

    const jumlaMpya = malipoYote.reduce((s, x) => s + x.kiasi, 0)

    if (jumlaMpya >= total && lines.length > 0) {
      const items: OrderItem[] = lines.map((l) => ({
        id: l.id,
        jina: l.jina,
        sku: l.sku,
        uom: l.uom,
        bei: l.bei,
        wingi: l.wingi,
        jumla: l.jumla,
      }))

      const order = createOrder(items, total, malipoYote)

      clear()
      setMalipo([])

      setTimeout(() => {
        navigate(`/mteja/order/${order.id}`)
      }, 400)
    }
  }

  if (lines.length === 0) {
    const orderZaMwisho = orders.slice(0, 3)
    return (
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Quotation Yangu</h1>
          <p className="text-slate-500 text-sm">Valid kwa siku 7</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <FileText size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna bidhaa kwenye cart</div>
          <p className="text-sm text-slate-500 mt-1">
            {orderZaMwisho.length > 0
              ? 'Umekamilisha malipo. Unaweza kuona order zako hapa chini.'
              : 'Ongeza bidhaa kwanza kwenye ukurasa wa Bidhaa.'}
          </p>
          <button
            onClick={() => navigate('/mteja/bidhaa')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
          >
            <ArrowLeft size={16} />
            Nenda Bidhaa
          </button>
        </div>

        {orderZaMwisho.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={18} className="text-emerald-600" />
              <h2 className="font-semibold">Order Zangu za Karibuni</h2>
            </div>
            <div className="space-y-2">
              {orderZaMwisho.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/mteja/order/${o.id}`)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        Order {o.id}
                      </div>
                      <div className="text-xs text-slate-500">
                        {o.tarehe} - Bidhaa {o.bidhaa.length}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-brand-700 whitespace-nowrap">
                    Tsh {o.jumla.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Quotation Yangu</h1>
          <p className="text-slate-500 text-sm">Valid kwa siku 7</p>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 self-start sm:self-auto"
        >
          <Trash2 size={14} />
          Futa Cart
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b pb-4 mb-4">
          <div>
            <div className="font-bold">SMART HARDWARE</div>
            <div className="text-xs text-slate-500">
              TIN: 123-456-789 - VRN: 4001234
            </div>
          </div>
          <div className="text-left sm:text-right text-sm">
            <div className="font-semibold">QUOTATION #Q-2026-0114</div>
            <div className="text-xs text-slate-500">Tarehe: 09 Nov 2026</div>
            <div className="text-xs text-amber-600">Inaisha: 16 Nov 2026</div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2 pl-4 md:pl-0">Bidhaa</th>
                <th className="py-2 text-right">Bei</th>
                <th className="py-2 text-center">Wingi</th>
                <th className="py-2 text-right">Jumla</th>
                <th className="py-2 pr-4 md:pr-0"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const Icon = iconForKundi(l.iconKey)
                return (
                  <tr key={l.id} className="border-b border-slate-100">
                    <td className="py-3 pl-4 md:pl-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 grid place-items-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{l.jina}</div>
                          <div className="text-xs text-slate-500">{l.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      Tsh {l.bei.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => dec(l.id)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                          aria-label="Punguza"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-semibold">{l.wingi}</span>
                        <button
                          onClick={() => inc(l.id)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                          aria-label="Ongeza"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 text-center mt-0.5">
                        {l.uom}
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold whitespace-nowrap">
                      Tsh {l.jumla.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 md:pr-0 text-right">
                      <button
                        onClick={() => remove(l.id)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
                        aria-label="Ondoa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 text-right font-semibold">
                  JUMLA ({count} bidhaa)
                </td>
                <td className="py-3 text-right font-bold text-brand-700 text-lg whitespace-nowrap">
                  Tsh {total.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {malipo.length > 0 && (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck size={16} className="text-emerald-600" />
              <div className="font-semibold text-sm">Malipo Yaliyothibitishwa</div>
            </div>
            <div className="space-y-2">
              {malipo.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100"
                >
                  <Smartphone size={16} className="text-emerald-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {m.simu} - {m.njia.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-600 font-mono">
                      Kumbukumbu: {m.kumbukumbu}
                    </div>
                    <div className="text-[10px] text-slate-500">{m.tarehe}</div>
                  </div>
                  <div className="text-sm font-bold text-emerald-700 whitespace-nowrap">
                    Tsh {m.kiasi.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Jumla</span>
                <span className="font-semibold">Tsh {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Iliyolipwa</span>
                <span className="font-semibold text-emerald-700">
                  Tsh {jumlaIliyolipwa.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1">
                <span className="text-slate-700 font-medium">Baki</span>
                <span className="font-bold text-red-600">
                  Tsh {Math.max(baki, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button
            onClick={() => setPayOpen(true)}
            disabled={baki <= 0}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Smartphone size={16} />
            Lipa kwa Simu
          </button>
          <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">
            <Send size={16} />
            Tuma WhatsApp
          </button>
          <button
            onClick={() => navigate('/mteja/bidhaa')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 sm:ml-auto"
          >
            <ArrowLeft size={16} />
            Endelea Kununua
          </button>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        jumla={baki}
        onClose={() => setPayOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}