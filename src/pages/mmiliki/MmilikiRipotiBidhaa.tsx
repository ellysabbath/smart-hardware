import { Package, CheckCircle2,  AlertTriangle, Calendar, PackageX, RotateCcw } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { AinaRipotiBidhaa } from '../../types'

const AINA_META: Record<AinaRipotiBidhaa, { label: string; tone: string; Icon: React.ElementType }> = {
  uharibifu: { label: 'Uharibifu', tone: 'text-red-700', Icon: AlertTriangle },
  expiry: { label: 'Expiry', tone: 'text-amber-700', Icon: Calendar },
  upotevu: { label: 'Upotevu', tone: 'text-orange-700', Icon: PackageX },
  kurudisha_msambazaji: { label: 'Kurudisha', tone: 'text-purple-700', Icon: RotateCcw },
}

export default function MmilikiRipotiBidhaa() {
  const { ripotiBidhaa, thibitishaRipotiBidhaa } = useStore()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Package size={26} className="text-brand-600" /> Ripoti za Bidhaa
      </h1>

      {ripotiBidhaa.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna ripoti</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {ripotiBidhaa.map((r) => {
            const meta = AINA_META[r.aina]
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{r.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="text-sm truncate">{r.jina}</div>
                      <div className="text-xs text-slate-500">{r.tarehe}</div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">{r.wingi} {r.uom}</div>
                    <div className="text-xs text-slate-500">{formatTsh(r.thamani)}</div>
                  </div>
                </div>
                {r.hali === 'inasubiri' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                    <button onClick={() => thibitishaRipotiBidhaa(r.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                      <CheckCircle2 size={12} /> Thibitisha
                    </button>
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