import StatCard from '../../components/StatCard'
import { maduka, madeni } from '../../data/demo'

export default function MmilikiDashboard() {
  const jumlaMauzo = maduka.reduce((s, d) => s + d.mauzoLeo, 0)
  const jumlaFaida = maduka.reduce((s, d) => s + d.faidaLeo, 0)
  const deniTotal = madeni.filter((d) => d.hali !== 'imelipwa').reduce((s, d) => s + d.kiasi, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard ya Mmiliki</h1>
        <p className="text-slate-500 text-sm">Muhtasari wa maduka yote leo</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Mauzo Leo" value={`Tsh ${jumlaMauzo.toLocaleString()}`} sub={`Maduka ${maduka.length}`} />
        <StatCard label="Faida Leo" value={`Tsh ${jumlaFaida.toLocaleString()}`} color="green" sub="Kabla ya zaka" />
        <StatCard label="Deni la Kukusanya" value={`Tsh ${deniTotal.toLocaleString()}`} color="red" sub="Wateja 3" />
        <StatCard label="Bidhaa Zinazoisha" value="5" color="amber" sub="Angalia stoki" />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-6">
        <div className="text-sm opacity-90">Kwa Bwana Wiki Hii</div>
        <div className="text-3xl font-bold mt-1">Zaka Tsh 305,000 + Sadaka Tsh 305,000</div>
        <div className="text-lg font-semibold opacity-90 mt-1">Jumla: Tsh 610,000</div>
        <button className="mt-4 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50">
          ✓ Nimelipa
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-3">Mauzo kwa Duka</h2>
          <div className="space-y-3">
            {maduka.map((d) => (
              <div key={d.id}>
                <div className="flex justify-between text-sm">
                  <span>{d.jina}</span>
                  <span className="font-semibold">Tsh {d.mauzoLeo.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${(d.mauzoLeo / 3500000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold mb-3">Wadeni Wakuu</h2>
          <div className="divide-y divide-slate-100">
            {madeni.filter((d) => d.hali !== 'imelipwa').map((d, i) => (
              <div key={i} className="py-2 flex justify-between text-sm">
                <span>{d.mteja}</span>
                <span className="font-semibold">Tsh {d.kiasi.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}