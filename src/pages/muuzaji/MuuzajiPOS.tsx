import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { useStore } from '../../store/StoreContext'

export default function MuuzajiPOS() {
  const navigate = useNavigate()
  const { bidhaa, wateja, createOrder, ongezaMalipo, sendSms } = useStore()
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<{ id: string; wingi: number }[]>([])
  const [mtejaId, setMtejaId] = useState(wateja[0]?.id ?? '')
  const [njiaMalipo, setNjiaMalipo] = useState<'cash' | 'mpesa' | 'deni'>('cash')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(
    () => bidhaa.filter((b) =>
      b.jina.toLowerCase().includes(q.toLowerCase()) ||
      b.sku.toLowerCase().includes(q.toLowerCase())
    ),
    [bidhaa, q]
  )

  const add = (id: string) => setCart((c) => {
    const ex = c.find((x) => x.id === id)
    return ex ? c.map((x) => x.id === id ? { ...x, wingi: x.wingi + 1 } : x) : [...c, { id, wingi: 1 }]
  })

  const lines = cart.map((c) => {
    const b = bidhaa.find((x) => x.id === c.id)!
    return { ...b, wingi: c.wingi, jumla: b.beiMauzo * c.wingi }
  })
  const total = lines.reduce((s, l) => s + l.jumla, 0)

  const kamilisha = () => {
    if (cart.length === 0 || !mtejaId) return
    const order = createOrder({
      mtejaId, dukaId: 'd1', muuzaji: 'Juma Hassan', items: cart,
    })
    if (njiaMalipo !== 'deni') {
      ongezaMalipo({
        orderId: order.id,
        njia: njiaMalipo === 'cash' ? 'cash' : 'mpesa',
        simu: order.simu, kumbukumbu: 'CASH', kiasi: total,
        hali: 'imethibitishwa',
      })
    }
    setToast(`Order ${order.id} imekamilika${njiaMalipo === 'deni' ? ' (Deni)' : ''}. SMS imetumwa kwa ${order.simu}`)
    setCart([])
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">POS</h1>
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Tafuta bidhaa..."
          className="w-full px-4 py-3 rounded-xl border outline-none"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[60vh] overflow-auto">
          {filtered.map((b) => (
            <button key={b.id} onClick={() => add(b.id)}
              className="bg-white rounded-xl border p-4 text-left hover:border-brand-500">
              <div className="font-semibold text-sm">{b.jina}</div>
              <div className="text-xs text-slate-500">{b.sku}</div>
              <div className="text-brand-700 font-bold mt-2">Tsh {b.beiMauzo.toLocaleString()}</div>
              <div className="text-xs">Stoki: {b.stoki}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 flex flex-col">
        <h2 className="font-semibold mb-3">Cart ({lines.length})</h2>
        <select value={mtejaId} onChange={(e) => setMtejaId(e.target.value)}
          className="mb-3 px-3 py-2 rounded-lg border text-sm">
          {wateja.map((w) => <option key={w.id} value={w.id}>{w.jina}</option>)}
        </select>
        <div className="flex-1 overflow-auto divide-y">
          {lines.map((l) => (
            <div key={l.id} className="py-2 flex justify-between text-sm">
              <div>
                <div>{l.jina}</div>
                <div className="text-xs text-slate-500">{l.wingi} × {l.beiMauzo.toLocaleString()}</div>
              </div>
              <div className="font-semibold">Tsh {l.jumla.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Jumla</span><span className="font-bold text-lg">Tsh {total.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'mpesa', 'deni'] as const).map((n) => (
              <button key={n} onClick={() => setNjiaMalipo(n)}
                className={`px-2 py-2 rounded-lg text-xs ${njiaMalipo === n ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>
                {n.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={kamilisha}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
            <Check size={16} className="inline mr-1" /> Kamilisha
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg text-sm max-w-xs">
          {toast}
        </div>
      )}
    </div>
  )
}