import { madeni } from '../../data/demo'
import Badge from '../../components/Badge'

export default function MtejaDeni() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Deni Langu</h1>
        <p className="text-slate-500 text-sm">Historia ya madeni na malipo</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y">
        {madeni.map((d, i) => (
          <div key={i} className="p-5 flex justify-between items-start">
            <div>
              <div className="font-semibold">{d.mteja}</div>
              <div className="text-sm text-slate-500">{d.simu}</div>
              <div className="text-xs text-slate-500 mt-1">Tarehe ya mwisho: {d.tareheMwisho}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">Tsh {d.kiasi.toLocaleString()}</div>
              <div className="mt-2">
                {d.hali === 'hai' && <Badge color="amber">Hai</Badge>}
                {d.hali === 'imechelewa' && <Badge color="red">Imechelewa</Badge>}
                {d.hali === 'imelipwa' && <Badge color="green">Imelipwa</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
        📄 Pakua Statement (PDF)
      </button>
    </div>
  )
}