
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogIn,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'

import { useLanguage } from '../../i18n/LanguageContext'

export default function Login() {
  const navigate = useNavigate()
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  const [simu, setSimu] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const translations = {
    sw: {
      backHome: 'Rudi Nyumbani',
      title: 'Ingia',
      subtitle: 'Weka namba yako ya simu na nywila',
      phone: 'Namba ya Simu',
      phonePlaceholder: '0754-123-456',
      password: 'Nywila',
      passwordPlaceholder: '••••••••',
      showPassword: 'Onyesha nywila',
      hidePassword: 'Ficha nywila',
      phoneRequired: 'Namba ya simu inahitajika',
      passwordRequired: 'Nywila inahitajika',
      submit: 'Ingia',
      forgotPassword: 'Umesahau Nywila?',
      security: 'Usalama wa akaunti yako ni kipaumbele chetu',
    },
    en: {
      backHome: 'Back to Home',
      title: 'Login',
      subtitle: 'Enter your phone number and password',
      phone: 'Phone Number',
      phonePlaceholder: '0754-123-456',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      phoneRequired: 'Phone number is required',
      passwordRequired: 'Password is required',
      submit: 'Login',
      forgotPassword: 'Forgot Password?',
      security: 'Your account security is our priority',
    },
  }

  const t = isSwahili ? translations.sw : translations.en

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!simu.trim()) {
      setError(t.phoneRequired)
      return
    }

    if (!password.trim()) {
      setError(t.passwordRequired)
      return
    }

    // Demo navigation only
    if (simu.includes('0712') || simu.includes('0754')) {
      navigate('/mteja')
    } else if (simu.includes('0713') || simu.includes('0714')) {
      navigate('/muuzaji')
    } else {
      navigate('/mmiliki')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 mb-6"
        >
          <ArrowLeft size={14} />
          {t.backHome}
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg">

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center mx-auto">
              <LogIn size={28} />
            </div>

            <h1 className="text-2xl font-bold mt-3">
              {t.title}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            <div>
              <label className="text-sm font-medium">
                {t.phone}
              </label>

              <div className="relative mt-1">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  value={simu}
                  onChange={(e) => {
                    setSimu(e.target.value)
                    setError('')
                  }}
                  placeholder={t.phonePlaceholder}
                  inputMode="tel"
                  autoComplete="tel"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                {t.password}
              </label>

              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? t.hidePassword : t.showPassword
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100"
                >
                  {showPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm"
              >
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              {t.submit}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
            >
              <KeyRound size={12} />
              {t.forgotPassword}
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={12} />
              {t.security}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
