import { useParams, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Package,
  Smartphone,
  ArrowLeft,
  Download,
  Home,
  FileText,
} from 'lucide-react'
import { useOrders } from '../../context/OrderContext'

export default function MtejaOrder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOrder } = useOrders()

  const order = id ? getOrder(id) : undefined

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-10 text-center">
        <FileText size={40} className="mx-auto mb-3 text-slate-300" />
        <div className="font-semibold">Order haipo</div>
        <p className="text-sm text-slate-500 mt-1">
          Order uliyoitafuta haipatikani. Labda ilifutwa au haijakamilika.
        </p>
        <button
          onClick={() => navigate('/mteja')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
        >
          <Home size={16} />
          Nyumbani
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 grid place-items-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-lg font-bold">Malipo Yamekamilika</div>
            <div className="text-sm opacity-90">
              Order {order.id} imethibitishwa
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm opacity-90">Tarehe: {order.tarehe}</div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Package size={18} className="text-brand-600" />
          Bidhaa Zilizonunuliwa
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2">Bidhaa</th>
                <th className="py-2 text-right">Wingi</th>
                <th className="py-2 text-right">Jumla</th>
              </tr>
            </thead>
            <tbody>
              {order.bidhaa.map((b) => (
                <tr key={b.id} className="border-b border-slate-100">
                  <td className="py-2">
                    <div className="font-medium">{b.jina}</div>
                    <div className="text-xs text-slate-500">{b.sku}</div>
                  </td>
                  <td className="py-2 text-right">
                    {b.wingi} {b.uom}
                  </td>
                  <td className="py-2 text-right font-semibold">
                    Tsh {b.jumla.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-2 text-right font-semibold">
                  JUMLA
                </td>
                <td className="py-2 text-right font-bold text-brand-700">
                  Tsh {order.jumla.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Smartphone size={18} className="text-emerald-600" />
          Malipo
        </h2>
        <div className="space-y-2">
          {order.malipo.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {m.njia.toUpperCase()} - {m.simu}
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
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => navigate('/mteja')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
        >
          <Home size={16} />
          Nyumbani
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">
          <Download size={16} />
          Pakua Risiti (PDF)
        </button>
        <button
          onClick={() => navigate('/mteja/bidhaa')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 sm:ml-auto"
        >
          <ArrowLeft size={16} />
          Nunua Tena
        </button>
      </div>
    </div>
  )
}