import { useMemo, useState } from 'react'
import {
  Receipt, Search, Filter, Banknote, Smartphone, Wallet,
  CreditCard, TrendingUp, ShoppingBag, Clock, X, Eye,
  Download, ChevronRight, User, Phone, Store, CheckCircle2,
  Split, Percent, AlertTriangle, ArrowRight,
} from 'lucide-react'
import { formatTsh } from '../../utils/faida'

type NjiaMalipo = 'Cash' | 'M-Pesa' | 'Tigo Pesa' | 'Split (Cash+M-Pesa)' | 'Deni' | 'Benki'

interface Risiti {
  id: string
  mteja: string
  simu?: string
  kiasi: number
  njia: NjiaMalipo
  saa: string
  tarehe: string
  bidhaa: number
  muuzaji: string
  duka: string
  kumbukumbu?: string
}

const NJIA_META: Record<
  NjiaMalipo,
  { color: string; Icon: React.ElementType }
> = {
  'Cash': { color: 'text-emerald-700 border-emerald-200', Icon: Banknote },
  'M-Pesa': { color: 'text-brand-700 border-brand-200', Icon: Smartphone },
  'Tigo Pesa': { color: 'text-orange-700 border-orange-200', Icon: Smartphone },
  'Split (Cash+M-Pesa)': { color: 'text-purple-700 border-purple-200', Icon: Split },
  'Deni': { color: 'text-red-700 border-red-200', Icon: Wallet },
  'Benki': { color: 'text-slate-700 border-slate-200', Icon: CreditCard },
}

// Data kamili ya risiti (kutoka kwenye risiti zilizotajwa na za ziada)
const RISITI: Risiti[] = [
  {
    id: 'R-2026-0145',
    mteja: 'Mjenzi Mwakyusa',
    simu: '0754-111-222',
    kiasi: 2500000,
    njia: 'Split (Cash+M-Pesa)',
    saa: '09:14',
    tarehe: '09 Nov 2026',
    bidhaa: 3,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'M-Pesa: QGR7XK2P9L',
  },
  {
    id: 'R-2026-0146',
    mteja: 'Mteja wa Kawaida',
    kiasi: 185000,
    njia: 'M-Pesa',
    saa: '09:47',
    tarehe: '09 Nov 2026',
    bidhaa: 1,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'QGR7XK2P9M',
  },
  {
    id: 'R-2026-0147',
    mteja: 'Fundi Joseph',
    simu: '0754-555-666',
    kiasi: 480000,
    njia: 'Cash',
    saa: '10:22',
    tarehe: '09 Nov 2026',
    bidhaa: 2,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
  },
  {
    id: 'R-2026-0148',
    mteja: 'Kampuni ya Nyati Ltd',
    simu: '0754-333-444',
    kiasi: 5200000,
    njia: 'Deni',
    saa: '10:45',
    tarehe: '09 Nov 2026',
    bidhaa: 2,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'Tarehe mwisho: 10 Nov 2026',
  },
  {
    id: 'R-2026-0149',
    mteja: 'Mama Sarah',
    simu: '0754-777-888',
    kiasi: 150000,
    njia: 'Tigo Pesa',
    saa: '11:05',
    tarehe: '09 Nov 2026',
    bidhaa: 1,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'TIG7XK2P9N',
  },
  {
    id: 'R-2026-0150',
    mteja: 'Fundi Hassan',
    simu: '0754-999-000',
    kiasi: 850000,
    njia: 'Split (Cash+M-Pesa)',
    saa: '11:30',
    tarehe: '09 Nov 2026',
    bidhaa: 4,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'Cash: 400k, M-Pesa: 450k',
  },
  {
    id: 'R-2026-0151',
    mteja: 'Mteja wa Kawaida',
    kiasi: 95000,
    njia: 'Cash',
    saa: '12:15',
    tarehe: '09 Nov 2026',
    bidhaa: 1,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
  },
  {
    id: 'R-2026-0152',
    mteja: 'Jengo Group Ltd',
    simu: '0754-444-555',
    kiasi: 3200000,
    njia: 'Benki',
    saa: '13:00',
    tarehe: '09 Nov 2026',
    bidhaa: 5,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'CRDB: 1234567890',
  },
  {
    id: 'R-2026-0153',
    mteja: 'Fundi Mwita',
    simu: '0754-222-333',
    kiasi: 620000,
    njia: 'M-Pesa',
    saa: '14:20',
    tarehe: '09 Nov 2026',
    bidhaa: 3,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
    kumbukumbu: 'QGR8YK3Q0M',
  },
  {
    id: 'R-2026-0154',
    mteja: 'Mama Amina',
    simu: '0754-666-777',
    kiasi: 320000,
    njia: 'Cash',
    saa: '15:00',
    tarehe: '09 Nov 2026',
    bidhaa: 2,
    muuzaji: 'Juma Hassan',
    duka: 'Kwembe',
  },
]

const NJIA_FILTERS: { key: NjiaMalipo | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'Cash', label: 'Cash' },
  { key: 'M-Pesa', label: 'M-Pesa' },
  { key: 'Tigo Pesa', label: 'Tigo Pesa' },
  { key: 'Split (Cash+M-Pesa)', label: 'Split' },
  { key: 'Benki', label: 'Benki' },
  { key: 'Deni', label: 'Deni' },
]

export default function MuuzajiRisiti() {
  const [q, setQ] = useState('')
  const [filterNjia, setFilterNjia] = useState<NjiaMalipo | 'zote'>('zote')
  const [selected, setSelected] = useState<Risiti | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return RISITI.filter((r) => {
      if (filterNjia !== 'zote' && r.njia !== filterNjia) return false
      if (!query) return true
      return (
        r.id.toLowerCase().includes(query) ||
        r.mteja.toLowerCase().includes(query) ||
        (r.simu?.includes(query) ?? false) ||
        r.njia.toLowerCase().includes(query)
      )
    })
  }, [q, filterNjia])

  const stats = useMemo(() => {
    const zote = RISITI.length
    const jumla = RISITI.reduce((s, r) => s + r.kiasi, 0)
    const cash = RISITI.filter((r) => r.njia === 'Cash').reduce((s, r) => s + r.kiasi, 0)
    const mpesa = RISITI.filter((r) => r.njia === 'M-Pesa' || r.njia === 'Split (Cash+M-Pesa)')
      .reduce((s, r) => s + r.kiasi, 0)
    const deni = RISITI.filter((r) => r.njia === 'Deni').reduce((s, r) => s + r.kiasi, 0)
    const bidhaa = RISITI.reduce((s, r) => s + r.bidhaa, 0)
    return { zote, jumla, cash, mpesa, deni, bidhaa }
  }, [])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt size={24} className="text-brand-600" />
            Risiti za Leo
          </h1>
          <p className="text-slate-500 text-sm">
            Duka la Kwembe - 09 Nov 2026
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 self-start sm:self-auto">
          <Download size={16} />
          Pakua Ripoti
        </button>
      </div>

      {/* Stats 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Risiti Zote"
          value={String(stats.zote)}
          Icon={Receipt}
          accent="brand"
          sub={`${stats.bidhaa} bidhaa`}
        />
        <StatCard
          label="Jumla ya Mauzo"
          value={formatTsh(stats.jumla)}
          Icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label="Cash"
          value={formatTsh(stats.cash)}
          Icon={Banknote}
          accent="emerald"
        />
        <StatCard
          label="M-Pesa"
          value={formatTsh(stats.mpesa)}
          Icon={Smartphone}
          accent="brand"
        />
      </div>

      {/* Stats za Deni */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-red-700" />
            <div className="text-xs text-slate-500">Deni la Leo</div>
          </div>
          <div className="text-lg font-bold text-red-700 mt-2">
            {formatTsh(stats.deni)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Wateja {RISITI.filter((r) => r.njia === 'Deni').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-brand-700" />
            <div className="text-xs text-slate-500">Bidhaa Zilizouzwa</div>
          </div>
          <div className="text-lg font-bold text-brand-700 mt-2">
            {stats.bidhaa} pcs
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Kati ya risiti {stats.zote}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa risiti, mteja, simu, au njia..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {NJIA_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterNjia(f.key)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                filterNjia === f.key
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risiti List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Receipt size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna risiti</div>
          <p className="text-sm text-slate-500 mt-1">Badilisha kichujio au utafutaji.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const meta = NJIA_META[r.njia]
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-500 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border grid place-items-center shrink-0 ${meta.color}`}>
                    <meta.Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.id}</span>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${meta.color}`}>
                        {r.njia}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5 truncate">
                      {r.mteja}
                      {r.simu && (
                        <span className="text-slate-400 ml-1">- {r.simu}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <Clock size={10} /> {r.saa}
                      <span className="text-slate-300">|</span>
                      <span>{r.bidhaa} bidhaa</span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(r.kiasi)}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 sm:justify-end">
                      Ona
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <RisitiDetailModal
          risiti={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Detail Modal
// ============================================================
function RisitiDetailModal({
  risiti,
  onClose,
}: {
  risiti: Risiti
  onClose: () => void
}) {
  const meta = NJIA_META[risiti.njia]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <Receipt size={16} className="text-brand-600" />
              {risiti.id}
            </div>
            <div className="text-xs text-slate-500">{risiti.tarehe} - {risiti.saa}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          {/* Njia */}
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${meta.color}`}>
            <meta.Icon size={12} />
            {risiti.njia}
          </div>

          {/* Mteja */}
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center text-[10px] font-bold shrink-0">
                {risiti.mteja.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{risiti.mteja}</div>
                {risiti.simu && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone size={10} /> {risiti.simu}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kiasi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Kiasi</div>
              <div className="text-lg font-bold text-slate-900">
                {formatTsh(risiti.kiasi)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Bidhaa</div>
              <div className="font-semibold">{risiti.bidhaa} pcs</div>
            </div>
          </div>

          {/* Kumbukumbu */}
          {risiti.kumbukumbu && (
            <div>
              <div className="text-xs text-slate-500">Kumbukumbu</div>
              <div className="font-mono text-xs bg-slate-50 px-2 py-1.5 rounded-md">
                {risiti.kumbukumbu}
              </div>
            </div>
          )}

          {/* Muuzaji + Duka */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User size={12} /> Muuzaji: {risiti.muuzaji}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Store size={12} /> Duka: {risiti.duka}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
              <Download size={14} />
              Pakua Risiti
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Stat Card
// ============================================================
type Accent = 'brand' | 'emerald' | 'amber' | 'red'
const ACCENT_BORDER: Record<Accent, string> = {
  brand: 'border-l-brand-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
}
const ACCENT_TEXT: Record<Accent, string> = {
  brand: 'text-brand-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
}

function StatCard({
  label,
  value,
  Icon,
  accent,
  sub,
}: {
  label: string
  value: string
  Icon: React.ElementType
  accent: Accent
  sub?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${ACCENT_BORDER[accent]} p-4`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={ACCENT_TEXT[accent]} />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-base md:text-lg font-bold mt-2 truncate text-slate-900">
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-500 truncate">{sub}</div>}
    </div>
  )
}