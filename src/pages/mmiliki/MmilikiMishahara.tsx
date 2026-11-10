import { useMemo, useState } from 'react'
import {
  Wallet, Search, Filter, User, Plus, X, Save, Trash2,
  CheckCircle2, Clock, XCircle, Eye, Download, TrendingUp,
  Banknote, Smartphone, Building2, CreditCard, Calendar,
  Users, ArrowRight, AlertTriangle, DollarSign, Store,
  Layers, CheckSquare, Square, Zap, Sparkles,
} from 'lucide-react'
import { useMshahara } from '../../context/MshaharaContext'
import { useDuka } from '../../context/DukaContext'
import { formatTsh } from '../../utils/faida'
import type {
  HaliMshahara,
  Mshahara,
  NjiaMalipoMshahara,
  BulkPaymentResult,
} from '../../types'

const HALI_META: Record<
  HaliMshahara,
  { label: string; color: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', color: 'text-amber-700 border-amber-200', Icon: Clock },
  imelipwa: { label: 'Imelipwa', color: 'text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imeshindwa: { label: 'Imeshindwa', color: 'text-red-700 border-red-200', Icon: XCircle },
  imekataliwa: { label: 'Imekataliwa', color: 'text-red-700 border-red-200', Icon: XCircle },
}

const NJIA_META: Record<
  NjiaMalipoMshahara,
  { color: string; Icon: React.ElementType; label: string }
> = {
  mpesa: { color: 'text-brand-700', Icon: Smartphone, label: 'M-Pesa' },
  tigopesa: { color: 'text-orange-700', Icon: Smartphone, label: 'Tigo Pesa' },
  airtel: { color: 'text-red-700', Icon: Smartphone, label: 'Airtel Money' },
  halopesa: { color: 'text-purple-700', Icon: Smartphone, label: 'HaloPesa' },
  crdb: { color: 'text-emerald-700', Icon: Building2, label: 'CRDB' },
  nmb: { color: 'text-brand-700', Icon: Building2, label: 'NMB' },
  nbc: { color: 'text-slate-700', Icon: Building2, label: 'NBC' },
  stanbic: { color: 'text-purple-700', Icon: Building2, label: 'Stanbic' },
  other: { color: 'text-slate-700', Icon: CreditCard, label: 'Nyingine' },
}

export default function MmilikiMishahara() {
  const {
    mishahara,
    lipaZoteZinazosubiri,
    lipaBulk,
    lipaMshaharaMmoja,
    futaMshahara,
  } = useMshahara()
  const { maduka } = useDuka()

  const [q, setQ] = useState('')
  const [filterDuka, setFilterDuka] = useState<string>('zote')
  const [filterHali, setFilterHali] = useState<HaliMshahara | 'zote'>('zote')
  const [selected, setSelected] = useState<Mshahara | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [matokeo, setMatokeo] = useState<BulkPaymentResult | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return mishahara.filter((m) => {
      if (filterDuka !== 'zote' && m.dukaId !== filterDuka) return false
      if (filterHali !== 'zote' && m.hali !== filterHali) return false
      if (!query) return true
      return (
        m.id.toLowerCase().includes(query) ||
        m.jinaMtumiaji.toLowerCase().includes(query) ||
        m.dukaJina.toLowerCase().includes(query)
      )
    })
  }, [mishahara, q, filterDuka, filterHali])

  const inasubiriZote = useMemo(
    () => mishahara.filter((m) => m.hali === 'inasubiri'),
    [mishahara]
  )

  const stats = useMemo(() => {
    const zote = mishahara.length
    const jumlaMishahara = mishahara.reduce((s, m) => s + m.jumla, 0)
    const zilizolipwa = mishahara.filter((m) => m.hali === 'imelipwa')
    const jumlaIliyolipwa = zilizolipwa.reduce((s, m) => s + m.jumla, 0)
    const zinazosubiri = inasubiriZote
    const jumlaInasubiri = zinazosubiri.reduce((s, m) => s + m.jumla, 0)
    return {
      zote,
      jumlaMishahara,
      zilizolipwa: zilizolipwa.length,
      jumlaIliyolipwa,
      zinazosubiri: zinazosubiri.length,
      jumlaInasubiri,
    }
  }, [mishahara, inasubiriZote])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const inasubiriIds = filtered
      .filter((m) => m.hali === 'inasubiri')
      .map((m) => m.id)
    if (selectedIds.length === inasubiriIds.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(inasubiriIds)
    }
  }

  const jumlaIliyochaguliwa = useMemo(() => {
    return filtered
      .filter((m) => selectedIds.includes(m.id))
      .reduce((s, m) => s + m.jumla, 0)
  }, [filtered, selectedIds])

  // Lipa zote kwa button moja
  const handleLipaZote = () => {
    const result = lipaZoteZinazosubiri()
    setMatokeo(result)
    setConfirmBulk(false)
    setSelectedIds([])
  }

  // Lipa waliochaguliwa
  const handleLipaWaliochaguliwa = () => {
    const result = lipaBulk(selectedIds)
    setMatokeo(result)
    setSelectedIds([])
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet size={24} className="text-brand-600" />
            Usimamizi wa Mishahara
          </h1>
          <p className="text-slate-500 text-sm">
            Lipa mishahara kwa button moja - pesa inaenda moja kwa moja kwa wafanyakazi
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          {inasubiriZote.length > 0 && (
            <button
              onClick={() => setConfirmBulk(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
            >
              <Zap size={16} />
              Lipa Wote ({inasubiriZote.length})
            </button>
          )}
        </div>
      </div>

      {/* Stats 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Mishahara Yote"
          value={String(stats.zote)}
          Icon={Users}
          accent="brand"
        />
        <StatCard
          label="Jumla ya Mshahara"
          value={formatTsh(stats.jumlaMishahara)}
          Icon={DollarSign}
          accent="brand"
        />
        <StatCard
          label="Zilizolipwa"
          value={formatTsh(stats.jumlaIliyolipwa)}
          Icon={CheckCircle2}
          accent="emerald"
          sub={`${stats.zilizolipwa} wafanyakazi`}
        />
        <StatCard
          label="Zinasubiri"
          value={formatTsh(stats.jumlaInasubiri)}
          Icon={Clock}
          accent="amber"
          sub={`${stats.zinazosubiri} wafanyakazi`}
        />
      </div>

      {/* Info: Malipo yanaenda kwa akaunti za wafanyakazi */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-2">
        <Sparkles size={16} className="text-brand-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <div className="font-medium text-slate-900">Malipo ya Moja kwa Moja</div>
          <div className="text-slate-500 mt-0.5">
            Pesa inaenda moja kwa moja kwenye akaunti ya kila mfanyakazi (mobile money au benki).
            Hakikisha kila mfanyakazi ameweka akaunti yake kwenye mfumo.
          </div>
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
            placeholder="Tafuta kwa mshahara ID, jina, au duka..."
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
            onChange={(e) => setFilterHali(e.target.value as HaliMshahara | 'zote')}
            className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
          >
            <option value="zote">Hali Zote</option>
            <option value="inasubiri">Inasubiri</option>
            <option value="imelipwa">Imelipwa</option>
          </select>
        </div>
      </div>

      {/* Selection bar */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 flex items-center gap-3">
          <CheckSquare size={18} className="text-brand-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              {selectedIds.length} wamechaguliwa
            </div>
            <div className="text-xs text-slate-600">
              Jumla: {formatTsh(jumlaIliyochaguliwa)}
            </div>
          </div>
          <button
            onClick={handleLipaWaliochaguliwa}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
          >
            <Banknote size={14} />
            Lipa
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="p-2 rounded-lg hover:bg-brand-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Wallet size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna mishahara</div>
          <p className="text-sm text-slate-500 mt-1">
            Badilisha kichujio au ongeza mshahara mpya.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select all */}
          {filtered.some((m) => m.hali === 'inasubiri') && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm w-full text-left"
            >
              {selectedIds.length > 0 &&
              selectedIds.length ===
                filtered.filter((m) => m.hali === 'inasubiri').length ? (
                <CheckSquare size={16} className="text-brand-600" />
              ) : (
                <Square size={16} className="text-slate-400" />
              )}
              <span className="text-slate-600">
                Chagua wote wanaosubiri (
                {filtered.filter((m) => m.hali === 'inasubiri').length})
              </span>
            </button>
          )}

          {filtered.map((m) => {
            const hali = HALI_META[m.hali]
            const njia = m.njiaMalipo ? NJIA_META[m.njiaMalipo] : null
            const isSelected = selectedIds.includes(m.id)
            const canSelect = m.hali === 'inasubiri'
            return (
              <div
                key={m.id}
                className={`bg-white rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-100'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {canSelect && (
                      <button
                        onClick={() => toggleSelect(m.id)}
                        className="shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare size={20} className="text-brand-600" />
                        ) : (
                          <Square size={20} className="text-slate-400" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setSelected(m)}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {m.jinaMtumiaji}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {m.nafasi}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${hali.color}`}
                          >
                            <hali.Icon size={10} />
                            {hali.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {m.id} - {m.dukaJina.replace('Smart Hardware - ', '')}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.mwezi} - {m.kipindi}
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(m.jumla)}
                    </div>
                    {m.tareheMalipo && (
                      <div className="text-xs text-slate-500">
                        {m.tareheMalipo}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelected(m)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    <Eye size={12} />
                    Ona
                  </button>
                  {m.hali === 'inasubiri' && (
                    <button
                      onClick={() => lipaMshaharaMmoja(m.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      <Banknote size={12} />
                      Lipa
                    </button>
                  )}
                  {m.hali === 'imelipwa' && njia && (
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-50 text-xs ${njia.color}`}
                    >
                      <njia.Icon size={12} />
                      {m.kumbukumbu}
                    </div>
                  )}
                  <button
                    onClick={() => futaMshahara(m.id)}
                    className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                  >
                    <Trash2 size={12} />
                    Futa
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirm Bulk Modal */}
      {confirmBulk && (
        <ConfirmBulkModal
          mishahara={inasubiriZote}
          onClose={() => setConfirmBulk(false)}
          onConfirm={handleLipaZote}
        />
      )}

      {/* Matokeo Modal */}
      {matokeo && (
        <MatokeoModal
          matokeo={matokeo}
          onClose={() => setMatokeo(null)}
        />
      )}

      {/* Detail Modal */}
      {selected && (
        <MshaharaDetailModal
          mshahara={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Confirm Bulk Modal
// ============================================================
function ConfirmBulkModal({
  mishahara,
  onClose,
  onConfirm,
}: {
  mishahara: Mshahara[]
  onClose: () => void
  onConfirm: () => void
}) {
  const jumla = mishahara.reduce((s, m) => s + m.jumla, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" />
              Lipa Mishahara Yote
            </div>
            <div className="text-xs text-slate-500">
              {mishahara.length} wafanyakazi - {formatTsh(jumla)}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="max-h-60 overflow-y-auto rounded-lg bg-slate-50 p-3 space-y-1.5">
            {mishahara.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between text-sm py-1"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{m.jinaMtumiaji}</div>
                  <div className="text-xs text-slate-500">
                    {m.nafasi} - {m.dukaJina.replace('Smart Hardware - ', '')}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="font-bold">{formatTsh(m.jumla)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              Pesa itaenda moja kwa moja kwenye akaunti za wafanyakazi (mobile money/benki).
              Wafanyakazi wasio na akaunti hawatapokea malipo.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 flex justify-between">
            <span className="text-sm font-medium">Jumla ya Kulipa</span>
            <span className="text-lg font-bold text-slate-900">{formatTsh(jumla)}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Ghairi
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              <Zap size={16} />
              Lipa Sasa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Matokeo Modal
// ============================================================
function MatokeoModal({
  matokeo,
  onClose,
}: {
  matokeo: BulkPaymentResult
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="text-lg font-bold mt-3">Malipo Yamekamilika</div>
          <div className="text-sm text-slate-500">
            Wafanyakazi {matokeo.zilizofanikiwa} wamelipwa kwa mafanikio
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <div className="text-xs text-slate-600">Zilizofanikiwa</div>
              <div className="text-lg font-bold text-emerald-700">
                {matokeo.zilizofanikiwa}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <div className="text-xs text-slate-600">Zilizoshindwa</div>
              <div className="text-lg font-bold text-red-700">
                {matokeo.zilizoshindwa}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 mt-2 flex justify-between text-sm">
            <span className="text-slate-600">Jumla Iliyolipwa</span>
            <span className="font-bold text-slate-900">
              {formatTsh(matokeo.jumla)}
            </span>
          </div>

          {matokeo.waliokosaAkaunti.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-left text-sm">
              <div className="font-medium text-amber-800 mb-1">
                Waliokosa Akaunti ({matokeo.waliokosaAkaunti.length})
              </div>
              <div className="text-xs text-amber-700">
                {matokeo.waliokosaAkaunti.join(', ')}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            Sawa
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Detail Modal
// ============================================================
function MshaharaDetailModal({
  mshahara,
  onClose,
}: {
  mshahara: Mshahara
  onClose: () => void
}) {
  const hali = HALI_META[mshahara.hali]
  const njia = mshahara.njiaMalipo ? NJIA_META[mshahara.njiaMalipo] : null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{mshahara.id}</div>
            <div className="text-xs text-slate-500">
              {mshahara.jinaMtumiaji} - {mshahara.nafasi}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${hali.color}`}
            >
              <hali.Icon size={12} />
              {hali.label}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between p-2 rounded-md bg-slate-50">
              <span className="text-slate-600">Mshahara Msingi</span>
              <span className="font-semibold">{formatTsh(mshahara.mshaharaMsingi)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-slate-50">
              <span className="text-slate-600">Posho</span>
              <span className="font-semibold text-emerald-700">
                + {formatTsh(mshahara.posho)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-slate-50">
              <span className="text-slate-600">Overtime</span>
              <span className="font-semibold text-emerald-700">
                + {formatTsh(mshahara.overtime)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-slate-50">
              <span className="text-slate-600">Mafao</span>
              <span className="font-semibold text-emerald-700">
                + {formatTsh(mshahara.mafao)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-slate-50">
              <span className="text-slate-600">Makato</span>
              <span className="font-semibold text-red-700">
                - {formatTsh(mshahara.makato)}
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-brand-50 border border-brand-200">
              <span className="font-semibold text-slate-700">JUMLA</span>
              <span className="font-bold text-brand-700 text-lg">
                {formatTsh(mshahara.jumla)}
              </span>
            </div>
          </div>

          {mshahara.hali === 'imelipwa' && njia && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-xs text-slate-600 mb-1">Malipo</div>
              <div className="flex items-center gap-1.5">
                <njia.Icon size={14} className={njia.color} />
                <span className="font-semibold uppercase">{njia.label}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Akaunti: {mshahara.akauntiMalipo}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {mshahara.kumbukumbu}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Tarehe: {mshahara.tareheMalipo}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            {mshahara.hali === 'imelipwa' && (
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
                <Download size={14} />
                Pakua Payslip
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
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
  sub,
}: {
  label: string
  value: string
  Icon: React.ElementType
  accent: Accent
  sub?: string
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
      {sub && <div className="text-[10px] text-slate-500 truncate">{sub}</div>}
    </div>
  )
}