
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  KeyRound,
  Phone,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'

import { useLanguage } from '../../i18n/LanguageContext'

export default function ForgotPassword() {
  const navigate = useNavigate()

  // Global language context
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  // Form states
  const [simu, setSimu] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  // ==========================================================
  // TRANSLATIONS
  // ==========================================================

  const translations = {
    sw: {
      backLogin: 'Rudi Login',
      title: 'Umesahau Nywila?',
      enterOtp: 'Weka OTP uliyotumiwa kwa simu',
      enterPhone: 'Weka namba yako ili tukupe OTP',

      phone: 'Namba ya Simu',
      phonePlaceholder: '0754-123-456',

      phoneInvalid: 'Weka namba sahihi ya simu',
      otpLabel: 'OTP (tarakimu 6)',
      otpPlaceholder: '123456',
      otpInvalid: 'OTP inapaswa kuwa tarakimu 6',

      sendOtp: 'Tuma OTP',
      verifyOtp: 'Thibitisha OTP',
      changePhone: 'Badilisha namba ya simu',

      otpSent: 'OTP imetumwa kwa',
      security: 'OTP ni salama - usiituma kwa mtu mwingine',
    },

    en: {
      backLogin: 'Back to Login',
      title: 'Forgot Password?',
      enterOtp: 'Enter the OTP sent to your phone',
      enterPhone: 'Enter your phone number to receive an OTP',

      phone: 'Phone Number',
      phonePlaceholder: '0754-123-456',

      phoneInvalid: 'Please enter a valid phone number',
      otpLabel: 'OTP (6 digits)',
      otpPlaceholder: '123456',
      otpInvalid: 'OTP must contain exactly 6 digits',

      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      changePhone: 'Change phone number',

      otpSent: 'OTP has been sent to',
      security: 'Your OTP is confidential - never share it with anyone',
    },
  }

  const t = isSwahili ? translations.sw : translations.en

  // ==========================================================
  // SEND OTP
  // ==========================================================

  const handleSendOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const cleanPhone = simu.replace(/\s/g, '')

    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(cleanPhone)) {
      setError(t.phoneInvalid)
      return
    }

    setError('')
    setOtpSent(true)
  }

  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  const handleVerifyOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setError(t.otpInvalid)
      return
    }

    setError('')
    navigate('/reset-password')
  }

  // ==========================================================
  // UI
  // ==========================================================

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

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center mx-auto">
              <KeyRound size={28} />
            </div>

            <h1 className="text-2xl font-bold mt-3">
              {t.title}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {otpSent ? t.enterOtp : t.enterPhone}
            </p>

          </div>

          {/* PHONE NUMBER FORM */}

          {!otpSent ? (

            <form onSubmit={handleSendOtp} className="space-y-3">

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
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                  />

                </div>

              </div>

              {/* ERROR MESSAGE */}

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

              {/* SEND OTP BUTTON */}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                <Smartphone size={14} />
                {t.sendOtp}
              </button>

            </form>

          ) : (

            /* OTP VERIFICATION FORM */

            <form onSubmit={handleVerifyOtp} className="space-y-3">

              {/* OTP SENT MESSAGE */}

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">

                <CheckCircle2
                  size={16}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />

                <div className="text-xs text-emerald-800">
                  {t.otpSent}{' '}
                  <span className="font-semibold">
                    {simu}
                  </span>
                </div>

              </div>

              {/* OTP INPUT */}

              <div>

                <label className="text-sm font-medium">
                  {t.otpLabel}
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                    )
                    setError('')
                  }}
                  placeholder={t.otpPlaceholder}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono text-center text-lg tracking-widest"
                />

              </div>

              {/* ERROR MESSAGE */}

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

              {/* VERIFY OTP BUTTON */}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                <CheckCircle2 size={14} />
                {t.verifyOtp}
              </button>

              {/* CHANGE PHONE NUMBER */}

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError('')
                }}
                className="w-full text-xs text-slate-500 hover:text-brand-600"
              >
                {t.changePhone}
              </button>

            </form>

          )}

          {/* SECURITY MESSAGE */}

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
