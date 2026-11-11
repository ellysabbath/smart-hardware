import { useEffect, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'

export default function SmsToast() {
  const { smsLog } = useStore()
  const [visible, setVisible] = useState<string | null>(null)

  useEffect(() => {
    if (smsLog.length === 0) return
    const latest = smsLog[0]
    setVisible(latest.id)
    const t = setTimeout(() => setVisible(null), 5000)
    return () => clearTimeout(t)
  }, [smsLog])

  if (!visible) return null
  const sms = smsLog.find((s) => s.id === visible)
  if (!sms) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-md">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-3 flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 grid place-items-center shrink-0">
          <MessageSquare size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-emerald-400">
            SMS imetumwa → {sms.to}
          </div>
          <div className="text-xs mt-0.5 line-clamp-2">{sms.message}</div>
        </div>
        <button onClick={() => setVisible(null)} className="p-1 rounded hover:bg-white/10">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}