import { useState, useMemo } from 'react'
import {
  Search, Plus, Minus, ShoppingCart, Check, Banknote, Smartphone,
  Wallet, X, Loader2, AlertTriangle, User, Store, Receipt,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { iconForKundi } from '../../utils/icons'

type NjiaMalipo = 'cash' | 'mpesa' | 'tigopesa' | 'deni'

export default function MuuzajiPOS() {
  const { bidhaa, wateja, createOrder, ongezaMalipo } = useStore()
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<{ id: string; wingi: number }[]>([])
  const [mtejaId, setMtejaId] = useState(wateja[0]?.id ?? '')
  const [njiaMalipo, setNjiaMalipo] = useState<NjiaMalipo>('cash')
  const [kumbukumbu, setKumbukumbu] = useState('')
  const [payOpen, setPayOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(
    () =>
      bidhaa.filter(
        (b) =>
          b.jina.toLowerCase().includes(q.toLowerCase()) ||
          b.sku.toLowerCase().includes(q.toLowerCase())
      ),
    [bidhaa, q]
  )

  const add = (id: string) =>
    setCart((c) => {
      const ex = c.find((x) => x.id === id)
      return ex
        ? c.map((x) => (x.id === id ? { ...x, wingi: x.wingi + 1 } : x))
        : [...c, { id, wingi: 1 }]
    })

  const inc = (id: string) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, wingi: x.wingi + 1 } : x)))

  const dec = (id: string) =>
    setCart((c) =>
      c
        .map((x) => (x.id === id ? { ...x, wingi: x.wingi - 1 } : x))
        .filter((x) => x.wingi > 0)
    )

  const remove = (id: string) => setCart((c) => c.filter((x) => x.id !== id))
  const clear = () => setCart([])

  const lines = cart.map((c) => {
    const b = bidhaa.find((x) => x.id === c.id)!
    return { ...b, wingi: c.wingi, jumla: b.beiMauzo * c.wingi }
  })
  const total = lines.reduce((s, l) => s + l.jumla, 0)

  const funguaMalipo = () => {
    if (cart.length === 0) return
    setKumbukumbu('')
    setNjiaMalipo('cash')
    setPayOpen(true)
  }

  const kamilisha = () => {
    if (cart.length === 0 || !mtejaId) return
    if ((njiaMalipo === 'mpesa' || njiaMalipo === 'tigopesa') && !kumbukumbu.trim()) {
      setToast('Weka kumbukumbu ya malipo')
      setTimeout(() => setToast(null), 3000)
      return
    }

    setSaving(true)

    setTimeout(() => {
      const order = createOrder({
        mtejaId,
        dukaId: 'd1',
        muuzaji: 'Juma Hassan',
        items: cart,
      })

      if (njiaMalipo === 'cash') {
        ongezaMalipo({
          orderId: order.id,
          njia: 'cash',
          simu: order.simu,
          kumbukumbu: 'CASH',
          kiasi: total,
          hali: 'imethibitishwa',
        })
        setToast(`Order ${order.id} imekamilika (Cash). SMS imetumwa.`)
      } else if (njiaMalipo === 'deni') {
        setToast(`Order ${order.id} imeandikwa kama DENI la ${order.mteja}.`)
      } else {
        ongezaMalipo({
          orderId: order.id,
          njia: njiaMalipo === 'mpesa' ? 'mpesa' : 'tigopesa',
          simu: order.simu,
          kumbukumbu: kumbukumbu.trim().toUpperCase(),
          kiasi: total,
          hali: 'inasubiri',
        })
        setToast(`Order ${order.id} inasubiri uthibitisho wa malipo. Mmiliki atathibitisha.`)
      }

      setSaving(false)
      setCart([])
      setKumbukumbu('')
      setPayOpen(false)
      setTimeout(() => setToast(null), 5000)
    }, 400)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {/* ============ BIDHAA ============ */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            POS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Duka la Kwembe — Muuzaji: Juma Hassan
          </p>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Scan barcode au tafuta bidhaa..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((b) => {
            const c = cart.find((x) => x.id === b.id)?.wingi ?? 0
            const Icon = iconForKundi(b.iconKey)
            return (
              <button
                key={b.id}
                onClick={() => add(b.id)}
                className={`bg-white rounded-2xl border p-4 text-left transition ${
                  c > 0
                    ? 'border-brand-500 ring-2 ring-brand-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
                    {b.pichaUrl ? (
                      <img src={b.pichaUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  {c > 0 && (
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-brand-600 text-white text-xs font-bold">
                      ×{c}
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm mt-3 truncate">{b.jina}</div>
                <div className="text-xs text-slate-500 mt-0.5">{b.sku}</div>
                <div className="text-brand-700 font-bold mt-2 text-lg">
                  {formatTsh(b.beiMauzo)}
                </div>
                <div className="text-xs text-slate-500">
                  Stoki: {b.stoki} {b.uom}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ============ CART ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingCart size={18} className="text-brand-600" />
            Cart
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {cart.length}
            </span>
          </h2>
          {cart.length > 0 && (
            <button onClick={clear} className="text-xs text-red-600 hover:underline">
              Futa Zote
            </button>
          )}
        </div>

        <div className="mb-3">
          <label className="text-xs font-medium text-slate-600 mb-1 block">Mteja</label>
          <select
            value={mtejaId}
            onChange={(e) => setMtejaId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
          >
            {wateja.length === 0 && <option value="">Hakuna wateja</option>}
            {wateja.map((w) => (
              <option key={w.id} value={w.id}>
                {w.jina} — {w.simu}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto divide-y divide-slate-100">
          {lines.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart size={40} className="mx-auto text-slate-300 mb-2" />
              <div className="text-sm text-slate-500">Cart ni tupu</div>
              <div className="text-xs text-slate-400 mt-1">Ongeza bidhaa kuanza</div>
            </div>
          ) : (
            lines.map((l) => (
              <div key={l.id} className="py-3">
                <div className="flex justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.jina}</div>
                    <div className="text-xs text-slate-500">
                      {formatTsh(l.beiMauzo)} / {l.uom}
                    </div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">
                    {formatTsh(l.jumla)}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => dec(l.id)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 grid place-items-center"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{l.wingi}</span>
                  <button
                    onClick={() => inc(l.id)}
                    className="w-7 h-7 rounded-lg bg-brand-600 text-white hover:bg-brand-700 grid place-items-center"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    className="ml-auto p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-slate-600">Jumla</span>
              <span className="text-2xl font-bold text-slate-900">{formatTsh(total)}</span>
            </div>
            <button
              onClick={funguaMalipo}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Kamilisha Malipo
            </button>
          </div>
        )}
      </div>

      {/* ============ MODAL YA MALIPO ============ */}
      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !saving && setPayOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">Kamilisha Malipo</div>
                <div className="text-xs text-slate-500">
                  Jumla: {formatTsh(total)}
                </div>
              </div>
              <button
                onClick={() => !saving && setPayOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Njia ya malipo */}
              <div>
                <label className="text-sm font-medium mb-2 block">Njia ya Malipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'cash', label: 'Cash', Icon: Banknote },
                    { key: 'mpesa', label: 'M-Pesa', Icon: Smartphone },
                    { key: 'tigopesa', label: 'Tigo Pesa', Icon: Smartphone },
                  ] as const).map((n) => (
                    <button
                      key={n.key}
                      onClick={() => setNjiaMalipo(n.key)}
                      className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-medium transition ${
                        njiaMalipo === n.key
                          ? 'bg-brand-50 border-brand-500 text-brand-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <n.Icon size={16} />
                      {n.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setNjiaMalipo('deni')}
                  className={`w-full mt-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition ${
                    njiaMalipo === 'deni'
                      ? 'bg-amber-50 border-amber-500 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Wallet size={16} />
                  Deni (Malipo baadaye)
                </button>
              </div>

              {/* Kumbukumbu — kwa mobile tu */}
              {(njiaMalipo === 'mpesa' || njiaMalipo === 'tigopesa') && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Kumbukumbu ya Malipo <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={kumbukumbu}
                    onChange={(e) => setKumbukumbu(e.target.value.toUpperCase())}
                    placeholder="Mfano: QGR7XK2P9L"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono"
                  />
                  <div className="flex items-start gap-1.5 text-xs text-amber-700 mt-1">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    Weka kumbukumbu halisi kutoka SMS ya mtandao. Mmiliki atathibitisha.
                  </div>
                </div>
              )}

              {/* Info kwa deni */}
              {njiaMalipo === 'deni' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  Order itaandikwa kama DENI. Mteja atalipa baadaye. Mmiliki ataona deni kwenye ripoti.
                </div>
              )}

              {/* Info kwa cash */}
              {njiaMalipo === 'cash' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  Malipo ya cash yanathibitishwa mara moja.
                </div>
              )}

              {/* Info kwa mobile */}
              {(njiaMalipo === 'mpesa' || njiaMalipo === 'tigopesa') && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                  <Smartphone size={14} className="mt-0.5 shrink-0" />
                  Malipo yatasubiri uthibitisho wa mmiliki. Order itakamilika baada ya uthibitisho.
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setPayOpen(false)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 disabled:opacity-50"
                >
                  Ghairi
                </button>
                <button
                  onClick={kamilisha}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Inakamilisha...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Thibitisha
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl max-w-md flex items-center gap-2">
          <Receipt size={16} className="text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  )
}