import StatCard from '../../components/StatCard'
import { madeni } from '../../data/demo'
import { Link } from 'react-router-dom'

export default function MtejaHome() {
  const deniLangu = 2500000
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Karibu, Mjenzi Mwakyusa 👋</h1>
        <p className="text-slate-500 text-sm">Hii ni dashboard yako ya manunuzi</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Deni Langu" value={`Tsh ${deniLangu.toLocaleString()}`} sub="Tarehe ya mwisho: 15 Nov 2026" color="red" />
        <StatCard label="Manunuzi Yote" value="Tsh 8,450,000" sub="Tangu Januari 2026" color="brand" />
        <StatCard label="Quotation Hai" value="2" sub="Moja inaisha kesho" color="amber" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/mteja/bidhaa" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 transition">
          <h2 className="font-semibold">🏗️ Nunua Vifaa</h2>
          <p className="text-sm text-slate-500 mt-1">Angalia bidhaa zote na bei</p>
        </Link>
        <Link to="/mteja/deni" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-500 transition">
          <h2 className="font-semibold">💰 Deni Langu</h2>
          <p className="text-sm text-slate-500 mt-1">Ona madeni yako na malipo</p>
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold mb-3">Madeni Yangu</h2>
        <div className="divide-y divide-slate-100">
          {madeni.slice(0, 3).map((d, i) => (
            <div key={i} className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">{d.mteja}</div>
                <div className="text-xs text-slate-500">Tarehe: {d.tareheMwisho}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">Tsh {d.kiasi.toLocaleString()}</div>
                <div className="text-xs text-red-600">{d.hali}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}