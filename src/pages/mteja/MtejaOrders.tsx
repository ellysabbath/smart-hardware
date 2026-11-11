import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronRight, CheckCircle2, Clock, XCircle, Package } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { Order } from '../../types'

const HALI_META: Record<Order['hali'], { label: string; tone: string; Icon: React.ElementType }> = {
  inasubiri_malipo: { label: 'Inasubiri Malipo', tone: 'text-amber-600', Icon: Clock },
  imekamilika: { label: 'Imekamilika', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-600', Icon: XCircle },
}

export default function MtejaOrders() {
  const navigate = useNavigate()
  const { orders } = useStore()

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Order Zangu</h1>
          <p className="text-sm text-slate-500 mt-1">Fuatilia orders zako zote</p>
        </div>
        <button onClick={() => navigate('/mteja/bidhaa')} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto">
          <Package size={16} /> Nunua Tena
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna order bado</h3>
          <p className="text-sm text-slate-500 mt-1">Ukinunua bidhaa na kulipa, order yako itaonekana hapa.</p>
          <button onClick={() => navigate('/mteja/bidhaa')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">
            Nenda Bidhaa
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const meta = HALI_META[o.hali]
            return (
              <button
                key={o.id}
                onClick={() => navigate(`/mteja/order/${o.id}`)}
                className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-brand-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{o.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{o.tarehe} — {o.bidhaa.length} bidhaa</div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">{formatTsh(o.jumla)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-brand-600">
                  Ona Maelezo <ChevronRight size={14} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}