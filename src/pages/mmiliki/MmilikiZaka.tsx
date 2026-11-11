import { useMemo, useState } from 'react'
import {
  HandCoins, CheckCircle2, Clock, AlertTriangle, Plus, X, Save,
  Receipt, Wallet, TrendingUp, Calendar,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { MalipoZaka } from '../../types'

export default function MmilikiZaka() {
  const { mauzo, opex, zakaMalipo, rekodiZaka, faida } = useStore()
  const [rekodiOpen, setRekodiOpen] = useState(false)

  const f = useMemo(() => faida(), [mauzo, opex])

  const malipoYote = useMemo(
    () =>
      zakaMalipo.reduce(
        (a, m) => ({
          zaka: a.zaka + (m.aina === 'zaka' ? m.kiasi : 0),
          sadaka: a.sadaka + (m.aina === 'sadaka' ? m.kiasi : 0),
          jumla: a.jumla + m.kiasi,
        }),
        { zaka: 0, sadaka: 0, jumla: 0 }
      ),
    [zakaMalipo]
  )

  const zakaIliyodaiwa = Math.max(f.zaka - malipoYote.zaka, 0)
  const sadakaIliyodaiwa = Math.max(f.sadaka - malipoYote.sadaka, 0)
  const jumlaIliyodaiwa = zakaIliyodaiwa + sadakaIliyodaiwa

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HandCoins size={26} className="text-brand-600" />
            Zaka & Sadaka
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kanuni: 10% Zaka + 10% Sadaka = 20% ya Faida Safi
          </p>
        </div>
        <button
          onClick={() => setRekodiOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Rekodi Malipo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center shrink-0">
              <HandCoins size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Jumla ya Bwana</div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-0.5">
                {formatTsh(f.jumlaYaMungu)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Faida Halisi: {formatTsh(f.faidaSafi)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-200">
          <div>
            <div className="text-xs text-slate-500">Faida Halisi</div>
            <div className="text-lg font-bold text-slate-900">{formatTsh(f.faidaSafi)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Zaka (10%)</div>
            <div className="text-lg font-bold text-brand-700">{formatTsh(f.zaka)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Sadaka (10%)</div>
            <div className="text-lg font-bold text-brand-700">{formatTsh(f.sadaka)}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Salio Lako</div>
            <div className="text-2xl font-bold text-slate-900">{formatTsh(f.inayobaki)}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 grid place-items-center">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ZakaStat label="Zaka Inayodaiwa" value={formatTsh(zakaIliyodaiwa)} Icon={Clock} tone="text-amber-600" />
        <ZakaStat label="Sadaka Inayodaiwa" value={formatTsh(sadakaIliyodaiwa)} Icon={Clock} tone="text-amber-600" />
        <ZakaStat label="Zilizolipwa" value={formatTsh(malipoYote.jumla)} Icon={CheckCircle2} tone="text-emerald-600" />
        <ZakaStat
          label="Jumla Inayodaiwa"
          value={formatTsh(jumlaIliyodaiwa)}
          Icon={AlertTriangle}
          tone={jumlaIliyodaiwa > 0 ? 'text-red-600' : 'text-emerald-600'}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          Malipo Yaliyofanyika ({zakaMalipo.length})
        </h2>
        {zakaMalipo.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">
            Hakuna malipo yaliyorekodiwa bado.
          </div>
        ) : (
          <div className="space-y-2">
            {zakaMalipo.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-emerald-600 grid place-items-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{m.aina === 'zaka' ? 'Zaka' : 'Sadaka'}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {m.risiti}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {m.tarehe} {m.maelezo ? `— ${m.maelezo}` : ''}
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  {formatTsh(m.kiasi)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rekodiOpen && (
        <FomuRekodi onClose={() => setRekodiOpen(false)} onSubmit={rekodiZaka} zakaIliyodaiwa={zakaIliyodaiwa} sadakaIliyodaiwa={sadakaIliyodaiwa} />
      )}
    </div>
  )
}

function ZakaStat({ label, value, Icon, tone }: { label: string; value: string; Icon: React.ElementType; tone: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}

function FomuRekodi({
  onClose, onSubmit, zakaIliyodaiwa, sadakaIliyodaiwa,
}: {
  onClose: () => void
  onSubmit: (d: Omit<MalipoZaka, 'id'>) => MalipoZaka
  zakaIliyodaiwa: number
  sadakaIliyodaiwa: number
}) {
  const [aina, setAina] = useState<'zaka' | 'sadaka'>('zaka')
  const [kiasi, setKiasi] = useState(0)
  const [risiti, setRisiti] = useState('')
  const [maelezo, setMaelezo] = useState('')
  const [tarehe, setTarehe] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya sifuri')
    if (!risiti.trim()) return setError('Risiti inahitajika')
    onSubmit({ tarehe, kiasi, aina, risiti: risiti.toUpperCase(), maelezo: maelezo || undefined })
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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Aina</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(['zaka', 'sadaka'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAina(k)}
                  className={`px-3 py-2.5 rounded-lg border text-sm ${
                    aina === k ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {k === 'zaka' ? 'Zaka' : 'Sadaka'}
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Inayodaiwa: {formatTsh(k === 'zaka' ? zakaIliyodaiwa : sadakaIliyodaiwa)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Kiasi (Tsh)</label>
            <input type="number" value={kiasi || ''} onChange={(e) => setKiasi(Number(e.target.value))} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Tarehe</label>
            <input type="date" value={tarehe} onChange={(e) => setTarehe(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Risiti</label>
            <input value={risiti} onChange={(e) => setRisiti(e.target.value.toUpperCase())} placeholder="RIS-001" className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono" />
          </div>
          <div>
            <label className="text-sm font-medium">Maelezo (hiari)</label>
            <input value={maelezo} onChange={(e) => setMaelezo(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm" />
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200">Ghairi</button>
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
              <Save size={16} /> Rekodi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}