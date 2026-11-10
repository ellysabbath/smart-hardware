import { useMemo, useState } from 'react'
import {
  Wallet, Banknote, Smartphone, Building2,
  CheckCircle2, Clock, XCircle, Download, X,
  Calendar, FileText, TrendingUp, CreditCard, AlertTriangle,
  User, Store, Info,
} from 'lucide-react'
import { useMshahara } from '../../context/MshaharaContext'
import { formatTsh } from '../../utils/faida'
import type {
  HaliMshahara,
  Mshahara,
  NjiaMalipoMshahara,
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

// Kwa demo, mtumiaji ni Juma Hassan (u1)
const MTUMIAJI_ID = 'u1'
const JINA_MTUMIAJI = 'Juma Hassan'
const NAFASI = 'Muuzaji'
const DUKA = 'Smart Hardware - Kwembe'

export default function MuuzajiMshahara() {
  const {
    mishahara,
    akaunti,
    getAkauntiMsingi,
  } = useMshahara()
  const [selected, setSelected] = useState<Mshahara | null>(null)

  const mishaharaYake = useMemo(
    () => mishahara.filter((m) => m.mtumiajiId === MTUMIAJI_ID),
    [mishahara]
  )

  // Muuzaji anaona akaunti Yake tu (iliyowekwa na mmiliki)
  const akauntiYake = useMemo(
    () => akaunti.filter((a) => a.mtumiajiId === MTUMIAJI_ID),
    [akaunti]
  )

  const akauntiMsingi = getAkauntiMsingi(MTUMIAJI_ID)

  const stats = useMemo(() => {
    const zote = mishaharaYake.length
    const jumlaIliyolipwa = mishaharaYake
      .filter((m) => m.hali === 'imelipwa')
      .reduce((s, m) => s + m.jumla, 0)
    const inayosubiri = mishaharaYake
      .filter((m) => m.hali === 'inasubiri')
      .reduce((s, m) => s + m.jumla, 0)
    const mshaharaWaMwisho = mishaharaYake[0]
    return { zote, jumlaIliyolipwa, inayosubiri, mshaharaWaMwisho }
  }, [mishaharaYake])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet size={24} className="text-brand-600" />
          Mshahara Wangu
        </h1>
        <p className="text-slate-500 text-sm">
          {JINA_MTUMIAJI} - {NAFASI} - {DUKA}
        </p>
      </div>

      {/* Info: Malipo yanaenda kwenye akaunti moja */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-2">
        <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <div className="font-medium text-slate-900">Kumbuka</div>
          <div className="text-slate-500 mt-0.5">
            Mshahara wako unalipwa kwenye akaunti uliyowekwa na mmiliki.
            Kama unataka kubadilisha akaunti, wasiliana na mmiliki.
          </div>
        </div>
      </div>

      {/* Stats 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Mishahara Yote"
          value={String(stats.zote)}
          Icon={FileText}
          accent="brand"
        />
        <StatCard
          label="Iliyolipwa"
          value={formatTsh(stats.jumlaIliyolipwa)}
          Icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Inasubiri"
          value={formatTsh(stats.inayosubiri)}
          Icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Mshahara wa Mwisho"
          value={
            stats.mshaharaWaMwisho
              ? formatTsh(stats.mshaharaWaMwisho.jumla)
              : 'Hakuna'
          }
          Icon={TrendingUp}
          accent="brand"
          sub={stats.mshaharaWaMwisho?.mwezi}
        />
      </div>

      {/* Onyo kama hana akaunti */}
      {!akauntiMsingi && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-amber-900">
              Huna akaunti ya malipo bado
            </div>
            <div className="text-amber-700 mt-0.5">
              Wasiliana na mmiliki ili aweke akaunti yako ya M-Pesa au benki.
              Bila akaunti, mshahara wako hautaingia.
            </div>
          </div>
        </div>
      )}

      {/* Akaunti Yake (read-only, iliyowekwa na mmiliki) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={16} className="text-brand-600" />
          <h2 className="font-semibold text-sm">Akaunti Yangu ya Malipo</h2>
        </div>

        {akauntiYake.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4">
            Hakuna akaunti bado. Wasiliana na mmiliki ili aweke akaunti yako.
          </div>
        ) : (
          <div className="space-y-2">
            {akauntiYake.map((a) => {
              const Icon = a.aina === 'mobile' ? Smartphone : Building2
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-lg border ${
                    a.ndiyoMsingi
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 grid place-items-center text-slate-700 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{a.jina}</span>
                        {a.ndiyoMsingi && (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-600 text-white">
                            Msingi
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {a.namba}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.jinaMmiliki}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mishahara */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-brand-600" />
          <h2 className="font-semibold text-sm">Historia ya Mishahara</h2>
        </div>

        {mishaharaYake.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Hakuna mishahara bado. Mshahara wako utaonekana hapa mmiliki akishaongeza.
          </div>
        ) : (
          <div className="space-y-2">
            {mishaharaYake.map((m) => {
              const hali = HALI_META[m.hali]
              const njia = m.njiaMalipo ? NJIA_META[m.njiaMalipo] : null
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="w-full text-left bg-white rounded-lg border border-slate-200 p-3 hover:border-brand-500 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{m.mwezi}</span>
                          <span
                            className={`text-[10px] uppercase font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${hali.color}`}
                          >
                            <hali.Icon size={10} />
                            {hali.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {m.kipindi}
                        </div>
                        {m.tareheMalipo && (
                          <div className="text-xs text-slate-500">
                            Imelipwa: {m.tareheMalipo}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <div className="text-base font-bold text-slate-900">
                        {formatTsh(m.jumla)}
                      </div>
                      {m.hali === 'inasubiri' && (
                        <div className="text-xs text-amber-700">
                          Inasubiri malipo
                        </div>
                      )}
                    </div>
                  </div>

                  {m.hali === 'imelipwa' && njia && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                      <njia.Icon size={12} className={njia.color} />
                      <span className="font-semibold uppercase">{njia.label}</span>
                      <span className="text-slate-300">-</span>
                      <span className="font-mono">{m.kumbukumbu}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

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
// Detail Modal (read-only)
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
            <div className="font-semibold">{mshahara.mwezi}</div>
            <div className="text-xs text-slate-500">{mshahara.kipindi}</div>
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