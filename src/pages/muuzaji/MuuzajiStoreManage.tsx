import { Package, AlertTriangle, Calendar, RotateCcw, PackageX, RefreshCcw } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MuuzajiStoreManage() {
  const { marekebishoStoki, thibitishaMarekebisho } = useStore()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Package size={26} className="text-brand-600" /> Usimamizi wa Stoki
      </h1>

      {marekebishoStoki.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <RefreshCcw size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna marekebisho</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {marekebishoStoki.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-amber-600 grid place-items-center shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{m.id} — {m.jina}</div>
                    <div className="text-xs text-slate-500">{m.aina} — {m.sababu}</div>
                    <div className="text-xs text-slate-500">{m.tarehe}</div>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base font-bold text-slate-900">{m.wingi} {m.uom}</div>
                  <div className="text-xs text-slate-500">{formatTsh(m.thamani)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}