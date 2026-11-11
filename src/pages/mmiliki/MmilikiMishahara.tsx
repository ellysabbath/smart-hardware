import { useMemo, useState } from 'react'
import { Wallet, Banknote, CheckCircle2, Clock, Trash2, Users, Zap } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiMishahara() {
  const { mishahara, lipaMshahara } = useStore()
  const [filterHali, setFilterHali] = useState<'zote' | 'inasubiri' | 'imelipwa'>('zote')

  const filtered = useMemo(() => {
    return mishahara.filter((m) => filterHali === 'zote' || m.hali === filterHali)
  }, [mishahara, filterHali])

  const stats = useMemo(() => {
    const zote = mishahara.length
    const jumla = mishahara.reduce((s, m) => s + m.jumla, 0)
    const zilizolipwa = mishahara.filter((m) => m.hali === 'imelipwa')
    const jumlaIliyolipwa = zilizolipwa.reduce((s, m) => s + m.jumla, 0)
    const inasubiri = mishahara.filter((m) => m.hali === 'inasubiri')
    const jumlaInasubiri = inasubiri.reduce((s, m) => s + m.jumla, 0)
    return { zote, jumla, zilizolipwa: zilizolipwa.length, jumlaIliyolipwa, inasubiri: inasubiri.length, jumlaInasubiri }
  }, [mishahara])

  const lipaZote = () => {
    mishahara.filter((m) => m.hali === 'inasubiri').forEach((m) => lipaMshahara(m.id))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet size={26} className="text-brand-600" /> Usimamizi wa Mishahara
          </h1>
          <p className="text-sm text-slate-500 mt-1">Mishahara inaingia moja kwa moja kwenye gharama za biashara</p>
        </div>
        {stats.inasubiri > 0 && (
          <button onClick={lipaZote} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 self-start sm:self-auto">
            <Zap size={16} /> Lipa Wote ({stats.inasubiri})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Mishahara Yote" value={String(stats.zote)} Icon={Users} tone="text-blue-600" />
        <Stat label="Jumla" value={formatTsh(stats.jumla)} Icon={Wallet} tone="text-purple-600" />
        <Stat label="Zilizolipwa" value={formatTsh(stats.jumlaIliyolipwa)} Icon={CheckCircle2} tone="text-emerald-600" sub={`${stats.zilizolipwa} wafanyakazi`} />
        <Stat label="Zinasubiri" value={formatTsh(stats.jumlaInasubiri)} Icon={Clock} tone="text-amber-600" sub={`${stats.inasubiri} wafanyakazi`} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 flex flex-wrap gap-2">
        {(['zote', 'inasubiri', 'imelipwa'] as const).map((k) => (
          <button key={k} onClick={() => setFilterHali(k)} className={`px-3 py-1.5 rounded-lg text-xs border ${filterHali === k ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
            {k === 'zote' ? 'Zote' : k === 'inasubiri' ? 'Zinasubiri' : 'Zilizolipwa'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna mishahara</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center text-xs font-bold shrink-0">
                    {m.jinaMtumiaji.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{m.jinaMtumiaji}</div>
                    <div className="text-xs text-slate-500">{m.nafasi} — {m.dukaJina.replace('Smart Hardware - ', '')}</div>
                    <div className="text-xs text-slate-500">{m.mwezi}</div>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base font-bold text-slate-900">{formatTsh(m.jumla)}</div>
                  <div className={`text-[10px] uppercase font-semibold ${m.hali === 'imelipwa' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {m.hali === 'imelipwa' ? 'Imelipwa' : 'Inasubiri'}
                  </div>
                </div>
              </div>
              {m.hali === 'inasubiri' && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                  <button onClick={() => lipaMshahara(m.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                    <Banknote size={12} /> Lipa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, sub, Icon, tone }: { label: string; value: string; sub?: string; Icon: React.ElementType; tone: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
    </div>
  )
}