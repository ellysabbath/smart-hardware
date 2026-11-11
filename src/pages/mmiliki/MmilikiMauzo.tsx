import { useMemo, useState } from 'react'
import {
  TrendingUp, TrendingDown, Wallet, Receipt,Package,
  Building2, BarChart3, Users, Store,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiMauzo() {
  const { maduka, mauzo, opex, mishahara, faida } = useStore()
  const [selectedDuka, setSelectedDuka] = useState<string>('zote')
  const dukaId = selectedDuka === 'zote' ? undefined : selectedDuka

  const f = useMemo(() => faida(dukaId), [mauzo, opex, mishahara, dukaId])

  const faidaKwaDuka = useMemo(
    () => maduka.map((d) => ({ duka: d, ...faida(d.id) })),
    [maduka, mauzo, opex, mishahara]
  )

  const chartData = faidaKwaDuka.map((x) => ({
    jina: x.duka.jina.replace('Smart Hardware - ', ''),
    mauzo: x.mauzo,
    faidaGhafi: x.faidaGhafi,
    faidaSafi: x.faidaSafi,
  }))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Mauzo na Faida</h1>
        <p className="text-sm text-slate-500 mt-1">Faida ghafi, gharama, mishahara, na faida safi</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4">
        <label className="text-xs font-medium text-slate-700">Chuja kwa Duka</label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={() => setSelectedDuka('zote')} className={`px-3 py-2 rounded-lg text-sm border ${selectedDuka === 'zote' ? 'bg-brand-600 text-white border-brand-600 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
            <Building2 size={14} className="inline mr-1" /> Maduka Yote
          </button>
          {maduka.map((d) => (
            <button key={d.id} onClick={() => setSelectedDuka(d.id)} className={`px-3 py-2 rounded-lg text-sm border ${selectedDuka === d.id ? 'bg-brand-600 text-white border-brand-600 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <Store size={14} className="inline mr-1" /> {d.jina.replace('Smart Hardware - ', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${f.hasara ? 'text-red-600' : 'text-emerald-600'}`}>
            {f.hasara ? <TrendingDown size={26} /> : <TrendingUp size={26} />}
          </div>
          <div>
            <div className="text-sm text-slate-500">Faida Safi {selectedDuka === 'zote' ? '(Maduka Yote)' : ''}</div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">{formatTsh(f.faidaSafi)}</div>
            <div className={`text-xs mt-1 font-medium ${f.hasara ? 'text-red-600' : 'text-emerald-600'}`}>
              {f.hasara ? 'HASARA' : 'FAIDA'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-200">
          <div><div className="text-xs text-slate-500">Zaka (10%)</div><div className="text-base font-bold text-slate-900">{formatTsh(f.zaka)}</div></div>
          <div><div className="text-xs text-slate-500">Sadaka (10%)</div><div className="text-base font-bold text-slate-900">{formatTsh(f.sadaka)}</div></div>
          <div><div className="text-xs text-slate-500">Jumla Bwana</div><div className="text-base font-bold text-slate-900">{formatTsh(f.jumlaYaMungu)}</div></div>
          <div><div className="text-xs text-slate-500">Inayobaki</div><div className="text-base font-bold text-emerald-700">{formatTsh(f.inayobaki)}</div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Mauzo Yote" value={formatTsh(f.mauzo)} Icon={Receipt} tone="text-blue-600" />
        <Stat label="COGS" value={formatTsh(f.cogs)} Icon={Package} tone="text-amber-600" />
        <Stat label="Faida Ghafi" value={formatTsh(f.faidaGhafi)} Icon={TrendingUp} tone="text-emerald-600" />
        <Stat label="Opex" value={formatTsh(f.jumlaOpex)} Icon={Wallet} tone="text-orange-600" sub="Bila mishahara" />
        <Stat label="Mishahara" value={formatTsh(f.jumlaMishahara)} Icon={Users} tone="text-purple-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-brand-600" /> Ulinganisho wa Maduka
        </h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="jina" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip formatter={(v) => formatTsh(Number(v ?? 0))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="mauzo" name="Mauzo" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="faidaGhafi" name="Faida Ghafi" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="faidaSafi" name="Faida Safi" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {faidaKwaDuka.map((x) => (
          <div key={x.duka.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center">
                  <Store size={18} />
                </div>
                <div>
                  <div className="font-semibold text-sm">{x.duka.jina.replace('Smart Hardware - ', '')}</div>
                  <div className="text-xs text-slate-500">{x.duka.mahali}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${x.hasara ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'}`}>
                {x.hasara ? 'HASARA' : 'FAIDA'}
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <Row label="Mauzo" value={formatTsh(x.mauzo)} />
              <Row label="COGS" value={formatTsh(x.cogs)} tone="text-amber-700" />
              <Row label="Faida Ghafi" value={formatTsh(x.faidaGhafi)} tone="text-brand-700" />
              <Row label="Opex" value={formatTsh(x.jumlaOpex)} tone="text-red-600" />
              <Row label="Mishahara" value={formatTsh(x.jumlaMishahara)} tone="text-purple-700" />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-sm">
              <Row label="Faida Safi" value={formatTsh(x.faidaSafi)} tone={x.hasara ? 'text-red-700' : 'text-emerald-700'} bold />
              <Row label="Zaka 10%" value={formatTsh(x.zaka)} />
              <Row label="Sadaka 10%" value={formatTsh(x.sadaka)} />
              <Row label="Inayobaki" value={formatTsh(x.inayobaki)} tone="text-emerald-700" bold />
            </div>
          </div>
        ))}
      </div>
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

function Row({ label, value, tone, bold }: { label: string; value: string; tone?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`${bold ? 'font-bold' : 'font-semibold'} ${tone ?? 'text-slate-900'}`}>{value}</span>
    </div>
  )
}