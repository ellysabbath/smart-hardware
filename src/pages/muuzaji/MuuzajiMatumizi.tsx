
import { useState } from 'react'
import {
  Wallet,
  Plus,
  X,
  Save,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { useLanguage } from '../../i18n/LanguageContext'
import type { AinaGharama } from '../../types'

const AINA_GHARAMA: {
  key: AinaGharama
  labelSw: string
  labelEn: string
}[] = [
  { key: 'mafuta', labelSw: 'Mafuta', labelEn: 'Fuel' },
  { key: 'chakula', labelSw: 'Chakula', labelEn: 'Food' },
  { key: 'usafiri', labelSw: 'Usafiri', labelEn: 'Transport' },
  { key: 'matengenezo', labelSw: 'Matengenezo', labelEn: 'Maintenance' },
  { key: 'vifaa', labelSw: 'Vifaa', labelEn: 'Equipment' },
  { key: 'nyingine', labelSw: 'Nyingine', labelEn: 'Other' },
]

const HALI_META: Record<
  string,
  {
    labelSw: string
    labelEn: string
    tone: string
    Icon: React.ElementType
  }
> = {
  inasubiri: {
    labelSw: 'Inasubiri',
    labelEn: 'Pending',
    tone: 'text-amber-600',
    Icon: Clock,
  },
  imekubaliwa: {
    labelSw: 'Imekubaliwa',
    labelEn: 'Approved',
    tone: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  imekataliwa: {
    labelSw: 'Imekataliwa',
    labelEn: 'Rejected',
    tone: 'text-red-600',
    Icon: XCircle,
  },
}

export default function MuuzajiMatumizi() {
  const { maombi, ongezaOmbi } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet size={26} className="text-brand-600" />
            {isSwahili ? 'Maombi ya Matumizi' : 'Expense Requests'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Omba matumizi — Mmiliki ataidhinisha'
              : 'Request expenses — The owner will approve them'}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          {isSwahili ? 'Omba Matumizi' : 'Request Expense'}
        </button>
      </div>

      {maombi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wallet size={40} className="mx-auto text-slate-300 mb-3" />

          <h3 className="font-semibold">
            {isSwahili ? 'Hakuna maombi' : 'No expense requests'}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Bofya "Omba Matumizi" kuanza.'
              : 'Click "Request Expense" to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {maombi.map((m) => {
            const meta = HALI_META[m.hali]
            const Icon = meta?.Icon || Clock

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${
                        meta?.tone || 'text-slate-500'
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {m.id}
                        </span>

                        <span
                          className={`text-[10px] uppercase font-semibold ${
                            meta?.tone || 'text-slate-500'
                          }`}
                        >
                          {meta
                            ? isSwahili
                              ? meta.labelSw
                              : meta.labelEn
                            : m.hali}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {m.maelezo}
                      </div>

                      <div className="text-xs text-slate-500">
                        {m.tarehe}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(m.kiasi)}
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
          onSubmit={ongezaOmbi}
        />
      )}
    </div>
  )
}

function Fomu({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: any
}) {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [aina, setAina] = useState<AinaGharama>('mafuta')
  const [kiasi, setKiasi] = useState(0)
  const [maelezo, setMaelezo] = useState('')
  const [sababu, setSababu] = useState('')
  const [simu, setSimu] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (kiasi <= 0) {
      return setError(
        isSwahili
          ? 'Kiasi lazima kiwe zaidi ya 0'
          : 'Amount must be greater than 0'
      )
    }

    if (!maelezo.trim()) {
      return setError(
        isSwahili
          ? 'Maelezo yanahitajika'
          : 'Description is required'
      )
    }

    if (!sababu.trim()) {
      return setError(
        isSwahili
          ? 'Sababu inahitajika'
          : 'Reason is required'
      )
    }

    if (!simu.trim()) {
      return setError(
        isSwahili
          ? 'Simu inahitajika'
          : 'Phone number is required'
      )
    }

    onSubmit({
      aina,
      kiasi,
      maelezo,
      sababu,
      simu,
      aliyeomba: 'Juma Hassan',
      duka: 'Kwembe',
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
            {isSwahili ? 'Omba Matumizi' : 'Request Expense'}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <select
            value={aina}
            onChange={(e) => {
              setAina(e.target.value as AinaGharama)
              setError('')
            }}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          >
            {AINA_GHARAMA.map((a) => (
              <option key={a.key} value={a.key}>
                {isSwahili ? a.labelSw : a.labelEn}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={kiasi || ''}
            onChange={(e) => {
              setKiasi(Number(e.target.value))
              setError('')
            }}
            placeholder={isSwahili ? 'Kiasi' : 'Amount'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <input
            value={maelezo}
            onChange={(e) => {
              setMaelezo(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Maelezo' : 'Description'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <input
            value={simu}
            onChange={(e) => {
              setSimu(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Simu' : 'Phone Number'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <textarea
            value={sababu}
            onChange={(e) => {
              setSababu(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Sababu' : 'Reason'}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm resize-none"
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
