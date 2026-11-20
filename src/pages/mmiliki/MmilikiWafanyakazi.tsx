
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Users,
  Plus,
  X,
  Save,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { useStore } from '../../store/StoreContext'
import type { NafasiMtumiaji } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

const NAFASI: NafasiMtumiaji[] = [
  'muuzaji',
  'mhazini',
  'admin',
  'mmiliki',
]

type EmployeeTranslations = {
  employees: string
  allEmployees: string
  add: string
  active: string
  blocked: string
  addEmployee: string
  fullName: string
  phone: string
  store: string
  cancel: string
  save: string
  nameAndPhoneRequired: string
  namePlaceholder: string
  phonePlaceholder: string
  storePlaceholder: string
  selectRole: string
  roles: Record<string, string>
  noEmployees: string
}

export default function MmilikiWafanyakazi() {
  const { wafanyakazi, ongezaMtumiaji } = useStore()
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  const [open, setOpen] = useState(false)

  const t: EmployeeTranslations = {
    employees: isSwahili ? 'Wafanyakazi' : 'Employees',

    allEmployees: isSwahili
      ? 'Wafanyakazi wote wa maduka yako'
      : 'All employees across your stores',

    add: isSwahili ? 'Ongeza' : 'Add Employee',

    active: isSwahili ? 'Hai' : 'Active',
    blocked: isSwahili ? 'Imezuiwa' : 'Blocked',

    addEmployee: isSwahili
      ? 'Ongeza Mfanyakazi'
      : 'Add Employee',

    fullName: isSwahili ? 'Jina Kamili' : 'Full Name',
    phone: isSwahili ? 'Namba ya Simu' : 'Phone Number',
    store: isSwahili ? 'Duka' : 'Store',

    cancel: isSwahili ? 'Ghairi' : 'Cancel',
    save: isSwahili ? 'Hifadhi' : 'Save',

    nameAndPhoneRequired: isSwahili
      ? 'Jina na namba ya simu vinahitajika'
      : 'Name and phone number are required',

    namePlaceholder: isSwahili
      ? 'Ingiza jina kamili'
      : 'Enter full name',

    phonePlaceholder: '0754-123-456',

    storePlaceholder: isSwahili
      ? 'Ingiza jina la duka'
      : 'Enter store name',

    selectRole: isSwahili
      ? 'Chagua nafasi ya mfanyakazi'
      : 'Select employee role',

    roles: {
      muuzaji: isSwahili ? 'Muuzaji' : 'Salesperson',
      mhazini: isSwahili ? 'Mhazini' : 'Cashier',
      admin: isSwahili ? 'Msimamizi' : 'Administrator',
      mmiliki: isSwahili ? 'Mmiliki' : 'Owner',
    },

    noEmployees: isSwahili
      ? 'Hakuna wafanyakazi waliosajiliwa bado'
      : 'No employees registered yet',
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {t.employees}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {t.allEmployees}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          {t.add}
        </button>
      </div>

      {/* EMPLOYEES LIST */}
      {wafanyakazi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Users
            size={40}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold text-slate-900">
            {t.noEmployees}
          </h3>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
          >
            <Plus size={16} />
            {t.add}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {wafanyakazi.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-2xl border border-slate-200 p-4"
            >

              {/* EMPLOYEE INFORMATION */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-700 grid place-items-center text-sm font-bold shrink-0">
                  {w.jina
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {w.jina}
                  </div>

                  <div className="text-xs text-slate-500 capitalize">
                    {t.roles[w.role] ?? w.role}
                  </div>
                </div>
              </div>

              {/* PHONE AND STORE */}
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone size={12} />
                  {w.simu}
                </div>

                <div className="flex items-center gap-1.5">
                  <Users size={12} />
                  {w.duka}
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                {w.active ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 size={12} />
                    {t.active}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold">
                    <XCircle size={12} />
                    {t.blocked}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {open && (
        <Fomu
          onClose={() => setOpen(false)}
          onSubmit={ongezaMtumiaji}
          t={t}
        />
      )}
    </div>
  )
}

/* ============================================================
   ADD EMPLOYEE FORM
============================================================ */

function Fomu({
  onClose,
  onSubmit,
  t,
}: {
  onClose: () => void
  onSubmit: (data: {
    jina: string
    simu: string
    role: NafasiMtumiaji
    duka: string
    active: boolean
  }) => unknown
  t: EmployeeTranslations
}) {
  const [jina, setJina] = useState('')
  const [simu, setSimu] = useState('')
  const [role, setRole] = useState<NafasiMtumiaji>('muuzaji')
  const [duka, setDuka] = useState('Kwembe')
  const [error, setError] = useState('')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!jina.trim() || !simu.trim()) {
      setError(t.nameAndPhoneRequired)
      return
    }

    onSubmit({
      jina: jina.trim(),
      simu: simu.trim(),
      role,
      duka: duka.trim(),
      active: true,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">
            {t.addEmployee}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="p-4 space-y-3">

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.fullName}
            </label>

            <input
              value={jina}
              onChange={(e) => {
                setJina(e.target.value)
                setError('')
              }}
              placeholder={t.namePlaceholder}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm focus:border-brand-500"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.phone}
            </label>

            <input
              type="tel"
              value={simu}
              onChange={(e) => {
                setSimu(e.target.value)
                setError('')
              }}
              placeholder={t.phonePlaceholder}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm focus:border-brand-500"
            />
          </div>

          {/* ROLE SELECTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.selectRole}
            </label>

            <div className="grid grid-cols-2 gap-2">
              {NAFASI.filter((n) => n !== 'mmiliki').map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRole(n)}
                  className={`px-3 py-2 rounded-lg border text-xs capitalize transition ${
                    role === n
                      ? 'bg-brand-50 text-brand-700 border-brand-500 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.roles[n]}
                </button>
              ))}
            </div>
          </div>

          {/* STORE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.store}
            </label>

            <input
              value={duka}
              onChange={(e) => setDuka(e.target.value)}
              placeholder={t.storePlaceholder}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none text-sm focus:border-brand-500"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Save size={16} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
