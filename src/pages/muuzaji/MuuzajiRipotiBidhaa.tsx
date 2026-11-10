import { useMemo, useState } from 'react'
import {
  Package, Search, Filter, Store, Plus, X, Save, Trash2,
  CheckCircle2, Clock, XCircle, AlertTriangle, ArrowDownCircle,
  RefreshCcw, ShoppingBag, RotateCcw, Eye, FileText, Download,
  TrendingDown, PackageX, Calendar, Upload, Image, Tag,
} from 'lucide-react'
import { useRipotiBidhaa } from '../../context/RipotiBidhaaContext'
import { useDuka } from '../../context/DukaContext'
import { bidhaaKamili, MTENGENEZAJI } from '../../data/demo'
import { iconForKundi } from '../../utils/icons'
import { formatTsh } from '../../utils/faida'
import {
  sikuZilizobaki,
  haliExpiry,
  rangiExpiry,
  bidhaaZinazokaribiaKuisha,
} from '../../utils/bidhaa'
import type {
  AinaRipotiBidhaa,
  HaliRipoti,
  RipotiBidhaa,
  BidhaaKamili,
} from '../../types'

const AINA_META: Record<
  AinaRipotiBidhaa,
  { label: string; color: string; Icon: React.ElementType; desc: string }
> = {
  uharibifu: {
    label: 'Uharibifu',
    color: 'text-red-700 border-red-200',
    Icon: AlertTriangle,
    desc: 'Bidhaa imeharibika (mfano: saruji imekauka)',
  },
  expiry: {
    label: 'Expiry',
    color: 'text-amber-700 border-amber-200',
    Icon: Calendar,
    desc: 'Bidhaa imeisha muda (mfano: rangi imeganda)',
  },
  upotevu: {
    label: 'Upotevu',
    color: 'text-orange-700 border-orange-200',
    Icon: PackageX,
    desc: 'Bidhaa imepotea (mfano: wizi, hesabu mbaya)',
  },
  kurudisha_msambazaji: {
    label: 'Kurudisha',
    color: 'text-purple-700 border-purple-200',
    Icon: RotateCcw,
    desc: 'Bidhaa inarudishwa kwa msambazaji',
  },
}

const HALI_META: Record<
  HaliRipoti,
  { label: string; Icon: React.ElementType; color: string }
> = {
  inasubiri: { label: 'Inasubiri', Icon: Clock, color: 'text-amber-700' },
  imethibitishwa: { label: 'Imethibitishwa', Icon: CheckCircle2, color: 'text-emerald-700' },
  imekataliwa: { label: 'Imekataliwa', Icon: XCircle, color: 'text-red-700' },
}

const AINA_FILTERS: { key: AinaRipotiBidhaa | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'uharibifu', label: 'Uharibifu' },
  { key: 'expiry', label: 'Expiry' },
  { key: 'upotevu', label: 'Upotevu' },
  { key: 'kurudisha_msambazaji', label: 'Kurudisha' },
]

export default function MuuzajiRipotiBidhaa() {
  const { ripoti, ongezaRipoti, thibitisha, kataa, futa } = useRipotiBidhaa()
  const { maduka } = useDuka()

  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<AinaRipotiBidhaa | 'zote'>('zote')
  const [filterHali, setFilterHali] = useState<HaliRipoti | 'zote'>('zote')
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState<RipotiBidhaa | null>(null)
  const [tab, setTab] = useState<'ripoti' | 'expiry'>('ripoti')

  // Bidhaa zinazokaribia kuisha (FR5)
  const bidhaaZinakaribia = useMemo(
    () => bidhaaZinazokaribiaKuisha(bidhaaKamili),
    []
  )

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return ripoti.filter((r) => {
      if (filterAina !== 'zote' && r.aina !== filterAina) return false
      if (filterHali !== 'zote' && r.hali !== filterHali) return false
      if (!query) return true
      return (
        r.id.toLowerCase().includes(query) ||
        r.jina.toLowerCase().includes(query) ||
        r.sku.toLowerCase().includes(query) ||
        r.sababu.toLowerCase().includes(query)
      )
    })
  }, [ripoti, q, filterAina, filterHali])

  const stats = useMemo(() => {
    const zote = ripoti.length
    const uharibifu = ripoti.filter((r) => r.aina === 'uharibifu').length
    const expiry = ripoti.filter((r) => r.aina === 'expiry').length
    const jumlaHasara = ripoti
      .filter((r) => r.aina === 'uharibifu' || r.aina === 'expiry' || r.aina === 'upotevu')
      .reduce((s, r) => s + r.thamani, 0)
    return { zote, uharibifu, expiry, jumlaHasara }
  }, [ripoti])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-brand-600" />
            Kuripoti Bidhaa
          </h1>
          <p className="text-slate-500 text-sm">
            Ripoti bidhaa zilizoharibika, kuisha muda, au kupotea
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Ripoti Mpya
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('ripoti')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition ${
            tab === 'ripoti'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText size={14} />
          Ripoti Zangu
        </button>
        <button
          onClick={() => setTab('expiry')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition ${
            tab === 'expiry'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar size={14} />
          Zinazokaribia Kuisha ({bidhaaZinakaribia.length})
        </button>
      </div>

      {tab === 'ripoti' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Ripoti Zote" value={String(stats.zote)} Icon={FileText} accent="brand" />
            <StatCard label="Uharibifu" value={String(stats.uharibifu)} Icon={AlertTriangle} accent="red" />
            <StatCard label="Expiry" value={String(stats.expiry)} Icon={Calendar} accent="amber" />
            <StatCard
              label="Jumla ya Hasara"
              value={formatTsh(stats.jumlaHasara)}
              Icon={TrendingDown}
              accent="red"
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
                placeholder="Tafuta kwa ID, bidhaa, SKU, au sababu..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AINA_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterAina(f.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                    filterAina === f.key
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
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
              <Package size={40} className="mx-auto mb-3 text-slate-300" />
              <div className="font-semibold">Hakuna ripoti</div>
              <p className="text-sm text-slate-500 mt-1">Bofya "Ripoti Mpya" kuanza.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => {
                const aina = AINA_META[r.aina]
                const hali = HALI_META[r.hali]
                const bidhaa = bidhaaKamili.find((b) => b.id === r.bidhaaId)
                const Icon = iconForKundi(bidhaa?.iconKey)
                return (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                      <button
                        onClick={() => setSelected(r)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{r.id}</span>
                            <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${aina.color}`}>
                              {aina.label}
                            </span>
                            <span className={`text-[10px] uppercase font-semibold inline-flex items-center gap-1 ${hali.color}`}>
                              <hali.Icon size={10} />
                              {hali.label}
                            </span>
                          </div>
                          <div className="text-sm font-medium mt-0.5 truncate">{r.jina}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {r.sku} - {r.sababu} - {r.tarehe}
                          </div>
                        </div>
                      </button>
                      <div className="sm:text-right shrink-0">
                        <div className="text-base font-bold text-slate-900">
                          {r.wingi} {r.uom}
                        </div>
                        <div className="text-xs text-slate-500">{formatTsh(r.thamani)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'expiry' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-200">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-slate-900">Alamu ya Expiry (FR5)</div>
                <div className="text-slate-500 mt-0.5">
                  Bidhaa {bidhaaZinakaribia.length} zinakaribia kuisha muda (siku 30) au zimeisha.
                  Tafadhali ripoti au uza kwa haraka.
                </div>
              </div>
            </div>
          </div>

          {bidhaaZinakaribia.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500" />
              <div className="font-semibold">Hakuna bidhaa inayokaribia kuisha</div>
              <p className="text-sm text-slate-500 mt-1">
                Bidhaa zote zina expiry zaidi ya siku 30.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bidhaaZinakaribia.map((b) => {
                const siku = sikuZilizobaki(b.expiry)
                const hali = haliExpiry(b.expiry)
                const Icon = iconForKundi(b.iconKey)
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3"
                  >
                    <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{b.jina}</div>
                      <div className="text-xs text-slate-500">
                        {b.sku} - {b.mtengenezaji} - {b.uzito}
                      </div>
                      <div className="text-xs mt-0.5">
                        Expiry: {b.expiry} -{' '}
                        <span className={`font-semibold ${rangiExpiry(hali)}`}>
                          {siku !== undefined && siku > 0
                            ? `Siku ${siku} zilizobaki`
                            : siku !== undefined && siku <= 0
                            ? `Imeisha siku ${Math.abs(siku)} zilizopita`
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {b.stoki} {b.uom}
                      </div>
                      <button
                        onClick={() => {
                          setFormOpen(true)
                          // Unaweza kuweka pre-fill hapa
                        }}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        Ripoti
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {formOpen && (
        <FomuRipoti
          onClose={() => setFormOpen(false)}
          onSubmit={ongezaRipoti}
        />
      )}
      {selected && (
        <RipotiDetailModal
          ripoti={selected}
          onClose={() => setSelected(null)}
          onFuta={() => {
            futa(selected.id)
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// Fomu ya Kuripoti Bidhaa
// ============================================================
function FomuRipoti({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: ReturnType<typeof useRipotiBidhaa>['ongezaRipoti']
}) {
  const [bidhaaId, setBidhaaId] = useState('')
  const [aina, setAina] = useState<AinaRipotiBidhaa>('uharibifu')
  const [wingi, setWingi] = useState(0)
  const [sababu, setSababu] = useState('')
  const [maelezo, setMaelezo] = useState('')
  const [pichaUrl, setPichaUrl] = useState('')
  const [error, setError] = useState('')

  const bidhaa = bidhaaKamili.find((b) => b.id === bidhaaId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidhaa) return setError('Chagua bidhaa')
    if (wingi <= 0) return setError('Wingi lazima uwe zaidi ya sifuri')
    if (wingi > bidhaa.stoki) return setError(`Wingi hauwezi kuzidi stoki (${bidhaa.stoki})`)
    if (!sababu.trim()) return setError('Sababu inahitajika')

    setError('')
    onSubmit({
      bidhaaId: bidhaa.id,
      jina: bidhaa.jina,
      sku: bidhaa.sku,
      uom: bidhaa.uom,
      kundi: bidhaa.kundi,
      dukaId: 'd1',
      dukaJina: 'Smart Hardware - Kwembe',
      aina,
      wingi,
      beiUnunuzi: bidhaa.beiUnunuzi,
      sababu: sababu.trim(),
      maelezo: maelezo.trim() || undefined,
      pichaUrl: pichaUrl.trim() || undefined,
      expiry: bidhaa.expiry,
      mtengenezaji: bidhaa.mtengenezaji,
      uzito: bidhaa.uzito,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Ripoti Bidhaa</div>
            <div className="text-xs text-slate-500">Uharibifu, expiry, au upotevu</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Chagua Bidhaa</label>
            <select
              value={bidhaaId}
              onChange={(e) => setBidhaaId(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            >
              <option value="">-- Chagua bidhaa --</option>
              {bidhaaKamili.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.jina} ({b.sku}) - Stoki: {b.stoki} {b.uom}
                </option>
              ))}
            </select>
          </div>

          {bidhaa && (
            <div className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 grid place-items-center text-slate-600 shrink-0">
                <Package size={18} />
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <div className="font-medium truncate">{bidhaa.jina}</div>
                <div className="text-xs text-slate-500">
                  {bidhaa.mtengenezaji} - {bidhaa.uzito} - Expiry: {bidhaa.expiry || 'Hakuna'}
                </div>
                <div className="text-xs text-slate-500">
                  Stoki: {bidhaa.stoki} {bidhaa.uom}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Aina ya Ripoti</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(Object.keys(AINA_META) as AinaRipotiBidhaa[]).map((a) => {
                const meta = AINA_META[a]
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAina(a)}
                    className={`px-3 py-2 rounded-lg border text-xs text-left ${
                      aina === a
                        ? 'border-brand-500 bg-slate-50 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <meta.Icon size={12} />
                      <span>{meta.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {AINA_META[aina].desc}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Wingi</label>
            <input
              type="number"
              value={wingi || ''}
              onChange={(e) => setWingi(Number(e.target.value))}
              placeholder="Mfano: 5"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
            {bidhaa && (
              <div className="text-xs text-slate-500 mt-1">
                Stoki iliyopo: {bidhaa.stoki} {bidhaa.uom}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Sababu</label>
            <input
              value={sababu}
              onChange={(e) => setSababu(e.target.value)}
              placeholder="Mfano: Saruji imekauka"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Maelezo (hiari)</label>
            <textarea
              value={maelezo}
              onChange={(e) => setMaelezo(e.target.value)}
              rows={2}
              placeholder="Eleza zaidi..."
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Picha (hiari)</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={pichaUrl}
                onChange={(e) => setPichaUrl(e.target.value)}
                placeholder="URL ya picha"
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
              Tuma Ripoti
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Ripoti Detail Modal
// ============================================================
function RipotiDetailModal({
  ripoti,
  onClose,
  onFuta,
}: {
  ripoti: RipotiBidhaa
  onClose: () => void
  onFuta: () => void
}) {
  const aina = AINA_META[ripoti.aina]
  const hali = HALI_META[ripoti.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{ripoti.id}</div>
            <div className="text-xs text-slate-500">{ripoti.tarehe}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${aina.color}`}>
              <aina.Icon size={12} />
              {aina.label}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${hali.color}`}>
              <hali.Icon size={12} />
              {hali.label}
            </span>
          </div>

          {ripoti.pichaUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={ripoti.pichaUrl}
                alt={ripoti.jina}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          <div>
            <div className="text-xs text-slate-500">Bidhaa</div>
            <div className="font-medium">{ripoti.jina}</div>
            <div className="text-xs text-slate-500">
              {ripoti.sku} - {ripoti.kundi}
            </div>
          </div>

          {ripoti.mtengenezaji && (
            <div>
              <div className="text-xs text-slate-500">Mtengenezaji</div>
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-slate-400" />
                {ripoti.mtengenezaji} - {ripoti.uzito}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Wingi</div>
              <div className="font-semibold">
                {ripoti.wingi} {ripoti.uom}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Thamani</div>
              <div className="font-bold text-slate-900">
                {formatTsh(ripoti.thamani)}
              </div>
            </div>
          </div>

          {ripoti.expiry && (
            <div>
              <div className="text-xs text-slate-500">Expiry</div>
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar size={12} className="text-slate-400" />
                {ripoti.expiry}
                {(() => {
                  const siku = sikuZilizobaki(ripoti.expiry)
                  const hali = haliExpiry(ripoti.expiry)
                  return (
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${rangiExpiry(hali)}`}>
                      {siku !== undefined && siku > 0
                        ? `${siku} siku zilizobaki`
                        : siku !== undefined && siku <= 0
                        ? `Imeisha`
                        : ''}
                    </span>
                  )
                })()}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-slate-500">Sababu</div>
            <div>{ripoti.sababu}</div>
          </div>

          {ripoti.maelezo && (
            <div>
              <div className="text-xs text-slate-500">Maelezo</div>
              <div className="text-sm">{ripoti.maelezo}</div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Store size={12} /> {ripoti.dukaJina}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <FileText size={12} /> {ripoti.aliyeingiza}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={onFuta}
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
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Stat Card
// ============================================================
type Accent = 'brand' | 'emerald' | 'amber' | 'red'
const ACCENT_BORDER: Record<Accent, string> = {
  brand: 'border-l-brand-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
}
const ACCENT_TEXT: Record<Accent, string> = {
  brand: 'text-brand-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
}

function StatCard({
  label,
  value,
  Icon,
  accent,
}: {
  label: string
  value: string
  Icon: React.ElementType
  accent: Accent
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${ACCENT_BORDER[accent]} p-4`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={ACCENT_TEXT[accent]} />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-base md:text-lg font-bold mt-2 truncate text-slate-900">
        {value}
      </div>
    </div>
  )
}