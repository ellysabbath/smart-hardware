import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang, languages, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = languages.find((l) => l.key === lang)!

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        title={t('common.language')}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
          {languages.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setLang(l.key)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${
                lang === l.key ? 'text-brand-700 font-semibold' : 'text-slate-700'
              }`}
            >
              <span>{l.flag}</span>
              <span className="flex-1 text-left">{l.label}</span>
              {lang === l.key && <Check size={14} className="text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}