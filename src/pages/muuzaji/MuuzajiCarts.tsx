
import { ShoppingCart } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function MuuzajiCarts() {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <ShoppingCart size={26} className="text-brand-600" />
        {isSwahili ? 'Carts Zinazosubiri' : 'Pending Carts'}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <ShoppingCart size={40} className="mx-auto text-slate-300 mb-3" />

        <h3 className="font-semibold">
          {isSwahili
            ? 'Hakuna cart inayosubiri'
            : 'No pending carts'}
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          {isSwahili
            ? 'Carts zitaonekana hapa mara mteja akiacha order.'
            : 'Carts will appear here when a customer leaves an order.'}
        </p>
      </div>
    </div>
  )
}
