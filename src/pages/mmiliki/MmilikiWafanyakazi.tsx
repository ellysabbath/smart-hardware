import { useState } from 'react'
import { Users, Plus, X, Save, Phone, CheckCircle2, XCircle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import type { NafasiMtumiaji } from '../../types'

const NAFASI: NafasiMtumiaji[] = ['muuzaji', 'mhazini', 'admin', 'mmiliki']

export default function MmilikiWafanyakazi() {
  const { wafanyakazi, ongezaMtumiaji } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Wafanyakazi</h1>
          <p className="text-sm text-slate-500 mt-1">Wafanyakazi wote wa maduka yako</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto">
          <Plus size={16} /> Ongeza
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {wafanyakazi.map((w) => (
          <div key={w.id} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center text-sm font-bold shrink-0">
                {w.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{w.jina}</div>
                <div className="text-xs text-slate-500 capitalize">{w.role}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5"><Phone size={12} /> {w.simu}</div>
              <div className="flex items-center gap-1.5"><Users size={12} /> {w.duka}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              {w.active ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold"><CheckCircle2 size={12} /> Active</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold"><XCircle size={12} /> Imezuiwa</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && <Fomu onClose={() => setOpen(false)} onSubmit={ongezaMtumiaji} />}
    </div>
  )
}

function Fomu({ onClose, onSubmit }: { onClose: () => void; onSubmit: any }) {
  const [jina, setJina] = useState('')
  const [simu, setSimu] = useState('')
  const [role, setRole] = useState<NafasiMtumiaji>('muuzaji')
  const [duka, setDuka] = useState('Kwembe')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim() || !simu.trim()) return setError('Jina na simu vinahitajika')
    onSubmit({ jina, simu, role, duka, active: true })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">Ongeza Mfanyakazi</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <input value={jina} onChange={(e) => setJina(e.target.value)} placeholder="Jina kamili" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <input value={simu} onChange={(e) => setSimu(e.target.value)} placeholder="0754-123-456" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          <div className="grid grid-cols-2 gap-2">
            {NAFASI.filter((n) => n !== 'mmiliki').map((n) => (
              <button key={n} type="button" onClick={() => setRole(n)} className={`px-3 py-2 rounded-lg border text-xs capitalize ${role === n ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold' : 'border-slate-200'}`}>{n}</button>
            ))}
          </div>
          <input value={duka} onChange={(e) => setDuka(e.target.value)} placeholder="Duka" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm" />
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm">Ghairi</button>
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"><Save size={16} /> Hifadhi</button>
          </div>
        </form>
      </div>
    </div>
  )
}