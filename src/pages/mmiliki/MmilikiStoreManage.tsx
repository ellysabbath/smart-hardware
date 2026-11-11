import { Package, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiStoreManage() {
  const { marekebishoStoki, thibitishaMarekebisho } = useStore()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Package size={26} className="text-brand-600" /> Marekebisho ya Stoki
      </h1>

      {marekebishoStoki.map((m) => (
        <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-sm">{m.id} — {m.jina}</div>
              <div className="text-xs text-slate-500">{m.aina} — {m.sababu}</div>
              <div className="text-xs text-slate-500">{m.tarehe}</div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-slate-900">{m.wingi} {m.uom}</div>
              <div className="text-xs text-slate-500">{formatTsh(m.thamani)}</div>
            </div>
          </div>
          {m.hali === 'inasubiri' && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button onClick={() => thibitishaMarekebisho(m.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                <CheckCircle2 size={12} /> Thibitisha
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}