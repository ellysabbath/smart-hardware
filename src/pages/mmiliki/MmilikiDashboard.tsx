import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, TrendingUp, TrendingDown, HandCoins, ChevronRight,
  ShoppingBag, Receipt, Building2, Activity,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiDashboard() {
  const navigate = useNavigate()
  const { maduka, mauzo, opex, orders, maombi, faida } = useStore()

  const f = useMemo(() => faida(), [mauzo, opex])

  const stats = useMemo(() => {
    const ordersZinazosubiri = orders.filter((o) => o.hali === 'inasubiri_malipo').length
    const maombiYanasubiri = maombi.filter((m) => m.hali === 'inasubiri').length
    const jumlaDeni = orders
      .filter((o) => o.hali === 'inasubiri_malipo')
      .reduce((s, o) => s + o.jumla, 0)
    return { ordersZinazosubiri, maombiYanasubiri, jumlaDeni }
  }, [orders, maombi])

  const faidaKwaDuka = useMemo(
    () => maduka.map((d) => ({ duka: d, ...faida(d.id) })),
    [maduka, mauzo, opex]
  )

  const ordersZaKaribuni = orders.slice(0, 5)
  const maombiYaKaribuni = maombi.filter((m) => m.hali === 'inasubiri').slice(0, 3)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard ya Mmiliki
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Muhtasari wa maduka yote — mauzo, faida, zaka na orders
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2 self-start sm:self-auto">
          {new Date().toLocaleDateString('sw-TZ', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Stat label="Mauzo Yote" value={formatTsh(f.mauzo)} sub={`Maduka ${maduka.length}`} Icon={ShoppingBag} tone="text-blue-600" />
        <Stat
          label="Faida Safi"
          value={formatTsh(f.faidaSafi)}
          sub={f.hasara ? 'Biashara ina hasara' : 'Baada ya gharama zote'}
          Icon={f.hasara ? TrendingDown : TrendingUp}
          tone={f.hasara ? 'text-red-600' : 'text-emerald-600'}
        />
        <Stat label="Deni la Kukusanya" value={formatTsh(stats.jumlaDeni)} sub={`Orders ${stats.ordersZinazosubiri}`} Icon={Wallet} tone="text-amber-600" />
        <Stat label="Maombi Yanayosubiri" value={String(stats.maombiYanasubiri)} sub="Yanasubiri idhini" Icon={Activity} tone="text-purple-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center shrink-0">
              <HandCoins size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Kwa Bwana Wiki Hii</div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-0.5">
                {formatTsh(f.jumlaYaMungu)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Zaka {formatTsh(f.zaka)} + Sadaka {formatTsh(f.sadaka)}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/mmiliki/zaka')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition self-start sm:self-auto"
          >
            <HandCoins size={16} />
            Nenda Zaka
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <Building2 size={18} className="text-brand-600" />
              Faida kwa Duka
            </h2>
            <button
              onClick={() => navigate('/mmiliki/mauzo')}
              className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              Ona Zote <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {faidaKwaDuka.map((fd) => {
              const maxMauzo = Math.max(...faidaKwaDuka.map((x) => x.mauzo), 1)
              const percentage = (fd.mauzo / maxMauzo) * 100
              return (
                <div key={fd.duka.id}>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-medium text-slate-700 truncate">
                      {fd.duka.jina.replace('Smart Hardware - ', '')}
                    </span>
                    <span className="font-semibold text-slate-900 whitespace-nowrap ml-2">
                      {formatTsh(fd.mauzo)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                    <span>Faida: {formatTsh(fd.faidaSafi)}</span>
                    {fd.hasara ? (
                      <span className="text-red-600 font-semibold">Hasara</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Faida</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <Receipt size={18} className="text-brand-600" />
              Maombi Yanayosubiri
            </h2>
            <button
              onClick={() => navigate('/mmiliki/matumizi')}
              className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              Ona Zote <ChevronRight size={12} />
            </button>
          </div>
          {maombiYaKaribuni.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-8">
              Hakuna maombi yanayosubiri
            </div>
          ) : (
            <div className="space-y-2">
              {maombiYaKaribuni.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate('/mmiliki/matumizi')}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition border border-slate-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 grid place-items-center shrink-0">
                    <Receipt size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.maelezo}</div>
                    <div className="text-xs text-slate-500">
                      {m.aliyeomba} — {m.duka}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {formatTsh(m.kiasi)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-600" />
            Orders za Karibuni
          </h2>
          <button
            onClick={() => navigate('/mmiliki/orders')}
            className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 font-medium"
          >
            Ona Zote <ChevronRight size={12} />
          </button>
        </div>
        {ordersZaKaribuni.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">Hakuna orders bado</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ordersZaKaribuni.map((o) => (
              <button
                key={o.id}
                onClick={() => navigate('/mmiliki/orders')}
                className="w-full text-left py-3.5 flex items-center gap-3 hover:bg-slate-50 -mx-3 px-3 rounded-lg transition first:pt-0 last:pb-0"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 grid place-items-center shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {o.id} — {o.mteja}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {o.tarehe} — {o.bidhaa.length} bidhaa
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900">
                    {formatTsh(o.jumla)}
                  </div>
                  <div
                    className={`text-[10px] uppercase font-semibold ${
                      o.hali === 'imekamilika'
                        ? 'text-emerald-600'
                        : o.hali === 'inasubiri_malipo'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {o.hali.replace('_', ' ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({
  label, value, sub, Icon, tone,
}: {
  label: string
  value: string
  sub?: string
  Icon: React.ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs font-medium text-slate-500 mt-3 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-lg md:text-xl font-bold text-slate-900 mt-1 truncate">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-0.5 truncate">{sub}</div>}
    </div>
  )
}