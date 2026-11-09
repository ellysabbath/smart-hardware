import { useMemo, useState } from 'react'
import {
  PackagePlus, Plus, Trash2, Save, Search, Package,
  AlertTriangle, CheckCircle2, Clock, XCircle, X,
  Layers, List, Store, ChevronDown, Upload, Eye,
} from 'lucide-react'
import { useDuka } from '../../context/DukaContext'
import { useUingizaji } from '../../context/UingizajiContext'
import { iconForKundi } from '../../utils/icons'
import type {
  AinaUingizaji, BidhaaMpya, KundiBidhaa, HaliUingizaji, UingizajiVifaa,
} from '../../types'

const KUNDI: KundiBidhaa[] = [
  'Saruji', 'Nondo', 'Mabati', 'Mbao', 'Rangi', 'Bomba', 'Umeme', 'Zana',
]

const UOM: string[] = ['Mfuko', 'Kg', 'Mita', 'Lita', 'Kipande', 'Dazeni', 'Futi']

const HALI_META: Record<
  HaliUingizaji,
  { label: string; color: string; Icon: React.ElementType }
> = {
  inasubiri: { label: 'Inasubiri', color: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Clock },
  imepokelewa: { label: 'Imepokelewa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  imekataliwa: { label: 'Imekataliwa', color: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
}

type Tab = 'moja' | 'bulk' | 'historia'

interface UingizaVifaaProps {
  role: 'mmiliki' | 'admin'
}

export default function UingizaVifaa({ role }: UingizaVifaaProps) {
  const { maduka } = useDuka()
  const { uingizaji } = useUingizaji()
  const [tab, setTab] = useState<Tab>('moja')
  const [selectedDukaId, setSelectedDukaId] = useState(maduka[0]?.id || '')

  const duka = maduka.find((d) => d.id === selectedDukaId)
  const mtumiaji = role === 'mmiliki' ? 'Moses Kimaro' : 'Grace Mushi'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PackagePlus size={24} className="text-brand-600" />
          Ingiza Vifaa
        </h1>
        <p className="text-slate-500 text-sm">
          Ongeza bidhaa moja moja au kwa bulk, kisha muuzaji atathibitisha "Nimepokea"
        </p>
      </div>

      {/* Chagua duka */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Store size={14} />
          Chagua Duka la Kuingiza
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {maduka.map((d) => {
            const active = selectedDukaId === d.id
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDukaId(d.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition ${
                  active
                    ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Store size={14} />
                {d.jina}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <TabButton active={tab === 'moja'} onClick={() => setTab('moja')} Icon={Plus} label="Moja kwa Moja" />
        <TabButton active={tab === 'bulk'} onClick={() => setTab('bulk')} Icon={Layers} label="Bulk (Wengi)" />
        <TabButton active={tab === 'historia'} onClick={() => setTab('historia')} Icon={List} label="Historia" />
      </div>

      {tab === 'moja' && (
        <FomuMoja
          dukaId={selectedDukaId}
          dukaJina={duka?.jina || ''}
          mtumiaji={mtumiaji}
          nafasi={role}
        />
      )}
      {tab === 'bulk' && (
        <FomuBulk
          dukaId={selectedDukaId}
          dukaJina={duka?.jina || ''}
          mtumiaji={mtumiaji}
          nafasi={role}
        />
      )}
      {tab === 'historia' && <Historia uingizaji={uingizaji} />}
    </div>
  )
}

// ============================================================
// Tab button
// ============================================================
function TabButton({
  active, onClick, Icon, label,
}: {
  active: boolean; onClick: () => void; Icon: React.ElementType; label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

// ============================================================
// Bidhaa moja kwa moja
// ============================================================
function FomuMoja({
  dukaId, dukaJina, mtumiaji, nafasi,
}: {
  dukaId: string; dukaJina: string; mtumiaji: string; nafasi: 'mmiliki' | 'admin'
}) {
  const { ongezaUingizaji } = useUingizaji()
  const [jina, setJina] = useState('')
  const [sku, setSku] = useState('')
  const [kundi, setKundi] = useState<KundiBidhaa>('Saruji')
  const [beiMauzo, setBeiMauzo] = useState(0)
  const [beiUnunuzi, setBeiUnunuzi] = useState(0)
  const [uom, setUom] = useState('Mfuko')
  const [stoki, setStoki] = useState(0)
  const [location, setLocation] = useState('')
  const [expiry, setExpiry] = useState('')
  const [maelezo, setMaelezo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jina.trim()) return setError('Jina la bidhaa linahitajika')
    if (!sku.trim()) return setError('SKU inahitajika')
    if (beiMauzo <= 0) return setError('Bei ya mauzo lazima iwe zaidi ya sifuri')
    if (beiUnunuzi <= 0) return setError('Bei ya ununuzi lazima iwe zaidi ya sifuri')
    if (stoki <= 0) return setError('Stoki lazima iwe zaidi ya sifuri')

    setError('')
    const bidhaa: BidhaaMpya = {
      jina: jina.trim(),
      sku: sku.trim().toUpperCase(),
      kundi,
      beiMauzo,
      beiUnunuzi,
      uom,
      stoki,
      location: location.trim() || 'Haijawekwa',
      expiry: expiry || undefined,
      iconKey: kundi,
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
    setSuccess(`Bidhaa imeingizwa! ID: ${u.id} - Muuzaji atathibitisha "Nimepokea"`)
    // Reset
    setJina('')
    setSku('')
    setBeiMauzo(0)
    setBeiUnunuzi(0)
    setStoki(0)
    setLocation('')
    setExpiry('')
    setMaelezo('')
    setTimeout(() => setSuccess(''), 5000)
  }

  const Icon = iconForKundi(kundi)

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Store size={14} />
        Duka: <span className="font-semibold text-slate-800">{dukaJina}</span>
      </div>

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Jina la Bidhaa</label>
          <input
            value={jina}
            onChange={(e) => setJina(e.target.value)}
            placeholder="Mfano: Saruji Dangote 50kg"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value.toUpperCase())}
            placeholder="SAR-DAN-50"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Kundi</label>
          <select
            value={kundi}
            onChange={(e) => setKundi(e.target.value as KundiBidhaa)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
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
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
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
        <div>
          <label className="text-sm font-medium">Mahali (Location)</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Shed A, Raka 3"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
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
      <div className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 grid place-items-center text-slate-600">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{jina || 'Jina la bidhaa'}</div>
          <div className="text-xs text-slate-500">
            {kundi} - {stoki} {uom} - Tsh {beiMauzo.toLocaleString()}
          </div>
        </div>
        <div className="text-sm font-bold text-brand-700 whitespace-nowrap">
          Tsh {(stoki * beiUnunuzi).toLocaleString()}
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
        className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 inline-flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Ingiza Bidhaa
      </button>
    </form>
  )
}

// ============================================================
// Bulk (Wengi kwa mkupuo)
// ============================================================
interface BulkRow extends BidhaaMpya {
  _id: string
}

function FomuBulk({
  dukaId, dukaJina, mtumiaji, nafasi,
}: {
  dukaId: string; dukaJina: string; mtumiaji: string; nafasi: 'mmiliki' | 'admin'
}) {
  const { ongezaUingizaji } = useUingizaji()
  const [rows, setRows] = useState<BulkRow[]>([emptyRow()])
  const [maelezo, setMaelezo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const jumlaBidhaa = rows.reduce((s, r) => s + (r.stoki || 0), 0)
  const jumlaThamani = rows.reduce((s, r) => s + (r.stoki || 0) * (r.beiUnunuzi || 0), 0)

  const updateRow = (id: string, patch: Partial<BulkRow>) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)))
  }

  const addRow = () => setRows((prev) => [...prev, emptyRow()])
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
      location: r.location.trim() || 'Haijawekwa',
      expiry: r.expiry || undefined,
      iconKey: r.kundi,
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
    setSuccess(`${bidhaa.length} bidhaa zimeingizwa! ID: ${u.id} - Muuzaji atathibitisha "Nimepokea"`)
    setRows([emptyRow()])
    setMaelezo('')
    setTimeout(() => setSuccess(''), 5000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-xl border border-slate-200 p-3">
        <Store size={14} />
        Duka: <span className="font-semibold text-slate-800">{dukaJina}</span>
      </div>

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Bidhaa ({rows.length})</h3>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100"
          >
            <Plus size={12} />
            Ongeza Mstari
          </button>
        </div>

        <div className="space-y-2">
          {rows.map((r, idx) => (
            <BulkRowItem
              key={r._id}
              index={idx}
              row={r}
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

        <div className="p-3 rounded-lg bg-slate-50 grid grid-cols-2 gap-2 text-sm">
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
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 inline-flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Ingiza Bidhaa Zote ({rows.length})
        </button>
      </div>
    </form>
  )
}

function BulkRowItem({
  index, row, onChange, onRemove, disabled,
}: {
  index: number
  row: BulkRow
  onChange: (patch: Partial<BulkRow>) => void
  onRemove: () => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(true)
  const Icon = iconForKundi(row.kundi)

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
        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 grid place-items-center text-slate-600">
          <Icon size={12} />
        </div>
        <div className="flex-1 min-w-0 text-xs">
          <div className="font-medium truncate">
            {row.jina || `Bidhaa #${index + 1}`}
          </div>
          <div className="text-slate-500">
            {row.stoki} {row.uom} - Tsh {row.beiMauzo.toLocaleString()}
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
        <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="col-span-2 md:col-span-4">
            <input
              value={row.jina}
              onChange={(e) => onChange({ jina: e.target.value })}
              placeholder="Jina la bidhaa"
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
            />
          </div>
          <input
            value={row.sku}
            onChange={(e) => onChange({ sku: e.target.value.toUpperCase() })}
            placeholder="SKU"
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-mono focus:border-brand-500 outline-none"
          />
          <select
            value={row.kundi}
            onChange={(e) => onChange({ kundi: e.target.value as KundiBidhaa, iconKey: e.target.value as KundiBidhaa })}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
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
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
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
          <input
            value={row.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Mahali"
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
          />
          <input
            type="date"
            value={row.expiry || ''}
            onChange={(e) => onChange({ expiry: e.target.value })}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:border-brand-500 outline-none"
          />
        </div>
      )}
    </div>
  )
}

function emptyRow(): BulkRow {
  return {
    _id: `row-${Math.random().toString(36).slice(2, 9)}`,
    jina: '',
    sku: '',
    kundi: 'Saruji',
    beiMauzo: 0,
    beiUnunuzi: 0,
    uom: 'Mfuko',
    stoki: 0,
    location: '',
    expiry: undefined,
    iconKey: 'Saruji',
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
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
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
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Package size={32} className="mx-auto mb-2 text-slate-300" />
          <div className="text-sm text-slate-500">Hakuna maingizo yanayolingana</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => {
            const meta = HALI_META[u.hali]
            return (
              <div key={u.id} className="bg-white rounded-xl border border-slate-200 p-3 md:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${meta.color}`}>
                      <meta.Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{u.id}</span>
                        <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {u.aina}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {u.dukaJina} - {u.aliyeingiza} ({u.nafasi}) - {u.tarehe}
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
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.jina} ({b.stoki} {b.uom})
                    </span>
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
      ? 'bg-brand-600 text-white border-brand-600'
      : 'bg-white border-slate-200 hover:bg-slate-50'
  }`
}