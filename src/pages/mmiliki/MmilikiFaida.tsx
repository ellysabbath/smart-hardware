import { faidaVipindi } from '../../data/demo'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function MmilikiFaida() {
  const jumla = faidaVipindi.reduce(
    (a, f) => ({
      mauzo: a.mauzo + f.mauzo,
      manunuzi: a.manunuzi + f.manunuzi,
      gharama: a.gharama + f.gharama,
      faida: a.faida + f.faidaHalisi,
    }),
    { mauzo: 0, manunuzi: 0, gharama: 0, faida: 0 }
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Faida / Hasara</h1>
        <p className="text-slate-500 text-sm">Wiki ya 01 - 07 Nov 2026</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">Mauzo</div><div className="text-xl font-bold">Tsh {jumla.mauzo.toLocaleString()}</div></div>
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">Manunuzi</div><div className="text-xl font-bold">Tsh {jumla.manunuzi.toLocaleString()}</div></div>
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">Gharama</div><div className="text-xl font-bold">Tsh {jumla.gharama.toLocaleString()}</div></div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5"><div className="text-xs text-emerald-700">Faida Halisi</div><div className="text-xl font-bold text-emerald-700">Tsh {jumla.faida.toLocaleString()}</div></div>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-4">Chati ya Faida (Siku 7)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={faidaVipindi}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="tarehe" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => `Tsh ${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="faidaHalisi" stroke="#2563eb" strokeWidth={2} name="Faida" />
            <Line type="monotone" dataKey="mauzo" stroke="#10b981" strokeWidth={2} name="Mauzo" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Tarehe</th>
              <th className="p-3 text-right">Mauzo</th>
              <th className="p-3 text-right">Manunuzi</th>
              <th className="p-3 text-right">Gharama</th>
              <th className="p-3 text-right">Faida Halisi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faidaVipindi.map((f) => (
              <tr key={f.tarehe}>
                <td className="p-3">{f.tarehe}</td>
                <td className="p-3 text-right">{f.mauzo.toLocaleString()}</td>
                <td className="p-3 text-right">{f.manunuzi.toLocaleString()}</td>
                <td className="p-3 text-right">{f.gharama.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold text-emerald-600">{f.faidaHalisi.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}