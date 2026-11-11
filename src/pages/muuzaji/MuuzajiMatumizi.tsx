import { useState } from 'react'
import { Wallet, Plus, X, Save, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { AinaGharama } from '../../types'

const AINA_GHARAMA: { key: AinaGharama; label: string }[] = [
  { key: 'mafuta', label: 'Mafuta' },
  { key: 'chakula', label: 'Chakula' },
  { key: 'usafiri', label: 'Usafiri' },
  { key: 'matengenezo', label: 'Matengenezo' },
  { key: 'vifaa', label: 'Vifaa' },
  { key: 'nyingine', label: 'Nyingine' },
]

const HALI_META: Record<string, { label: string; tone: string; Icon: React.ElementType }> = {
  inasubiri: { label: 'Inasubiri', tone: 'text-amber-600', Icon: Clock },
  imekubaliwa: { label: 'Imekubaliwa', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-600', Icon: XCircle },
}

export default function MuuzajiMatumizi() {
  const { maombi, ongezaOmbi } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet size={26} className="text-brand-600" /> Maombi ya Matumizi
          </h1>
          <p className="text-sm text-slate-500 mt-1">Omba matumizi — Mmiliki ataidhinisha</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto">
          <Plus size={16} /> Omba Matumizi
        </button>
      </div>

      {maombi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna maombi</h3>
          <p className="text-sm text-slate-500 mt-1">Bofya "Omba Matumizi" kuanza.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {maombi.map((m) => {
            const meta = HALI_META[m.hali]
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{m.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 truncate">{m.maelezo}</div>
                      <div className="text-xs text-slate-500">{m.tarehe}</div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">{formatTsh(m.kiasi)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {open && <Fomu onClose={() => setOpen(false)} onSubmit={ongezaOmbi} />}
    </div>
  )
}

function Fomu({ onClose, onSubmit }: { onClose: () => void; onSubmit: any }) {
  const [aina, setAina] = useState<AinaGharama>('mafuta')
  const [kiasi, setKiasi] = useState(0)
  const [maelezo, setMaelezo] = useState('')
  const [sababu, setSababu] = useState('')
  const [simu, setSimu] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya 0')
    if (!maelezo.trim()) return setError('Maelezo yanahitajika')
    if (!sababu.trim()) return setError('Sababu inahitajika')
    if (!simu.trim()) return setError('Simu inahitajika')
    onSubmit({
      aina, kiasi, maelezo, sababu, simu,
      aliyeomba: 'Juma Hassan', duka: 'Kwembe',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">Omba Matumizi</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <select value={aina} onChange={(e) => setAina(e.target.value as AinaGharama)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm">
            {AINA_GHARAMA.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
          <input type="number" value={kiasi || ''} onChange={(e) => setKiasi(Number(e.target.value))} placeholder="Kiasi" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <input value={maelezo} onChange={(e) => setMaelezo(e.target.value)} placeholder="Maelezo" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <input value={simu} onChange={(e) => setSimu(e.target.value)} placeholder="Simu" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <textarea value={sababu} onChange={(e) => setSababu(e.target.value)} placeholder="Sababu" rows={2} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm resize-none" />
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm">Ghairi</button>
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold"><Save size={16} /> Tuma</button>
          </div>
        </form>
      </div>
    </div>
  )
}