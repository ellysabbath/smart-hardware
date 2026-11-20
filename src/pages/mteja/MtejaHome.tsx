
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ShoppingBag,
  FileText,
  Package,
  ArrowRight,
} from 'lucide-react'

import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { useLanguage } from '../../i18n/LanguageContext'

export default function MtejaHome() {
  const { orders, wateja, deniLaMteja } = useStore()
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  const mteja = wateja[0]

  const deni = mteja ? deniLaMteja(mteja.id) : 0

  const manunuziYote = useMemo(
    () =>
      orders
        .filter((o) => mteja && o.simu === mteja.simu)
        .reduce((s, o) => s + o.jumla, 0),
    [orders, mteja]
  )

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {isSwahili ? 'Karibu' : 'Welcome'}, {mteja?.jina ?? (isSwahili ? 'Mteja' : 'Customer')} 👋
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {isSwahili
            ? 'Dashibodi yako ya manunuzi'
            : 'Your shopping dashboard'}
        </p>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid md:grid-cols-3 gap-3">

        {/* DEBT */}

        <div className="bg-white rounded-2xl border border-slate-200 p-5">

          <div
            className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${
              deni > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            <Wallet size={18} />
          </div>

          <div className="text-xs text-slate-500 mt-3">
            {isSwahili ? 'Deni Langu' : 'My Debt'}
          </div>

          <div
            className={`text-xl font-bold ${
              deni > 0 ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {formatTsh(deni)}
          </div>

        </div>

        {/* TOTAL PURCHASES */}

        <div className="bg-white rounded-2xl border border-slate-200 p-5">

          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-blue-600">
            <ShoppingBag size={18} />
          </div>

          <div className="text-xs text-slate-500 mt-3">
            {isSwahili ? 'Manunuzi Yote' : 'Total Purchases'}
          </div>

          <div className="text-xl font-bold text-slate-900">
            {formatTsh(manunuziYote)}
          </div>

        </div>

        {/* ORDERS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-5">

          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-brand-600">
            <FileText size={18} />
          </div>

          <div className="text-xs text-slate-500 mt-3">
            {isSwahili ? 'Orders Zote' : 'Total Orders'}
          </div>

          <div className="text-xl font-bold text-slate-900">
            {orders.length}
          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="grid md:grid-cols-2 gap-3">

        {/* BUY PRODUCTS */}

        <Link
          to="/mteja/bidhaa"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 transition group"
        >

          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-brand-600">
            <Package size={18} />
          </div>

          <div className="font-semibold mt-3">
            {isSwahili ? 'Nunua Vifaa' : 'Buy Products'}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            {isSwahili
              ? 'Angalia bidhaa na bei zake'
              : 'Browse products and their prices'}
          </div>

          <div className="mt-3 flex items-center text-xs text-brand-600 font-semibold">

            {isSwahili ? 'Fungua' : 'Open'}

            <ArrowRight
              size={12}
              className="ml-1 group-hover:translate-x-1 transition"
            />

          </div>

        </Link>

        {/* MY DEBT */}

        <Link
          to="/mteja/deni"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 transition group"
        >

          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-amber-600">
            <Wallet size={18} />
          </div>

          <div className="font-semibold mt-3">
            {isSwahili ? 'Deni Langu' : 'My Debt'}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            {isSwahili
              ? 'Angalia madeni na malipo yako'
              : 'View your debts and payments'}
          </div>

          <div className="mt-3 flex items-center text-xs text-brand-600 font-semibold">

            {isSwahili ? 'Fungua' : 'Open'}

            <ArrowRight
              size={12}
              className="ml-1 group-hover:translate-x-1 transition"
            />

          </div>

        </Link>

      </div>

    </div>
  )
}
