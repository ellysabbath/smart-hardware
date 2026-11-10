import { useMemo, useState } from 'react'
import {
  Wallet, Search, Filter, Store, User, Phone, Clock,
  CheckCircle2, XCircle, Trash2, Plus, X, Save,
  AlertTriangle, Eye, FileText, Upload, TrendingUp,
  Pencil, MoreVertical, Receipt,
} from 'lucide-react'
import { useMaombi } from '../../context/OmbiContext'
import { useDuka } from '../../context/DukaContext'
import { AINA_GHARAMA } from '../../data/demo'
import type {
  AinaGharama,
  HaliOmbi,
  OmbiMatumizi,
} from '../../types'

const HALI_META: Record<
  HaliOmbi,
  { label: string; color: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  imekubaliwa: { label: 'Imekubaliwa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
}

const HALI_FILTERS: { key: HaliOmbi | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'inasubiri', label: 'Zinasubiri' },
  { key: 'imekubaliwa', label: 'Zilizokubaliwa' },
  { key: 'imekataliwa', label: 'Zilizokataliwa' },
]

export default function MmilikiMatumizi() {
  const { maombi, idhinisha, kataa, futa, ongezaOmbi } = useMaombi()
  const { maduka, wafanyakazi } = useDuka()

  const [q, setQ] = useState('')
  const [filterHali, setFilterHali] = useState<HaliOmbi | 'zote'>('zote')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [selected, setSelected] = useState<OmbiMatumizi | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return maombi.filter((m) => {
      if (filterHali !== 'zote' && m.hali !== filterHali) return false
      if (filterDuka !== 'zote' && m.duka !== filterDuka) return false
      if (!query) return true
      return (
        m.id.toLowerCase().includes(query) ||
        m.maelezo.toLowerCase().includes(query) ||
        m.sababu.toLowerCase().includes(query) ||
        m.aliyeomba.toLowerCase().includes(query) ||
        m.simu.includes(query)
      )
    })
  }, [maombi, q, filterHali, filterDuka])

  const stats = useMemo(() => {
    const zote = maombi.length
    const inasubiri = maombi.filter((m) => m.hali === 'inasubiri').length
    const zilizokubaliwa = maombi.filter((m) => m.hali === 'imekubaliwa')
    const jumlaIlikubaliwa = zilizokubaliwa.reduce((s, m) => s + m.kiasi, 0)
    const jumlaInasubiri = maombi
      .filter((m) => m.hali === 'inasubiri')
      .reduce((s, m) => s + m.kiasi, 0)
    return { zote, inasubiri, zilizokubaliwa: zilizokubaliwa.length, jumlaIlikubaliwa, jumlaInasubiri }
  }, [maombi])

  // Maduka ya kipekee kutoka kwenye maombi
  const madukaYaMaombi = useMemo(() => {
    const set = new Set(maombi.map((m) => m.duka))
    return Array.from(set)
  }, [maombi])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet size={24} className="text-brand-600" />
            Maombi ya Matumizi - Maduka Yote
          </h1>
          <p className="text-slate-500 text-sm">
            Idhinisha, kataa, au ongeza maombi ya wafanyakazi
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Ongeza Ombi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Maombi Yote" value={String(stats.zote)} Icon={Receipt} tone="brand" />
        <StatCard
          label="Zinasubiri"
          value={String(stats.inasubiri)}
          Icon={Clock}
          tone="amber"
          sub={`Tsh ${stats.jumlaInasubiri.toLocaleString()}`}
        />
        <StatCard
          label="Zilizokubaliwa"
          value={String(stats.zilizokubaliwa)}
          Icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Jumla Iliyokubaliwa"
          value={`Tsh ${stats.jumlaIlikubaliwa.toLocaleString()}`}
          Icon={TrendingUp}
          tone="emerald"
        />
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
            placeholder="Tafuta kwa ID, maelezo, mfanyakazi, au simu..."
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
            <option value="zote">Maduka Yote</option>
            {madukaYaMaombi.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5">
            {HALI_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterHali(f.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                  filterHali === f.key
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Wallet size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna maombi</div>
          <p className="text-sm text-slate-500 mt-1">
            Badilisha kichujio au ongeza ombi jipya.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const meta = HALI_META[m.hali]
            const ainaLabel =
              AINA_GHARAMA.find((a) => a.key === m.aina)?.label ?? m.aina
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <button
                    onClick={() => setSelected(m)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                  >
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
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {m.aliyeomba} - {m.duka} - {m.tarehe}
                      </div>
                    </div>
                  </button>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-brand-700">
                      Tsh {m.kiasi.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 mt-1 sm:justify-end">
                      {m.hali === 'inasubiri' && (
                        <>
                          <button
                            onClick={() => idhinisha(m.id, 'Imekubaliwa')}
                            className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700 inline-flex items-center gap-1"
                          >
                            <CheckCircle2 size={10} />
                            Kubali
                          </button>
                          <button
                            onClick={() => setSelected(m)}
                            className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-semibold hover:bg-red-700 inline-flex items-center gap-1"
                          >
                            <XCircle size={10} />
                            Kataa
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelected(m)}
                        className="p-1.5 rounded-md hover:bg-slate-100"
                        title="Ona"
                      >
                        <Eye size={14} className="text-slate-500" />
                      </button>
                      <button
                        onClick={() => futa(m.id)}
                        className="p-1.5 rounded-md hover:bg-red-50"
                        title="Futa"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <OmbiDetailsModal
          ombi={selected}
          onClose={() => setSelected(null)}
          onIdhinisha={(maoni) => {
            idhinisha(selected.id, maoni)
            setSelected(null)
          }}
          onKataa={(maoni) => {
            kataa(selected.id, maoni)
            setSelected(null)
          }}
          onFuta={() => {
            futa(selected.id)
            setSelected(null)
          }}
        />
      )}

      {formOpen && (
        <OngezaOmbiForm
          onClose={() => setFormOpen(false)}
          onSubmit={(data) => {
            ongezaOmbi(data)
            setFormOpen(false)
          }}
          wafanyakazi={wafanyakazi}
        />
      )}
    </div>
  )
}

// ============================================================
// Ombi Details Modal
// ============================================================
function OmbiDetailsModal({
  ombi,
  onClose,
  onIdhinisha,
  onKataa,
  onFuta,
}: {
  ombi: OmbiMatumizi
  onClose: () => void
  onIdhinisha: (maoni?: string) => void
  onKataa: (maoni: string) => void
  onFuta: () => void
}) {
  const meta = HALI_META[ombi.hali]
  const ainaLabel =
    AINA_GHARAMA.find((a) => a.key === ombi.aina)?.label ?? ombi.aina
  const [mode, setMode] = useState<'view' | 'kubali' | 'kataa' | 'futa'>('view')
  const [maoni, setMaoni] = useState('')
  const [error, setError] = useState('')

  const handleKubali = () => {
    onIdhinisha(maoni.trim() || undefined)
  }

  const handleKataa = () => {
    if (!maoni.trim()) {
      setError('Sababu ya kukataa inahitajika')
      return
    }
    onKataa(maoni.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
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

          {/* Mode selection */}
          {ombi.hali === 'inasubiri' && mode === 'view' && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setMode('kubali')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Kubali
              </button>
              <button
                onClick={() => setMode('kataa')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                <XCircle size={14} />
                Kataa
              </button>
            </div>
          )}

          {/* Kubali mode */}
          {mode === 'kubali' && (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Maoni (hiari)</label>
              <textarea
                value={maoni}
                onChange={(e) => setMaoni(e.target.value)}
                rows={2}
                placeholder="Mfano: Sawa, endelea"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('view'); setMaoni('') }}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  onClick={handleKubali}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  Thibitisha Kukubali
                </button>
              </div>
            </div>
          )}

          {/* Kataa mode */}
          {mode === 'kataa' && (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">
                Sababu ya Kukataa <span className="text-red-500">*</span>
              </label>
              <textarea
                value={maoni}
                onChange={(e) => { setMaoni(e.target.value); setError('') }}
                rows={2}
                placeholder="Eleza kwa nini unakataa ombi hili..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm resize-none"
              />
              {error && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('view'); setMaoni(''); setError('') }}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  onClick={handleKataa}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Thibitisha Kukataa
                </button>
              </div>
            </div>
          )}

          {/* Futa mode */}
          {mode === 'futa' && (
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                Una uhakika unataka kufuta ombi hili? Haiwezi kurudishwa.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('view')}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  onClick={onFuta}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Ndiyo, Futa
                </button>
              </div>
            </div>
          )}

          {/* Bottom actions */}
          {mode === 'view' && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setMode('futa')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
              >
                <Trash2 size={14} />
                Futa
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 sm:ml-auto"
              >
                Funga
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Ongeza Ombi Form
// ============================================================
function OngezaOmbiForm({
  onClose,
  onSubmit,
  wafanyakazi,
}: {
  onClose: () => void
  onSubmit: (data: {
    aina: string
    kiasi: number
    maelezo: string
    simu: string
    sababu: string
    risitiUrl?: string
    aliyeomba: string
    duka: string
  }) => void
  wafanyakazi: { jina: string; dukaJina?: string; simu: string }[]
}) {
  const [aina, setAina] = useState<AinaGharama>('mafuta')
  const [kiasi, setKiasi] = useState(0)
  const [maelezo, setMaelezo] = useState('')
  const [simu, setSimu] = useState('')
  const [sababu, setSababu] = useState('')
  const [risitiUrl, setRisitiUrl] = useState('')
  const [aliyeomba, setAliyeomba] = useState(wafanyakazi[0]?.jina || '')
  const [duka, setDuka] = useState(wafanyakazi[0]?.dukaJina || '')
  const [error, setError] = useState('')

  const handleMfanyakaziChange = (jina: string) => {
    setAliyeomba(jina)
    const w = wafanyakazi.find((x) => x.jina === jina)
    if (w?.dukaJina) setDuka(w.dukaJina)
    if (w?.simu) setSimu(w.simu)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!maelezo.trim()) return setError('Maelezo yanahitajika')
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya sifuri')
    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, '')))
      return setError('Namba ya simu si sahihi')
    if (!sababu.trim()) return setError('Sababu inahitajika')
    if (!aliyeomba.trim()) return setError('Chagua mfanyakazi')

    onSubmit({
      aina,
      kiasi,
      maelezo,
      simu,
      sababu,
      risitiUrl: risitiUrl || undefined,
      aliyeomba,
      duka,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Ongeza Ombi Jipya</div>
            <div className="text-xs text-slate-500">Kwa niaba ya mfanyakazi</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Mfanyakazi</label>
            <select
              value={aliyeomba}
              onChange={(e) => handleMfanyakaziChange(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              {wafanyakazi.map((w) => (
                <option key={w.jina} value={w.jina}>
                  {w.jina} {w.dukaJina ? `(${w.dukaJina})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Duka</label>
            <input
              value={duka}
              onChange={(e) => setDuka(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>
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
              placeholder="80000"
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
              rows={2}
              placeholder="Eleza kwa nini..."
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Risiti (hiari)</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={risitiUrl}
                onChange={(e) => setRisitiUrl(e.target.value)}
                placeholder="URL ya picha"
                className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              />
              <button
                type="button"
                className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200"
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
              Hifadhi Ombi
            </button>
          </div>
        </form>
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
  sub,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: Tone
  sub?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`inline-flex w-9 h-9 rounded-lg items-center justify-center ${TONE[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-slate-500 mt-2">{label}</div>
      <div className="text-base md:text-lg font-bold mt-0.5 truncate">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 truncate">{sub}</div>}
    </div>
  )
}