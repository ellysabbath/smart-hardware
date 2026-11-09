import { useState } from 'react'
import {
  X,
  Smartphone,
  Banknote,
  Building2,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { Malipo, NjiaMalipo } from '../types'
import { NJIA_MALIPO } from '../data/demo'

interface PaymentModalProps {
  open: boolean
  jumla: number
  onClose: () => void
  onSuccess: (malipo: Malipo) => void
}

const NJIA_ICONS: Record<NjiaMalipo, React.ElementType> = {
  mpesa: Smartphone,
  tigopesa: Smartphone,
  airtel: Smartphone,
  halopesa: Smartphone,
  cash: Banknote,
  benki: Building2,
}

export default function PaymentModal({
  open,
  jumla,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [njia, setNjia] = useState<NjiaMalipo>('mpesa')
  const [simu, setSimu] = useState('')
  const [kumbukumbu, setKumbukumbu] = useState('')
  const [kiasi, setKiasi] = useState(jumla)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const isMobile = njia !== 'cash' && njia !== 'benki'

  const validate = (): string => {
    if (kiasi <= 0) return 'Kiasi kinapaswa kuwa zaidi ya sifuri'
    if (kiasi > jumla) return 'Kiasi hakiwezi kuzidi jumla'
    if (isMobile) {
      if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, ''))) {
        return 'Weka namba sahihi ya simu (mfano: 0754-123-456)'
      }
      if (kumbukumbu.trim().length < 6) {
        return 'Kumbukumbu namba iwe angalau herufi/namba 6'
      }
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setLoading(true)

    setTimeout(() => {
      const malipo: Malipo = {
        id: `M-${Date.now()}`,
        njia,
        simu: isMobile ? simu : 'Cash / Benki',
        kumbukumbu: isMobile ? kumbukumbu.trim().toUpperCase() : 'CASH',
        kiasi,
        tarehe: new Date().toLocaleString('sw-TZ'),
        hali: 'imethibitishwa',
      }
      onSuccess(malipo)
      setLoading(false)
      setSimu('')
      setKumbukumbu('')
      setKiasi(jumla)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">Lipa kwa Namba ya Simu</div>
            <div className="text-xs text-slate-500">
              Jumla: Tsh {jumla.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Funga"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Njia ya Malipo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {NJIA_MALIPO.map((n) => {
                const Icon = NJIA_ICONS[n.key]
                const active = njia === n.key
                return (
                  <button
                    key={n.key}
                    type="button"
                    onClick={() => setNjia(n.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    {n.label}
                  </button>
                )
              })}
            </div>
          </div>

          {isMobile && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Namba ya Simu ya Mlipaji
                </label>
                <input
                  value={simu}
                  onChange={(e) => setSimu(e.target.value)}
                  placeholder="0754-123-456"
                  inputMode="tel"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Kumbukumbu Namba (Transaction ID)
                </label>
                <input
                  value={kumbukumbu}
                  onChange={(e) => setKumbukumbu(e.target.value.toUpperCase())}
                  placeholder="Mfano: QGR7XK2P9L"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono tracking-wide"
                />
                <div className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                  Utapata kumbukumbu hii kwenye SMS ya malipo kutoka kwa mtandao wako.
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Kiasi Unacholipa (Tsh)
            </label>
            <input
              type="number"
              value={kiasi}
              onChange={(e) => setKiasi(Number(e.target.value))}
              max={jumla}
              min={1}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setKiasi(jumla)}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
              >
                Lipa Zote
              </button>
              <button
                type="button"
                onClick={() => setKiasi(Math.floor(jumla / 2))}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
              >
                Nusu
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 order-2 sm:order-1"
            >
              Ghairi
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Inathibitisha...
                </>
              ) : (
                <>
                  <Check size={16} />
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