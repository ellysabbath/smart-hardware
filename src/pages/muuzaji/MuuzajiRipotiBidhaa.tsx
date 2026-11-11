import { useState } from 'react'
import { Package, Plus, X, Save, AlertTriangle, Calendar, RotateCcw, PackageX } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { AinaRipotiBidhaa } from '../../types'

const AINA_META: Record<AinaRipotiBidhaa, { label: string; tone: string; Icon: React.ElementType }> = {
  uharibifu: { label: 'Uharibifu', tone: 'text-red-700', Icon: AlertTriangle },
  expiry: { label: 'Expiry', tone: 'text-amber-700', Icon: Calendar },
  upotevu: { label: 'Upotevu', tone: 'text-orange-700', Icon: PackageX },
  kurudisha_msambazaji: { label: 'Kurudisha', tone: 'text-purple-700', Icon: RotateCcw },
}

export default function MuuzajiRipotiBidhaa() {
  const { bidhaa, ripotiBidhaa, ongezaRipotiBidhaa } = useStore()
  const [open, setOpen] = useState(false)

  const stats = {
    zote: ripotiBidhaa.length,
    uharibifu: ripotiBidhaa.filter((r) => r.aina === 'uharibifu').length,
    expiry: ripotiBidhaa.filter((r) => r.aina === 'expiry').length,
    hasara: ripotiBidhaa
      .filter((r) => ['uharibifu', 'expiry', 'upotevu'].includes(r.aina))
      .reduce((s, r) => s + r.thamani, 0),
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package size={26} className="text-brand-600" /> Ripoti za Bidhaa
          </h1>
          <p className="text-sm text-slate-500 mt-1">Ripoti uharibifu, expiry au upotevu</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto">
          <Plus size={16} /> Ripoti Mpya
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Ripoti Zote" value={String(stats.zote)} Icon={Package} tone="text-blue-600" />
        <Stat label="Uharibifu" value={String(stats.uharibifu)} Icon={AlertTriangle} tone="text-red-600" />
        <Stat label="Expiry" value={String(stats.expiry)} Icon={Calendar} tone="text-amber-600" />
        <Stat label="Jumla ya Hasara" value={formatTsh(stats.hasara)} Icon={PackageX} tone="text-red-600" />
      </div>

      {ripotiBidhaa.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna ripoti</h3>
          <p className="text-sm text-slate-500 mt-1">Bofya "Ripoti Mpya" kuanza.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ripotiBidhaa.map((r) => {
            const meta = AINA_META[r.aina]
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{r.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="text-sm truncate">{r.jina}</div>
                      <div className="text-xs text-slate-500">{r.tarehe}</div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">{r.wingi} {r.uom}</div>
                    <div className="text-xs text-slate-500">{formatTsh(r.thamani)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {open && <Fomu onClose={() => setOpen(false)} onSubmit={ongezaRipotiBidhaa} bidhaa={bidhaa} />}
    </div>
  )
}

function Stat({ label, value, Icon, tone }: { label: string; value: string; Icon: React.ElementType; tone: string }) {
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

function Fomu({ onClose, onSubmit, bidhaa }: { onClose: () => void; onSubmit: any; bidhaa: any[] }) {
  const [bidhaaId, setBidhaaId] = useState('')
  const [aina, setAina] = useState<AinaRipotiBidhaa>('uharibifu')
  const [wingi, setWingi] = useState(0)
  const [sababu, setSababu] = useState('')
  const [error, setError] = useState('')

  const b = bidhaa.find((x) => x.id === bidhaaId)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!b) return setError('Chagua bidhaa')
    if (wingi <= 0) return setError('Wingi lazima uwe zaidi ya 0')
    if (wingi > b.stoki) return setError(`Wingi hauwezi kuzidi ${b.stoki}`)
    if (!sababu.trim()) return setError('Sababu inahitajika')
    onSubmit({
      bidhaaId: b.id, jina: b.jina, sku: b.sku, uom: b.uom, kundi: b.kundi,
      dukaId: 'd1', dukaJina: 'Smart Hardware - Kwembe',
      aina, wingi, beiUnunuzi: b.beiUnunuzi, sababu,
      expiry: b.expiry, mtengenezaji: b.mtengenezaji, uzito: b.uzito,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">Ripoti Bidhaa</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <select value={bidhaaId} onChange={(e) => setBidhaaId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm">
            <option value="">-- Chagua bidhaa --</option>
            {bidhaa.map((x) => <option key={x.id} value={x.id}>{x.jina} ({x.stoki} {x.uom})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(AINA_META) as AinaRipotiBidhaa[]).map((k) => {
              const m = AINA_META[k]
              return (
                <button key={k} type="button" onClick={() => setAina(k)} className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-1.5 ${aina === k ? 'border-brand-500 bg-slate-50 font-semibold' : 'border-slate-200'}`}>
                  <m.Icon size={12} /> {m.label}
                </button>
              )
            })}
          </div>
          <input type="number" value={wingi || ''} onChange={(e) => setWingi(Number(e.target.value))} placeholder="Wingi" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <input value={sababu} onChange={(e) => setSababu(e.target.value)} placeholder="Sababu" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
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