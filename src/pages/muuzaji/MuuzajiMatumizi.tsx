import { useMemo, useState } from 'react'
import {
  Wallet, Plus, Search, Phone, MessageSquare, AlertTriangle,
  CheckCircle2, Clock, XCircle, X, Save, Upload, Receipt,
  Filter, ChevronRight, User,
} from 'lucide-react'
import { useMaombi } from '../../context/OmbiContext'
import { AINA_GHARAMA } from '../../data/demo'
import type { AinaGharama, HaliOmbi, OmbiMatumizi } from '../../types'

const HALI_META: Record<
  HaliOmbi,
  { label: string; color: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  imekubaliwa: { label: 'Imekubaliwa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
}

type FilterKey = 'zote' | HaliOmbi

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'inasubiri', label: 'Zinasubiri' },
  { key: 'imekubaliwa', label: 'Zilizokubaliwa' },
  { key: 'imekataliwa', label: 'Zilizokataliwa' },
]

export default function MuuzajiMatumizi() {
  const { maombi, ongezaOmbi } = useMaombi()
  const [formOpen, setFormOpen] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('zote')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<OmbiMatumizi | null>(null)

  const filtered = useMemo(() => {
    return maombi.filter((m) => {
      if (filter !== 'zote' && m.hali !== filter) return false
      const query = q.toLowerCase().trim()
      if (!query) return true
      return (
        m.maelezo.toLowerCase().includes(query) ||
        m.sababu.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query) ||
        m.aina.toLowerCase().includes(query)
      )
    })
  }, [maombi, filter, q])

  const stats = useMemo(() => {
    const zote = maombi.length
    const inasubiri = maombi.filter((m) => m.hali === 'inasubiri').length
    const imekubaliwa = maombi.filter((m) => m.hali === 'imekubaliwa')
    const jumlaIlikubaliwa = imekubaliwa.reduce((s, m) => s + m.kiasi, 0)
    return { zote, inasubiri, imekubaliwa: imekubaliwa.length, jumlaIlikubaliwa }
  }, [maombi])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Maombi ya Matumizi</h1>
          <p className="text-slate-500 text-sm">
            Omba matumizi ya duka - Mmiliki ataidhinisha
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Omba Matumizi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Maombi Yote" value={String(stats.zote)} Icon={Receipt} tone="brand" />
        <StatCard label="Zinasubiri" value={String(stats.inasubiri)} Icon={Clock} tone="amber" />
        <StatCard label="Zilizokubaliwa" value={String(stats.imekubaliwa)} Icon={CheckCircle2} tone="emerald" />
        <StatCard
          label="Jumla Iliyokubaliwa"
          value={`Tsh ${stats.jumlaIlikubaliwa.toLocaleString()}`}
          Icon={Wallet}
          tone="emerald"
        />
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa ID, aina, maelezo, au sababu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                filter === f.key
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Wallet size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna maombi</div>
          <p className="text-sm text-slate-500 mt-1">
            Bofya "Omba Matumizi" kuanza kuomba.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const meta = HALI_META[m.hali]
            const ainaLabel =
              AINA_GHARAMA.find((a) => a.key === m.aina)?.label ?? m.aina
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 ${meta.color}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{m.id}</span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {ainaLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {m.maelezo}
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-base font-bold text-brand-700">
                      Tsh {m.kiasi.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">{m.tarehe}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {formOpen && <OmbiForm onClose={() => setFormOpen(false)} onSubmit={ongezaOmbi} />}
      {selected && <OmbiDetails ombi={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ---------- Fomu ya Ombi ----------
function OmbiForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: ReturnType<typeof useMaombi>['ongezaOmbi']
}) {
  const [aina, setAina] = useState<AinaGharama>('mafuta')
  const [kiasi, setKiasi] = useState(0)
  const [maelezo, setMaelezo] = useState('')
  const [simu, setSimu] = useState('')
  const [sababu, setSababu] = useState('')
  const [risitiUrl, setRisitiUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!maelezo.trim()) return setError('Maelezo yanahitajika')
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya sifuri')
    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, '')))
      return setError('Namba ya simu si sahihi (mfano: 0754-123-456)')
    if (!sababu.trim()) return setError('Sababu inahitajika')

    setError('')
    onSubmit({ aina, kiasi, maelezo, simu, sababu, risitiUrl: risitiUrl || undefined })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">Omba Matumizi</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Aina ya Gharama</label>
            <select
              value={aina}
              onChange={(e) => setAina(e.target.value as AinaGharama)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              {AINA_GHARAMA.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Kiasi (Tsh)</label>
            <input
              type="number"
              value={kiasi || ''}
              onChange={(e) => setKiasi(Number(e.target.value))}
              placeholder="Mfano: 80000"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Maelezo</label>
            <input
              value={maelezo}
              onChange={(e) => setMaelezo(e.target.value)}
              placeholder="Mfano: Mafuta ya pikipiki"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Namba ya Simu ya Mlipaji</label>
            <input
              value={simu}
              onChange={(e) => setSimu(e.target.value)}
              placeholder="0754-123-456"
              inputMode="tel"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sababu</label>
            <textarea
              value={sababu}
              onChange={(e) => setSababu(e.target.value)}
              rows={3}
              placeholder="Eleza kwa nini unahitaji matumizi haya..."
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Risiti (hiari)</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={risitiUrl}
                onChange={(e) => setRisitiUrl(e.target.value)}
                placeholder="URL ya picha ya risiti"
                className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              />
              <button
                type="button"
                className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200"
                title="Pakia picha"
              >
                <Upload size={16} />
              </button>
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
              Tuma Ombi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------- Maelezo ya Ombi ----------
function OmbiDetails({ ombi, onClose }: { ombi: OmbiMatumizi; onClose: () => void }) {
  const meta = HALI_META[ombi.hali]
  const ainaLabel =
    AINA_GHARAMA.find((a) => a.key === ombi.aina)?.label ?? ombi.aina
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{ombi.id}</div>
            <div className="text-xs text-slate-500">{ombi.tarehe}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${meta.color}`}>
            <meta.Icon size={12} />
            {meta.label}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Aina</div>
              <div className="font-medium capitalize">{ainaLabel}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Kiasi</div>
              <div className="font-bold text-brand-700">
                Tsh {ombi.kiasi.toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Maelezo</div>
            <div>{ombi.maelezo}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Sababu</div>
            <div>{ombi.sababu}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Phone size={12} /> {ombi.simu}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User size={12} /> {ombi.aliyeomba} - {ombi.duka}
          </div>
          {ombi.maoni && (
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500 mb-1">Maoni ya Mmiliki</div>
              <div className="text-sm">{ombi.maoni}</div>
              {ombi.aliyeidhinisha && (
                <div className="text-xs text-slate-500 mt-1">
                  - {ombi.aliyeidhinisha}, {ombi.tareheIdhini}
                </div>
              )}
            </div>
          )}
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