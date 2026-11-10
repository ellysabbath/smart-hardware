import { useMemo, useState } from 'react'
import {
  Package, Search, Filter, Plus, X, Save, Eye, FileText,
  TrendingDown, Calendar, Tag, AlertTriangle, Clock,
  CheckCircle2, XCircle, Store, User, Layers, RefreshCcw,
  ShoppingBag, RotateCcw, PackageX, Upload,
} from 'lucide-react'
import { useStoki } from '../../context/StokiContext'
import { useDuka } from '../../context/DukaContext'
import { bidhaaKamili } from '../../data/demo'
import { iconForKundi } from '../../utils/icons'
import { formatTsh } from '../../utils/faida'
import {
  sikuZilizobaki,
  haliExpiry,
  rangiExpiry,
  bidhaaZinazokaribiaKuisha,
} from '../../utils/bidhaa'
import type {
  AinaMarekebishoStoki,
  HaliMarekebisho,
  MarekebishoStoki,
} from '../../types'
import { AINA_META, HALI_META, StokiStat } from '../../components/stoki/StokiSubComponents'

const AINA_FILTERS: { key: AinaMarekebishoStoki | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'mauzo', label: 'Mauzo' },
  { key: 'uharibifu', label: 'Uharibifu' },
  { key: 'expiry', label: 'Expiry' },
  { key: 'upotevu', label: 'Upotevu' },
  { key: 'kurudisha_msambazaji', label: 'Kurudisha' },
]

// Duka la muuzaji (kwa demo, ni d1)
const DUKA_ID = 'd1'
const DUKA_JINA = 'Smart Hardware - Kwembe'
const ALIYEINGIZA = 'Juma Hassan'

export default function MuuzajiStoreManage() {
  const { marekebisho, ongezaMarekebisho } = useStoki()
  const { maduka } = useDuka()

  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<AinaMarekebishoStoki | 'zote'>('zote')
  const [filterHali, setFilterHali] = useState<HaliMarekebisho | 'zote'>('zote')
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState<MarekebishoStoki | null>(null)
  const [tab, setTab] = useState<'stoki' | 'marekebisho' | 'expiry'>('stoki')

  // Chuja marekebisho ya duka la muuzaji tu
  const marekebishoYaDuka = useMemo(
    () => marekebisho.filter((m) => m.dukaId === DUKA_ID),
    [marekebisho]
  )

  // Bidhaa zinazokaribia kuisha (FR5)
  const bidhaaZinakaribia = useMemo(
    () => bidhaaZinazokaribiaKuisha(bidhaaKamili),
    []
  )

  const filteredMarekebisho = useMemo(() => {
    const query = q.toLowerCase().trim()
    return marekebishoYaDuka.filter((m) => {
      if (filterAina !== 'zote' && m.aina !== filterAina) return false
      if (filterHali !== 'zote' && m.hali !== filterHali) return false
      if (!query) return true
      return (
        m.id.toLowerCase().includes(query) ||
        m.jina.toLowerCase().includes(query) ||
        m.sku.toLowerCase().includes(query) ||
        m.sababu.toLowerCase().includes(query)
      )
    })
  }, [marekebishoYaDuka, q, filterAina, filterHali])

  const filteredBidhaa = useMemo(() => {
    const query = q.toLowerCase().trim()
    return bidhaaKamili.filter((b) => {
      if (!query) return true
      return (
        b.jina.toLowerCase().includes(query) ||
        b.sku.toLowerCase().includes(query) ||
        b.kundi.toLowerCase().includes(query) ||
        (b.mtengenezaji?.toLowerCase().includes(query) ?? false)
      )
    })
  }, [q])

  const stats = useMemo(() => {
    const zote = marekebishoYaDuka.length
    const uharibifu = marekebishoYaDuka.filter((m) => m.aina === 'uharibifu').length
    const expiry = marekebishoYaDuka.filter((m) => m.aina === 'expiry').length
    const jumlaHasara = marekebishoYaDuka
      .filter((m) => ['uharibifu', 'expiry', 'upotevu'].includes(m.aina))
      .reduce((s, m) => s + m.thamani, 0)
    const zinazosubiri = marekebishoYaDuka.filter((m) => m.hali === 'inasubiri').length
    return { zote, uharibifu, expiry, jumlaHasara, zinazosubiri }
  }, [marekebishoYaDuka])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-brand-600" />
            Usimamizi wa Stoki
          </h1>
          <p className="text-slate-500 text-sm">
            Simamia stoki ya duka lako - ripoti bidhaa zilizoharibika au kuisha
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Ripoti Stoki
        </button>
      </div>

      {/* Duka info */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
          <Store size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{DUKA_JINA}</div>
          <div className="text-xs text-slate-500">Muuzaji: {ALIYEINGIZA}</div>
        </div>
      </div>

      {/* Stats 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StokiStat
          label="Marekebisho Yote"
          value={String(stats.zote)}
          Icon={FileText}
          accent="brand"
          sub={`${stats.zinazosubiri} zinasubiri`}
        />
        <StokiStat
          label="Uharibifu"
          value={String(stats.uharibifu)}
          Icon={AlertTriangle}
          accent="red"
        />
        <StokiStat
          label="Expiry"
          value={String(stats.expiry)}
          Icon={Calendar}
          accent="amber"
        />
        <StokiStat
          label="Jumla ya Hasara"
          value={formatTsh(stats.jumlaHasara)}
          Icon={TrendingDown}
          accent="red"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('stoki')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
            tab === 'stoki'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers size={14} />
          Stoki ({bidhaaKamili.length})
        </button>
        <button
          onClick={() => setTab('marekebisho')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
            tab === 'marekebisho'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <RefreshCcw size={14} />
          Ripoti Zangu ({marekebishoYaDuka.length})
        </button>
        <button
          onClick={() => setTab('expiry')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
            tab === 'expiry'
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar size={14} />
          Zinazokaribia Kuisha ({bidhaaZinakaribia.length})
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: STOKI */}
      {/* ============================================================ */}
      {tab === 'stoki' && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tafuta bidhaa kwa jina, SKU, kundi, au mtengenezaji..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              />
            </div>
          </div>

          {filteredBidhaa.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <Package size={40} className="mx-auto mb-3 text-slate-300" />
              <div className="font-semibold">Hakuna bidhaa</div>
              <p className="text-sm text-slate-500 mt-1">Badilisha utafutaji.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredBidhaa.map((b) => {
                const Icon = iconForKundi(b.iconKey)
                const siku = sikuZilizobaki(b.expiry)
                const haliE = haliExpiry(b.expiry)
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{b.jina}</div>
                        <div className="text-xs text-slate-500">
                          {b.sku} - {b.kundi}
                        </div>
                        <div className="text-xs text-slate-500">
                          {b.mtengenezaji} - {b.uzito}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <div className="text-slate-500">Stoki</div>
                        <div className="font-bold text-slate-900">
                          {b.stoki} {b.uom}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Bei Mauzo</div>
                        <div className="font-semibold text-brand-700">
                          {formatTsh(b.beiMauzo)}
                        </div>
                      </div>
                    </div>

                    {b.expiry && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                        <Calendar size={10} className="text-slate-400" />
                        <span className="text-slate-500">Expiry:</span>
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${rangiExpiry(haliE)}`}>
                          {siku !== undefined && siku > 0
                            ? `${siku} siku`
                            : siku !== undefined && siku <= 0
                            ? `Imeisha`
                            : ''}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => setFormOpen(true)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                    >
                      <Plus size={14} />
                      Ripoti
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MAREKEBISHO */}
      {/* ============================================================ */}
      {tab === 'marekebisho' && (
        <>
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
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterHali}
                onChange={(e) => setFilterHali(e.target.value as HaliMarekebisho | 'zote')}
                className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
              >
                <option value="zote">Hali Zote</option>
                <option value="inasubiri">Inasubiri</option>
                <option value="imethibitishwa">Imethibitishwa</option>
                <option value="imekataliwa">Imekataliwa</option>
              </select>
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

          {filteredMarekebisho.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <RefreshCcw size={40} className="mx-auto mb-3 text-slate-300" />
              <div className="font-semibold">Hakuna ripoti</div>
              <p className="text-sm text-slate-500 mt-1">
                Bofya "Ripoti Stoki" kuanza.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMarekebisho.map((m) => {
                const aina = AINA_META[m.aina]
                const hali = HALI_META[m.hali]
                const bidhaa = bidhaaKamili.find((b) => b.id === m.bidhaaId)
                const Icon = iconForKundi(bidhaa?.iconKey)
                return (
                  <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                      <button
                        onClick={() => setSelected(m)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{m.id}</span>
                            <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${aina.color}`}>
                              {aina.label}
                            </span>
                            <span className={`text-[10px] uppercase font-semibold inline-flex items-center gap-1 ${hali.color}`}>
                              <hali.Icon size={10} />
                              {hali.label}
                            </span>
                          </div>
                          <div className="text-sm font-medium mt-0.5 truncate">{m.jina}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {m.sku} - {m.tarehe}
                          </div>
                        </div>
                      </button>
                      <div className="sm:text-right shrink-0">
                        <div className="text-base font-bold text-slate-900">
                          {m.wingi} {m.uom}
                        </div>
                        <div className="text-xs text-slate-500">{formatTsh(m.thamani)}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => setSelected(m)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                      >
                        <Eye size={12} />
                        Ona Maelezo
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* TAB 3: EXPIRY */}
      {/* ============================================================ */}
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
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${rangiExpiry(hali)}`}>
                          {siku !== undefined && siku > 0
                            ? `${siku} siku zilizobaki`
                            : siku !== undefined && siku <= 0
                            ? `Imeisha`
                            : ''}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {b.stoki} {b.uom}
                      </div>
                      <button
                        onClick={() => setFormOpen(true)}
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
          onSubmit={ongezaMarekebisho}
        />
      )}
      {selected && (
        <DetailModal
          marekebisho={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Fomu ya Kuripoti (Muuzaji)
// ============================================================
function FomuRipoti({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: ReturnType<typeof useStoki>['ongezaMarekebisho']
}) {
  const [bidhaaId, setBidhaaId] = useState('')
  const [aina, setAina] = useState<AinaMarekebishoStoki>('uharibifu')
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
      dukaId: DUKA_ID,
      dukaJina: DUKA_JINA,
      aina,
      wingi,
      beiUnunuzi: bidhaa.beiUnunuzi,
      sababu: sababu.trim(),
      maelezo: maelezo.trim() || undefined,
      pichaUrl: pichaUrl.trim() || undefined,
      expiry: bidhaa.expiry,
      mtengenezaji: bidhaa.mtengenezaji,
      uzito: bidhaa.uzito,
      aliyeingiza: ALIYEINGIZA,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Ripoti Stoki</div>
            <div className="text-xs text-slate-500">{DUKA_JINA}</div>
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
              {(['uharibifu', 'expiry', 'upotevu', 'kurudisha_msambazaji'] as AinaMarekebishoStoki[]).map((a) => {
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
// Detail Modal (Muuzaji - read only)
// ============================================================
function DetailModal({
  marekebisho,
  onClose,
}: {
  marekebisho: MarekebishoStoki
  onClose: () => void
}) {
  const aina = AINA_META[marekebisho.aina]
  const hali = HALI_META[marekebisho.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{marekebisho.id}</div>
            <div className="text-xs text-slate-500">{marekebisho.tarehe}</div>
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

          {marekebisho.pichaUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={marekebisho.pichaUrl}
                alt={marekebisho.jina}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          <div>
            <div className="text-xs text-slate-500">Bidhaa</div>
            <div className="font-medium">{marekebisho.jina}</div>
            <div className="text-xs text-slate-500">
              {marekebisho.sku} - {marekebisho.kundi}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Store size={12} /> {marekebisho.dukaJina}
          </div>

          {marekebisho.mtengenezaji && (
            <div>
              <div className="text-xs text-slate-500">Mtengenezaji</div>
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-slate-400" />
                {marekebisho.mtengenezaji} - {marekebisho.uzito}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Wingi</div>
              <div className="font-semibold">
                {marekebisho.wingi} {marekebisho.uom}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Thamani</div>
              <div className="font-bold text-slate-900">
                {formatTsh(marekebisho.thamani)}
              </div>
            </div>
          </div>

          {marekebisho.expiry && (
            <div>
              <div className="text-xs text-slate-500">Expiry</div>
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar size={12} className="text-slate-400" />
                {marekebisho.expiry}
                {(() => {
                  const siku = sikuZilizobaki(marekebisho.expiry)
                  const haliE = haliExpiry(marekebisho.expiry)
                  return (
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${rangiExpiry(haliE)}`}>
                      {siku !== undefined && siku > 0
                        ? `${siku} siku`
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
            <div>{marekebisho.sababu}</div>
          </div>

          {marekebisho.maelezo && (
            <div>
              <div className="text-xs text-slate-500">Maelezo</div>
              <div className="text-sm">{marekebisho.maelezo}</div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User size={12} /> {marekebisho.aliyeingiza}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}