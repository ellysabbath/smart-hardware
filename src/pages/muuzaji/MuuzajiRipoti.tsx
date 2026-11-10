import { useMemo, useState } from 'react'
import {
  BarChart3, TrendingUp, Package, Users, Wallet,
  AlertTriangle, CheckCircle2, Download, Calendar,
  FileText, FileSpreadsheet, File, Search, Filter,
  Trash2, X, Eye, Plus, Clock, Store, User, Layers,
  ArrowDownToLine, Sheet, Table, Building2,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from 'recharts'
import {
  ripotiMauzo, ripotiStoki, ripotiWateja,
} from '../../data/demo'
import { useDocuments } from '../../context/DocumentContext'
import { formatTsh } from '../../utils/faida'
import type {
  AinaDocument,
  Document,
  HaliDocument,
} from '../../types'

// ============================================================
// Meta za Documents
// ============================================================
const AINA_DOC_META: Record<
  AinaDocument,
  { label: string; Icon: React.ElementType; color: string }
> = {
  mauzo: { label: 'Mauzo', Icon: TrendingUp, color: 'text-brand-700' },
  stoki: { label: 'Stoki', Icon: Package, color: 'text-emerald-700' },
  wateja: { label: 'Wateja', Icon: Users, color: 'text-purple-700' },
  madeni: { label: 'Madeni', Icon: Wallet, color: 'text-red-700' },
  gharama: { label: 'Gharama', Icon: FileText, color: 'text-amber-700' },
  jumla: { label: 'Jumla', Icon: BarChart3, color: 'text-slate-700' },
}

const FORMAT_META: Record<
  'pdf' | 'csv' | 'excel',
  { Icon: React.ElementType; color: string; bg: string }
> = {
  pdf: { Icon: File, color: 'text-red-700', bg: 'bg-red-50' },
  csv: { Icon: Table, color: 'text-brand-700', bg: 'bg-brand-50' },
  excel: { Icon: Sheet, color: 'text-emerald-700', bg: 'bg-emerald-50' },
}

const HALI_DOC_META: Record<
  HaliDocument,
  { label: string; Icon: React.ElementType; color: string }
> = {
  tayari: { label: 'Tayari', Icon: CheckCircle2, color: 'text-emerald-700' },
  inasindika: { label: 'Inasindika', Icon: Clock, color: 'text-amber-700' },
  imeshindwa: { label: 'Imeshindwa', Icon: X, color: 'text-red-700' },
}

type Tab = 'mauzo' | 'stoki' | 'wateja' | 'documents'

const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: 'mauzo', label: 'Mauzo', Icon: TrendingUp },
  { key: 'stoki', label: 'Stoki', Icon: Package },
  { key: 'wateja', label: 'Wateja', Icon: Users },
  { key: 'documents', label: 'Documents', Icon: FileText },
]

export default function MuuzajiRipoti() {
  const [tab, setTab] = useState<Tab>('mauzo')
  const { documents } = useDocuments()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={24} className="text-brand-600" />
            Ripoti za Duka
          </h1>
          <p className="text-slate-500 text-sm">
            Duka la Kwembe - Muuzaji: Juma Hassan
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 self-start sm:self-auto">
          <Plus size={16} />
          Zalisha Ripoti
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap transition ${
              tab === t.key
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.Icon size={14} />
            {t.label}
            {t.key === 'documents' && documents.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                tab === t.key ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {documents.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'mauzo' && <RipotiMauzoTab />}
      {tab === 'stoki' && <RipotiStokiTab />}
      {tab === 'wateja' && <RipotiWatejaTab />}
      {tab === 'documents' && <DocumentsTab />}
    </div>
  )
}

// ============================================================
// Tab: Mauzo
// ============================================================
function RipotiMauzoTab() {
  const jumla = useMemo(
    () =>
      ripotiMauzo.reduce(
        (a, r) => ({
          mauzo: a.mauzo + r.mauzo,
          faida: a.faida + r.faida,
          orders: a.orders + r.orders,
        }),
        { mauzo: 0, faida: 0, orders: 0 }
      ),
    []
  )

  return (
    <div className="space-y-4">
      {/* Stats 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <RipotiStat
          label="Mauzo (Siku 7)"
          value={formatTsh(jumla.mauzo)}
          Icon={TrendingUp}
          accent="brand"
        />
        <RipotiStat
          label="Faida"
          value={formatTsh(jumla.faida)}
          Icon={CheckCircle2}
          accent="emerald"
        />
        <RipotiStat
          label="Orders"
          value={String(jumla.orders)}
          Icon={Package}
          accent="brand"
        />
        <RipotiStat
          label="Wastani/Order"
          value={formatTsh(Math.round(jumla.mauzo / jumla.orders))}
          Icon={BarChart3}
          accent="amber"
        />
      </div>

      {/* Chati */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-600" />
            Mauzo ya Siku 7
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar size={12} />
            04 - 10 Nov 2026
          </div>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ripotiMauzo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tarehe" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip formatter={(v) => formatTsh(Number(v ?? 0))} />
              <Line
                type="monotone"
                dataKey="mauzo"
                stroke="#2563eb"
                strokeWidth={2}
                name="Mauzo"
              />
              <Line
                type="monotone"
                dataKey="faida"
                stroke="#10b981"
                strokeWidth={2}
                name="Faida"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText size={16} className="text-brand-600" />
            Jedwali la Mauzo
          </h3>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium">
            <Download size={12} />
            Pakua CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Tarehe</th>
                <th className="p-3 text-right">Mauzo</th>
                <th className="p-3 text-right">Faida</th>
                <th className="p-3 text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ripotiMauzo.map((r) => (
                <tr key={r.tarehe}>
                  <td className="p-3">{r.tarehe}</td>
                  <td className="p-3 text-right">{r.mauzo.toLocaleString()}</td>
                  <td className="p-3 text-right text-emerald-600 font-medium">
                    {r.faida.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">{r.orders}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td className="p-3 font-bold">JUMLA</td>
                <td className="p-3 text-right font-bold">
                  {jumla.mauzo.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  {jumla.faida.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold">{jumla.orders}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tab: Stoki
// ============================================================
function RipotiStokiTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label="Bidhaa Zote"
          value={String(ripotiStoki.length)}
          Icon={Package}
          accent="brand"
        />
        <RipotiStat
          label="Zinazoisha"
          value={String(ripotiStoki.filter((r) => r.hali === 'imeisha').length)}
          Icon={AlertTriangle}
          accent="red"
        />
        <RipotiStat
          label="Zinaribia"
          value={String(ripotiStoki.filter((r) => r.hali === 'inaribia').length)}
          Icon={Clock}
          accent="amber"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <Package size={16} className="text-brand-600" />
            Jedwali la Stoki
          </h3>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium">
            <Download size={12} />
            Pakua Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Bidhaa</th>
                <th className="p-3 text-right">Stoki</th>
                <th className="p-3 text-right">Kiwango Chini</th>
                <th className="p-3 text-right">Hali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ripotiStoki.map((r) => (
                <tr key={r.sku}>
                  <td className="p-3">
                    <div className="font-medium">{r.bidhaa}</div>
                    <div className="text-xs text-slate-500">{r.sku}</div>
                  </td>
                  <td className="p-3 text-right font-semibold">{r.stoki}</td>
                  <td className="p-3 text-right text-slate-500">
                    {r.kiwangoChini}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                        r.hali === 'sawa'
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.hali === 'inaribia'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {r.hali === 'sawa' && <CheckCircle2 size={12} />}
                      {(r.hali === 'inaribia' || r.hali === 'imeisha') && (
                        <AlertTriangle size={12} />
                      )}
                      {r.hali}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tab: Wateja
// ============================================================
function RipotiWatejaTab() {
  const jumlaDeni = ripotiWateja.reduce((s, w) => s + w.deni, 0)
  const jumlaManunuzi = ripotiWateja.reduce((s, w) => s + w.manunuzi, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label="Wateja"
          value={String(ripotiWateja.length)}
          Icon={Users}
          accent="brand"
        />
        <RipotiStat
          label="Jumla ya Madeni"
          value={formatTsh(jumlaDeni)}
          Icon={Wallet}
          accent="red"
        />
        <RipotiStat
          label="Jumla ya Manunuzi"
          value={formatTsh(jumlaManunuzi)}
          Icon={TrendingUp}
          accent="emerald"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold flex items-center gap-2">
            <Users size={16} className="text-brand-600" />
            Jedwali la Wateja
          </h3>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium">
            <Download size={12} />
            Pakua CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Mteja</th>
                <th className="p-3 text-right">Manunuzi</th>
                <th className="p-3 text-right">Deni</th>
                <th className="p-3">Mwisho Kununua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ripotiWateja.map((w) => (
                <tr key={w.simu}>
                  <td className="p-3">
                    <div className="font-medium">{w.mteja}</div>
                    <div className="text-xs text-slate-500">{w.simu}</div>
                  </td>
                  <td className="p-3 text-right">
                    {w.manunuzi.toLocaleString()}
                  </td>
                  <td
                    className={`p-3 text-right font-semibold ${
                      w.deni > 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {w.deni.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-500">{w.mwishoKununua}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tab: Documents
// ============================================================
function DocumentsTab() {
  const { documents, futa } = useDocuments()
  const [q, setQ] = useState('')
  const [filterAina, setFilterAina] = useState<AinaDocument | 'zote'>('zote')
  const [selected, setSelected] = useState<Document | null>(null)

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim()
    return documents.filter((d) => {
      if (filterAina !== 'zote' && d.aina !== filterAina) return false
      if (!query) return true
      return (
        d.jina.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.dukaJina.toLowerCase().includes(query)
      )
    })
  }, [documents, q, filterAina])

  const stats = useMemo(() => {
    const zote = documents.length
    const tayari = documents.filter((d) => d.hali === 'tayari').length
    const inasindika = documents.filter((d) => d.hali === 'inasindika').length
    return { zote, tayari, inasindika }
  }, [documents])

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <RipotiStat
          label="Documents Zote"
          value={String(stats.zote)}
          Icon={FileText}
          accent="brand"
        />
        <RipotiStat
          label="Tayari"
          value={String(stats.tayari)}
          Icon={CheckCircle2}
          accent="emerald"
        />
        <RipotiStat
          label="Zinasindika"
          value={String(stats.inasindika)}
          Icon={Clock}
          accent="amber"
        />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta kwa jina, ID, au duka..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterAina('zote')}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
              filterAina === 'zote'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Zote
          </button>
          {(Object.keys(AINA_DOC_META) as AinaDocument[]).map((a) => {
            const meta = AINA_DOC_META[a]
            return (
              <button
                key={a}
                onClick={() => setFilterAina(a)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition ${
                  filterAina === a
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <meta.Icon size={10} />
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <FileText size={40} className="mx-auto mb-3 text-slate-300" />
          <div className="font-semibold">Hakuna documents</div>
          <p className="text-sm text-slate-500 mt-1">
            Bofya "Zalisha Ripoti" kuanza.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => {
            const aina = AINA_DOC_META[d.aina]
            const format = FORMAT_META[d.format]
            const hali = HALI_DOC_META[d.hali]
            return (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg grid place-items-center shrink-0 ${format.bg} ${format.color}`}
                  >
                    <format.Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelected(d)}
                      className="text-sm font-semibold text-left truncate hover:text-brand-600 w-full"
                    >
                      {d.jina}
                    </button>
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
                      <span className={`inline-flex items-center gap-1 ${aina.color}`}>
                        <aina.Icon size={10} />
                        {aina.label}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="uppercase font-semibold text-slate-600">
                        {d.format}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">{d.ukubwa}</span>
                      <span className="text-slate-300">|</span>
                      <span className={`inline-flex items-center gap-1 ${hali.color}`}>
                        <hali.Icon size={10} />
                        {hali.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {d.tarehe} - {d.muda} - {d.kipindi}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelected(d)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                      title="Ona"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="p-2 rounded-lg text-brand-600 hover:bg-brand-50 disabled:opacity-40"
                      disabled={d.hali !== 'tayari'}
                      title="Pakua"
                    >
                      <ArrowDownToLine size={14} />
                    </button>
                    <button
                      onClick={() => futa(d.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title="Futa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <DocumentDetailModal
          document={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Document Detail Modal
// ============================================================
function DocumentDetailModal({
  document,
  onClose,
}: {
  document: Document
  onClose: () => void
}) {
  const aina = AINA_DOC_META[document.aina]
  const format = FORMAT_META[document.format]
  const hali = HALI_DOC_META[document.hali]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
          <div>
            <div className="font-semibold">{document.id}</div>
            <div className="text-xs text-slate-500">{document.tarehe} {document.muda}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${format.bg} ${format.color}`}>
              <format.Icon size={12} />
              {document.format.toUpperCase()}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${hali.color}`}>
              <hali.Icon size={12} />
              {hali.label}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${aina.color}`}>
              <aina.Icon size={12} />
              {aina.label}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500">Jina la Document</div>
            <div className="font-semibold">{document.jina}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Ukubwa</div>
              <div className="font-semibold">{document.ukubwa}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Format</div>
              <div className="font-semibold uppercase">{document.format}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Kipindi</div>
            <div className="font-medium">{document.kipindi}</div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Store size={12} /> {document.dukaJina}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User size={12} /> {document.aliyezalisha}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              disabled={document.hali !== 'tayari'}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownToLine size={14} />
              Pakua
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-sm hover:bg-slate-200"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Stat Card (nyeupe + accent border-l)
// ============================================================
type Accent = 'brand' | 'emerald' | 'amber' | 'red'
const ACCENT_BORDER: Record<Accent, string> = {
  brand: 'border-l-brand-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
}
const ACCENT_TEXT: Record<Accent, string> = {
  brand: 'text-brand-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
}

function RipotiStat({
  label,
  value,
  Icon,
  accent,
}: {
  label: string
  value: string
  Icon: React.ElementType
  accent: Accent
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${ACCENT_BORDER[accent]} p-4`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={ACCENT_TEXT[accent]} />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-base md:text-lg font-bold mt-2 truncate text-slate-900">
        {value}
      </div>
    </div>
  )
}