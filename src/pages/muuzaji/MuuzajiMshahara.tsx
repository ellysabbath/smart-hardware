import { Wallet, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MuuzajiMshahara() {
  const { mishahara, akaunti } = useStore()
  const MTUMIAJI_ID = 'u1'
  const yangu = mishahara.filter((m) => m.mtumiajiId === MTUMIAJI_ID)
  const akauntiYangu = akaunti.find((a) => a.mtumiajiId === MTUMIAJI_ID && a.ndiyoMsingi)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Wallet size={26} className="text-brand-600" /> Mshahara Wangu
      </h1>

      {akauntiYangu && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Akaunti ya Malipo</div>
          <div className="font-semibold mt-1">{akauntiYangu.jina}</div>
          <div className="text-sm font-mono text-slate-600">{akauntiYangu.namba}</div>
          <div className="text-xs text-slate-500">{akauntiYangu.jinaMmiliki}</div>
        </div>
      )}

      {yangu.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna mishahara</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {yangu.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{m.mwezi}</div>
                  <div className="text-xs text-slate-500">{m.kipindi}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-slate-900">{formatTsh(m.jumla)}</div>
                  <div className={`text-[10px] uppercase font-semibold inline-flex items-center gap-1 ${m.hali === 'imelipwa' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {m.hali === 'imelipwa' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {m.hali}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}