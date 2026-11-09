import { useMemo, useState } from 'react'
import {
  TrendingUp, TrendingDown, Wallet, Receipt, HandCoins,
  Package, Store, PiggyBank, Filter, Download, Building2,
  Users, ChevronRight, X, BarChart3, Calendar,
  CheckCircle2,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Legend,
} from 'recharts'
import { useMauzo } from '../../context/MauzoContext'
import { useDuka } from '../../context/DukaContext'
import {
  hesabuFaidaKamili,
  gharamaKwaAina,
  formatTsh,
} from '../../utils/faida'

export default function MmilikiMauzo() {
  const { mauzo, opex } = useMauzo()
  const { maduka } = useDuka()
  const [selectedDuka, setSelectedDuka] = useState<string>('zote')

  const dukaId = selectedDuka === 'zote' ? undefined : selectedDuka

  // Faida ya jumla (maduka yote au duka moja)
  const faidaJumla = useMemo(
    () => hesabuFaidaKamili(mauzo, opex, dukaId),
    [mauzo, opex, dukaId]
  )

  const gharamaJumla = useMemo(
    () => gharamaKwaAina(opex, dukaId),
    [opex, dukaId]
  )

  // Faida kwa kila duka
  const faidaKwaDuka = useMemo(() => {
    return maduka.map((d) => {
      const f = hesabuFaidaKamili(mauzo, opex, d.id)
      return { duka: d, ...f }
    })
  }, [maduka, mauzo, opex])

  // Data ya chati - faida kwa kila duka
  const chartData = faidaKwaDuka.map((f) => ({
    jina: f.duka.jina.replace('Smart Hardware - ', ''),
    mauzo: f.mauzo,
    cogs: f.cogs,
    faidaGhafi: f.faidaGhafi,
    opex: f.jumlaOpex,
    faidaSafi: f.faidaSafi,
  }))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mauzo na Faida - Maduka Yote</h1>
          <p className="text-slate-500 text-sm">
            Muhtasari wa biashara yote - faida ghafi, gharama, faida safi, zaka na sadaka
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 self-start sm:self-auto">
          <Download size={16} />
          Pakua Ripoti
        </button>
      </div>

      {/* Chagua duka */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Filter size={14} />
          Chuja kwa Duka
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDuka('zote')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border ${
              selectedDuka === 'zote'
                ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 size={14} />
            Maduka Yote
          </button>
          {maduka.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDuka(d.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border ${
                selectedDuka === d.id
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Store size={14} />
              {d.jina.replace('Smart Hardware - ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* HERO CARD - Faida Safi ya Jumla */}
      <div
        className={`rounded-2xl p-6 text-white ${
          faidaJumla.hasara
            ? 'bg-gradient-to-r from-red-600 to-red-500'
            : 'bg-gradient-to-r from-emerald-600 to-emerald-500'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm opacity-90">
              {selectedDuka === 'zote' ? 'Faida Safi - Maduka Yote' : 'Faida Safi - Duka Moja'}
            </div>
            <div className="text-3xl md:text-4xl font-bold mt-1">
              {formatTsh(faidaJumla.faidaSafi)}
            </div>
            <div className="text-xs opacity-80 mt-1">
              {faidaJumla.hasara ? 'Biashara inapata HASARA' : 'Biashara inapata FAIDA'}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center">
            {faidaJumla.hasara ? <TrendingDown size={28} /> : <TrendingUp size={28} />}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
          <div>
            <div className="text-xs opacity-80">Zaka (10%)</div>
            <div className="text-xl font-bold">{formatTsh(faidaJumla.zaka)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Sadaka (10%)</div>
            <div className="text-xl font-bold">{formatTsh(faidaJumla.sadaka)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Jumla ya Bwana (20%)</div>
            <div className="text-xl font-bold">{formatTsh(faidaJumla.jumlaYaMungu)}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Inayobaki Kwako</div>
              <div className="text-2xl font-bold">{formatTsh(faidaJumla.inayobaki)}</div>
            </div>
            <HandCoins size={28} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Stats 4 za Jumla */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Mauzo Yote"
          value={formatTsh(faidaJumla.mauzo)}
          Icon={Receipt}
          tone="brand"
        />
        <StatCard
          label="Gharama ya Bidhaa (COGS)"
          value={formatTsh(faidaJumla.cogs)}
          Icon={Package}
          tone="amber"
        />
        <StatCard
          label="Faida Ghafi"
          value={formatTsh(faidaJumla.faidaGhafi)}
          Icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Gharama za Uendeshaji"
          value={formatTsh(faidaJumla.jumlaOpex)}
          Icon={Wallet}
          tone="red"
        />
      </div>

      {/* Chati - Faida kwa kila Duka */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-brand-600" />
          Ulinganisho wa Maduka
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

      {/* Faida kwa Kila Duka (Card za kila duka) */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Store size={18} className="text-brand-600" />
          Faida kwa Kila Duka
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {faidaKwaDuka.map((f) => (
            <div
              key={f.duka.id}
              className="bg-white rounded-xl border border-slate-200 p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                    <Store size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {f.duka.jina.replace('Smart Hardware - ', '')}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {f.duka.mahali}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${
                    f.hasara
                      ? 'bg-red-50 text-red-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {f.hasara ? 'HASARA' : 'FAIDA'}
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mauzo</span>
                  <span className="font-semibold">{formatTsh(f.mauzo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">COGS</span>
                  <span className="font-semibold text-amber-700">
                    {formatTsh(f.cogs)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Faida Ghafi</span>
                  <span className="font-semibold text-brand-700">
                    {formatTsh(f.faidaGhafi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gharama</span>
                  <span className="font-semibold text-red-600">
                    {formatTsh(f.jumlaOpex)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">Faida Safi</span>
                  <span
                    className={`font-bold ${
                      f.hasara ? 'text-red-700' : 'text-emerald-700'
                    }`}
                  >
                    {formatTsh(f.faidaSafi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Zaka 10%</span>
                  <span className="font-semibold text-brand-600">
                    {formatTsh(f.zaka)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sadaka 10%</span>
                  <span className="font-semibold text-brand-600">
                    {formatTsh(f.sadaka)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Inayobaki</span>
                  <span className="font-bold text-emerald-700">
                    {formatTsh(f.inayobaki)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown ya Gharama za Uendeshaji */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <PiggyBank size={18} className="text-brand-600" />
          Gharama za Uendeshaji - {selectedDuka === 'zote' ? 'Maduka Yote' : 'Duka Moja'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          <GharamaItem label="Mishahara" value={gharamaJumla.mishahara} />
          <GharamaItem label="Kodi" value={gharamaJumla.kodi} />
          <GharamaItem label="Umeme" value={gharamaJumla.umeme} />
          <GharamaItem label="Mafuta" value={gharamaJumla.mafuta} />
          <GharamaItem label="Usafiri" value={gharamaJumla.usafiri} />
          <GharamaItem label="Chakula" value={gharamaJumla.chakula} />
          <GharamaItem label="Matengenezo" value={gharamaJumla.matengenezo} />
          <GharamaItem label="Vifaa" value={gharamaJumla.vifaa} />
          <GharamaItem label="Bima" value={gharamaJumla.bima} />
          <GharamaItem label="Leseni" value={gharamaJumla.leseni} />
          <GharamaItem label="Maji" value={gharamaJumla.maji} />
          <GharamaItem label="Nyingine" value={gharamaJumla.nyingine} />
        </div>

        <div className="mt-3 p-3 rounded-lg bg-slate-50 flex justify-between">
          <span className="text-sm font-medium">Jumla ya Gharama</span>
          <span className="text-sm font-bold text-red-700">
            {formatTsh(gharamaJumla.jumla)}
          </span>
        </div>
      </div>

      {/* Ripoti ya Kila Duka - Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Receipt size={18} className="text-brand-600" />
          Jedwali la Maduka Yote
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2">Duka</th>
                <th className="py-2 text-right">Mauzo</th>
                <th className="py-2 text-right">COGS</th>
                <th className="py-2 text-right">Faida Ghafi</th>
                <th className="py-2 text-right">Gharama</th>
                <th className="py-2 text-right">Faida Safi</th>
                <th className="py-2 text-right">Zaka</th>
                <th className="py-2 text-right">Sadaka</th>
              </tr>
            </thead>
            <tbody>
              {faidaKwaDuka.map((f) => (
                <tr key={f.duka.id} className="border-b border-slate-100">
                  <td className="py-2">
                    <div className="font-medium text-sm">
                      {f.duka.jina.replace('Smart Hardware - ', '')}
                    </div>
                    <div className="text-xs text-slate-500">{f.duka.mahali}</div>
                  </td>
                  <td className="py-2 text-right">{f.mauzo.toLocaleString()}</td>
                  <td className="py-2 text-right text-amber-700">
                    {f.cogs.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-semibold text-brand-700">
                    {f.faidaGhafi.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-red-600">
                    {f.jumlaOpex.toLocaleString()}
                  </td>
                  <td
                    className={`py-2 text-right font-bold ${
                      f.hasara ? 'text-red-700' : 'text-emerald-700'
                    }`}
                  >
                    {f.faidaSafi.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-brand-600">
                    {f.zaka.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-brand-600">
                    {f.sadaka.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="py-2 font-bold">JUMLA</td>
                <td className="py-2 text-right font-bold">
                  {faidaJumla.mauzo.toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold text-amber-700">
                  {faidaJumla.cogs.toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold text-brand-700">
                  {faidaJumla.faidaGhafi.toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold text-red-600">
                  {faidaJumla.jumlaOpex.toLocaleString()}
                </td>
                <td
                  className={`py-2 text-right font-bold ${
                    faidaJumla.hasara ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {faidaJumla.faidaSafi.toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold text-brand-600">
                  {faidaJumla.zaka.toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold text-brand-600">
                  {faidaJumla.sadaka.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Zaka na Sadaka - Muhtasari wa Wiki */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm opacity-90">Zaka na Sadaka - Jumla</div>
            <div className="text-3xl font-bold mt-1">
              {formatTsh(faidaJumla.jumlaYaMungu)}
            </div>
            <div className="text-xs opacity-80 mt-1">
              Zaka {formatTsh(faidaJumla.zaka)} + Sadaka {formatTsh(faidaJumla.sadaka)}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center">
            <HandCoins size={28} />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs opacity-80">Inayobaki Kwako (Baada ya Zaka & Sadaka)</div>
            <div className="text-2xl font-bold">{formatTsh(faidaJumla.inayobaki)}</div>
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-brand-700 rounded-lg text-sm font-semibold hover:bg-brand-50">
            <CheckCircle2 size={16} />
            Nimelipa
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================
function GharamaItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-2.5 rounded-lg bg-slate-50">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-sm truncate">{formatTsh(value)}</div>
    </div>
  )
}

type Tone = 'brand' | 'emerald' | 'amber' | 'red'
const TONE: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
}

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: Tone
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`inline-flex w-9 h-9 rounded-lg items-center justify-center ${TONE[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-slate-500 mt-2">{label}</div>
      <div className="text-base md:text-lg font-bold mt-0.5 truncate">{value}</div>
    </div>
  )
}