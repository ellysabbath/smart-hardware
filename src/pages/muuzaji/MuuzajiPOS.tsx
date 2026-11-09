import { useState } from 'react'
import { bidhaa } from '../../data/demo'

export default function MuuzajiPOS() {
  const [cart, setCart] = useState<{ id: string; wingi: number }[]>([])
  const [q, setQ] = useState('')

  const filtered = bidhaa.filter((b) =>
    b.jina.toLowerCase().includes(q.toLowerCase()) || b.sku.toLowerCase().includes(q.toLowerCase())
  )

  const add = (id: string) => {
    setCart((c) => {
      const ex = c.find((x) => x.id === id)
      if (ex) return c.map((x) => (x.id === id ? { ...x, wingi: x.wingi + 1 } : x))
      return [...c, { id, wingi: 1 }]
    })
  }

  const lines = cart.map((c) => {
    const b = bidhaa.find((x) => x.id === c.id)!
    return { ...b, wingi: c.wingi, jumla: b.beiMauzo * c.wingi }
  })
  const total = lines.reduce((s, l) => s + l.jumla, 0)

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">POS - Duka la Kwembe</h1>
          <p className="text-slate-500 text-sm">Muuzaji: Juma Hassan</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Scan barcode au tafuta bidhaa..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-auto max-h-[calc(100vh-14rem)]">
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => add(b.id)}
              className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-brand-500 hover:shadow-sm transition"
            >
              <div className="text-3xl">{b.picha}</div>
              <div className="font-semibold text-sm mt-1">{b.jina}</div>
              <div className="text-xs text-slate-500">{b.sku}</div>
              <div className="text-brand-700 font-bold mt-2">Tsh {b.beiMauzo.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Stoki: {b.stoki}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
        <h2 className="font-semibold mb-3">Cart ({lines.length})</h2>
        <div className="flex-1 overflow-auto divide-y divide-slate-100">
          {lines.length === 0 && <div className="text-sm text-slate-400 text-center py-10">Hakuna bidhaa bado</div>}
          {lines.map((l) => (
            <div key={l.id} className="py-3">
              <div className="flex justify-between">
                <div className="text-sm font-medium">{l.jina}</div>
                <div className="text-sm font-semibold">Tsh {l.jumla.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{l.wingi} {l.uom} × {l.beiMauzo.toLocaleString()}</span>
                <button onClick={() => setCart((c) => c.filter((x) => x.id !== l.id))} className="text-red-500">Ondoa</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Jumla</span>
            <span className="font-bold text-lg">Tsh {total.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Cash</button>
            <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">M-Pesa</button>
            <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Tigo Pesa</button>
            <button className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Deni</button>
          </div>
          <button className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
            ✓ Kamilisha Mauzo
          </button>
        </div>
      </div>
    </div>
  )
}