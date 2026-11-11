import { ShoppingCart } from 'lucide-react'

export default function MuuzajiCarts() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <ShoppingCart size={26} className="text-brand-600" /> Carts Zinazosubiri
      </h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <ShoppingCart size={40} className="mx-auto text-slate-300 mb-3" />
        <h3 className="font-semibold">Hakuna cart inayosubiri</h3>
        <p className="text-sm text-slate-500 mt-1">Carts zitaonekana hapa mara mteja akiacha order.</p>
      </div>
    </div>
  )
}