import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Search, Filter, CheckCheck, Trash2, ArrowRight,
  Info, AlertTriangle, CheckCircle2, XCircle, Inbox,
  ShoppingBag, Package, Wallet, CreditCard, FileText,
  Users, MoreHorizontal,
} from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import type {
  AinaNotification,
  KundiNotification,
  Notification,
} from '../../types'

const AINA_META: Record<
  AinaNotification,
  { color: string; Icon: React.ElementType }
> = {
  info: { color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Info },
  warning: { color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: AlertTriangle },
  success: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  danger: { color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
}

const KUNDI_META: Record<
  KundiNotification,
  { label: string; Icon: React.ElementType }
> = {
  mauzo: { label: 'Mauzo', Icon: ShoppingBag },
  stoki: { label: 'Stoki', Icon: Package },
  deni: { label: 'Deni', Icon: Wallet },
  malipo: { label: 'Malipo', Icon: CreditCard },
  order: { label: 'Order', Icon: FileText },
  gharama: { label: 'Gharama', Icon: CreditCard },
  mtumiaji: { label: 'Mtumiaji', Icon: Users },
  mengine: { label: 'Mengine', Icon: MoreHorizontal },
}

const FILTERS: { key: KundiNotification | 'zote'; label: string }[] = [
  { key: 'zote', label: 'Zote' },
  { key: 'mauzo', label: 'Mauzo' },
  { key: 'stoki', label: 'Stoki' },
  { key: 'deni', label: 'Deni' },
  { key: 'malipo', label: 'Malipo' },
  { key: 'order', label: 'Order' },
  { key: 'gharama', label: 'Gharama' },
]

export default function Notifications() {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    futa,
    futaZote,
    search,
  } = useNotifications()

  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<KundiNotification | 'zote'>('zote')
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  const filtered = useMemo(() => {
    let list = search(q)
    if (filter !== 'zote') list = list.filter((n) => n.kundi === filter)
    if (showOnlyUnread) list = list.filter((n) => !n.read)
    return list
  }, [q, filter, showOnlyUnread, notifications, search])

  const handleClick = (n: Notification) => {
    markAsRead(n.id)
    if (n.route) navigate(n.route)
    else navigate(`/notifications/${n.id}`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell size={24} className="text-brand-600" />
            Taarifa
          </h1>
          <p className="text-slate-500 text-sm">
            {notifications.length} taarifa - {unreadCount} hazijasomwa
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-semibold hover:bg-brand-100"
            >
              <CheckCheck size={14} />
              Soma Zote
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={futaZote}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100"
            >
              <Trash2 size={14} />
              Futa Zote
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta taarifa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-slate-400" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                filter === f.key
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setShowOnlyUnread((v) => !v)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-sm border transition ${
              showOnlyUnread
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Hazijasomwa ({unreadCount})
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Inbox size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">
            {notifications.length === 0
              ? 'Hakuna taarifa'
              : 'Hakuna taarifa inayolingana'}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {notifications.length === 0
              ? 'Ukipata taarifa mpya, zitaonekana hapa.'
              : 'Badilisha kichujio au utafutaji.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = AINA_META[n.type]
            const kundiMeta = KUNDI_META[n.kundi]
            return (
              <div
                key={n.id}
                className={`bg-white rounded-xl border p-4 transition ${
                  !n.read
                    ? 'border-brand-200 bg-brand-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 border ${meta.color}`}
                  >
                    <meta.Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleClick(n)}
                        className="font-semibold text-sm text-left hover:text-brand-600"
                      >
                        {n.title}
                      </button>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                      )}
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {kundiMeta.label}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5">
                      {n.message}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleClick(n)}
                      className="p-2 rounded-lg text-brand-600 hover:bg-brand-50"
                      title="Fungua"
                    >
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => futa(n.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title="Futa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}