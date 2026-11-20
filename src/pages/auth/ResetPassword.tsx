
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  Lock,
  ArrowLeft,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'

import { useLanguage } from '../../i18n/LanguageContext'

export default function ResetPassword() {
  const navigate = useNavigate()

  // Global language
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  // Form states
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Translations
  const translations = {
    sw: {
      backLogin: 'Rudi Login',
      title: 'Weka Nywila Mpya',
      subtitle: 'Chagua nywila mpya yenye usalama',
      newPassword: 'Nywila Mpya',
      confirmPassword: 'Rudia Nywila',
      passwordPlaceholder: '••••••••',
      passwordTooShort: 'Nywila iwe angalau herufi 6',
      passwordMismatch: 'Nywila hazifanani',
      savePassword: 'Hifadhi Nywila',
      security: 'Tumia nywila imara yenye herufi na namba',
      showPassword: 'Onyesha nywila',
      hidePassword: 'Ficha nywila',
    },

    en: {
      backLogin: 'Back to Login',
      title: 'Set New Password',
      subtitle: 'Choose a strong and secure new password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: '••••••••',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      savePassword: 'Save Password',
      security: 'Use a strong password containing letters and numbers',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
  }

  const t = isSwahili ? translations.sw : translations.en

  // Handle password reset
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password.length < 6) {
      setError(t.passwordTooShort)
      return
    }

    if (password !== confirm) {
      setError(t.passwordMismatch)
      return
    }

    setError('')
    navigate('/reset-complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* Back to Login */}

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 mb-6"
        >
          <ArrowLeft size={14} />
          {t.backLogin}
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg">

          {/* Header */}

          <div className="text-center mb-6">

            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center mx-auto">
              <Lock size={28} />
            </div>

            <h1 className="text-2xl font-bold mt-3">
              {t.title}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {t.subtitle}
            </p>

          </div>

          {/* Password Form */}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* New Password */}

            <div>

              <label className="text-sm font-medium">
                {t.newPassword}
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
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
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

            {/* Confirm Password */}

            <div>

              <label className="text-sm font-medium">
                {t.confirmPassword}
              </label>

              <div className="relative mt-1">

                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value)
                    setError('')
                  }}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                />

              </div>

            </div>

            {/* Error Message */}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm"
              >
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                {error}
              </div>
            )}

            {/* Submit Button */}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              <KeyRound size={14} />
              {t.savePassword}
            </button>

          </form>

          {/* Security Message */}

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
