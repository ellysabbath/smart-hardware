import { useMemo, useState } from 'react'
import { Receipt, Search, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MuuzajiRisiti() {
  const { orders } = useStore()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return orders.filter((o) => {
      if (!query) return true
      return o.id.toLowerCase().includes(query) || o.mteja.toLowerCase().includes(query) || o.simu.includes(query)
    })
  }, [orders, q])

  const stats = useMemo(() => {
    const zote = orders.length
    const jumla = orders.reduce((s, o) => s + o.jumla, 0)
    const cash = orders
      .filter((o) => o.malipo.some((m) => m.njia === 'cash' && m.hali === 'imethibitishwa'))
      .reduce((s, o) => s + o.jumla, 0)
    const deni = orders.reduce((s, o) => {
      const jumlaIlipwa = o.malipo.filter((m) => m.hali === 'imethibitishwa').reduce((a, m) => a + m.kiasi, 0)
      return s + Math.max(o.jumla - jumlaIlipwa, 0)
    }, 0)
    return { zote, jumla, cash, deni }
  }, [orders])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Receipt size={26} className="text-brand-600" /> Risiti
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Risiti Zote" value={String(stats.zote)} Icon={Receipt} tone="text-blue-600" />
        <Stat label="Jumla ya Mauzo" value={formatTsh(stats.jumla)} Icon={CheckCircle2} tone="text-emerald-600" />
        <Stat label="Cash" value={formatTsh(stats.cash)} Icon={CheckCircle2} tone="text-emerald-600" />
        <Stat label="Deni" value={formatTsh(stats.deni)} Icon={Clock} tone="text-amber-600" />
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tafuta risiti..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Receipt size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna risiti</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => {
            const jumlaIlipwa = o.malipo.filter((m) => m.hali === 'imethibitishwa').reduce((s, m) => s + m.kiasi, 0)
            const baki = o.jumla - jumlaIlipwa
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${baki > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {baki > 0 ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{o.id}</div>
                      <div className="text-xs text-slate-500 truncate">{o.mteja} — {o.simu}</div>
                      <div className="text-xs text-slate-500">{o.tarehe}</div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">{formatTsh(o.jumla)}</div>
                    {baki > 0 && <div className="text-xs text-amber-700">Baki: {formatTsh(baki)}</div>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, Icon, tone }: { label: string; value: string; Icon: React.ElementType; tone: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}