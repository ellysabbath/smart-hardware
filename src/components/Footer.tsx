
import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Heart, MessageCircle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [online, setOnline] = useState(() => navigator.onLine)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.clearInterval(timer)
    }
  }, [])

  const locale = isSwahili ? 'sw-TZ' : 'en-GB'

  const time = now.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const date = now.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const devWhatsApp = 'https://wa.me/255744198426'

  const text = {
    help: isSwahili ? 'Msaada' : 'Help',
    terms: isSwahili ? 'Sheria' : 'Terms',
    online: isSwahili ? 'Mtandaoni' : 'Online',
    offline: isSwahili ? 'Nje ya mtandao' : 'Offline',
    madeWith: isSwahili ? 'Imetengenezwa kwa' : 'Made with',
    by: isSwahili ? 'na' : 'by',
    contact: isSwahili ? 'Wasiliana kupitia WhatsApp' : 'Contact via WhatsApp',
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">

        {/* BRAND + VERSION + TIME */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          <span className="font-semibold text-slate-700 truncate max-w-[180px] sm:max-w-none">
            SUNRISE GLASSES &amp; ALUMINIUM PROFILES
          </span>

          <span className="text-slate-300">|</span>
          <span>v1.0.0</span>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <span className="hidden sm:inline">
            {date} - {time}
          </span>
        </div>

        {/* LINKS + CONNECTION STATUS */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="hover:text-brand-600 transition"
          >
            {text.help}
          </button>

          <button
            type="button"
            className="hover:text-brand-600 transition"
          >
            {text.terms}
          </button>

          <span className="flex items-center gap-1">
            {online ? (
              <>
                <Wifi size={12} className="text-emerald-500" />
                <span className="text-emerald-600 font-medium">
                  {text.online}
                </span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-500" />
                <span className="text-red-600 font-medium">
                  {text.offline}
                </span>
              </>
            )}
          </span>
        </div>

        {/* DEVELOPER CONTACT */}
        <div className="flex items-center gap-1">
          <span className="hidden md:inline">{text.madeWith}</span>

          <Heart
            size={12}
            className="text-red-500 fill-red-500"
          />

          <span className="hidden md:inline">{text.by}</span>

          <a
            href={devWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 hover:underline transition"
            title={text.contact}
          >
            <MessageCircle size={12} />
            744 198 426
          </a>
        </div>

      </div>
    </footer>
  )
}
