
import { useState } from 'react'
import { Plus, Search, X, Save, Phone, MapPin } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import type { AinaMteja } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

const AINA: { key: AinaMteja; labelSw: string; labelEn: string }[] = [
  { key: 'fundi', labelSw: 'Fundi', labelEn: 'Technician' },
  { key: 'mjenzi', labelSw: 'Mjenzi', labelEn: 'Builder' },
  { key: 'kampuni', labelSw: 'Kampuni', labelEn: 'Company' },
  { key: 'mteja', labelSw: 'Mteja', labelEn: 'Customer' },
]

export default function MuuzajiWateja() {
  const { wateja, ongezaMteja, orders } = useStore()
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = wateja.filter(
    (m) =>
      m.jina.toLowerCase().includes(q.toLowerCase()) ||
      m.simu.includes(q)
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {isSwahili ? 'Wateja' : 'Customers'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isSwahili
              ? 'Sajili na simamia wateja wa duka'
              : 'Register and manage store customers'}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          {isSwahili ? 'Ongeza Mteja' : 'Add Customer'}
        </button>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            isSwahili
              ? 'Tafuta kwa jina au simu...'
              : 'Search by name or phone...'
          }
          className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="text-slate-400 mb-2">
            <Search size={28} className="mx-auto" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            {isSwahili ? 'Hakuna mteja aliyepatikana' : 'No customers found'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isSwahili
              ? 'Jaribu kutafuta kwa jina au namba nyingine ya simu.'
              : 'Try searching with another name or phone number.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => {
            const deni = orders
              .filter((o) => o.simu === m.simu)
              .reduce((s, o) => {
                const ilipwa = o.malipo
                  .filter((x) => x.hali === 'imethibitishwa')
                  .reduce((a, x) => a + x.kiasi, 0)

                return s + Math.max(o.jumla - ilipwa, 0)
              }, 0)

            const ainaLabel = AINA.find((a) => a.key === m.aina)

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center text-sm font-bold">
                    {m.jina
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {m.jina}
                    </div>
                    <div className="text-xs text-slate-500">
                      {ainaLabel
                        ? isSwahili
                          ? ainaLabel.labelSw
                          : ainaLabel.labelEn
                        : m.aina}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} />
                    {m.simu}
                  </div>

                  {m.mahali && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {m.mahali}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-slate-500">
                      {isSwahili ? 'Manunuzi' : 'Purchases'}
                    </div>
                    <div className="font-bold text-brand-700 truncate">
                      {formatTsh(m.jumlaManunuzi)}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      {isSwahili ? 'Deni' : 'Debt'}
                    </div>
                    <div
                      className={`font-bold truncate ${
                        deni > 0 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatTsh(deni)}
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
          onSubmit={ongezaMteja}
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
  onSubmit: (d: any) => any
}) {
  const { language } = useLanguage()
  const isSwahili = language === 'sw'

  const [jina, setJina] = useState('')
  const [simu, setSimu] = useState('')
  const [aina, setAina] = useState<AinaMteja>('mteja')
  const [mahali, setMahali] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!jina.trim() || !simu.trim()) {
      setError(
        isSwahili
          ? 'Jina na simu vinahitajika'
          : 'Name and phone number are required'
      )
      return
    }

    onSubmit({
      jina,
      simu,
      aina,
      mahali,
      deni: 0,
      jumlaManunuzi: 0,
      tareheSajili: new Date().toISOString().split('T')[0],
      active: true,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">
            {isSwahili ? 'Ongeza Mteja' : 'Add Customer'}
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
          <input
            value={jina}
            onChange={(e) => {
              setJina(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Jina' : 'Name'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <input
            value={simu}
            onChange={(e) => {
              setSimu(e.target.value)
              setError('')
            }}
            placeholder={isSwahili ? 'Namba ya simu' : 'Phone number'}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm"
          />

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              {isSwahili ? 'Aina ya mteja' : 'Customer type'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {AINA.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setAina(a.key)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    aina === a.key
                      ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSwahili ? a.labelSw : a.labelEn}
                </button>
              ))}
            </div>
          </div>

          <input
            value={mahali}
            onChange={(e) => setMahali(e.target.value)}
            placeholder={
              isSwahili ? 'Mahali (hiari)' : 'Location (optional)'
            }
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
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              {isSwahili ? 'Ghairi' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Save size={16} />
              {isSwahili ? 'Hifadhi' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
