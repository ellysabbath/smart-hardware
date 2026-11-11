import { useMemo, useState } from 'react'
import {
  Wallet, AlertTriangle, CheckCircle2, Loader2,
  Banknote, Smartphone, X, Receipt, ChevronRight,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { NjiaMalipo } from '../../types'

type NjiaMalipoDeni = 'mpesa' | 'tigopesa' | 'cash'

const NJIA_META: Record<
  NjiaMalipoDeni,
  { label: string; Icon: React.ElementType; tone: string }
> = {
  cash: { label: 'Cash', Icon: Banknote, tone: 'text-emerald-600' },
  mpesa: { label: 'M-Pesa', Icon: Smartphone, tone: 'text-brand-600' },
  tigopesa: { label: 'Tigo Pesa', Icon: Smartphone, tone: 'text-orange-600' },
}

export default function MtejaDeni() {
  const { orders, malipo, wateja, deniLaMteja, ongezaMalipo } = useStore()
  const mteja = wateja[0]
  const [payOpen, setPayOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const deni = useMemo(
    () => (mteja ? deniLaMteja(mteja.id) : 0),
    [mteja, orders, malipo]
  )

  if (!mteja) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
        Hakuna mteja
      </div>
    )
  }

  const ordersZake = orders
    .filter((o) => o.simu === mteja.simu)
    .map((o) => {
      const jumlaIlipwa = o.malipo
        .filter((m) => m.hali === 'imethibitishwa')
        .reduce((s, m) => s + m.kiasi, 0)
      const baki = o.jumla - jumlaIlipwa
      return { ...o, jumlaIlipwa, baki }
    })

  const ordersZenyeDeni = ordersZake.filter((o) => o.baki > 0)

  const funguaMalipo = (orderId?: string) => {
    setSelectedOrder(orderId ?? null)
    setPayOpen(true)
  }

  const handleSuccess = (msg: string, ok: boolean) => {
    setPayOpen(false)
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 5000)
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
        Deni Langu
      </h1>

      {/* ============ DENI LA SASA ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 grid place-items-center ${
                deni > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              <Wallet size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Deni la Sasa</div>
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  deni > 0 ? 'text-red-700' : 'text-emerald-700'
                }`}
              >
                {formatTsh(deni)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {deni > 0
                  ? 'Tafadhali lipa deni lako'
                  : 'Hauna deni — umelipa yote'}
              </div>
            </div>
          </div>

          {deni > 0 && (
            <button
              onClick={() => funguaMalipo()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition self-start sm:self-auto"
            >
              <Banknote size={16} />
              Lipa Deni
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ============ ORDERS ZANGU ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Orders Zangu ({ordersZake.length})</h2>
          {ordersZenyeDeni.length > 0 && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
              {ordersZenyeDeni.length} zina deni
            </span>
          )}
        </div>

        {ordersZake.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Hakuna order bado
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ordersZake.map((o) => {
              const baki = o.baki
              return (
                <div key={o.id} className="py-3 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${
                      baki > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {baki > 0 ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{o.id}</div>
                    <div className="text-xs text-slate-500">{o.tarehe}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {formatTsh(o.jumla)}
                    </div>
                    {baki > 0 ? (
                      <div className="text-xs text-amber-700">
                        Baki: {formatTsh(baki)}
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-700">Imelipwa</div>
                    )}
                  </div>
                  {baki > 0 && (
                    <button
                      onClick={() => funguaMalipo(o.id)}
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 shrink-0"
                    >
                      <Banknote size={12} />
                      Lipa
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ============ MODAL YA MALIPO ============ */}
      {payOpen && (
        <MalipoDeniModal
          mtejaId={mteja.id}
          selectedOrder={selectedOrder}
          orders={ordersZenyeDeni}
          onClose={() => setPayOpen(false)}
          onSuccess={handleSuccess}
          ongezaMalipo={ongezaMalipo}
        />
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-md ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Modal ya Malipo ya Deni
// ============================================================
function MalipoDeniModal({
  mtejaId,
  selectedOrder,
  orders,
  onClose,
  onSuccess,
  ongezaMalipo,
}: {
  mtejaId: string
  selectedOrder: string | null
  orders: ReturnType<typeof useStore>['orders']
  onClose: () => void
  onSuccess: (msg: string, ok: boolean) => void
  ongezaMalipo: ReturnType<typeof useStore>['ongezaMalipo']
}) {
  const [njia, setNjia] = useState<NjiaMalipoDeni>('mpesa')
  const [kiasi, setKiasi] = useState(0)
  const [kumbukumbu, setKumbukumbu] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const order = selectedOrder ? orders.find((o) => o.id === selectedOrder) : null
  const jumlaBaki = order
    ? order.jumla -
      order.malipo
        .filter((m) => m.hali === 'imethibitishwa')
        .reduce((s, m) => s + m.kiasi, 0)
    : orders.reduce(
        (s, o) =>
          s +
          (o.jumla -
            o.malipo
              .filter((m) => m.hali === 'imethibitishwa')
              .reduce((a, m) => a + m.kiasi, 0)),
        0
      )

  const [initialized, setInitialized] = useState(false)
  if (!initialized && jumlaBaki > 0) {
    setKiasi(jumlaBaki)
    setInitialized(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!mtejaId) return setError('Mteja haipo')
    if (kiasi <= 0) return setError('Kiasi lazima kiwe zaidi ya sifuri')
    if (kiasi > jumlaBaki) return setError('Kiasi hakiwezi kuzidi baki')

    if (njia !== 'cash' && !kumbukumbu.trim()) {
      return setError('Weka kumbukumbu ya malipo (reference)')
    }

    setSaving(true)

    setTimeout(() => {
      try {
        if (order) {
          ongezaMalipo({
            orderId: order.id,
            njia: njia as NjiaMalipo,
            simu: order.simu,
            kumbukumbu: njia === 'cash' ? 'CASH' : kumbukumbu.trim().toUpperCase(),
            kiasi,
            hali: njia === 'cash' ? 'imethibitishwa' : 'inasubiri',
          })
        } else {
          let remaining = kiasi
          const sorted = [...orders].sort((a, b) => {
            const aBaki =
              a.jumla -
              a.malipo
                .filter((m) => m.hali === 'imethibitishwa')
                .reduce((s, m) => s + m.kiasi, 0)
            const bBaki =
              b.jumla -
              b.malipo
                .filter((m) => m.hali === 'imethibitishwa')
                .reduce((s, m) => s + m.kiasi, 0)
            return aBaki - bBaki
          })

          for (const o of sorted) {
            if (remaining <= 0) break
            const bakiOrder =
              o.jumla -
              o.malipo
                .filter((m) => m.hali === 'imethibitishwa')
                .reduce((s, m) => s + m.kiasi, 0)
            if (bakiOrder <= 0) continue
            const malipoKiasi = Math.min(remaining, bakiOrder)
            ongezaMalipo({
              orderId: o.id,
              njia: njia as NjiaMalipo,
              simu: o.simu,
              kumbukumbu:
                njia === 'cash' ? 'CASH' : kumbukumbu.trim().toUpperCase(),
              kiasi: malipoKiasi,
              hali: njia === 'cash' ? 'imethibitishwa' : 'inasubiri',
            })
            remaining -= malipoKiasi
          }
        }

        setSaving(false)
        const msg =
          njia === 'cash'
            ? `Malipo ya ${formatTsh(kiasi)} yamekamilika (Cash)`
            : `Malipo ya ${formatTsh(kiasi)} yamewasilishwa. Yanasubiri uthibitisho wa duka.`
        onSuccess(msg, true)
      } catch {
        setSaving(false)
        onSuccess('Imeshindwa kukamilisha malipo', false)
      }
    }, 500)
  }

  // ✅ Tumia njiaMeta kwenye UI — badge ya header
  const njiaMeta = NJIA_META[njia]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !saving && onClose()}
      />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <Banknote size={16} className="text-brand-600" />
              Lipa Deni
            </div>
            <div className="text-xs text-slate-500">
              {order ? `Order ${order.id}` : `Orders ${orders.length} zenye deni`}
            </div>
            {/* ✅ Badge ya njia iliyochaguliwa */}
            <div
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 bg-slate-50 border border-slate-200 ${njiaMeta.tone}`}
            >
              <njiaMeta.Icon size={10} />
              {njiaMeta.label}
            </div>
          </div>
          <button
            onClick={() => !saving && onClose()}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Baki */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Baki ya Kulipa</div>
            <div className="text-2xl font-bold text-red-700 mt-0.5">
              {formatTsh(jumlaBaki)}
            </div>
          </div>

          {/* Njia */}
          <div>
            <label className="text-sm font-medium mb-2 block">Njia ya Malipo</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(NJIA_META) as NjiaMalipoDeni[]).map((k) => {
                const meta = NJIA_META[k]
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setNjia(k)}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-medium transition ${
                      njia === k
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <meta.Icon size={16} className={meta.tone} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Kiasi */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Kiasi Unacholipa (Tsh)
            </label>
            <input
              type="number"
              value={kiasi || ''}
              onChange={(e) => setKiasi(Number(e.target.value))}
              max={jumlaBaki}
              min={1}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setKiasi(jumlaBaki)}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 font-medium"
              >
                Lipa Yote
              </button>
              <button
                type="button"
                onClick={() => setKiasi(Math.floor(jumlaBaki / 2))}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 font-medium"
              >
                Nusu
              </button>
            </div>
          </div>

          {/* Kumbukumbu — kwa mobile tu */}
          {njia !== 'cash' && (
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
                Weka kumbukumbu halisi kutoka SMS ya mtandao
              </div>
            </div>
          )}

          {/* Info kwa cash */}
          {njia === 'cash' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              Malipo ya cash yanathibitishwa mara moja
            </div>
          )}

          {/* Info kwa mobile */}
          {njia !== 'cash' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
              <Smartphone size={14} className="mt-0.5 shrink-0" />
              Malipo yatasubiri uthibitisho wa duka. Deni litapungua baada ya uthibitisho.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => !saving && onClose()}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 disabled:opacity-50"
            >
              Ghairi
            </button>
            <button
              type="submit"
              disabled={saving || jumlaBaki <= 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Inakamilisha...
                </>
              ) : (
                <>
                  <Receipt size={16} />
                  Thibitisha Malipo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}