import { Truck, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MuuzajiPokeaBidhaa() {
  const { uingizaji, pokeaUingizaji } = useStore()

  const inasubiri = uingizaji.filter((u) => u.hali === 'inasubiri')

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Truck size={26} className="text-brand-600" /> Pokea Bidhaa
      </h1>

      {inasubiri.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Truck size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna mizigo ya kupokea</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {inasubiri.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-amber-600 grid place-items-center shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{u.id}</div>
                    <div className="text-xs text-slate-500">{u.dukaJina} — {u.tarehe}</div>
                    <div className="text-xs text-slate-500">{u.bidhaa.length} bidhaa</div>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base font-bold text-slate-900">{formatTsh(u.jumlaThamani)}</div>
                  <button onClick={() => pokeaUingizaji(u.id, 'Juma Hassan')} className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                    <CheckCircle2 size={12} /> Nimepokea
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}