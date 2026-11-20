
import { useMemo, useState } from 'react'
import type { FormEvent, ElementType } from 'react'
import {
  Store,
  Users,
  Package,
  Plus,
  X,
  Save,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Duka } from '../../types'

export default function MmilikiMaduka() {
  const { maduka, wafanyakazi, bidhaa, faida, ongezaDuka } = useStore()
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  const [open, setOpen] = useState(false)

  const t = {
    myStores: isSwahili ? 'Maduka Yangu' : 'My Stores',
    manageStores: isSwahili
      ? 'Simamia maduka yote ya biashara'
      : 'Manage all business stores',
    addStore: isSwahili ? 'Ongeza Duka' : 'Add Store',

    stores: isSwahili ? 'Maduka' : 'Stores',
    employees: isSwahili ? 'Wafanyakazi' : 'Employees',
    stock: isSwahili ? 'Stoki' : 'Stock',
    sales: isSwahili ? 'Mauzo' : 'Sales',
    netProfit: isSwahili ? 'Faida Safi' : 'Net Profit',

    noStore: isSwahili ? 'Hakuna duka bado' : 'No stores yet',
    startMessage: isSwahili
      ? 'Bofya "Ongeza Duka" kuanza.'
      : 'Click "Add Store" to get started.',

    active: isSwahili ? 'Hai' : 'Active',
    profit: isSwahili ? 'Faida' : 'Profit',
    loss: isSwahili ? 'Hasara' : 'Loss',
    salaries: isSwahili ? 'Mishahara' : 'Salaries',
    stockValue: isSwahili ? 'Thamani' : 'Value',
    pieces: isSwahili ? 'pcs' : 'pcs',

    addNewStore: isSwahili ? 'Ongeza Duka Jipya' : 'Add New Store',
    storeInformation: isSwahili
      ? 'Weka taarifa za duka'
      : 'Enter store information',

    storeName: isSwahili ? 'Jina la Duka' : 'Store Name',
    location: isSwahili ? 'Mahali' : 'Location',
    required: isSwahili ? 'linahitajika' : 'is required',

    namePlaceholder: isSwahili
      ? 'Mfano: Smart Hardware - Mbezi'
      : 'Example: Smart Hardware - Mbezi',

    locationPlaceholder: isSwahili
      ? 'Mfano: Mbezi, Dar'
      : 'Example: Mbezi, Dar es Salaam',

    cancel: isSwahili ? 'Ghairi' : 'Cancel',
    saveStore: isSwahili ? 'Hifadhi Duka' : 'Save Store',

    nameRequired: isSwahili
      ? 'Jina la duka linahitajika'
      : 'Store name is required',

    locationRequired: isSwahili
      ? 'Mahali panahitajika'
      : 'Store location is required',

    registeredStores: isSwahili
      ? 'Hakuna maduka yaliyosajiliwa'
      : 'No registered stores',
  }

  // Hesabu statistics kwa kila duka
  const dukaStats = useMemo(() => {
    return maduka.map((d) => {
      const f = faida(d.id)

      const wafanyakaziWaDuka = wafanyakazi.filter(
        (w) => w.duka === d.jina
      ).length

      const bidhaaZaDuka = bidhaa.filter(
        (b) => b.duka === d.jina
      )

      const stokiJumla = bidhaaZaDuka.reduce(
        (s, b) => s + b.stoki,
        0
      )

      const stokiThamani = bidhaaZaDuka.reduce(
        (s, b) => s + b.stoki * b.beiUnunuzi,
        0
      )

      return {
        d,
        f,
        wafanyakaziWaDuka,
        stokiJumla,
        stokiThamani,
      }
    })
  }, [maduka, wafanyakazi, bidhaa, faida])

  // Jumla ya taarifa za maduka yote
  const jumla = useMemo(
    () =>
      dukaStats.reduce(
        (a, x) => ({
          maduka: a.maduka + 1,
          wafanyakazi: a.wafanyakazi + x.wafanyakaziWaDuka,
          stokiJumla: a.stokiJumla + x.stokiJumla,
          mauzo: a.mauzo + x.f.mauzo,
          faida: a.faida + x.f.faidaSafi,
        }),
        {
          maduka: 0,
          wafanyakazi: 0,
          stokiJumla: 0,
          mauzo: 0,
          faida: 0,
        }
      ),
    [dukaStats]
  )

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Store size={26} className="text-brand-600" />
            {t.myStores}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {t.manageStores}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto"
        >
          <Plus size={16} />
          {t.addStore}
        </button>
      </div>

      {/* GENERAL STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MiniStat
          label={t.stores}
          value={String(jumla.maduka)}
          Icon={Store}
          tone="text-blue-600"
        />

        <MiniStat
          label={t.employees}
          value={String(jumla.wafanyakazi)}
          Icon={Users}
          tone="text-purple-600"
        />

        <MiniStat
          label={t.stock}
          value={`${jumla.stokiJumla} ${t.pieces}`}
          Icon={Package}
          tone="text-emerald-600"
        />

        <MiniStat
          label={t.sales}
          value={formatTsh(jumla.mauzo)}
          Icon={Store}
          tone="text-blue-600"
        />

        <MiniStat
          label={t.netProfit}
          value={formatTsh(jumla.faida)}
          Icon={Store}
          tone={
            jumla.faida < 0
              ? 'text-red-600'
              : 'text-emerald-600'
          }
        />
      </div>

      {/* STORES LIST */}
      {maduka.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Store
            size={40}
            className="mx-auto text-slate-300 mb-3"
          />

          <h3 className="font-semibold">
            {t.noStore}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {t.startMessage}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700"
          >
            <Plus size={16} />
            {t.addStore}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {dukaStats.map(
            ({
              d,
              f,
              wafanyakaziWaDuka,
              stokiJumla,
              stokiThamani,
            }) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                {/* STORE HEADER */}
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 text-brand-600 grid place-items-center">
                    <Store size={20} />
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    <CheckCircle2 size={10} />
                    {t.active}
                  </span>
                </div>

                {/* STORE INFORMATION */}
                <div className="mt-3">
                  <div className="font-semibold truncate">
                    {d.jina}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {d.mahali}
                  </div>
                </div>

                {/* SALES, PROFIT AND SALARIES */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div>
                    <div className="text-slate-500">
                      {t.sales}
                    </div>

                    <div className="font-bold text-brand-700 truncate">
                      {formatTsh(f.mauzo)}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      {t.netProfit}
                    </div>

                    <div
                      className={`font-bold truncate ${
                        f.hasara
                          ? 'text-red-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatTsh(f.faidaSafi)}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      {t.salaries}
                    </div>

                    <div className="font-bold text-purple-700 truncate">
                      {formatTsh(f.jumlaMishahara)}
                    </div>
                  </div>
                </div>

                {/* EMPLOYEES AND STOCK */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <div className="text-slate-500">
                      {t.employees}
                    </div>

                    <div className="font-semibold">
                      {wafanyakaziWaDuka}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      {t.stock}
                    </div>

                    <div className="font-semibold">
                      {stokiJumla} {t.pieces}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      {t.stockValue}
                    </div>

                    <div className="font-semibold text-slate-900 truncate">
                      {formatTsh(stokiThamani)}
                    </div>
                  </div>
                </div>

                {/* PROFIT / LOSS STATUS */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span
                    className={`text-xs font-semibold ${
                      f.hasara
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {f.hasara ? t.loss : t.profit}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ADD STORE MODAL */}
      {open && (
        <FomuDuka
          onClose={() => setOpen(false)}
          onSubmit={ongezaDuka}
          isSwahili={isSwahili}
          t={t}
        />
      )}
    </div>
  )
}

/* ============================================================
   MINI STATISTICS CARD
============================================================ */

function MiniStat({
  label,
  value,
  Icon,
  tone,
}: {
  label: string
  value: string
  Icon: ElementType
  tone: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div
        className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}
      >
        <Icon size={16} />
      </div>

      <div className="text-xs text-slate-500 mt-2.5">
        {label}
      </div>

      <div className="text-sm md:text-base font-bold text-slate-900 mt-0.5 truncate">
        {value}
      </div>
    </div>
  )
}

/* ============================================================
   FORM YA KUONGEZA DUKA
============================================================ */

type StoreTranslations = {
  addNewStore: string
  storeInformation: string
  storeName: string
  location: string
  namePlaceholder: string
  locationPlaceholder: string
  cancel: string
  saveStore: string
  nameRequired: string
  locationRequired: string
}

function FomuDuka({
  onClose,
  onSubmit,
  isSwahili,
  t,
}: {
  onClose: () => void
  onSubmit: (data: Omit<Duka, 'id'>) => Duka
  isSwahili: boolean
  t: StoreTranslations
}) {
  const [jina, setJina] = useState('')
  const [mahali, setMahali] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!jina.trim()) {
      setError(t.nameRequired)
      return
    }

    if (!mahali.trim()) {
      setError(t.locationRequired)
      return
    }

    onSubmit({
      jina: jina.trim(),
      mahali: mahali.trim(),
      mauzoLeo: 0,
      faidaLeo: 0,
      wafanyakazi: 0,
      stokiJumla: 0,
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

        {/* MODAL HEADER */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">
              {t.addNewStore}
            </div>

            <div className="text-xs text-slate-500">
              {t.storeInformation}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isSwahili ? 'Funga' : 'Close'}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="p-4 space-y-3">

          {/* STORE NAME */}
          <div>
            <label className="text-sm font-medium">
              {t.storeName}{' '}
              <span className="text-red-500">*</span>
            </label>

            <input
              value={jina}
              onChange={(e) => {
                setJina(e.target.value)
                setError('')
              }}
              placeholder={t.namePlaceholder}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
              autoFocus
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-medium">
              {t.location}{' '}
              <span className="text-red-500">*</span>
            </label>

            <input
              value={mahali}
              onChange={(e) => {
                setMahali(e.target.value)
                setError('')
              }}
              placeholder={t.locationPlaceholder}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0"
              />
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
              {t.saveStore}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
