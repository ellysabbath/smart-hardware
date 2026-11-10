import { useMemo, useState } from 'react'
import {
  Package, Search, Filter, Store, X, Trash2, CheckCircle2,
  XCircle, Eye, FileText, TrendingDown, Calendar, Tag,
  AlertTriangle, Clock, User, Building2, Layers, RefreshCcw,
} from 'lucide-react'
import { useStoki } from '../../context/StokiContext'
import { useDuka } from '../../context/DukaContext'
import { bidhaaKamili } from '../../data/demo'
import { iconForKundi } from '../../utils/icons'
import { formatTsh } from '../../utils/faida'
import { sikuZilizobaki, haliExpiry, rangiExpiry } from '../../utils/bidhaa'
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

export default function MmilikiStoreManage() {
  const { marekebisho, thibitisha, kataa, futa } = useStoki()
  const { maduka } = useDuka()

  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<AinaMarekebishoStoki | 'zote'>('zote')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [filterHali, setFilterHali] = useState<HaliMarekebisho | 'zote'>('zote')
  const [selected, setSelected] = useState<MarekebishoStoki | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return marekebisho.filter((m) => {
      if (filterAina !== 'zote' && m.aina !== filterAina) return false
      if (filterDuka !== 'zote' && m.dukaId !== filterDuka) return false
      if (filterHali !== 'zote' && m.hali !== filterHali) return false
      if (!query) return true
      return (
        m.id.toLowerCase().includes(query) ||
        m.jina.toLowerCase().includes(query) ||
        m.sku.toLowerCase().includes(query) ||
        m.sababu.toLowerCase().includes(query) ||
        m.dukaJina.toLowerCase().includes(query)
      )
    })
  }, [marekebisho, q, filterAina, filterDuka, filterHali])

  const stats = useMemo(() => {
    const zote = marekebisho.length
    const uharibifu = marekebisho.filter((m) => m.aina === 'uharibifu').length
    const expiry = marekebisho.filter((m) => m.aina === 'expiry').length
    const jumlaHasara = marekebisho
      .filter((m) => ['uharibifu', 'expiry', 'upotevu'].includes(m.aina))
      .reduce((s, m) => s + m.thamani, 0)
    const zinazosubiri = marekebisho.filter((m) => m.hali === 'inasubiri').length
    return { zote, uharibifu, expiry, jumlaHasara, zinazosubiri }
  }, [marekebisho])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-brand-600" />
            Usimamizi wa Stoki - Maduka Yote
          </h1>
          <p className="text-slate-500 text-sm">
            Thibitisha, kataa, au fuatilia marekebisho ya stoki ya maduka yako yote
          </p>
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
            placeholder="Tafuta kwa ID, bidhaa, SKU, sababu, au duka..."
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
            {maduka.map((d) => (
              <option key={d.id} value={d.id}>{d.jina}</option>
            ))}
          </select>
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

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <RefreshCcw size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna marekebisho</div>
          <p className="text-sm text-slate-500 mt-1">Badilisha kichujio au utafutaji.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
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
                        {m.sku} - {m.dukaJina.replace('Smart Hardware - ', '')} - {m.tarehe}
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

                {m.hali === 'inasubiri' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => thibitisha(m.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={12} />
                      Thibitisha
                    </button>
                    <button
                      onClick={() => setSelected(m)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                    >
                      <XCircle size={12} />
                      Kataa
                    </button>
                    <button
                      onClick={() => setSelected(m)}
                      className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      <Eye size={12} />
                      Ona
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <DetailModal
          marekebisho={selected}
          role="mmiliki"
          onClose={() => setSelected(null)}
          onThibitisha={() => {
            thibitisha(selected.id)
            setSelected(null)
          }}
          onKataa={() => {
            kataa(selected.id, 'Imekataliwa na mmiliki')
            setSelected(null)
          }}
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
// Detail Modal
// ============================================================
function DetailModal({
  marekebisho,
  role,
  onClose,
  onThibitisha,
  onKataa,
  onFuta,
}: {
  marekebisho: MarekebishoStoki
  role: 'mmiliki' | 'muuzaji'
  onClose: () => void
  onThibitisha: () => void
  onKataa: () => void
  onFuta: () => void
}) {
  const aina = AINA_META[marekebisho.aina]
  const hali = HALI_META[marekebisho.hali]
  const [confirmFuta, setConfirmFuta] = useState(false)

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

          {role === 'mmiliki' && marekebisho.hali === 'inasubiri' && !confirmFuta && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={onThibitisha}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Thibitisha
              </button>
              <button
                onClick={onKataa}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                <XCircle size={14} />
                Kataa
              </button>
            </div>
          )}

          {role === 'mmiliki' && marekebisho.hali !== 'inasubiri' && !confirmFuta && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setConfirmFuta(true)}
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

          {role === 'muuzaji' && !confirmFuta && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 sm:ml-auto"
              >
                Funga
              </button>
            </div>
          )}

          {confirmFuta && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                Una uhakika unataka kufuta marekebisho haya?
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmFuta(false)}
                  className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  onClick={onFuta}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Ndiyo, Futa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}