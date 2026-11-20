
import { useState } from 'react'
import { Wallet, CheckCircle2, XCircle, Clock, X } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatTsh } from '../../utils/faida'

const HALI_META: Record<
  string,
  { sw: string; en: string; tone: string; Icon: React.ElementType }
> = {
  inasubiri: {
    sw: 'Inasubiri',
    en: 'Pending',
    tone: 'text-amber-600',
    Icon: Clock,
  },
  imekubaliwa: {
    sw: 'Imekubaliwa',
    en: 'Approved',
    tone: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  imekataliwa: {
    sw: 'Imekataliwa',
    en: 'Rejected',
    tone: 'text-red-600',
    Icon: XCircle,
  },
}

export default function MmilikiMatumizi() {
  const { maombi, idhinishaOmbi, kataaOmbi } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [selected, setSelected] = useState<any | null>(null)
  const [mode, setMode] = useState<'view' | 'kubali' | 'kataa'>('view')
  const [maoni, setMaoni] = useState('')

  const t = {
    title: isSwahili ? 'Maombi ya Matumizi' : 'Expense Requests',
    subtitle: isSwahili
      ? 'Idhinisha au kataa maombi ya wafanyakazi'
      : 'Approve or reject employee expense requests',
    noRequests: isSwahili ? 'Hakuna maombi' : 'No requests',
    type: isSwahili ? 'Aina' : 'Type',
    amount: isSwahili ? 'Kiasi' : 'Amount',
    description: isSwahili ? 'Maelezo' : 'Description',
    reason: isSwahili ? 'Sababu' : 'Reason',
    customer: isSwahili ? 'Aliyeomba' : 'Requested by',
    approve: isSwahili ? 'Kubali' : 'Approve',
    reject: isSwahili ? 'Kataa' : 'Reject',
    approveConfirm: isSwahili
      ? 'Thibitisha Kukubali'
      : 'Confirm Approval',
    rejectConfirm: isSwahili
      ? 'Thibitisha Kukataa'
      : 'Confirm Rejection',
    optionalComment: isSwahili ? 'Maoni (hiari)' : 'Comment (optional)',
    rejectionReason: isSwahili ? 'Sababu ya kukataa' : 'Reason for rejection',
    comments: isSwahili ? 'Maoni' : 'Comments',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Wallet size={26} className="text-brand-600" />
          {t.title}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {t.subtitle}
        </p>
      </div>

      {maombi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">{t.noRequests}</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {maombi.map((m) => {
            const meta = HALI_META[m.hali] ?? HALI_META.inasubiri

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <button
                    onClick={() => {
                      setSelected(m)
                      setMode('view')
                      setMaoni('')
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}
                    >
                      <meta.Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {m.id}
                        </span>

                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>
                          {isSwahili ? meta.sw : meta.en}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {m.maelezo}
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {m.aliyeomba} — {m.duka}
                      </div>
                    </div>
                  </button>

                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">
                      {formatTsh(m.kiasi)}
                    </div>

                    {m.hali === 'inasubiri' && (
                      <div className="flex gap-1 mt-1 sm:justify-end">
                        <button
                          onClick={() => {
                            setSelected(m)
                            setMode('kubali')
                            setMaoni('')
                          }}
                          className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={10} className="inline" />{' '}
                          {t.approve}
                        </button>

                        <button
                          onClick={() => {
                            setSelected(m)
                            setMode('kataa')
                            setMaoni('')
                          }}
                          className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-semibold hover:bg-red-700"
                        >
                          <XCircle size={10} className="inline" />{' '}
                          {t.reject}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
          />

          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{selected.id}</div>
                <div className="text-xs text-slate-500">
                  {selected.tarehe}
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500">{t.type}</div>
                  <div className="font-medium capitalize">
                    {selected.aina}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">{t.amount}</div>
                  <div className="font-bold text-brand-700">
                    {formatTsh(selected.kiasi)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">{t.description}</div>
                <div>{selected.maelezo}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">{t.reason}</div>
                <div>{selected.sababu}</div>
              </div>

              {mode === 'kubali' && (
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <textarea
                    value={maoni}
                    onChange={(e) => setMaoni(e.target.value)}
                    rows={2}
                    placeholder={t.optionalComment}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm resize-none"
                  />

                  <button
                    onClick={() => {
                      idhinishaOmbi(selected.id, maoni || undefined)
                      setSelected(null)
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  >
                    {t.approveConfirm}
                  </button>
                </div>
              )}

              {mode === 'kataa' && (
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <textarea
                    value={maoni}
                    onChange={(e) => setMaoni(e.target.value)}
                    rows={2}
                    placeholder={t.rejectionReason}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm resize-none"
                  />

                  <button
                    onClick={() => {
                      if (!maoni.trim()) return
                      kataaOmbi(selected.id, maoni)
                      setSelected(null)
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                  >
                    {t.rejectConfirm}
                  </button>
                </div>
              )}

              {mode === 'view' && selected.hali === 'inasubiri' && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setMode('kubali')
                      setMaoni('')
                    }}
                    className="px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  >
                    {t.approve}
                  </button>

                  <button
                    onClick={() => {
                      setMode('kataa')
                      setMaoni('')
                    }}
                    className="px-3 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                  >
                    {t.reject}
                  </button>
                </div>
              )}

              {selected.maoni && (
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-xs text-slate-500 mb-1">
                    {t.comments}
                  </div>

                  <div className="text-sm">{selected.maoni}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
