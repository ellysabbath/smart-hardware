import { useState } from 'react'
import { Users, Phone, MapPin } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiWateja() {
  const { wateja,  deniLaMteja } = useStore()
  const [q, setQ] = useState('')

  const filtered = wateja.filter((m) => m.jina.toLowerCase().includes(q.toLowerCase()) || m.simu.includes(q))

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Users size={26} className="text-brand-600" /> Wateja
      </h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tafuta mteja..."
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => {
          const deni = deniLaMteja(m.id)
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center text-sm font-bold shrink-0">
                  {m.jina.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{m.jina}</div>
                  <div className="text-xs text-slate-500 capitalize">{m.aina}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5"><Phone size={12} /> {m.simu}</div>
                {m.mahali && <div className="flex items-center gap-1.5"><MapPin size={12} /> {m.mahali}</div>}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-500">Manunuzi</div>
                  <div className="font-bold text-brand-700 truncate">{formatTsh(m.jumlaManunuzi)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Deni</div>
                  <div className={`font-bold truncate ${deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatTsh(deni)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}