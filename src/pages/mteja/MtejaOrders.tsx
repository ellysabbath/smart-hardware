
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
} from 'lucide-react'
import type { ElementType } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { Order } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

const HALI_META: Record<
  Order['hali'],
  {
    labelSw: string
    labelEn: string
    tone: string
    Icon: ElementType
  }
> = {
  inasubiri_malipo: {
    labelSw: 'Inasubiri Malipo',
    labelEn: 'Awaiting Payment',
    tone: 'text-amber-600',
    Icon: Clock,
  },
  imekamilika: {
    labelSw: 'Imekamilika',
    labelEn: 'Completed',
    tone: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  imekataliwa: {
    labelSw: 'Imekataliwa',
    labelEn: 'Rejected',
    tone: 'text-red-600',
    Icon: XCircle,
  },
}

export default function MtejaOrders() {
  const navigate = useNavigate()
  const { orders } = useStore()
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {isSwahili ? 'Order Zangu' : 'My Orders'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Fuatilia order zako zote'
              : 'Track all your orders'}
          </p>
        </div>

        <button
          onClick={() => navigate('/mteja/bidhaa')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Package size={16} />
          {isSwahili ? 'Nunua Tena' : 'Shop Again'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingBag
            size={40}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold">
            {isSwahili ? 'Hakuna order bado' : 'No Orders Yet'}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Ukinunua bidhaa na kulipa, order yako itaonekana hapa.'
              : 'Once you purchase products and make payment, your order will appear here.'}
          </p>

          <button
            onClick={() => navigate('/mteja/bidhaa')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
          >
            {isSwahili ? 'Nenda Bidhaa' : 'Browse Products'}
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
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}
                    >
                      <meta.Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {o.id}
                        </span>

                        <span
                          className={`text-[10px] uppercase font-semibold ${meta.tone}`}
                        >
                          {isSwahili ? meta.labelSw : meta.labelEn}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        {o.tarehe} — {o.bidhaa.length}{' '}
                        {isSwahili ? 'bidhaa' : 'products'}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(o.jumla)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-brand-600">
                  {isSwahili ? 'Ona Maelezo' : 'View Details'}
                  <ChevronRight size={14} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
