import { useMemo } from 'react'
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MtejaDeni() {
  const { orders, malipo, wateja, deniLaMteja } = useStore()
  const mteja = wateja[0]

  const deni = useMemo(() => (mteja ? deniLaMteja(mteja.id) : 0), [mteja, orders, malipo])

  if (!mteja) {
    return <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">Hakuna mteja</div>
  }

  const ordersZake = orders.filter((o) => o.simu === mteja.simu)

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Deni Langu</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 grid place-items-center ${deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            <Wallet size={24} />
          </div>
          <div>
            <div className="text-sm text-slate-500">Deni la Sasa</div>
            <div className={`text-2xl md:text-3xl font-bold ${deni > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
              {formatTsh(deni)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {deni > 0 ? 'Tafadhali lipa deni lako' : 'Hauna deni — umelipa yote'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-3">Orders Zangu ({ordersZake.length})</h2>
        {ordersZake.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">Hakuna order bado</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ordersZake.map((o) => {
              const jumlaIlipwa = o.malipo.filter((m) => m.hali === 'imethibitishwa').reduce((s, m) => s + m.kiasi, 0)
              const baki = o.jumla - jumlaIlipwa
              return (
                <div key={o.id} className="py-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${baki > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {baki > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{o.id}</div>
                    <div className="text-xs text-slate-500">{o.tarehe}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{formatTsh(o.jumla)}</div>
                    {baki > 0 ? (
                      <div className="text-xs text-amber-700">Baki: {formatTsh(baki)}</div>
                    ) : (
                      <div className="text-xs text-emerald-700">Imelipwa</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}