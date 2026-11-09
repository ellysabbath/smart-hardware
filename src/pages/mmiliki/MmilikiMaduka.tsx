import { useMemo, useState } from 'react'
import {
  Store, Plus, Search, MapPin, Phone, User, Users,
  TrendingUp, Wallet, Package, CheckCircle2, AlertTriangle,
  XCircle, X, Save, Edit, Pause, Play, Ban,
} from 'lucide-react'
import { useDuka } from '../../context/DukaContext'
import type { DukaKamili, HaliDuka, MtumiajiKamili } from '../../types'

const HALI_META: Record<
  HaliDuka,
  { label: string; color: string; Icon: React.ElementType }
> = {
  hai: { label: 'Hai', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imesimamishwa: { label: 'Imesimamishwa', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Pause },
  imefungwa: { label: 'Imefungwa', color: 'bg-red-50 text-red-700 border-red-200', Icon: Ban },
}

export default function MmilikiMaduka() {
  const { maduka, wafanyakazi } = useDuka()
  const [q, setQ] = useState('')
  const [funguaOpen, setFunguaOpen] = useState(false)
  const [selected, setSelected] = useState<DukaKamili | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    if (!query) return maduka
    return maduka.filter(
      (d) =>
        d.jina.toLowerCase().includes(query) ||
        d.mahali.toLowerCase().includes(query) ||
        (d.msimamiziJina?.toLowerCase().includes(query) ?? false)
    )
  }, [maduka, q])

  const stats = useMemo(() => {
    const hai = maduka.filter((d) => d.hali === 'hai').length
    const mauzoLeo = maduka.reduce((s, d) => s + d.mauzoLeo, 0)
    const faidaLeo = maduka.reduce((s, d) => s + d.faidaLeo, 0)
    return { zote: maduka.length, hai, mauzoLeo, faidaLeo }
  }, [maduka])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Maduka Yangu</h1>
          <p className="text-slate-500 text-sm">Fungua, simamia, na panga wasimamizi</p>
        </div>
        <button
          onClick={() => setFunguaOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Fungua Duka
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Maduka Yote" value={String(stats.zote)} Icon={Store} tone="brand" />
        <StatCard label="Maduka Hai" value={String(stats.hai)} Icon={CheckCircle2} tone="emerald" />
        <StatCard label="Mauzo Leo" value={`Tsh ${stats.mauzoLeo.toLocaleString()}`} Icon={TrendingUp} tone="brand" />
        <StatCard label="Faida Leo" value={`Tsh ${stats.faidaLeo.toLocaleString()}`} Icon={Wallet} tone="emerald" />
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tafuta duka kwa jina, mahali, au msimamizi..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Store size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna duka</div>
          <p className="text-sm text-slate-500 mt-1">
            Bofya "Fungua Duka" kuanza biashara mpya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((d) => {
            const meta = HALI_META[d.hali]
            return (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                    <Store size={20} />
                  </div>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="font-semibold">{d.jina}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin size={12} /> {d.mahali}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Phone size={12} /> {d.simu}
                  </div>
                </div>

                <div className="mt-3 p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-600">
                      Msimamizi:{' '}
                      <span className="font-semibold text-slate-800">
                        {d.msimamiziJina || 'Hakuna'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div>
                    <div className="text-slate-500">Mauzo</div>
                    <div className="font-bold text-brand-700 truncate">
                      {d.mauzoLeo.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Faida</div>
                    <div className="font-bold text-emerald-700 truncate">
                      {d.faidaLeo.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Stoki</div>
                    <div className="font-bold truncate">{d.stokiJumla}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                  <Users size={12} /> {d.wafanyakazi} wafanyakazi
                  <span className="mx-1">-</span>
                  <Package size={12} /> {d.stokiJumla} bidhaa
                </div>

                <button
                  onClick={() => setSelected(d)}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  <Edit size={14} />
                  Simamia
                </button>
              </div>
            )
          })}
        </div>
      )}

      {funguaOpen && <FunguaDukaForm onClose={() => setFunguaOpen(false)} />}
      {selected && <DukaDetails duka={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ---------- Fomu ya Kufungua Duka ----------
function FunguaDukaForm({ onClose }: { onClose: () => void }) {
  const { funguaDuka, wafanyakazi } = useDuka()
  const [jina, setJina] = useState('')
  const [mahali, setMahali] = useState('')
  const [simu, setSimu] = useState('')
  const [msimamiziId, setMsimamiziId] = useState<string>('')
  const [error, setError] = useState('')

  const wagombea = wafanyakazi.filter((w) => w.active)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim()) return setError('Jina la duka linahitajika')
    if (!mahali.trim()) return setError('Mahali panahitajika')
    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, '')))
      return setError('Namba ya simu si sahihi')

    setError('')
    funguaDuka({
      jina,
      mahali,
      simu,
      msimamiziId: msimamiziId || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Fungua Duka Jipya</div>
            <div className="text-xs text-slate-500">Weka taarifa za duka na msimamizi</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Jina la Duka</label>
            <input
              value={jina}
              onChange={(e) => setJina(e.target.value)}
              placeholder="Mfano: Smart Hardware - Mbezi"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mahali</label>
            <input
              value={mahali}
              onChange={(e) => setMahali(e.target.value)}
              placeholder="Mfano: Mbezi, Dar"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Namba ya Simu ya Duka</label>
            <input
              value={simu}
              onChange={(e) => setSimu(e.target.value)}
              placeholder="0754-123-456"
              inputMode="tel"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Msimamizi wa Duka</label>
            <select
              value={msimamiziId}
              onChange={(e) => setMsimamiziId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              <option value="">-- Chagua msimamizi (hiari) --</option>
              {wagombea.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.jina} - {w.role} {w.dukaJina ? `(${w.dukaJina})` : '(hana duka)'}
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1">
              Unaweza kubadilisha msimamizi baadaye.
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
              Fungua Duka
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------- Maelezo ya Duka ----------
function DukaDetails({ duka, onClose }: { duka: DukaKamili; onClose: () => void }) {
  const { wafanyakaziWaDuka, wekaMsimamizi, wafanyakazi, badilishaHali } = useDuka()
  const [msimamiziId, setMsimamiziId] = useState(duka.msimamiziId || '')
  const [hali, setHali] = useState<HaliDuka>(duka.hali)

  const wafanyakaziWake = wafanyakaziWaDuka(duka.id)
  const wagombea = wafanyakazi.filter((w) => w.active)

  const handleSave = () => {
    if (msimamiziId) wekaMsimamizi(duka.id, msimamiziId)
    if (hali !== duka.hali) badilishaHali(duka.id, hali)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{duka.jina}</div>
            <div className="text-xs text-slate-500">{duka.mahali}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Msimamizi */}
          <div>
            <label className="text-sm font-medium">Msimamizi wa Duka</label>
            <select
              value={msimamiziId}
              onChange={(e) => setMsimamiziId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              <option value="">-- Hakuna msimamizi --</option>
              {wagombea.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.jina} - {w.role} {w.dukaJina ? `(${w.dukaJina})` : '(hana duka)'}
                </option>
              ))}
            </select>
          </div>

          {/* Hali ya duka */}
          <div>
            <label className="text-sm font-medium">Hali ya Duka</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(['hai', 'imesimamishwa', 'imefungwa'] as HaliDuka[]).map((h) => {
                const meta = HALI_META[h]
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHali(h)}
                    className={`px-2 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 ${
                      hali === h
                        ? `${meta.color}`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <meta.Icon size={12} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Wafanyakazi wa duka */}
          <div>
            <div className="text-sm font-medium mb-2">
              Wafanyakazi wa Duka ({wafanyakaziWake.length})
            </div>
            {wafanyakaziWake.length === 0 ? (
              <div className="text-xs text-slate-500 p-3 rounded-lg bg-slate-50">
                Hakuna wafanyakazi bado. Weka msimamizi kwanza.
              </div>
            ) : (
              <div className="space-y-1.5">
                {wafanyakaziWake.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white grid place-items-center text-[10px] font-bold">
                      {w.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{w.jina}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {w.role} - {w.simu}
                      </div>
                    </div>
                    {duka.msimamiziId === w.id && (
                      <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Msimamizi
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            <Save size={16} />
            Hifadhi Mabadiliko
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------- Stat Card ----------
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