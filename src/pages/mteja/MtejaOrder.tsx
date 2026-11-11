import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Package, Smartphone, Home, FileText } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MtejaOrder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <FileText size={40} className="mx-auto text-slate-300 mb-3" />
        <h3 className="font-semibold">Order haipo</h3>
        <button onClick={() => navigate('/mteja')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
          <Home size={16} /> Nyumbani
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-50 border border-emerald-200 text-emerald-600 grid place-items-center">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <div className="text-lg font-bold">Order {order.id}</div>
          <div className="text-xs text-slate-500">{order.tarehe}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Package size={18} className="text-brand-600" /> Bidhaa
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2 font-medium">Bidhaa</th>
                <th className="py-2 text-right font-medium">Wingi</th>
                <th className="py-2 text-right font-medium">Jumla</th>
              </tr>
            </thead>
            <tbody>
              {order.bidhaa.map((b) => (
                <tr key={b.id} className="border-b border-slate-100">
                  <td className="py-2">
                    <div className="font-medium">{b.jina}</div>
                    <div className="text-xs text-slate-500">{b.sku}</div>
                  </td>
                  <td className="py-2 text-right">{b.wingi} {b.uom}</td>
                  <td className="py-2 text-right font-semibold">{formatTsh(b.jumla)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-2 text-right font-semibold">JUMLA</td>
                <td className="py-2 text-right font-bold text-brand-700">{formatTsh(order.jumla)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Smartphone size={18} className="text-emerald-600" /> Malipo
        </h2>
        <div className="space-y-2">
          {order.malipo.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{m.njia.toUpperCase()} — {m.simu}</div>
                <div className="text-xs text-slate-500 font-mono">{m.kumbukumbu}</div>
              </div>
              <div className="text-sm font-bold text-emerald-700 whitespace-nowrap">{formatTsh(m.kiasi)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => navigate('/mteja')} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
          <Home size={16} /> Nyumbani
        </button>
      </div>
    </div>
  )
}