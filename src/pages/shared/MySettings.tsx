
import { useEffect, useMemo, useState } from 'react'
import {
  Settings, Bell, Globe, Lock, Shield, Smartphone, Save,
  CheckCircle2, AlertTriangle, X, KeyRound, Eye, EyeOff,
  MessageSquare, Package, Wallet, CreditCard, ShoppingBag,
  FileText, Users, MoreHorizontal, Moon, Sun, Info,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useLanguage } from '../../i18n/LanguageContext'

type Role = 'mteja' | 'muuzaji' | 'mmiliki'

interface MySettingsProps {
  role: Role
}

type Lugha = 'sw' | 'en'
type Muonekano = 'light' | 'dark'

interface Settings {
  notifMauzo: boolean
  notifStoki: boolean
  notifDeni: boolean
  notifMalipo: boolean
  notifOrder: boolean
  notifGharama: boolean
  notifMtumiaji: boolean
  notifMengine: boolean
  lugha: Lugha
  muonekano: Muonekano
  onyeshaSimu: boolean
  onyeshaBaruaPepe: boolean
  otpKwaSimu: boolean
}

const DEFAULTS: Settings = {
  notifMauzo: true,
  notifStoki: true,
  notifDeni: true,
  notifMalipo: true,
  notifOrder: true,
  notifGharama: true,
  notifMtumiaji: false,
  notifMengine: true,
  lugha: 'sw',
  muonekano: 'light',
  onyeshaSimu: true,
  onyeshaBaruaPepe: false,
  otpKwaSimu: true,
}

const NOTIF_KUNDI: {
  key: keyof Pick<
    Settings,
    | 'notifMauzo'
    | 'notifStoki'
    | 'notifDeni'
    | 'notifMalipo'
    | 'notifOrder'
    | 'notifGharama'
    | 'notifMtumiaji'
    | 'notifMengine'
  >
  labelSw: string
  labelEn: string
  descSw: string
  descEn: string
  Icon: React.ElementType
  tone: string
}[] = [
  {
    key: 'notifMauzo',
    labelSw: 'Mauzo',
    labelEn: 'Sales',
    descSw: 'Taarifa za mauzo mapya',
    descEn: 'Notifications about new sales',
    Icon: ShoppingBag,
    tone: 'text-blue-600',
  },
  {
    key: 'notifStoki',
    labelSw: 'Stoki',
    labelEn: 'Stock',
    descSw: 'Bidhaa zinazoisha au kuisha',
    descEn: 'Low or out-of-stock products',
    Icon: Package,
    tone: 'text-emerald-600',
  },
  {
    key: 'notifDeni',
    labelSw: 'Deni',
    labelEn: 'Debt',
    descSw: 'Madeni yanayochelewa',
    descEn: 'Overdue debts',
    Icon: Wallet,
    tone: 'text-red-600',
  },
  {
    key: 'notifMalipo',
    labelSw: 'Malipo',
    labelEn: 'Payments',
    descSw: 'Malipo yaliyopokelewa au kuthibitishwa',
    descEn: 'Payments received or confirmed',
    Icon: CreditCard,
    tone: 'text-amber-600',
  },
  {
    key: 'notifOrder',
    labelSw: 'Order',
    labelEn: 'Orders',
    descSw: 'Orders mpya na zilizokamilika',
    descEn: 'New and completed orders',
    Icon: FileText,
    tone: 'text-purple-600',
  },
  {
    key: 'notifGharama',
    labelSw: 'Gharama',
    labelEn: 'Expenses',
    descSw: 'Maombi ya matumizi',
    descEn: 'Expense requests',
    Icon: Wallet,
    tone: 'text-orange-600',
  },
  {
    key: 'notifMtumiaji',
    labelSw: 'Mtumiaji',
    labelEn: 'Users',
    descSw: 'Wafanyakazi wapya au mabadiliko',
    descEn: 'New employees or account changes',
    Icon: Users,
    tone: 'text-slate-600',
  },
  {
    key: 'notifMengine',
    labelSw: 'Mengine',
    labelEn: 'Other',
    descSw: 'Taarifa zingine',
    descEn: 'Other notifications',
    Icon: MoreHorizontal,
    tone: 'text-slate-600',
  },
]

function loadSettings(role: Role): Settings {
  try {
    const raw = localStorage.getItem(`sh_settings_${role}`)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

function saveSettings(role: Role, settings: Settings) {
  try {
    localStorage.setItem(`sh_settings_${role}`, JSON.stringify(settings))
    return true
  } catch {
    return false
  }
}

export default function MySettings({ role }: MySettingsProps) {
  const { sendSms } = useStore()
  const { language, setLanguage } = useLanguage()
  const isSwahili = language === 'sw'

  const [settings, setSettings] = useState<Settings>(() => ({
    ...loadSettings(role),
    lugha: language,
  }))

  const [changePassOpen, setChangePassOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const t = {
    title: isSwahili ? 'Mipangilio' : 'Settings',
    subtitle: isSwahili
      ? 'Simamia arifa, lugha, usalama, na faragha ya akaunti yako'
      : 'Manage your notifications, language, security and account privacy',
    notifications: isSwahili ? 'Arifa' : 'Notifications',
    enabled: isSwahili ? 'zimewashwa' : 'enabled',
    languageAppearance: isSwahili ? 'Lugha na Muonekano' : 'Language & Appearance',
    language: isSwahili ? 'Lugha' : 'Language',
    appearance: isSwahili ? 'Muonekano' : 'Appearance',
    darkComingSoon: isSwahili
      ? 'Muonekano wa dark utakuja hivi karibuni'
      : 'Dark mode will be available soon',
    privacy: isSwahili ? 'Faragha' : 'Privacy',
    showPhone: isSwahili ? 'Onyesha namba yangu ya simu' : 'Show my phone number',
    phoneDescription: isSwahili
      ? 'Wateja wengine wanaweza kuona namba yako'
      : 'Other customers can see your phone number',
    showEmail: isSwahili ? 'Onyesha barua pepe yangu' : 'Show my email address',
    emailDescription: isSwahili
      ? 'Wengine wanaweza kuona email yako'
      : 'Other people can see your email address',
    security: isSwahili ? 'Usalama' : 'Security',
    otp: isSwahili ? 'OTP kwa kila kuingia' : 'OTP on every login',
    otpDescription: isSwahili
      ? 'Pata OTP kwa SMS kila unapoingia'
      : 'Receive an OTP by SMS whenever you log in',
    changePassword: isSwahili ? 'Badilisha Nywila' : 'Change Password',
    passwordDescription: isSwahili
      ? 'Tumia nywila imara yenye herufi na namba'
      : 'Use a strong password with letters and numbers',
    change: isSwahili ? 'Badilisha' : 'Change',
    saveSettings: isSwahili ? 'Hifadhi Mipangilio' : 'Save Settings',
    saved: isSwahili ? 'Mipangilio imehifadhiwa' : 'Settings saved successfully',
    saveFailed: isSwahili
      ? 'Imeshindwa kuhifadhi mipangilio'
      : 'Failed to save settings',
    passwordChanged: isSwahili
      ? 'Nywila imebadilishwa (demo)'
      : 'Password changed (demo)',
    cancel: isSwahili ? 'Ghairi' : 'Cancel',
    save: isSwahili ? 'Hifadhi' : 'Save',
    saving: isSwahili ? 'Inahifadhi...' : 'Saving...',
    passwordModalTitle: isSwahili ? 'Badilisha Nywila' : 'Change Password',
    passwordModalSubtitle: isSwahili
      ? 'Weka nywila mpya imara'
      : 'Set a new strong password',
  }

  // Reload settings when role changes.
  useEffect(() => {
    setSettings({
      ...loadSettings(role),
      lugha: language,
    })
  }, [role, language])

  const handleToggle = <K extends keyof Settings>(key: K) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLanguageChange = (lang: Lugha) => {
    setSettings((prev) => ({ ...prev, lugha: lang }))
    setLanguage(lang)
  }

  const handleSave = () => {
    const settingsToSave = {
      ...settings,
      lugha: language,
    }

    const ok = saveSettings(role, settingsToSave)

    if (ok) {
      setToast({ msg: t.saved, ok: true })
    } else {
      setToast({ msg: t.saveFailed, ok: false })
    }

    setTimeout(() => setToast(null), 4000)
  }

  const jumlahNotifZilizowashwa = useMemo(
    () =>
      NOTIF_KUNDI.reduce(
        (s, k) => s + (settings[k.key] ? 1 : 0),
        0
      ),
    [settings]
  )

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings size={26} className="text-brand-600" />
          {t.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Bell size={18} className="text-brand-600" />
            {t.notifications}
          </h2>

          <span className="text-xs text-slate-500">
            {jumlahNotifZilizowashwa} / {NOTIF_KUNDI.length} {t.enabled}
          </span>
        </div>

        <div className="space-y-2">
          {NOTIF_KUNDI.map((k) => (
            <ToggleRow
              key={k.key}
              Icon={k.Icon}
              tone={k.tone}
              label={isSwahili ? k.labelSw : k.labelEn}
              desc={isSwahili ? k.descSw : k.descEn}
              value={settings[k.key]}
              onToggle={() => handleToggle(k.key)}
            />
          ))}
        </div>
      </div>

      {/* Language & Appearance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Globe size={18} className="text-brand-600" />
          {t.languageAppearance}
        </h2>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-slate-500 mb-2">
              {t.language}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLanguageChange('sw')}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  language === 'sw'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kiswahili
              </button>

              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  language === 'en'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-2">
              {t.appearance}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setSettings({ ...settings, muonekano: 'light' })
                }
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.muonekano === 'light'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sun size={14} />
                Light
              </button>

              <button
                onClick={() =>
                  setSettings({ ...settings, muonekano: 'dark' })
                }
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.muonekano === 'dark'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Moon size={14} />
                Dark
              </button>
            </div>

            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Info size={10} />
              {t.darkComingSoon}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Shield size={18} className="text-brand-600" />
          {t.privacy}
        </h2>

        <div className="space-y-2">
          <ToggleRow
            Icon={Smartphone}
            tone="text-emerald-600"
            label={t.showPhone}
            desc={t.phoneDescription}
            value={settings.onyeshaSimu}
            onToggle={() => handleToggle('onyeshaSimu')}
          />

          <ToggleRow
            Icon={MessageSquare}
            tone="text-blue-600"
            label={t.showEmail}
            desc={t.emailDescription}
            value={settings.onyeshaBaruaPepe}
            onToggle={() => handleToggle('onyeshaBaruaPepe')}
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Lock size={18} className="text-brand-600" />
          {t.security}
        </h2>

        <div className="space-y-2">
          <ToggleRow
            Icon={Smartphone}
            tone="text-amber-600"
            label={t.otp}
            desc={t.otpDescription}
            value={settings.otpKwaSimu}
            onToggle={() => handleToggle('otpKwaSimu')}
          />

          <button
            onClick={() => setChangePassOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center text-slate-700 shrink-0">
                <KeyRound size={16} />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900">
                  {t.changePassword}
                </div>
                <div className="text-xs text-slate-500">
                  {t.passwordDescription}
                </div>
              </div>
            </div>

            <span className="text-xs text-brand-600 font-semibold shrink-0">
              {t.change}
            </span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          <Save size={16} />
          {t.saveSettings}
        </button>
      </div>

      {/* Change Password Modal */}
      {changePassOpen && (
        <ChangePasswordModal
          isSwahili={isSwahili}
          onClose={() => setChangePassOpen(false)}
          onSuccess={() => {
            setChangePassOpen(false)
            setToast({ msg: t.passwordChanged, ok: true })
            setTimeout(() => setToast(null), 4000)

            sendSms(
              '—',
              isSwahili
                ? 'Nywila yako imebadilishwa. Kama si wewe, wasiliana na msaada.'
                : 'Your password has been changed. If this was not you, contact support.'
            )
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-md ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.ok
            ? <CheckCircle2 size={16} />
            : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ============================================================
// ToggleRow
// ============================================================
function ToggleRow({
  Icon,
  tone,
  label,
  desc,
  value,
  onToggle,
}: {
  Icon: React.ElementType
  tone: string
  label: string
  desc: string
  value: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${tone}`}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">
            {label}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {desc}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={value}
        aria-label={label}
        className={`relative shrink-0 w-11 h-6 rounded-full transition ${
          value ? 'bg-brand-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// ============================================================
// ChangePasswordModal
// ============================================================
function ChangePasswordModal({
  onClose,
  onSuccess,
  isSwahili,
}: {
  onClose: () => void
  onSuccess: () => void
  isSwahili: boolean
}) {
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const t = {
    title: isSwahili ? 'Badilisha Nywila' : 'Change Password',
    subtitle: isSwahili
      ? 'Weka nywila mpya imara'
      : 'Set a new strong password',
    current: isSwahili ? 'Nywila ya Sasa' : 'Current Password',
    newPassword: isSwahili ? 'Nywila Mpya' : 'New Password',
    confirmPassword: isSwahili ? 'Rudia Nywila Mpya' : 'Confirm New Password',
    currentRequired: isSwahili
      ? 'Nywila ya sasa inahitajika'
      : 'Current password is required',
    minLength: isSwahili
      ? 'Nywila mpya iwe angalau herufi 6'
      : 'New password must be at least 6 characters',
    mismatch: isSwahili
      ? 'Nywila hazifanani'
      : 'Passwords do not match',
    cancel: isSwahili ? 'Ghairi' : 'Cancel',
    save: isSwahili ? 'Hifadhi Nywila' : 'Save Password',
    saving: isSwahili ? 'Inahifadhi...' : 'Saving...',
    show: isSwahili ? 'Onyesha nywila' : 'Show password',
    hide: isSwahili ? 'Ficha nywila' : 'Hide password',
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!current.trim()) {
      return setError(t.currentRequired)
    }

    if (password.length < 6) {
      return setError(t.minLength)
    }

    if (password !== confirm) {
      return setError(t.mismatch)
    }

    setError('')
    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      onSuccess()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !saving && onClose()}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <KeyRound size={16} className="text-brand-600" />
              {t.title}
            </div>

            <div className="text-xs text-slate-500">
              {t.subtitle}
            </div>
          </div>

          <button
            onClick={() => !saving && onClose()}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            disabled={saving}
            aria-label={t.cancel}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">
              {t.current}
            </label>

            <input
              type={showPass ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {t.newPassword}
            </label>

            <div className="relative mt-1">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100"
                aria-label={showPass ? t.hide : t.show}
              >
                {showPass
                  ? <EyeOff size={14} />
                  : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              {t.confirmPassword}
            </label>

            <input
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => !saving && onClose()}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? (
                <>{t.saving}</>
              ) : (
                <>
                  <Save size={16} />
                  {t.save}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
