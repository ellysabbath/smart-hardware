import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Bell, CheckCheck, Trash2, ArrowRight,
  Info, AlertTriangle, CheckCircle2, XCircle, Inbox,
} from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import type { AinaNotification } from '../../types'

const AINA_META: Record<
  AinaNotification,
  { color: string; Icon: React.ElementType; label: string }
> = {
  info: { color: 'bg-brand-50 text-brand-700 border-brand-200', Icon: Info, label: 'Taarifa' },
  warning: { color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: AlertTriangle, label: 'Onyo' },
  success: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2, label: 'Mafanikio' },
  danger: { color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle, label: 'Hatari' },
}

export default function NotificationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getNotification, markAsRead, futa } = useNotifications()

  const notif = id ? getNotification(id) : undefined

  if (!notif) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-10 text-center">
        <Inbox size={40} className="mx-auto mb-3 text-slate-300" />
        <div className="font-semibold">Taarifa haipo</div>
        <p className="text-sm text-slate-500 mt-1">
          Taarifa uliyoitafuta haipatikani au ilifutwa.
        </p>
        <button
          onClick={() => navigate('/notifications')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
        >
          <ArrowLeft size={16} />
          Rudi Taarifa
        </button>
      </div>
    )
  }

  const meta = AINA_META[notif.type]

  const handleOpenRoute = () => {
    markAsRead(notif.id)
    if (notif.route) navigate(notif.route)
  }

  const handleFuta = () => {
    futa(notif.id)
    navigate('/notifications')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button
        onClick={() => navigate('/notifications')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft size={16} />
        Rudi Taarifa
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-lg grid place-items-center shrink-0 border ${meta.color}`}
          >
            <meta.Icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${meta.color}`}>
                {meta.label}
              </span>
              {!notif.read && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-brand-600 text-white">
                  Mpya
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold mt-2">{notif.title}</h1>
            <div className="text-xs text-slate-500 mt-1">{notif.time}</div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200">
          <p className="text-sm text-slate-700">{notif.message}</p>
          {notif.maelezo && (
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {notif.maelezo}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          {notif.route && (
            <button
              onClick={handleOpenRoute}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
            >
              <ArrowRight size={16} />
              Fungua Ukurasa
            </button>
          )}
          {!notif.read && (
            <button
              onClick={() => markAsRead(notif.id)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200"
            >
              <CheckCheck size={16} />
              Weka Kama Imesomwa
            </button>
          )}
          <button
            onClick={handleFuta}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 sm:ml-auto"
          >
            <Trash2 size={16} />
            Futa
          </button>
        </div>
      </div>
    </div>
  )
}