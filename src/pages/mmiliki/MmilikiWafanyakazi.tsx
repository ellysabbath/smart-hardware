import { useMemo, useState } from 'react'
import {
  Users, UserPlus, Search, Phone, Store, Edit, X, Save,
  CheckCircle2, XCircle, Shield, Briefcase, Package,
  Trash2, AlertTriangle, Crown, Filter,
} from 'lucide-react'
import { useDuka } from '../../context/DukaContext'
import type { MtumiajiKamili } from '../../types'

// ============================================================
// Nafasi na rangi zake
// ============================================================
type Nafasi = 'muuzaji' | 'mhazini' | 'admin' | 'mmiliki'

const NAFASI_META: Record<
  Nafasi,
  { label: string; color: string; Icon: React.ElementType }
> = {
  mmiliki: { label: 'Mmiliki', color: 'bg-purple-50 text-purple-700 border-purple-200', Icon: Crown },
  admin: { label: 'Admin', color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Shield },
  muuzaji: { label: 'Muuzaji', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: Briefcase },
  mhazini: { label: 'Mhazini', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Package },
}

const NAFASI_ZOTE: Nafasi[] = ['mmiliki', 'admin', 'muuzaji', 'mhazini']

export default function MmilikiWafanyakazi() {
  const { wafanyakazi, maduka, ongezaMtumiaji } = useDuka()
  const [q, setQ] = useState('')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [filterNafasi, setFilterNafasi] = useState<Nafasi | 'zote'>('zote')
  const [ongezaOpen, setOngezaOpen] = useState(false)
  const [selected, setSelected] = useState<MtumiajiKamili | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return wafanyakazi.filter((w) => {
      if (filterDuka !== 'zote' && w.dukaId !== filterDuka) return false
      if (filterNafasi !== 'zote' && w.role !== filterNafasi) return false
      if (!query) return true
      return (
        w.jina.toLowerCase().includes(query) ||
        w.simu.includes(query) ||
        w.role.includes(query)
      )
    })
  }, [wafanyakazi, q, filterDuka, filterNafasi])

  const stats = useMemo(() => {
    const zote = wafanyakazi.length
    const active = wafanyakazi.filter((w) => w.active).length
    const hai = maduka.filter((d) => d.hali === 'hai').length
    const wasioNaDuka = wafanyakazi.filter((w) => !w.dukaId).length
    return { zote, active, hai, wasioNaDuka }
  }, [wafanyakazi, maduka])

  // Wafanyakazi kwa kila duka (kwa muhtasari)
  const kwaDuka = useMemo(() => {
    return maduka.map((d) => ({
      duka: d,
      wafanyakazi: wafanyakazi.filter((w) => w.dukaId === d.id),
      msimamizi: wafanyakazi.find((w) => w.id === d.msimamiziId),
    }))
  }, [maduka, wafanyakazi])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Wafanyakazi</h1>
          <p className="text-slate-500 text-sm">
            Duka moja linaweza kuwa na wafanyakazi wengi
          </p>
        </div>
        <button
          onClick={() => setOngezaOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Ongeza Mtumiaji
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Wafanyakazi Wote" value={String(stats.zote)} Icon={Users} tone="brand" />
        <StatCard label="Wanaofanya Kazi" value={String(stats.active)} Icon={CheckCircle2} tone="emerald" />
        <StatCard label="Maduka Hai" value={String(stats.hai)} Icon={Store} tone="brand" />
        <StatCard label="Wasio na Duka" value={String(stats.wasioNaDuka)} Icon={AlertTriangle} tone="amber" />
      </div>

      {/* Muhtasari kwa kila duka */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Wafanyakazi kwa Duka</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {kwaDuka.map(({ duka, wafanyakazi: wafanyakaziWaDuka, msimamizi }) => (
            <div key={duka.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{duka.jina}</div>
                    <div className="text-xs text-slate-500 truncate">{duka.mahali}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md shrink-0">
                  {wafanyakaziWaDuka.length}
                </span>
              </div>

              {msimamizi ? (
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <Crown size={12} className="text-amber-500" />
                  <span className="text-slate-600">Msimamizi:</span>
                  <span className="font-semibold text-slate-800">{msimamizi.jina}</span>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                  <AlertTriangle size={12} />
                  Hakuna msimamizi
                </div>
              )}

              {wafanyakaziWaDuka.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {wafanyakaziWaDuka.slice(0, 4).map((w) => {
                    const meta = NAFASI_META[w.role]
                    return (
                      <span
                        key={w.id}
                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md border ${meta.color}`}
                      >
                        <meta.Icon size={8} />
                        {w.jina.split(' ')[0]}
                      </span>
                    )
                  })}
                  {wafanyakaziWaDuka.length > 4 && (
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5">
                      +{wafanyakaziWaDuka.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa jina, simu, au nafasi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filterDuka}
            onChange={(e) => setFilterDuka(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
          >
            <option value="zote">Duka zote</option>
            {maduka.map((d) => (
              <option key={d.id} value={d.id}>
                {d.jina}
              </option>
            ))}
          </select>
          <select
            value={filterNafasi}
            onChange={(e) => setFilterNafasi(e.target.value as Nafasi | 'zote')}
            className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
          >
            <option value="zote">Nafasi zote</option>
            {NAFASI_ZOTE.map((n) => (
              <option key={n} value={n}>
                {NAFASI_META[n].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Jina</th>
                <th className="p-3">Nafasi</th>
                <th className="p-3">Duka</th>
                <th className="p-3">Simu</th>
                <th className="p-3">Hali</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <Users size={32} className="mx-auto mb-2 text-slate-300" />
                    <div className="text-sm text-slate-500">
                      Hakuna wafanyakazi wanaolingana na kichujio.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((w) => {
                  const meta = NAFASI_META[w.role]
                  return (
                    <tr key={w.id}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-600 text-white grid place-items-center text-[10px] font-bold shrink-0">
                            {w.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="font-medium">{w.jina}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${meta.color}`}
                        >
                          <meta.Icon size={10} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="p-3">
                        {w.dukaJina ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Store size={12} className="text-slate-400" />
                            {w.dukaJina}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Hana duka</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Phone size={12} />
                          {w.simu}
                        </span>
                      </td>
                      <td className="p-3">
                        {w.active ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                            <XCircle size={10} /> Imezuiwa
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelected(w)}
                          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                        >
                          <Edit size={12} />
                          Badilisha
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {ongezaOpen && <OngezaMtumiajiForm onClose={() => setOngezaOpen(false)} onSubmit={ongezaMtumiaji} />}
      {selected && <MtumiajiDetails mtumiaji={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ============================================================
// Fomu ya Kuongeza Mtumiaji
// ============================================================
function OngezaMtumiajiForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: ReturnType<typeof useDuka>['ongezaMtumiaji']
}) {
  const { maduka } = useDuka()
  const [jina, setJina] = useState('')
  const [simu, setSimu] = useState('')
  const [role, setRole] = useState<Nafasi>('muuzaji')
  const [dukaId, setDukaId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim()) return setError('Jina linahitajika')
    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, '')))
      return setError('Namba ya simu si sahihi (mfano: 0754-123-456)')

    setError('')
    const duka = maduka.find((d) => d.id === dukaId)
    onSubmit({
      jina,
      simu,
      role,
      dukaId: dukaId || undefined,
      dukaJina: duka?.jina,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Ongeza Mtumiaji</div>
            <div className="text-xs text-slate-500">Weka taarifa za mfanyakazi</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Jina Kamili</label>
            <input
              value={jina}
              onChange={(e) => setJina(e.target.value)}
              placeholder="Mfano: Juma Hassan"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Namba ya Simu</label>
            <input
              value={simu}
              onChange={(e) => setSimu(e.target.value)}
              placeholder="0754-123-456"
              inputMode="tel"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nafasi</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {NAFASI_ZOTE.filter((n) => n !== 'mmiliki').map((n) => {
                const meta = NAFASI_META[n]
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRole(n)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                      role === n
                        ? `${meta.color} font-semibold`
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <meta.Icon size={14} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Duka (hiari)</label>
            <select
              value={dukaId}
              onChange={(e) => setDukaId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              <option value="">-- Hana duka bado --</option>
              {maduka.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.jina}
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1">
              Unaweza kumpanga baadaye kwenye ukurasa wa maduka.
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Ghairi
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Save size={16} />
              Hifadhi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Maelezo ya Mtumiaji (Edit)
// ============================================================
function MtumiajiDetails({
  mtumiaji,
  onClose,
}: {
  mtumiaji: MtumiajiKamili
  onClose: () => void
}) {
  const { maduka, wafanyakazi } = useDuka()
  const [dukaId, setDukaId] = useState(mtumiaji.dukaId || '')
  const [role, setRole] = useState<Nafasi>(mtumiaji.role)
  const [active, setActive] = useState(mtumiaji.active)

  // Simulizi: kwa sasa hakuna update method kwenye context
  // Hii inaonyesha UI pekee

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{mtumiaji.jina}</div>
            <div className="text-xs text-slate-500">{mtumiaji.simu}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Nafasi</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {NAFASI_ZOTE.map((n) => {
                const meta = NAFASI_META[n]
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRole(n)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                      role === n
                        ? `${meta.color} font-semibold`
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <meta.Icon size={14} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Duka</label>
            <select
              value={dukaId}
              onChange={(e) => setDukaId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              <option value="">-- Hana duka --</option>
              {maduka.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.jina}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Hali</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setActive(true)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 size={14} /> Active
              </button>
              <button
                type="button"
                onClick={() => setActive(false)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                  !active
                    ? 'bg-red-50 text-red-700 border-red-200 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle size={14} /> Imezuiwa
              </button>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            Ilisajiliwa: {mtumiaji.tareheSajili}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Ghairi
            </button>
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Save size={16} />
              Hifadhi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Stat Card
// ============================================================
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