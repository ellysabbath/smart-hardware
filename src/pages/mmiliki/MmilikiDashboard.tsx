import { useMemo } from 'react'
import {
  Wallet, TrendingUp, TrendingDown, Store, Users, HandCoins,
  Package, AlertTriangle, ArrowRight, ShoppingBag, Receipt,
  BarChart3, ChevronRight, Building2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDuka } from '../../context/DukaContext'
import { useMauzo } from '../../context/MauzoContext'
import { useOrderAdmin } from '../../context/OrderAdminContext'
import { useMaombi } from '../../context/OmbiContext'
import { hesabuFaidaKamili, formatTsh } from '../../utils/faida'

export default function MmilikiDashboard() {
  const navigate = useNavigate()
  const { maduka } = useDuka()
  const { mauzo, opex } = useMauzo()
  const { orders } = useOrderAdmin()
  const { maombi } = useMaombi()

  // ============================================================
  // Hesabu za jumla
  // ============================================================
  const faida = useMemo(
    () => hesabuFaidaKamili(mauzo, opex),
    [mauzo, opex]
  )

  const stats = useMemo(() => {
    const watejaWote = new Set(orders.map((o) => o.mteja)).size
    const ordersZinazosubiri = orders.filter(
      (o) => o.hali === 'inasubiri_malipo'
    ).length
    const maombiYanasubiri = maombi.filter((m) => m.hali === 'inasubiri').length
    const jumlaDeni = orders
      .filter((o) => o.hali === 'inasubiri_malipo')
      .reduce((s, o) => s + o.jumla, 0)
    return {
      watejaWote,
      ordersZinazosubiri,
      maombiYanasubiri,
      jumlaDeni,
    }
  }, [orders, maombi])

  // Faida kwa kila duka
  const faidaKwaDuka = useMemo(() => {
    return maduka.map((d) => {
      const f = hesabuFaidaKamili(mauzo, opex, d.id)
      return { duka: d, ...f }
    })
  }, [maduka, mauzo, opex])

  // Orders 5 za karibuni
  const ordersZaKaribuni = useMemo(
    () => orders.slice(0, 5),
    [orders]
  )

  // Maombi 3 yanayosubiri
  const maombiYaKaribuni = useMemo(
    () => maombi.filter((m) => m.hali === 'inasubiri').slice(0, 3),
    [maombi]
  )

  return (
    <div className="space-y-5">
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard ya Mmiliki</h1>
          <p className="text-slate-500 text-sm">
            Muhtasari wa maduka yote - mauzo, faida, zaka, na orders
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Leo, {new Date().toLocaleDateString('sw-TZ', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* STATS 4 - cards nyeupe bila rangi */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <DashboardStat
          label="Mauzo Yote"
          value={formatTsh(faida.mauzo)}
          sub={`Maduka ${maduka.length}`}
          Icon={ShoppingBag}
          trend="up"
        />
        <DashboardStat
          label="Faida Safi"
          value={formatTsh(faida.faidaSafi)}
          sub={
            faida.hasara
              ? 'Biashara inapata hasara'
              : 'Baada ya gharama zote'
          }
          Icon={faida.hasara ? TrendingDown : TrendingUp}
          trend={faida.hasara ? 'down' : 'up'}
        />
        <DashboardStat
          label="Deni la Kukusanya"
          value={formatTsh(stats.jumlaDeni)}
          sub={`Orders ${stats.ordersZinazosubiri}`}
          Icon={Wallet}
          trend="down"
        />
        <DashboardStat
          label="Maombi Yanayosubiri"
          value={String(stats.maombiYanasubiri)}
          sub={`Wateja ${stats.watejaWote}`}
          Icon={AlertTriangle}
          trend="neutral"
        />
      </div>

      {/* ============================================================ */}
      {/* ZAKA NA SADAKA - hero card */}
      {/* ============================================================ */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 grid place-items-center shrink-0">
              <HandCoins size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Kwa Bwana Wiki Hii</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatTsh(faida.jumlaYaMungu)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Zaka {formatTsh(faida.zaka)} + Sadaka {formatTsh(faida.sadaka)}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/mmiliki/zaka')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
          >
            <HandCoins size={16} />
            Nenda Zaka
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FAIDA KWA DUKA + WADENI WAKUU */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Faida kwa Duka */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Building2 size={18} className="text-brand-600" />
              Faida kwa Duka
            </h2>
            <button
              onClick={() => navigate('/mmiliki/mauzo')}
              className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
            >
              Ona Zote
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {faidaKwaDuka.map((f) => {
              const maxMauzo = Math.max(...faidaKwaDuka.map((x) => x.mauzo), 1)
              const percentage = (f.mauzo / maxMauzo) * 100
              return (
                <div key={f.duka.id}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium text-slate-700 truncate">
                      {f.duka.jina.replace('Smart Hardware - ', '')}
                    </span>
                    <span className="font-semibold text-slate-900 whitespace-nowrap ml-2">
                      {formatTsh(f.mauzo)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Faida: {formatTsh(f.faidaSafi)}</span>
                    {f.hasara ? (
                      <span className="text-red-600 font-medium">Hasara</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">Faida</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Maombi Yanayosubiri */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Receipt size={18} className="text-brand-600" />
              Maombi Yanayosubiri
            </h2>
            <button
              onClick={() => navigate('/mmiliki/matumizi')}
              className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
            >
              Ona Zote
              <ChevronRight size={12} />
            </button>
          </div>
          {maombiYaKaribuni.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-6">
              Hakuna maombi yanayosubiri
            </div>
          ) : (
            <div className="space-y-2">
              {maombiYaKaribuni.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate('/mmiliki/matumizi')}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition border border-slate-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 grid place-items-center shrink-0">
                    <Receipt size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {m.maelezo}
                    </div>
                    <div className="text-xs text-slate-500">
                      {m.aliyeomba} - {m.duka}
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

      {/* ============================================================ */}
      {/* ORDERS ZA KARIBUNI */}
      {/* ============================================================ */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-600" />
            Orders za Karibuni
          </h2>
          <button
            onClick={() => navigate('/mmiliki/orders')}
            className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
          >
            Ona Zote
            <ChevronRight size={12} />
          </button>
        </div>
        {ordersZaKaribuni.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">
            Hakuna orders bado
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ordersZaKaribuni.map((o) => (
              <button
                key={o.id}
                onClick={() => navigate('/mmiliki/orders')}
                className="w-full text-left py-3 flex items-center gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 grid place-items-center shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {o.id} - {o.mteja}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {o.dukaJina.replace('Smart Hardware - ', '')} - {o.tarehe}{' '}
                    {o.muda}
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
                        : o.hali === 'imesafirishwa'
                        ? 'text-brand-600'
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

      {/* ============================================================ */}
      {/* SHORTCUTS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ShortcutCard
          label="Maduka"
          desc={`${maduka.length} maduka`}
          Icon={Store}
          onClick={() => navigate('/mmiliki/maduka')}
        />
        <ShortcutCard
          label="Wafanyakazi"
          desc="Simamia wafanyakazi"
          Icon={Users}
          onClick={() => navigate('/mmiliki/wafanyakazi')}
        />
        <ShortcutCard
          label="Wateja"
          desc="Wateja wote"
          Icon={Users}
          onClick={() => navigate('/mmiliki/wateja')}
        />
        <ShortcutCard
          label="Mauzo na Faida"
          desc="Ripoti kamili"
          Icon={BarChart3}
          onClick={() => navigate('/mmiliki/mauzo')}
        />
      </div>
    </div>
  )
}

// ============================================================
// Dashboard Stat Card (nyeupe, bila rangi ya background)
// ============================================================
function DashboardStat({
  label,
  value,
  sub,
  Icon,
  trend = 'neutral',
}: {
  label: string
  value: string
  sub?: string
  Icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
}) {
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600'
      : trend === 'down'
      ? 'text-red-600'
      : 'text-slate-500'

  const trendIcon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
      ? TrendingDown
      : null

  const TrendIcon = trendIcon

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
          <Icon size={20} />
        </div>
        {TrendIcon && (
          <div className={`${trendColor} opacity-80`}>
            <TrendIcon size={16} />
          </div>
        )}
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-lg md:text-xl font-bold text-slate-900 mt-0.5 truncate">
        {value}
      </div>
      {sub && (
        <div className="text-xs text-slate-500 mt-0.5 truncate">{sub}</div>
      )}
    </div>
  )
}

// ============================================================
// Shortcut Card
// ============================================================
function ShortcutCard({
  label,
  desc,
  Icon,
  onClick,
}: {
  label: string
  desc: string
  Icon: React.ElementType
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-brand-500 hover:shadow-sm transition"
    >
      <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
        <Icon size={18} />
      </div>
      <div className="font-semibold text-sm mt-3">{label}</div>
      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      <div className="mt-2 flex items-center text-xs text-brand-600 font-medium">
        Fungua
        <ArrowRight size={12} className="ml-1" />
      </div>
    </button>
  )
}