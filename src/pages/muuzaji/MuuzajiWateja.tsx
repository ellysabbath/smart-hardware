import { useState } from 'react'
import {
  UserPlus, Search, Phone, MapPin, Wallet, X, Save,
} from 'lucide-react'
import { useCustomers } from '../../context/CustomerContext'
import type { AinaMteja } from '../../types'

const AINA: { key: AinaMteja; label: string }[] = [
  { key: 'fundi', label: 'Fundi' },
  { key: 'mjenzi', label: 'Mjenzi' },
  { key: 'kampuni', label: 'Kampuni' },
  { key: 'mteja', label: 'Mteja' },
]

export default function MuuzajiWateja() {
  const { wateja, ongezaMteja } = useCustomers()
  const [q, setQ] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [jina, setJina] = useState('')
  const [simu, setSimu] = useState('')
  const [aina, setAina] = useState<AinaMteja>('mteja')
  const [mahali, setMahali] = useState('')

  const filtered = wateja.filter(
    (m) =>
      m.jina.toLowerCase().includes(q.toLowerCase()) ||
      m.simu.includes(q) ||
      m.aina.includes(q.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim() || !simu.trim()) return
    ongezaMteja({ jina, simu, aina, mahali })
    setJina('')
    setSimu('')
    setAina('mteja')
    setMahali('')
    setFormOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Wateja</h1>
          <p className="text-slate-500 text-sm">Sajili na simamia wateja wa duka</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Ongeza Mteja
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Wateja Wote</div>
          <div className="text-xl font-bold">{wateja.length}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Wenye Deni</div>
          <div className="text-xl font-bold text-red-600">
            {wateja.filter((m) => m.deni > 0).length}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Jumla ya Madeni</div>
          <div className="text-sm font-bold text-red-600 truncate">
            Tsh {wateja.reduce((s, m) => s + m.deni, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Manunuzi Yote</div>
          <div className="text-sm font-bold text-brand-700 truncate">
            Tsh {wateja.reduce((s, m) => s + m.jumlaManunuzi, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tafuta kwa jina, simu, au aina..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-bold">
                {m.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{m.jina}</div>
                <div className="text-xs text-slate-500 capitalize">{m.aina}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone size={12} /> {m.simu}
              </div>
              {m.mahali && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} /> {m.mahali}
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-500">Manunuzi</div>
                <div className="font-bold text-brand-700 truncate">
                  Tsh {m.jumlaManunuzi.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Deni</div>
                <div className={`font-bold truncate ${m.deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  Tsh {m.deni.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <div className="font-semibold">Ongeza Mteja Mpya</div>
              <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Jina</label>
                <input
                  value={jina}
                  onChange={(e) => setJina(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Simu</label>
                <input
                  value={simu}
                  onChange={(e) => setSimu(e.target.value)}
                  placeholder="0754-123-456"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Aina</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {AINA.map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => setAina(a.key)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        aina === a.key
                          ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Mahali (hiari)</label>
                <input
                  value={mahali}
                  onChange={(e) => setMahali(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
                >
                  <Save size={16} />
                  Hifadhi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}