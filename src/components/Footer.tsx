import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Heart, MessageCircle } from 'lucide-react'

export default function Footer() {
  const [online, setOnline] = useState(navigator.onLine)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const timer = setInterval(() => setNow(new Date()), 1000)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      clearInterval(timer)
    }
  }, [])

  const time = now.toLocaleTimeString('sw-TZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const date = now.toLocaleDateString('sw-TZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  // ============================================================
  // Developer WhatsApp — 744 198 426
  // ============================================================
  const devWhatsApp = 'https://wa.me/255744198426'

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        {/* BRAND + VERSION + TIME */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          <span className="font-semibold text-slate-700 truncate max-w-[180px] sm:max-w-none">
            SUNRISE GLASSES & ALUMINIUM
          </span>
          <span className="text-slate-300">|</span>
          <span>v1.0.0</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            {date} - {time}
          </span>
        </div>

        {/* LINKS */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hover:text-brand-600">Msaada</button>
          <button className="hover:text-brand-600">Sheria</button>
          <span className="flex items-center gap-1">
            {online ? (
              <>
                <Wifi size={12} className="text-emerald-500" />
                <span className="text-emerald-600 font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-500" />
                <span className="text-red-600 font-medium">Offline</span>
              </>
            )}
          </span>
        </div>

        {/* DEVELOPED BY — WhatsApp link */}
        <div className="flex items-center gap-1">
          <span className="hidden md:inline">Imetengenezwa kwa</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span className="hidden md:inline">na</span>
          <a
            href={devWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 hover:underline transition"
            title="Wasiliana kwa WhatsApp"
          >
            <MessageCircle size={12} />
            744 198 426
          </a>
        </div>
      </div>
    </footer>
  )
}