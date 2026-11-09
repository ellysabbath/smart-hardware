import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Heart } from 'lucide-react'

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

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">SMART HARDWARE</span>
          <span className="text-slate-300">|</span>
          <span>v1.0.0</span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline">
            {date} - {time}
          </span>
        </div>

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-1">
          <span className="hidden md:inline">Imetengenezwa kwa</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span className="hidden md:inline">Tanzania</span>
          <span className="md:hidden">2026</span>
        </div>
      </div>
    </footer>
  )
}