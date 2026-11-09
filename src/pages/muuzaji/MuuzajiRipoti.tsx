import { useState } from 'react'
import {
  BarChart3, TrendingUp, Package, Users, Wallet,
  AlertTriangle, CheckCircle2, Download, Calendar,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from 'recharts'
import {
  ripotiMauzo, ripotiStoki, ripotiWateja,
} from '../../data/demo'

type Tab = 'mauzo' | 'stoki' | 'wateja'

const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: 'mauzo', label: 'Mauzo', Icon: TrendingUp },
  { key: 'stoki', label: 'Stoki', Icon: Package },
  { key: 'wateja', label: 'Wateja', Icon: Users },
]

export default function MuuzajiRipoti() {
  const [tab, setTab] = useState<Tab>('mauzo')

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Ripoti za Duka</h1>
          <p className="text-slate-500 text-sm">Duka la Kwembe - Muuzaji: Juma Hassan</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 self-start sm:self-auto">
          <Download size={16} />
          Pakua PDF
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border whitespace-nowrap ${
              tab === t.key
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.Icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'mauzo' && <RipotiMauzoTab />}
      {tab === 'stoki' && <RipotiStokiTab />}
      {tab === 'wateja' && <RipotiWatejaTab />}
    </div>
  )
}

function RipotiMauzoTab() {
  const jumla = ripotiMauzo.reduce(
    (a, r) => ({
      mauzo: a.mauzo + r.mauzo,
      faida: a.faida + r.faida,
      orders: a.orders + r.orders,
    }),
    { mauzo: 0, faida: 0, orders: 0 }
  )
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Mauzo (Siku 7)" value={`Tsh ${jumla.mauzo.toLocaleString()}`} />
        <Card label="Faida" value={`Tsh ${jumla.faida.toLocaleString()}`} tone="emerald" />
        <Card label="Orders" value={String(jumla.orders)} />
        <Card label="Wastani/Order" value={`Tsh ${Math.round(jumla.mauzo / jumla.orders).toLocaleString()}`} />
      </div>

      <div className="bg-white rounded-xl border p-4 md:p-5">
        <h3 className="font-semibold mb-3">Mauzo ya Siku 7</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ripotiMauzo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tarehe" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `Tsh ${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="mauzo" stroke="#2563eb" strokeWidth={2} name="Mauzo" />
              <Line type="monotone" dataKey="faida" stroke="#10b981" strokeWidth={2} name="Faida" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
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
                  <td className="p-3 text-right text-emerald-600">{r.faida.toLocaleString()}</td>
                  <td className="p-3 text-right">{r.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RipotiStokiTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card label="Bidhaa Zote" value={String(ripotiStoki.length)} />
        <Card label="Zinazoisha" value={String(ripotiStoki.filter((r) => r.hali === 'imeisha').length)} tone="red" />
        <Card label="Zinaribia" value={String(ripotiStoki.filter((r) => r.hali === 'inaribia').length)} tone="amber" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
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
                  <td className="p-3 text-right text-slate-500">{r.kiwangoChini}</td>
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
                      {r.hali === 'inaribia' && <AlertTriangle size={12} />}
                      {r.hali === 'imeisha' && <AlertTriangle size={12} />}
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

function RipotiWatejaTab() {
  const jumlaDeni = ripotiWateja.reduce((s, w) => s + w.deni, 0)
  const jumlaManunuzi = ripotiWateja.reduce((s, w) => s + w.manunuzi, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card label="Wateja" value={String(ripotiWateja.length)} />
        <Card label="Jumla ya Madeni" value={`Tsh ${jumlaDeni.toLocaleString()}`} tone="red" />
        <Card label="Jumla ya Manunuzi" value={`Tsh ${jumlaManunuzi.toLocaleString()}`} tone="emerald" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
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
                  <td className="p-3 text-right">{w.manunuzi.toLocaleString()}</td>
                  <td className={`p-3 text-right font-semibold ${w.deni > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
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

function Card({
  label,
  value,
  tone = 'brand',
}: {
  label: string
  value: string
  tone?: 'brand' | 'emerald' | 'amber' | 'red'
}) {
  const map = {
    brand: 'text-brand-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
  }
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-base md:text-lg font-bold mt-1 truncate ${map[tone]}`}>
        {value}
      </div>
    </div>
  )
}