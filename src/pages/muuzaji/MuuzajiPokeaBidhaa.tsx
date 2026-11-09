import { useState } from 'react'
import {
  Truck, Plus, Minus, Check, AlertTriangle, Package,
  Save, FileText, X,
} from 'lucide-react'
import { useGRN } from '../../context/GRNContext'
import { iconForKundi } from '../../utils/icons'
import { bidhaa } from '../../data/demo'
import type { GRNItem } from '../../types'

export default function MuuzajiPokeaBidhaa() {
  const { grns, pokeaBidhaa } = useGRN()
  const [selected, setSelected] = useState<string | null>(null)

  const grn = grns.find((g) => g.id === selected)

  if (!grn) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Pokea Bidhaa (GRN)</h1>
          <p className="text-slate-500 text-sm">Mizigo inayosubiri kupokelewa</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Inasubiri</div>
            <div className="text-xl font-bold mt-1">
              {grns.filter((g) => g.hali === 'inasubiri').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Zimepokelewa</div>
            <div className="text-xl font-bold mt-1 text-emerald-600">
              {grns.filter((g) => g.hali === 'imepokelewa').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Upungufu</div>
            <div className="text-xl font-bold mt-1 text-amber-600">
              {grns.filter((g) => g.hali === 'upungufu').length}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {grns.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-500 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-600 grid place-items-center shrink-0">
                  <Truck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{g.id}</span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${
                        g.hali === 'imepokelewa'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : g.hali === 'upungufu'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {g.hali === 'imepokelewa' && 'Imepokelewa'}
                      {g.hali === 'upungufu' && 'Upungufu'}
                      {g.hali === 'inasubiri' && 'Inasubiri'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {g.msambazaji} - {g.tarehe} - LPO {g.lpoId}
                  </div>
                </div>
                <div className="text-xs text-slate-500 hidden sm:block">
                  {g.bidhaa.length} bidhaa
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const jumlaIliyoagizwa = grn.bidhaa.reduce((s, b) => s + b.iliyoagizwa, 0)
  const jumlaIliyopokelewa = grn.bidhaa.reduce((s, b) => s + b.iliyopokelewa, 0)
  const upungufu = jumlaIliyoagizwa - jumlaIliyopokelewa

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelected(null)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{grn.id}</h1>
          <p className="text-slate-500 text-sm">
            {grn.msambazaji} - LPO {grn.lpoId}
          </p>
        </div>
      </div>

      {upungufu > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>
            Upungufu wa bidhaa {upungufu} - hakikisha umeandika sababu.
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold mb-3">Bidhaa Zilizoagizwa</h2>
        <div className="space-y-3">
          {grn.bidhaa.map((item, idx) => {
            const b = bidhaa.find((x) => x.id === item.bidhaaId)
            const Icon = iconForKundi(b?.iconKey)
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 grid place-items-center">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.jina}</div>
                    <div className="text-xs text-slate-500">{item.sku}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Iliyoagizwa</div>
                    <div className="font-semibold">
                      {item.iliyoagizwa} {item.uom}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Iliyopokelewa</div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (item.iliyopokelewa <= 0) return
                          const newItems = grn.bidhaa.map((x, i) =>
                            i === idx
                              ? { ...x, iliyopokelewa: x.iliyopokelewa - 1 }
                              : x
                          )
                          pokeaBidhaa(grn.id, newItems)
                        }}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.iliyopokelewa}
                      </span>
                      <button
                        onClick={() => {
                          const newItems = grn.bidhaa.map((x, i) =>
                            i === idx
                              ? { ...x, iliyopokelewa: x.iliyopokelewa + 1 }
                              : x
                          )
                          pokeaBidhaa(grn.id, newItems)
                        }}
                        className="w-6 h-6 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 grid place-items-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-50 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Jumla Iliyoagizwa</span>
            <span className="font-semibold">{jumlaIliyoagizwa}</span>
          </div>
          <div className="flex justify-between">
            <span>Jumla Iliyopokelewa</span>
            <span className="font-semibold text-emerald-700">
              {jumlaIliyopokelewa}
            </span>
          </div>
          {upungufu > 0 && (
            <div className="flex justify-between border-t border-slate-200 pt-1">
              <span>Upungufu</span>
              <span className="font-bold text-amber-700">{upungufu}</span>
            </div>
          )}
        </div>

        <button className="mt-4 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 inline-flex items-center justify-center gap-2">
          <Check size={16} />
          Thibitisha Kupokea
        </button>
      </div>
    </div>
  )
}