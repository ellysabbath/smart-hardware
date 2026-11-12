import { useMemo, useState } from 'react'
import {
  User, Phone,  Mail, Store, Shield,
  Briefcase, Wallet,  CheckCircle2, XCircle,
  Building2, Pencil, Save, X,  Crown,
  Users, Receipt, TrendingUp,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

type Role = 'mteja' | 'muuzaji' | 'mmiliki'

const PROFILE: Record<Role, { name: string; email: string; simu: string; initials: string; badge: string; jina: string }> = {
  mteja: {
    name: 'Dan Ndusiro',
    email: 'ndusiro@email.com',
    simu: '0754-111-222',
    initials: 'MM',
    badge: 'Mteja',
    jina: 'mteja',
  },
  muuzaji: {
    name: 'Dan Ndusiro',
    email: 'dan@smarthardware.co.tz',
    simu: '0712-345-678',
    initials: 'JH',
    badge: 'Muuzaji',
    jina: 'muuzaji',
  },
  mmiliki: {
    name: 'Dan Ndusiro',
    email: 'dan@smarthardware.co.tz',
    simu: '0716-789-012',
    initials: 'MK',
    badge: 'Mmiliki',
    jina: 'mmiliki',
  },
}

const ROLE_ICON: Record<Role, React.ElementType> = {
  mteja: User,
  muuzaji: Briefcase,
  mmiliki: Crown,
}

interface MyProfileProps {
  role: Role
}

export default function MyProfile({ role }: MyProfileProps) {
  const profile = PROFILE[role]
  const RoleIcon = ROLE_ICON[role]
  const [editOpen, setEditOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    jina: profile.name,
    email: profile.email,
    simu: profile.simu,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setEditOpen(false)
    setToast('Wasifu umeshahifadhiwa (demo)')
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <User size={26} className="text-brand-600" />
          Wasifu Wangu
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Taarifa zako binafsi na muhtasari wa akaunti
        </p>
      </div>

      {/* ============ KICHWA CHA WASIFU ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white grid place-items-center text-2xl font-bold shrink-0">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                <RoleIcon size={10} />
                {profile.badge}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-sm text-slate-600 flex items-center gap-1.5">
                <Mail size={12} className="text-slate-400" />
                {profile.email}
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-1.5">
                <Phone size={12} className="text-slate-400" />
                {profile.simu}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditForm({
                jina: profile.name,
                email: profile.email,
                simu: profile.simu,
              })
              setEditOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold self-start sm:self-auto"
          >
            <Pencil size={14} /> Badilisha
          </button>
        </div>
      </div>

      {/* ============ MUHTASARI KULINGANA NA ROLE ============ */}
      {role === 'mteja' && <MtejaSummary />}
      {role === 'muuzaji' && <MuuzajiSummary />}
      {role === 'mmiliki' && <MmilikiSummary />}

      {/* ============ TAARIFA ZA AKOUNTI ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield size={16} className="text-brand-600" />
          Taarifa za Akaunti
        </h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Jina Kamili" value={profile.name} />
          <InfoRow label="Barua Pepe" value={profile.email} />
          <InfoRow label="Namba ya Simu" value={profile.simu} />
          <InfoRow label="Jukumu" value={profile.badge} />
          <InfoRow label="Hali ya Akaunti" value="Active" tone="emerald" />
          <InfoRow label="Tarehe ya Kujiunga" value="15 Januari 2025" />
        </div>
      </div>

      {/* ============ MODAL YA KUBADILISHA ============ */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <div className="font-semibold">Badilisha Wasifu</div>
              <button onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Jina Kamili</label>
                <input
                  value={editForm.jina}
                  onChange={(e) => setEditForm({ ...editForm, jina: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Barua Pepe</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Namba ya Simu</label>
                <input
                  value={editForm.simu}
                  onChange={(e) => setEditForm({ ...editForm, simu: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
                >
                  <Save size={16} /> Hifadhi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-md">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}

// ============================================================
// MTEJA — Muhtasari
// ============================================================
function MtejaSummary() {
  const { wateja, orders, deniLaMteja } = useStore()
  const mteja = wateja[0]

  const stats = useMemo(() => {
    if (!mteja) return { deni: 0, orders: 0, manunuzi: 0 }
    const ordersZake = orders.filter((o) => o.simu === mteja.simu)
    const jumlaManunuzi = ordersZake.reduce((s, o) => s + o.jumla, 0)
    return {
      deni: deniLaMteja(mteja.id),
      orders: ordersZake.length,
      manunuzi: jumlaManunuzi,
    }
  }, [mteja, orders, deniLaMteja])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <SumStat label="Deni Langu" value={formatTsh(stats.deni)} Icon={Wallet} tone={stats.deni > 0 ? 'text-red-600' : 'text-emerald-600'} />
      <SumStat label="Orders" value={String(stats.orders)} Icon={Receipt} tone="text-blue-600" />
      <SumStat label="Manunuzi Yote" value={formatTsh(stats.manunuzi)} Icon={TrendingUp} tone="text-emerald-600" />
    </div>
  )
}

// ============================================================
// MUUZAJI — Muhtasari
// ============================================================
function MuuzajiSummary() {
  const { wafanyakazi, orders, mauzo } = useStore()
  const muuzaji = wafanyakazi.find((w) => w.jina === 'Juma Hassan')
  const duka = muuzaji?.duka ?? 'Kwembe'

  const stats = useMemo(() => {
    const mauzoYake = mauzo.filter((m) => m.muuzaji === 'Juma Hassan')
    const jumlaMauzo = mauzoYake.reduce((s, m) => s + m.jumlaMauzo, 0)
    const jumlaFaida = mauzoYake.reduce((s, m) => s + m.faidaGhafi, 0)
    const ordersZake = orders.length
    return { jumlaMauzo, jumlaFaida, ordersZake }
  }, [mauzo, orders])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <SumStat label="Duka" value={duka} Icon={Store} tone="text-purple-600" />
      <SumStat label="Mauzo Yangu" value={formatTsh(stats.jumlaMauzo)} Icon={Receipt} tone="text-blue-600" />
      <SumStat label="Faida Ghafi" value={formatTsh(stats.jumlaFaida)} Icon={TrendingUp} tone="text-emerald-600" />
    </div>
  )
}

// ============================================================
// MMILIKI — Muhtasari
// ============================================================
function MmilikiSummary() {
  const { maduka, wafanyakazi, mauzo, opex, mishahara } = useStore()

  const stats = useMemo(() => {
    const jumlaMauzo = mauzo.reduce((s, m) => s + m.jumlaMauzo, 0)
    const jumlaFaida = mauzo.reduce((s, m) => s + m.faidaGhafi, 0)
    const jumlaOpex = opex.filter((o) => o.aina !== 'mishahara').reduce((s, o) => s + o.kiasi, 0)
    const jumlaMishahara = mishahara.reduce((s, m) => s + m.jumla, 0)
    return { jumlaMauzo, jumlaFaida, jumlaGharama: jumlaOpex + jumlaMishahara }
  }, [mauzo, opex, mishahara])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <SumStat label="Maduka" value={String(maduka.length)} Icon={Building2} tone="text-blue-600" />
      <SumStat label="Wafanyakazi" value={String(wafanyakazi.length)} Icon={Users} tone="text-purple-600" />
      <SumStat label="Mauzo Yote" value={formatTsh(stats.jumlaMauzo)} Icon={Receipt} tone="text-emerald-600" />
      <SumStat label="Faida Ghafi" value={formatTsh(stats.jumlaFaida)} Icon={TrendingUp} tone="text-emerald-600" />
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================
function SumStat({
  label, value, Icon, tone,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}

function InfoRow({
  label, value, tone,
}: {
  label: string
  value: string
  tone?: 'emerald' | 'red'
}) {
  const toneColor =
    tone === 'emerald' ? 'text-emerald-700' : tone === 'red' ? 'text-red-700' : 'text-slate-900'

  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      {tone ? (
        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${toneColor}`}>
          {tone === 'emerald' && <CheckCircle2 size={12} />}
          {tone === 'red' && <XCircle size={12} />}
          {value}
        </span>
      ) : (
        <span className="font-semibold text-slate-900 text-right">{value}</span>
      )}
    </div>
  )
}