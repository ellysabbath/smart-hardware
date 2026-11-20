
import { Link } from 'react-router-dom'

import {
  CheckCircle2,
  ArrowRight,
  LogIn,
} from 'lucide-react'

import { useLanguage } from '../../i18n/LanguageContext'

export default function ResetComplete() {

  // Global language
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  // Translations
  const translations = {
    sw: {
      title: 'Nywila Imebadilishwa',
      description:
        'Nywila yako mpya imehifadhiwa kwa mafanikio. Sasa unaweza kuingia kwenye akaunti yako.',
      login: 'Ingia Sasa',
      home: 'Rudi Nyumbani',
    },

    en: {
      title: 'Password Changed Successfully',
      description:
        'Your new password has been saved successfully. You can now log in to your account.',
      login: 'Login Now',
      home: 'Back to Home',
    },
  }

  const t = isSwahili ? translations.sw : translations.en

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg text-center">

          {/* Success Icon */}

          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto">

            <CheckCircle2 size={32} />

          </div>

          {/* Success Message */}

          <h1 className="text-2xl font-bold mt-4">
            {t.title}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {t.description}
          </p>

          {/* Login Button */}

          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >

            <LogIn size={14} />

            {t.login}

            <ArrowRight size={14} />

          </Link>

          {/* Back Home */}

          <div className="mt-6 pt-4 border-t border-slate-100">

            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-brand-600"
            >
              {t.home}
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}
