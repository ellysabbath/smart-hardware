import { useMemo, useState } from 'react'
import {
  HandCoins, Calendar, Wallet, CheckCircle2, Clock,
  AlertTriangle, Plus, X, Save, Receipt, Filter,
  TrendingUp, ArrowRight, FileText,
} from 'lucide-react'
import { useMauzo } from '../../context/MauzoContext'
import { useZaka } from '../../context/ZakaContext'
import {
  hesabuZakaKwaKipindi,
  jumlaZaka,
  chujaKwaKipindi,
} from '../../utils/zaka'
import { formatTsh } from '../../utils/faida'
import type { AinaKipindi, MalipoZaka } from '../../types'

const KIPINDI: { key: AinaKipindi; label: string }[] = [
  { key: 'siku', label: 'Siku' },
  { key: 'wiki', label: 'Wiki' },
  { key: 'mwezi', label: 'Mwezi' },
  { key: 'mwaka', label: 'Mwaka' },
]

export default function MmilikiZaka() {
  const { mauzo, opex } = useMauzo()
  const { malipo, rekodiMalipo, futaMalipo } = useZaka()
  const [kipindi, setKipindi] = useState<AinaKipindi>('wiki')
  const [rekodiOpen, setRekodiOpen] = useState(false)

  const vipindiVote = useMemo(
    () => hesabuZakaKwaKipindi(mauzo, opex),
    [mauzo, opex]
  )

  const vipindiVilivyochujwa = useMemo(
    () => chujaKwaKipindi(vipindiVote, kipindi),
    [vipindiVote, kipindi]
  )

  const jumla = useMemo(() => jumlaZaka(vipindiVilivyochujwa), [vipindiVilivyochujwa])

  // Malipo yaliyofanyika
  const malipoYote = useMemo(
    () =>
      malipo.reduce(
        (a, m) => ({
          zaka: a.zaka + (m.aina === 'zaka' ? m.kiasi : 0),
          sadaka: a.sadaka + (m.aina === 'sadaka' ? m.kiasi : 0),
          jumla: a.jumla + m.kiasi,
        }),
        { zaka: 0, sadaka: 0, jumla: 0 }
      ),
    [malipo]
  )

  const zakaIliyodaiwa = jumla.zaka - malipoYote.zaka
  const sadakaIliyodaiwa = jumla.sadaka - malipoYote.sadaka
  const jumlaIliyodaiwa = zakaIliyodaiwa + sadakaIliyodaiwa

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HandCoins size={24} className="text-brand-600" />
            Zaka & Sadaka
          </h1>
          <p className="text-slate-500 text-sm">
            Kanuni: 10% Zaka + 10% Sadaka = 20% ya Faida Safi
          </p>
        </div>
        <button
          onClick={() => setRekodiOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          Rekodi Malipo
        </button>
      </div>

      {/* Chagua kipindi */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Calendar size={14} />
          Kipindi
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {KIPINDI.map((k) => (
            <button
              key={k.key}
              onClick={() => setKipindi(k.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border ${
                kipindi === k.key
                  ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* HERO CARD - Zaka na Sadaka */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm opacity-90">
              Jumla ya Bwana - {KIPINDI.find((k) => k.key === kipindi)?.label}
            </div>
            <div className="text-3xl md:text-4xl font-bold mt-1">
              {formatTsh(jumla.jumlaYaMungu)}
            </div>
            <div className="text-xs opacity-80 mt-1">
              Faida Halisi: {formatTsh(jumla.faida)}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center">
            <HandCoins size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
          <div>
            <div className="text-xs opacity-80">Faida Halisi</div>
            <div className="text-xl font-bold">{formatTsh(jumla.faida)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Zaka (10%)</div>
            <div className="text-xl font-bold">{formatTsh(jumla.zaka)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Sadaka (10%)</div>
            <div className="text-xl font-bold">{formatTsh(jumla.sadaka)}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Salio Lako</div>
              <div className="text-2xl font-bold">{formatTsh(jumla.salioLako)}</div>
            </div>
            <Wallet size={28} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Stats za Malipo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Zaka Inayodaiwa"
          value={formatTsh(Math.max(zakaIliyodaiwa, 0))}
          Icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Sadaka Inayodaiwa"
          value={formatTsh(Math.max(sadakaIliyodaiwa, 0))}
          Icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Zilizolipwa"
          value={formatTsh(malipoYote.jumla)}
          Icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Jumla Inayodaiwa"
          value={formatTsh(Math.max(jumlaIliyodaiwa, 0))}
          Icon={AlertTriangle}
          tone={jumlaIliyodaiwa > 0 ? 'red' : 'emerald'}
        />
      </div>

      {/* Ripoti ya Kila Siku */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Receipt size={18} className="text-brand-600" />
          Ripoti ya Kila Siku - {KIPINDI.find((k) => k.key === kipindi)?.label}
        </h2>

        {vipindiVilivyochujwa.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Hakuna data kwa kipindi hiki
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="py-2">Tarehe</th>
                  <th className="py-2 text-right">Faida Halisi</th>
                  <th className="py-2 text-right">Zaka 10%</th>
                  <th className="py-2 text-right">Sadaka 10%</th>
                  <th className="py-2 text-right">Jumla ya Mungu</th>
                  <th className="py-2 text-right">Salio Lako</th>
                </tr>
              </thead>
              <tbody>
                {vipindiVilivyochujwa.map((v) => (
                  <tr key={v.tarehe} className="border-b border-slate-100">
                    <td className="py-2">{v.tarehe}</td>
                    <td className="py-2 text-right">
                      {v.faidaHalisi.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-brand-600">
                      {v.zaka.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-brand-600">
                      {v.sadaka.toLocaleString()}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {v.jumlaYaMungu.toLocaleString()}
                    </td>
                    <td
                      className={`py-2 text-right font-semibold ${
                        v.salioLako < 0 ? 'text-red-700' : 'text-emerald-700'
                      }`}
                    >
                      {v.salioLako.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300">
                  <td className="py-2 font-bold">JUMLA</td>
                  <td className="py-2 text-right font-bold">
                    {jumla.faida.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-bold text-brand-600">
                    {jumla.zaka.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-bold text-brand-600">
                    {jumla.sadaka.toLocaleString()}
                  </td>
                  <td className="py-2 text-right font-bold">
                    {jumla.jumlaYaMungu.toLocaleString()}
                  </td>
                  <td
                    className={`py-2 text-right font-bold ${
                      jumla.salioLako < 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}
                  >
                    {jumla.salioLako.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Malipo Yaliyofanyika */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Malipo Yaliyofanyika ({malipo.length})
          </h2>
        </div>

        {malipo.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Hakuna malipo yaliyorekodiwa bado. Bofya "Rekodi Malipo".
          </div>
        ) : (
          <div className="space-y-2">
            {malipo.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">
                      {m.aina === 'zaka' ? 'Zaka' : 'Sadaka'}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {m.risiti}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {m.tarehe} {m.maelezo ? `- ${m.maelezo}` : ''}
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-700 whitespace-nowrap">
                  {formatTsh(m.kiasi)}
                </div>
                <button
                  onClick={() => futaMalipo(m.id)}
                  className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
                  aria-label="Futa"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jumla ya Malipo vs Inayodaiwa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-600" />
            Muhtasari wa Zaka
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Zaka Inayodaiwa</span>
              <span className="font-semibold text-red-600">
                {formatTsh(Math.max(zakaIliyodaiwa, 0))}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50">
              <span className="text-slate-600">Zaka Iliyolipwa</span>
              <span className="font-semibold text-emerald-700">
                {formatTsh(malipoYote.zaka)}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-amber-50">
              <span className="text-slate-600">Deni la Zaka</span>
              <span className="font-semibold text-amber-700">
                {formatTsh(Math.max(zakaIliyodaiwa, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <HandCoins size={16} className="text-brand-600" />
            Muhtasari wa Sadaka
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-600">Sadaka Inayodaiwa</span>
              <span className="font-semibold text-red-600">
                {formatTsh(Math.max(sadakaIliyodaiwa, 0))}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50">
              <span className="text-slate-600">Sadaka Iliyolipwa</span>
              <span className="font-semibold text-emerald-700">
                {formatTsh(malipoYote.sadaka)}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-amber-50">
              <span className="text-slate-600">Deni la Sadaka</span>
              <span className="font-semibold text-amber-700">
                {formatTsh(Math.max(sadakaIliyodaiwa, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {rekodiOpen && (
        <FomuRekodiMalipo
          onClose={() => setRekodiOpen(false)}
          onSubmit={rekodiMalipo}
          zakaIliyodaiwa={Math.max(zakaIliyodaiwa, 0)}
          sadakaIliyodaiwa={Math.max(sadakaIliyodaiwa, 0)}
        />
      )}
    </div>
  )
}

// ============================================================
// Fomu ya Kurekodi Malipo
// ============================================================
function FomuRekodiMalipo({
  onClose,
  onSubmit,
  zakaIliyodaiwa,
  sadakaIliyodaiwa,
}: {
  onClose: () => void
  onSubmit: ReturnType<typeof useZaka>['rekodiMalipo']
  zakaIliyodaiwa: number
  sadakaIliyodaiwa: number
}) {
  const [aina, setAina] = useState<'zaka' | 'sadaka'>('zaka')
  const [kiasi, setKiasi] = useState(0)
  const [risiti, setRisiti] = useState('')
  const [maelezo, setMaelezo] = useState('')
  const [tarehe, setTarehe] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya sifuri')
    if (!risiti.trim()) return setError('Namba ya risiti inahitajika')

    setError('')
    onSubmit({
      tarehe,
      kiasi,
      aina,
      risiti: risiti.trim().toUpperCase(),
      maelezo: maelezo.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Rekodi Malipo</div>
            <div className="text-xs text-slate-500">Zaka au Sadaka</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Aina</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setAina('zaka')}
                className={`px-3 py-2.5 rounded-lg border text-sm ${
                  aina === 'zaka'
                    ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                Zaka
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Inayodaiwa: {formatTsh(zakaIliyodaiwa)}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAina('sadaka')}
                className={`px-3 py-2.5 rounded-lg border text-sm ${
                  aina === 'sadaka'
                    ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sadaka
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Inayodaiwa: {formatTsh(sadakaIliyodaiwa)}
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Kiasi (Tsh)</label>
            <input
              type="number"
              value={kiasi || ''}
              onChange={(e) => setKiasi(Number(e.target.value))}
              placeholder="50000"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tarehe</label>
            <input
              type="date"
              value={tarehe}
              onChange={(e) => setTarehe(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Namba ya Risiti</label>
            <input
              value={risiti}
              onChange={(e) => setRisiti(e.target.value.toUpperCase())}
              placeholder="RIS-001"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Maelezo (hiari)</label>
            <input
              value={maelezo}
              onChange={(e) => setMaelezo(e.target.value)}
              placeholder="Mfano: Zaka ya wiki ya 1 Nov"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
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
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              <Save size={16} />
              Rekodi Malipo
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