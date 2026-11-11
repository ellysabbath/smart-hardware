import { useMemo, useRef, useState } from 'react'
import {
  PackagePlus, Plus, Trash2, Save, Search, Package,
  AlertTriangle, CheckCircle2, Clock, XCircle,
  Layers, List, Store, ChevronDown, Upload, Image as ImageIcon, X,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { iconForKundi } from '../../utils/icons'
import { generateSku } from '../../utils/sku'
import type {
  BidhaaMpya,
  KundiBidhaa,
  HaliUingizaji,
  UingizajiVifaa,
  Duka,
} from '../../types'

// ============================================================
// Constants
// ============================================================
const KUNDI: KundiBidhaa[] = [
  'Saruji', 'Nondo', 'Mabati', 'Mbao', 'Rangi', 'Bomba', 'Umeme', 'Zana',
]

const UOM: string[] = ['Mfuko', 'Kg', 'Mita', 'Lita', 'Kipande', 'Dazeni', 'Futi']

const HALI_META: Record<
  HaliUingizaji,
  { label: string; tone: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', tone: 'text-amber-600', Icon: Clock },
  imepokelewa: { label: 'Imepokelewa', tone: 'text-emerald-600', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', tone: 'text-red-600', Icon: XCircle },
}

type Tab = 'moja' | 'bulk' | 'historia'

interface UingizaVifaaProps {
  role: 'mmiliki' | 'admin'
}

// ============================================================
// AlertModal — badala ya window.alert
// ============================================================
function AlertModal({
  open, title, message, tone = 'danger', onClose,
}: {
  open: boolean
  title: string
  message: string
  tone?: 'danger' | 'warning' | 'success'
  onClose: () => void
}) {
  if (!open) return null

  const toneMap = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    success: {
      icon: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
  }[tone]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 text-center">
          <div className={`w-14 h-14 rounded-full ${toneMap.bg} border ${toneMap.border} grid place-items-center mx-auto`}>
            <AlertTriangle size={26} className={toneMap.icon} />
          </div>
          <h3 className="font-semibold text-slate-900 mt-3">{title}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className={`mt-5 w-full py-2.5 rounded-lg text-white text-sm font-semibold ${toneMap.button} transition`}
          >
            Sawa
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function UingizaVifaa({ role }: UingizaVifaaProps) {
  const { maduka, uingizaji } = useStore()
  const [tab, setTab] = useState<Tab>('moja')
  const [selectedDukaId, setSelectedDukaId] = useState(maduka[0]?.id ?? '')

  const duka = maduka.find((d) => d.id === selectedDukaId)
  const mtumiaji = role === 'mmiliki' ? 'Moses Kimaro' : 'Grace Mushi'

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <PackagePlus size={26} className="text-brand-600" />
          Ingiza Vifaa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ongeza bidhaa moja moja au kwa bulk — muuzaji atathibitisha "Nimepokea"
        </p>
      </div>

      {/* CHAGUA DUKA LA KUINGIZA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Store size={14} /> Duka la Kuingiza
        </label>
        {maduka.length === 0 ? (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
            <AlertTriangle size={14} /> Hakuna maduka — ongeza duka kwanza kwenye "Maduka".
          </div>
        ) : (
          <select
            value={selectedDukaId}
            onChange={(e) => setSelectedDukaId(e.target.value)}
            className="mt-2 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
          >
            {maduka.map((d) => (
              <option key={d.id} value={d.id}>
                {d.jina} — {d.mahali}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto">
        <TabButton active={tab === 'moja'} onClick={() => setTab('moja')} Icon={Plus} label="Moja kwa Moja" />
        <TabButton active={tab === 'bulk'} onClick={() => setTab('bulk')} Icon={Layers} label="Bulk (Wengi)" />
        <TabButton active={tab === 'historia'} onClick={() => setTab('historia')} Icon={List} label="Historia" />
      </div>

      {maduka.length === 0 ? null : (
        <>
          {tab === 'moja' && duka && (
            <FomuMoja
              dukaId={duka.id}
              dukaJina={duka.jina}
              mtumiaji={mtumiaji}
              nafasi={role}
            />
          )}
          {tab === 'bulk' && duka && (
            <FomuBulk
              dukaId={duka.id}
              dukaJina={duka.jina}
              mtumiaji={mtumiaji}
              nafasi={role}
              maduka={maduka}
            />
          )}
          {tab === 'historia' && <Historia uingizaji={uingizaji} />}
        </>
      )}
    </div>
  )
}

// ============================================================
// Tab Button
// ============================================================
function TabButton({
  active, onClick, Icon, label,
}: {
  active: boolean
  onClick: () => void
  Icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
        active
          ? 'bg-brand-600 text-white border-brand-600 font-semibold'
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

// ============================================================
// Picha Upload — hakuna size limit, compression ya lazima, AlertModal
// ============================================================
function PichaUpload({
  value, onChange,
}: {
  value?: string
  onChange: (dataUrl: string | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [alert, setAlert] = useState<{ title: string; message: string; tone: 'danger' | 'warning' } | null>(null)

  const compressAndSet = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Punguza hadi max 800x800 — inatosha kwa bidhaa
        const MAX = 800
        let { width, height } = img
        if (width > height && width > MAX) {
          height = Math.round((height * MAX) / width)
          width = MAX
        } else if (height > MAX) {
          width = Math.round((width * MAX) / height)
          height = MAX
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setAlert({
            title: 'Kifaa hakiwezi kuchakata picha',
            message: 'Kivinjari chako hakina uwezo wa kuchakata picha. Jaribu kivinjari kingine.',
            tone: 'danger',
          })
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        // Anza na quality ya juu, punguza kama ni kubwa sana
        let dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        let quality = 0.85
        while (dataUrl.length > 800_000 && quality > 0.3) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        onChange(dataUrl)
      }
      img.onerror = () => {
        setAlert({
          title: 'Imeshindwa kusoma picha',
          message: 'Faili uliyopakia halifai kama picha. Jaribu picha nyingine (PNG, JPG, WEBP).',
          tone: 'danger',
        })
      }
      img.src = reader.result as string
    }
    reader.onerror = () => {
      setAlert({
        title: 'Imeshindwa kusoma faili',
        message: 'Faili halikusomwa. Jaribu tena au chagua faili lingine.',
        tone: 'danger',
      })
    }
    reader.readAsDataURL(file)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAlert({
        title: 'Faili si picha',
        message: 'Tafadhali chagua picha halali (PNG, JPG, WEBP, GIF, n.k.).',
        tone: 'warning',
      })
      return
    }
    compressAndSet(file)
  }

  return (
    <div>
      <label className="text-sm font-medium">Picha ya Bidhaa</label>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 grid place-items-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="picha" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-slate-300" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
              <Upload size={14} /> {value ? 'Badilisha Picha' : 'Pakia Picha'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-red-600 hover:bg-red-50"
              >
                <X size={12} /> Ondoa
              </button>
            )}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <AlertTriangle size={10} className="text-amber-500" />
            Picha yoyote — itapunguzwa hadi 800px automatically
          </div>
        </div>
      </div>

      <AlertModal
        open={!!alert}
        title={alert?.title ?? ''}
        message={alert?.message ?? ''}
        tone={alert?.tone ?? 'danger'}
        onClose={() => setAlert(null)}
      />
    </div>
  )
}

// ============================================================
// Bidhaa Moja kwa Moja
// ============================================================
function FomuMoja({
  dukaId, dukaJina, mtumiaji, nafasi,
}: {
  dukaId: string
  dukaJina: string
  mtumiaji: string
  nafasi: 'mmiliki' | 'admin'
}) {
  const { ongezaUingizaji, maduka } = useStore()
  const [jina, setJina] = useState('')
  const [sku, setSku] = useState('')
  const [skuManual, setSkuManual] = useState(false)
  const [kundi, setKundi] = useState<KundiBidhaa>('Saruji')
  const [beiMauzo, setBeiMauzo] = useState(0)
  const [beiUnunuzi, setBeiUnunuzi] = useState(0)
  const [uom, setUom] = useState('Mfuko')
  const [stoki, setStoki] = useState(0)
  const [location, setLocation] = useState(dukaJina)
  const [expiry, setExpiry] = useState('')
  const [maelezo, setMaelezo] = useState('')
  const [pichaUrl, setPichaUrl] = useState<string | undefined>()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleJinaChange = (value: string) => {
    setJina(value)
    if (!skuManual && value.trim()) {
      setSku(generateSku(value, kundi))
    }
  }

  const handleKundiChange = (value: KundiBidhaa) => {
    setKundi(value)
    if (!skuManual && jina.trim()) {
      setSku(generateSku(jina, value))
    }
  }

  const regenerateSku = () => {
    if (jina.trim()) {
      setSku(generateSku(jina, kundi))
      setSkuManual(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim()) return setError('Jina la bidhaa linahitajika')
    if (!sku.trim()) return setError('SKU inahitajika')
    if (beiMauzo <= 0) return setError('Bei ya mauzo lazima iwe zaidi ya sifuri')
    if (beiUnunuzi <= 0) return setError('Bei ya ununuzi lazima iwe zaidi ya sifuri')
    if (stoki <= 0) return setError('Stoki lazima iwe zaidi ya sifuri')
    if (!location.trim()) return setError('Chagua mahali (duka)')

    setError('')
    const bidhaa: BidhaaMpya = {
      jina: jina.trim(),
      sku: sku.trim().toUpperCase(),
      kundi,
      beiMauzo,
      beiUnunuzi,
      uom,
      stoki,
      location: location.trim(),
      expiry: expiry || undefined,
      iconKey: kundi,
      pichaUrl,
    }
    const u = ongezaUingizaji({
      aina: 'moja',
      dukaId,
      dukaJina,
      bidhaa: [bidhaa],
      aliyeingiza: mtumiaji,
      nafasi,
      maelezo,
    })
    setSuccess(`Bidhaa imeingizwa! ID: ${u.id} — Muuzaji atathibitisha "Nimepokea"`)
    // Reset
    setJina('')
    setSku('')
    setSkuManual(false)
    setBeiMauzo(0)
    setBeiUnunuzi(0)
    setStoki(0)
    setLocation(dukaJina)
    setExpiry('')
    setMaelezo('')
    setPichaUrl(undefined)
    setTimeout(() => setSuccess(''), 5000)
  }

  const Icon = iconForKundi(kundi)

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Store size={14} /> Duka: <span className="font-semibold text-slate-800">{dukaJina}</span>
      </div>

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Picha */}
      <PichaUpload value={pichaUrl} onChange={setPichaUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Jina la Bidhaa</label>
          <input
            value={jina}
            onChange={(e) => handleJinaChange(e.target.value)}
            placeholder="Mfano: Saruji Dangote 50kg"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">SKU</label>
            {jina.trim() && (
              <button
                type="button"
                onClick={regenerateSku}
                className="text-[10px] text-brand-600 hover:underline font-semibold"
              >
                Auto-tengeneza
              </button>
            )}
          </div>
          <input
            value={sku}
            onChange={(e) => { setSku(e.target.value.toUpperCase()); setSkuManual(true) }}
            placeholder={jina.trim() ? generateSku(jina, kundi) : 'SAR-DAN-1234'}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono"
          />
          <div className="text-[10px] text-slate-500 mt-1">
            {skuManual ? 'Umeandika mwenyewe' : 'Auto-generated kutokana na jina'}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Kundi</label>
          <select
            value={kundi}
            onChange={(e) => handleKundiChange(e.target.value as KundiBidhaa)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
          >
            {KUNDI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Bei ya Mauzo (Tsh)</label>
          <input
            type="number"
            value={beiMauzo || ''}
            onChange={(e) => setBeiMauzo(Number(e.target.value))}
            placeholder="18500"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Bei ya Ununuzi (Tsh)</label>
          <input
            type="number"
            value={beiUnunuzi || ''}
            onChange={(e) => setBeiUnunuzi(Number(e.target.value))}
            placeholder="16000"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Kipimo (UoM)</label>
          <select
            value={uom}
            onChange={(e) => setUom(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
          >
            {UOM.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Stoki</label>
          <input
            type="number"
            value={stoki || ''}
            onChange={(e) => setStoki(Number(e.target.value))}
            placeholder="200"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        {/* MAHALI = SELECT YA MADUKA */}
        <div>
          <label className="text-sm font-medium">Mahali (Duka)</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm bg-white"
          >
            <option value="">— Chagua duka —</option>
            {maduka.map((d) => (
              <option key={d.id} value={d.jina}>
                {d.jina} — {d.mahali}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Tarehe ya Kuisha (hiari)</label>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Maelezo (hiari)</label>
          <input
            value={maelezo}
            onChange={(e) => setMaelezo(e.target.value)}
            placeholder="Mfano: Saruji mpya kutoka Dangote"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
          {pichaUrl ? (
            <img src={pichaUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Icon size={22} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{jina || 'Jina la bidhaa'}</div>
          <div className="text-xs text-slate-500 truncate">
            {sku || 'SKU auto'} — {kundi} — {stoki} {uom}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {location || 'Duka halijachaguliwa'} — Tsh {beiMauzo.toLocaleString()} / {uom}
          </div>
        </div>
        <div className="text-sm font-bold text-brand-700 whitespace-nowrap">
          Tsh {(stoki * beiUnunuzi).toLocaleString()}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 inline-flex items-center justify-center gap-2"
      >
        <Save size={16} /> Ingiza Bidhaa
      </button>
    </form>
  )
}

// ============================================================
// Bulk (Wengi kwa mkupuo)
// ============================================================
interface BulkRow extends BidhaaMpya {
  _id: string
  _skuManual?: boolean
}

function FomuBulk({
  dukaId, dukaJina, mtumiaji, nafasi, maduka,
}: {
  dukaId: string
  dukaJina: string
  mtumiaji: string
  nafasi: 'mmiliki' | 'admin'
  maduka: Duka[]
}) {
  const { ongezaUingizaji } = useStore()
  const [rows, setRows] = useState<BulkRow[]>([emptyRow(dukaJina)])
  const [maelezo, setMaelezo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const jumlaBidhaa = rows.reduce((s, r) => s + (r.stoki || 0), 0)
  const jumlaThamani = rows.reduce((s, r) => s + (r.stoki || 0) * (r.beiUnunuzi || 0), 0)

  const updateRow = (id: string, patch: Partial<BulkRow>) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)))
  }

  const addRow = () => setRows((prev) => [...prev, emptyRow(dukaJina)])
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r._id !== id))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rows.length === 0) return setError('Ongeza angalau bidhaa moja')
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      if (!r.jina.trim()) return setError(`Mstari ${i + 1}: Jina linahitajika`)
      if (!r.sku.trim()) return setError(`Mstari ${i + 1}: SKU inahitajika`)
      if (r.beiMauzo <= 0) return setError(`Mstari ${i + 1}: Bei ya mauzo si sahihi`)
      if (r.beiUnunuzi <= 0) return setError(`Mstari ${i + 1}: Bei ya ununuzi si sahihi`)
      if (r.stoki <= 0) return setError(`Mstari ${i + 1}: Stoki si sahihi`)
      if (!r.location.trim()) return setError(`Mstari ${i + 1}: Chagua mahali (duka)`)
    }

    setError('')
    const bidhaa: BidhaaMpya[] = rows.map((r) => ({
      jina: r.jina.trim(),
      sku: r.sku.trim().toUpperCase(),
      kundi: r.kundi,
      beiMauzo: r.beiMauzo,
      beiUnunuzi: r.beiUnunuzi,
      uom: r.uom,
      stoki: r.stoki,
      location: r.location.trim(),
      expiry: r.expiry || undefined,
      iconKey: r.kundi,
      pichaUrl: r.pichaUrl,
    }))

    const u = ongezaUingizaji({
      aina: 'bulk',
      dukaId,
      dukaJina,
      bidhaa,
      aliyeingiza: mtumiaji,
      nafasi,
      maelezo,
    })
    setSuccess(`${bidhaa.length} bidhaa zimeingizwa! ID: ${u.id} — Muuzaji atathibitisha "Nimepokea"`)
    setRows([emptyRow(dukaJina)])
    setMaelezo('')
    setTimeout(() => setSuccess(''), 5000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-2xl border border-slate-200 p-3">
        <Store size={14} /> Duka: <span className="font-semibold text-slate-800">{dukaJina}</span>
      </div>

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Bidhaa ({rows.length})</h3>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100"
          >
            <Plus size={12} /> Ongeza Mstari
          </button>
        </div>

        <div className="space-y-2">
          {rows.map((r, idx) => (
            <BulkRowItem
              key={r._id}
              index={idx}
              row={r}
              maduka={maduka}
              onChange={(patch) => updateRow(r._id, patch)}
              onRemove={() => removeRow(r._id)}
              disabled={rows.length === 1}
            />
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">Maelezo ya Jumla (hiari)</label>
          <input
            value={maelezo}
            onChange={(e) => setMaelezo(e.target.value)}
            placeholder="Mfano: Mizigo ya Novemba kutoka msambazaji"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-slate-500">Jumla Bidhaa</div>
            <div className="font-bold">{jumlaBidhaa} pcs</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Thamani (Ununuzi)</div>
            <div className="font-bold text-brand-700">Tsh {jumlaThamani.toLocaleString()}</div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 inline-flex items-center justify-center gap-2"
        >
          <Save size={16} /> Ingiza Bidhaa Zote ({rows.length})
        </button>
      </div>
    </form>
  )
}

function BulkRowItem({
  index, row, maduka, onChange, onRemove, disabled,
}: {
  index: number
  row: BulkRow
  maduka: Duka[]
  onChange: (patch: Partial<BulkRow>) => void
  onRemove: () => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(true)
  const Icon = iconForKundi(row.kundi)

  const handleJina = (value: string) => {
    const patch: Partial<BulkRow> = { jina: value }
    if (!row._skuManual && value.trim()) {
      patch.sku = generateSku(value, row.kundi)
    }
    onChange(patch)
  }

  const handleKundi = (value: KundiBidhaa) => {
    const patch: Partial<BulkRow> = { kundi: value, iconKey: value }
    if (!row._skuManual && row.jina.trim()) {
      patch.sku = generateSku(row.jina, value)
    }
    onChange(patch)
  }

  const handleSku = (value: string) => {
    onChange({ sku: value.toUpperCase(), _skuManual: true })
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 bg-slate-50">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-1 rounded-md hover:bg-slate-200"
        >
          <ChevronDown size={14} className={`transition ${open ? '' : '-rotate-90'}`} />
        </button>
        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 overflow-hidden grid place-items-center text-slate-600 shrink-0">
          {row.pichaUrl ? (
            <img src={row.pichaUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Icon size={12} />
          )}
        </div>
        <div className="flex-1 min-w-0 text-xs">
          <div className="font-medium truncate">
            {row.jina || `Bidhaa #${index + 1}`}
          </div>
          <div className="text-slate-500 truncate">
            {row.sku || 'SKU auto'} — {row.stoki} {row.uom} — {row.location || 'Duka'} — Tsh {row.beiMauzo.toLocaleString()}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {open && (
        <div className="p-3 space-y-2">
          <PichaUpload value={row.pichaUrl} onChange={(url) => onChange({ pichaUrl: url })} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="col-span-2 md:col-span-4">
              <input
                value={row.jina}
                onChange={(e) => handleJina(e.target.value)}
                placeholder="Jina la bidhaa"
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
              />
            </div>
            <input
              value={row.sku}
              onChange={(e) => handleSku(e.target.value)}
              placeholder="SKU auto"
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-mono focus:border-brand-500 outline-none"
            />
            <select
              value={row.kundi}
              onChange={(e) => handleKundi(e.target.value as KundiBidhaa)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none bg-white"
            >
              {KUNDI.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <input
              type="number"
              value={row.beiMauzo || ''}
              onChange={(e) => onChange({ beiMauzo: Number(e.target.value) })}
              placeholder="Bei mauzo"
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
            />
            <input
              type="number"
              value={row.beiUnunuzi || ''}
              onChange={(e) => onChange({ beiUnunuzi: Number(e.target.value) })}
              placeholder="Bei ununuzi"
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
            />
            <select
              value={row.uom}
              onChange={(e) => onChange({ uom: e.target.value })}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none bg-white"
            >
              {UOM.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              type="number"
              value={row.stoki || ''}
              onChange={(e) => onChange({ stoki: Number(e.target.value) })}
              placeholder="Stoki"
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
            />

            {/* MAHALI = SELECT YA MADUKA */}
            <select
              value={row.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none bg-white"
            >
              <option value="">— Duka —</option>
              {maduka.map((d) => (
                <option key={d.id} value={d.jina}>
                  {d.jina.replace('Smart Hardware - ', '')}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={row.expiry || ''}
              onChange={(e) => onChange({ expiry: e.target.value })}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function emptyRow(defaultLocation = ''): BulkRow {
  return {
    _id: `row-${Math.random().toString(36).slice(2, 9)}`,
    jina: '',
    sku: '',
    kundi: 'Saruji',
    beiMauzo: 0,
    beiUnunuzi: 0,
    uom: 'Mfuko',
    stoki: 0,
    location: defaultLocation,
    expiry: undefined,
    iconKey: 'Saruji',
    pichaUrl: undefined,
    _skuManual: false,
  }
}

// ============================================================
// Historia
// ============================================================
function Historia({ uingizaji }: { uingizaji: UingizajiVifaa[] }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<HaliUingizaji | 'zote'>('zote')

  const filtered = useMemo(() => {
    return uingizaji.filter((u) => {
      if (filter !== 'zote' && u.hali !== filter) return false
      const query = q.toLowerCase().trim()
      if (!query) return true
      return (
        u.id.toLowerCase().includes(query) ||
        u.dukaJina.toLowerCase().includes(query) ||
        u.bidhaa.some((b) => b.jina.toLowerCase().includes(query))
      )
    })
  }, [uingizaji, q, filter])

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa ID, duka, au bidhaa..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('zote')} className={chipCls(filter === 'zote')}>Zote</button>
          {(Object.keys(HALI_META) as HaliUingizaji[]).map((h) => (
            <button key={h} onClick={() => setFilter(h)} className={chipCls(filter === h)}>
              {HALI_META[h].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold">Hakuna maingizo yanayolingana</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => {
            const meta = HALI_META[u.hali]
            return (
              <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center shrink-0 ${meta.tone}`}>
                      <meta.Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{u.id}</span>
                        <span className={`text-[10px] uppercase font-semibold ${meta.tone}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {u.aina}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {u.dukaJina} — {u.aliyeingiza} ({u.nafasi}) — {u.tarehe}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-brand-700">
                      {u.bidhaa.length} bidhaa
                    </div>
                    <div className="text-xs text-slate-500">
                      Tsh {u.jumlaThamani.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {u.bidhaa.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.pichaUrl && (
                        <img src={b.pichaUrl} alt="" className="w-4 h-4 rounded object-cover" />
                      )}
                      <span className="text-[10px]">{b.jina}</span>
                      <span className="text-[10px] text-slate-500">({b.location})</span>
                    </div>
                  ))}
                  {u.bidhaa.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500">+{u.bidhaa.length - 4}</span>
                  )}
                </div>

                {u.hali === 'imepokelewa' && u.aliyepokea && (
                  <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Imepokelewa na {u.aliyepokea} ({u.tareheKupokea})
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function chipCls(active: boolean) {
  return `px-3 py-1.5 rounded-lg text-sm border transition ${
    active
      ? 'bg-brand-600 text-white border-brand-600 font-semibold'
      : 'bg-white border-slate-200 hover:bg-slate-50'
  }`
}