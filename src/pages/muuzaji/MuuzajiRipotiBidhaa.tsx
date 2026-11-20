
import { useState } from 'react'
import {
  Package, Plus, X, Save, AlertTriangle, Calendar,
  RotateCcw, PackageX,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { useLanguage } from '../../i18n/LanguageContext'
import type { AinaRipotiBidhaa } from '../../types'

type AinaMeta = {
  labelSw: string
  labelEn: string
  tone: string
  Icon: React.ElementType
}

const AINA_META: Record<AinaRipotiBidhaa, AinaMeta> = {
  uharibifu: {
    labelSw: 'Uharibifu',
    labelEn: 'Damage',
    tone: 'text-red-700',
    Icon: AlertTriangle,
  },
  expiry: {
    labelSw: 'Muda kuisha',
    labelEn: 'Expired',
    tone: 'text-amber-700',
    Icon: Calendar,
  },
  upotevu: {
    labelSw: 'Upotevu',
    labelEn: 'Loss',
    tone: 'text-orange-700',
    Icon: PackageX,
  },
  kurudisha_msambazaji: {
    labelSw: 'Kurudisha',
    labelEn: 'Supplier Return',
    tone: 'text-purple-700',
    Icon: RotateCcw,
  },
}

export default function MuuzajiRipotiBidhaa() {
  const { bidhaa, ripotiBidhaa, ongezaRipotiBidhaa } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [open, setOpen] = useState(false)

  const stats = {
    zote: ripotiBidhaa.length,
    uharibifu: ripotiBidhaa.filter((r) => r.aina === 'uharibifu').length,
    expiry: ripotiBidhaa.filter((r) => r.aina === 'expiry').length,
    hasara: ripotiBidhaa
      .filter((r) => ['uharibifu', 'expiry', 'upotevu'].includes(r.aina))
      .reduce((s, r) => s + r.thamani, 0),
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package size={26} className="text-brand-600" />
            {isSwahili ? 'Ripoti za Bidhaa' : 'Product Reports'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Ripoti uharibifu, muda kuisha au upotevu'
              : 'Report damaged, expired, or lost products'}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          {isSwahili ? 'Ripoti Mpya' : 'New Report'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label={isSwahili ? 'Ripoti Zote' : 'Total Reports'}
          value={String(stats.zote)}
          Icon={Package}
          tone="text-blue-600"
        />
        <Stat
          label={isSwahili ? 'Uharibifu' : 'Damaged'}
          value={String(stats.uharibifu)}
          Icon={AlertTriangle}
          tone="text-red-600"
        />
        <Stat
          label={isSwahili ? 'Muda Umeisha' : 'Expired'}
          value={String(stats.expiry)}
          Icon={Calendar}
          tone="text-amber-600"
        />
        <Stat
          label={isSwahili ? 'Jumla ya Hasara' : 'Total Loss'}
          value={formatTsh(stats.hasara)}
          Icon={PackageX}
          tone="text-red-600"
        />
      </div>

      {ripotiBidhaa.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">
            {isSwahili ? 'Hakuna ripoti' : 'No reports yet'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Bofya "Ripoti Mpya" kuanza.'
              : 'Click "New Report" to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ripotiBidhaa.map((r) => {
            const meta = AINA_META[r.aina]

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}
                    >
                      <meta.Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{r.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>
                          {isSwahili ? meta.labelSw : meta.labelEn}
                        </span>
                      </div>

                      <div className="text-sm truncate">{r.jina}</div>
                      <div className="text-xs text-slate-500">{r.tarehe}</div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {r.wingi} {r.uom}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatTsh(r.thamani)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {open && (
        <Fomu
          onClose={() => setOpen(false)}
          onSubmit={ongezaRipotiBidhaa}
          bidhaa={bidhaa}
        />
      )}
    </div>
  )
}

// ============================================================
// STAT
// ============================================================
function Stat({
  label,
  value,
  Icon,
  tone,
}: {
  label: string
  value: string
  Icon: React.ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">
        {value}
      </div>
    </div>
  )
}

// ============================================================
// FORM
// ============================================================
function Fomu({
  onClose,
  onSubmit,
  bidhaa,
}: {
  onClose: () => void
  onSubmit: any
  bidhaa: any[]
}) {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [bidhaaId, setBidhaaId] = useState('')
  const [aina, setAina] = useState<AinaRipotiBidhaa>('uharibifu')
  const [wingi, setWingi] = useState(0)
  const [sababu, setSababu] = useState('')
  const [error, setError] = useState('')

  const b = bidhaa.find((x) => x.id === bidhaaId)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!b) {
      setError(isSwahili ? 'Chagua bidhaa' : 'Select a product')
      return
    }

    if (wingi <= 0) {
      setError(
        isSwahili
          ? 'Wingi lazima uwe zaidi ya 0'
          : 'Quantity must be greater than 0'
      )
      return
    }

    if (wingi > b.stoki) {
      setError(
        isSwahili
          ? `Wingi hauwezi kuzidi ${b.stoki}`
          : `Quantity cannot exceed ${b.stoki}`
      )
      return
    }

    if (!sababu.trim()) {
      setError(isSwahili ? 'Sababu inahitajika' : 'Reason is required')
      return
    }

    onSubmit({
      bidhaaId: b.id,
      jina: b.jina,
      sku: b.sku,
      uom: b.uom,
      kundi: b.kundi,
      dukaId: 'd1',
      dukaJina: 'Smart Hardware - Kwembe',
      aina,
      wingi,
      beiUnunuzi: b.beiUnunuzi,
      sababu,
      expiry: b.expiry,
      mtengenezaji: b.mtengenezaji,
      uzito: b.uzito,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">
            {isSwahili ? 'Ripoti Bidhaa' : 'Report Product'}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
            aria-label={isSwahili ? 'Funga' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <select
            value={bidhaaId}
            onChange={(e) => {
              setBidhaaId(e.target.value)
              setError('')
            }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          >
            <option value="">
              {isSwahili ? '-- Chagua bidhaa --' : '-- Select product --'}
            </option>

            {bidhaa.map((x) => (
              <option key={x.id} value={x.id}>
                {x.jina} ({x.stoki} {x.uom})
              </option>
            ))}
          </select>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              {isSwahili ? 'Aina ya ripoti' : 'Report type'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(AINA_META) as AinaRipotiBidhaa[]).map((k) => {
                const m = AINA_META[k]

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setAina(k)}
                    className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-1.5 ${
                      aina === k
                        ? 'border-brand-500 bg-slate-50 font-semibold'
                        : 'border-slate-200'
                    }`}
                  >
                    <m.Icon size={12} />
                    {isSwahili ? m.labelSw : m.labelEn}
                  </button>
                )
              })}
            </div>
          </div>

          <input
            type="number"
            min="1"
            value={wingi || ''}
            onChange={(e) => {
              setWingi(Number(e.target.value))
              setError('')
            }}
            placeholder={isSwahili ? 'Wingi' : 'Quantity'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <input
            value={sababu}
            onChange={(e) => {
              setSababu(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Sababu' : 'Reason'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm"
            >
              {isSwahili ? 'Ghairi' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold"
            >
              <Save size={16} />
              {isSwahili ? 'Tuma' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
