import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, ShoppingBag, FileText, Package, ArrowRight } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MtejaHome() {
  const { orders, wateja, deniLaMteja } = useStore()
  const mteja = wateja[0]
  const deni = mteja ? deniLaMteja(mteja.id) : 0
  const manunuziYote = useMemo(
    () => orders.filter((o) => mteja && o.simu === mteja.simu).reduce((s, o) => s + o.jumla, 0),
    [orders, mteja]
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Karibu, {mteja?.jina ?? 'Mteja'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Dashboard yako ya manunuzi</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            <Wallet size={18} />
          </div>
          <div className="text-xs text-slate-500 mt-3">Deni Langu</div>
          <div className={`text-xl font-bold ${deni > 0 ? 'text-red-700' : 'text-emerald-700'}`}>{formatTsh(deni)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-blue-600">
            <ShoppingBag size={18} />
          </div>
          <div className="text-xs text-slate-500 mt-3">Manunuzi Yote</div>
          <div className="text-xl font-bold text-slate-900">{formatTsh(manunuziYote)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-brand-600">
            <FileText size={18} />
          </div>
          <div className="text-xs text-slate-500 mt-3">Orders</div>
          <div className="text-xl font-bold text-slate-900">{orders.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Link to="/mteja/bidhaa" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 transition group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-brand-600">
            <Package size={18} />
          </div>
          <div className="font-semibold mt-3">Nunua Vifaa</div>
          <div className="text-xs text-slate-500 mt-1">Angalia bidhaa na bei</div>
          <div className="mt-3 flex items-center text-xs text-brand-600 font-semibold">
            Fungua <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition" />
          </div>
        </Link>
        <Link to="/mteja/deni" className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 transition group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-amber-600">
            <Wallet size={18} />
          </div>
          <div className="font-semibold mt-3">Deni Langu</div>
          <div className="text-xs text-slate-500 mt-1">Ona madeni na malipo</div>
          <div className="mt-3 flex items-center text-xs text-brand-600 font-semibold">
            Fungua <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>
    </div>
  )
}