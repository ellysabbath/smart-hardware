import { useEffect, useMemo, useState } from 'react'
import {
  Settings, Bell, Globe, Lock, Shield, Smartphone, Save,
  CheckCircle2, AlertTriangle, X, KeyRound, Eye, EyeOff,
  MessageSquare, Package, Wallet, CreditCard, ShoppingBag,
  FileText, Users, MoreHorizontal, Moon, Sun, Info,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'

type Role = 'mteja' | 'muuzaji' | 'mmiliki'

interface MySettingsProps {
  role: Role
}

type Lugha = 'sw' | 'en'
type Muonekano = 'light' | 'dark'

interface Settings {
  // Notifications kwa kundi
  notifMauzo: boolean
  notifStoki: boolean
  notifDeni: boolean
  notifMalipo: boolean
  notifOrder: boolean
  notifGharama: boolean
  notifMtumiaji: boolean
  notifMengine: boolean
  // Lugha & Muonekano
  lugha: Lugha
  muonekano: Muonekano
  // Faragha
  onyeshaSimu: boolean
  onyeshaBaruaPepe: boolean
  // Usalama
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
  label: string
  desc: string
  Icon: React.ElementType
  tone: string
}[] = [
  {
    key: 'notifMauzo',
    label: 'Mauzo',
    desc: 'Taarifa za mauzo mapya',
    Icon: ShoppingBag,
    tone: 'text-blue-600',
  },
  {
    key: 'notifStoki',
    label: 'Stoki',
    desc: 'Bidhaa zinazoisha au kuisha',
    Icon: Package,
    tone: 'text-emerald-600',
  },
  {
    key: 'notifDeni',
    label: 'Deni',
    desc: 'Madeni yanayochelewa',
    Icon: Wallet,
    tone: 'text-red-600',
  },
  {
    key: 'notifMalipo',
    label: 'Malipo',
    desc: 'Malipo yaliyopokelewa au kuthibitishwa',
    Icon: CreditCard,
    tone: 'text-amber-600',
  },
  {
    key: 'notifOrder',
    label: 'Order',
    desc: 'Orders mpya na zilizokamilika',
    Icon: FileText,
    tone: 'text-purple-600',
  },
  {
    key: 'notifGharama',
    label: 'Gharama',
    desc: 'Maombi ya matumizi',
    Icon: Wallet,
    tone: 'text-orange-600',
  },
  {
    key: 'notifMtumiaji',
    label: 'Mtumiaji',
    desc: 'Wafanyakazi wapya au mabadiliko',
    Icon: Users,
    tone: 'text-slate-600',
  },
  {
    key: 'notifMengine',
    label: 'Mengine',
    desc: 'Taarifa zingine',
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
  const [settings, setSettings] = useState<Settings>(() => loadSettings(role))
  const [changePassOpen, setChangePassOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Reload settings when role changes
  useEffect(() => {
    setSettings(loadSettings(role))
  }, [role])

  const handleToggle = <K extends keyof Settings>(key: K) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    const ok = saveSettings(role, settings)
    if (ok) {
      setToast({ msg: 'Mipangilio imehifadhiwa', ok: true })
    } else {
      setToast({ msg: 'Imeshindwa kuhifadhi mipangilio', ok: false })
    }
    setTimeout(() => setToast(null), 4000)
  }

  const jumlahNotifZilizowashwa = useMemo(
    () =>
      NOTIF_KUNDI.reduce(
        (s, k) => s + (settings[k.key as keyof Settings] ? 1 : 0),
        0
      ),
    [settings]
  )

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings size={26} className="text-brand-600" /> Mipangilio
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simamia arifa, lugha, usalama, na faragha ya akaunti yako
        </p>
      </div>

      {/* ============ NOTIFICATIONS ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Bell size={18} className="text-brand-600" />
            Arifa
          </h2>
          <span className="text-xs text-slate-500">
            {jumlahNotifZilizowashwa} / {NOTIF_KUNDI.length} zimewashwa
          </span>
        </div>
        <div className="space-y-2">
          {NOTIF_KUNDI.map((k) => (
            <ToggleRow
              key={k.key}
              Icon={k.Icon}
              tone={k.tone}
              label={k.label}
              desc={k.desc}
              value={settings[k.key] as boolean}
              onToggle={() => handleToggle(k.key)}
            />
          ))}
        </div>
      </div>

      {/* ============ LUGHA & MUONEKANO ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Globe size={18} className="text-brand-600" />
          Lugha na Muonekano
        </h2>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-slate-500 mb-2">Lugha</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings({ ...settings, lugha: 'sw' })}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.lugha === 'sw'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kiswahili
              </button>
              <button
                onClick={() => setSettings({ ...settings, lugha: 'en' })}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.lugha === 'en'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-2">Muonekano</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings({ ...settings, muonekano: 'light' })}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.muonekano === 'light'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sun size={14} /> Light
              </button>
              <button
                onClick={() => setSettings({ ...settings, muonekano: 'dark' })}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  settings.muonekano === 'dark'
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Moon size={14} /> Dark
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Info size={10} /> Muonekano wa dark utakuja hivi karibuni
            </div>
          </div>
        </div>
      </div>

      {/* ============ FARAGHA ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Shield size={18} className="text-brand-600" />
          Faragha
        </h2>
        <div className="space-y-2">
          <ToggleRow
            Icon={Smartphone}
            tone="text-emerald-600"
            label="Onyesha namba yangu ya simu"
            desc="Wateja wengine wanaweza kuona namba yako"
            value={settings.onyeshaSimu}
            onToggle={() => handleToggle('onyeshaSimu')}
          />
          <ToggleRow
            Icon={MessageSquare}
            tone="text-blue-600"
            label="Onyesha barua pepe yangu"
            desc="Wengine wanaweza kuona email yako"
            value={settings.onyeshaBaruaPepe}
            onToggle={() => handleToggle('onyeshaBaruaPepe')}
          />
        </div>
      </div>

      {/* ============ USALAMA ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Lock size={18} className="text-brand-600" />
          Usalama
        </h2>
        <div className="space-y-2">
          <ToggleRow
            Icon={Smartphone}
            tone="text-amber-600"
            label="OTP kwa kila kuingia"
            desc="Pata OTP kwa SMS kila unapoingia"
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
                  Badilisha Nywila
                </div>
                <div className="text-xs text-slate-500">
                  Tumia nywila imara yenye herufi na namba
                </div>
              </div>
            </div>
            <span className="text-xs text-brand-600 font-semibold shrink-0">
              Badilisha
            </span>
          </button>
        </div>
      </div>

      {/* ============ SAVE BUTTON ============ */}
      <div className="sticky bottom-4 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-lg shadow-brand-600/20"
        >
          <Save size={16} />
          Hifadhi Mipangilio
        </button>
      </div>

      {/* ============ MODAL YA KUBADILISHA NYWILA ============ */}
      {changePassOpen && (
        <ChangePasswordModal
          onClose={() => setChangePassOpen(false)}
          onSuccess={() => {
            setChangePassOpen(false)
            setToast({ msg: 'Nywila imebadilishwa (demo)', ok: true })
            setTimeout(() => setToast(null), 4000)
            sendSms('—', 'Nywila yako imebadilishwa. Kama si wewe, wasiliana na msaada.')
          }}
        />
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-md ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
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
  Icon, tone, label, desc, value, onToggle,
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
        <div className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${tone}`}>
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">{label}</div>
          <div className="text-xs text-slate-500 truncate">{desc}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        aria-pressed={value}
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
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!current.trim()) return setError('Nywila ya sasa inahitajika')
    if (password.length < 6) return setError('Nywila mpya iwe angalau herufi 6')
    if (password !== confirm) return setError('Nywila hazifanani')

    setError('')
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSuccess()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => !saving && onClose()} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <KeyRound size={16} className="text-brand-600" />
              Badilisha Nywila
            </div>
            <div className="text-xs text-slate-500">
              Weka nywila mpya imara
            </div>
          </div>
          <button
            onClick={() => !saving && onClose()}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Nywila ya Sasa</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nywila Mpya</label>
            <div className="relative mt-1">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Rudia Nywila Mpya</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              placeholder="••••••••"
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
              Ghairi
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? (
                <>Inahifadhi...</>
              ) : (
                <>
                  <Save size={16} /> Hifadhi Nywila
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}