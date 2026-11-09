const risiti = [
  { id: 'R-2026-0145', mteja: 'Mjenzi Mwakyusa', kiasi: 2500000, njia: 'Split (Cash+M-Pesa)', saa: '09:14' },
  { id: 'R-2026-0146', mteja: 'Mteja wa Kawaida', kiasi: 185000, njia: 'M-Pesa', saa: '09:47' },
  { id: 'R-2026-0147', mteja: 'Fundi Joseph', kiasi: 480000, njia: 'Cash', saa: '10:22' },
]

export default function MuuzajiRisiti() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Risiti za Leo</h1>
        <p className="text-slate-500 text-sm">Duka la Kwembe • 09 Nov 2026</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y">
        {risiti.map((r) => (
          <div key={r.id} className="p-5 flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.id}</div>
              <div className="text-sm text-slate-500">{r.mteja} • {r.saa}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">Tsh {r.kiasi.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{r.njia}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">Cash</div><div className="text-xl font-bold">Tsh 480,000</div></div>
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">M-Pesa</div><div className="text-xl font-bold">Tsh 435,000</div></div>
        <div className="bg-white rounded-xl border p-5"><div className="text-xs text-slate-500">Deni</div><div className="text-xl font-bold">Tsh 2,500,000</div></div>
      </div>
    </div>
  )
}