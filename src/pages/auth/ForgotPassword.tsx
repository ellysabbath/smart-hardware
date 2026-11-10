import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  KeyRound, Phone, ArrowLeft, AlertTriangle, CheckCircle2,
  ShieldCheck, Smartphone,
} from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [simu, setSimu] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^0[67]\d{2}-?\d{3}-?\d{3}$/.test(simu.replace(/\s/g, ''))) {
      return setError('Weka namba sahihi ya simu')
    }
    setError('')
    setOtpSent(true)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('OTP inapaswa kuwa tarakimu 6')
    setError('')
    navigate('/reset-password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 mb-6"
        >
          <ArrowLeft size={14} />
          Rudi Login
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center mx-auto">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-bold mt-3">Umesahau Nywila?</h1>
            <p className="text-sm text-slate-500 mt-1">
              {otpSent
                ? 'Weka OTP uliyotumiwa kwa simu'
                : 'Weka namba yako ili tukupe OTP'}
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Namba ya Simu</label>
                <div className="relative mt-1">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={simu}
                    onChange={(e) => setSimu(e.target.value)}
                    placeholder="0754-123-456"
                    inputMode="tel"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
              >
                <Smartphone size={14} />
                Tuma OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-800">
                  OTP imetumwa kwa <span className="font-semibold">{simu}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">OTP (tarakimu 6)</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  inputMode="numeric"
                  maxLength={6}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono text-center text-lg tracking-widest"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
              >
                <CheckCircle2 size={14} />
                Thibitisha OTP
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-slate-500 hover:text-brand-600"
              >
                Badilisha namba ya simu
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={12} />
              OTP ni salama - usiituma kwa mtu mwingine
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}