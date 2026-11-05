import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { fmtTsh, today } from '../../lib/utils'
import { Heart, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

export default function ZakatPage() {
  const { sales, expenses, zakat, addZakatRecord, markZakatPaid } = useData()
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [viewId, setViewId] = useState<string | null>(null)

  // compute profit for period
  const computeProfit = (type: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date()
    const cutoff = new Date()
    if (type === 'daily') cutoff.setHours(0, 0, 0, 0)
    else if (type === 'weekly') cutoff.setDate(now.getDate() - 7)
    else cutoff.setDate(now.getDate() - 30)

    const salesInPeriod = sales.filter(s => new Date(s.createdAt) >= cutoff)
    const revenue = salesInPeriod.reduce((sum, s) => sum + s.total, 0)
    const cogs = salesInPeriod.reduce((sum, s) =>
      sum + s.items.reduce((x, i) => x + i.buyPrice * i.qty, 0), 0)
    const opex = expenses.filter(e => e.status === 'approved' && new Date(e.date) >= cutoff)
      .reduce((sum, e) => sum + e.amount, 0)
    const netProfit = Math.max(0, revenue - cogs - opex)
    return { revenue, cogs, opex, netProfit }
  }

  const preview = computeProfit(period)

  const save = () => {
    const z = preview.netProfit * 0.10
    const s = preview.netProfit * 0.10
    addZakatRecord({
      date: today(),
      type: period,
      netProfit: preview.netProfit,
      zakat: z,
      sadaka: s,
      total: z + s,
      paid: false,
    })
    setOpen(false)
  }

  const totalOwed = zakat.filter(z => !z.paid).reduce((s, z) => s + z.total, 0)
  const totalPaid = zakat.filter(z => z.paid).reduce((s, z) => s + z.total, 0)

  return (
    <Layout title="Zaka & Sadaka">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <div className="flex items-center gap-2 text-emerald-100 text-xs mb-1"><Heart size={14} /> Kwa Bwana - Haijalipwa</div>
          <div className="text-2xl font-bold">{fmtTsh(totalOwed)}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><CheckCircle2 size={14} /> Zilizolipwa</div>
          <div className="text-2xl font-bold text-emerald-600">{fmtTsh(totalPaid)}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><Sparkles size={14} /> Kanuni</div>
          <div className="text-sm text-slate-700">Zaka 10% + Sadaka 10% = 20% ya Faida Halisi</div>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-500">Hesabu ya Zaka na Sadaka kwa kila kipindi</div>
        <Button onClick={() => setOpen(true)}>
          <span className="flex items-center gap-2"><TrendingUp size={16} /> Hesabu Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Tarehe', 'Kipindi', 'Faida Halisi', 'Zaka 10%', 'Sadaka 10%', 'Jumla', 'Hali', '']}>
          {zakat.map(z => (
            <tr key={z.id} className="hover:bg-slate-50">
              <Td className="text-xs">{z.date}</Td>
              <Td><Badge color="blue">{z.type === 'daily' ? 'Siku' : z.type === 'weekly' ? 'Wiki' : 'Mwezi'}</Badge></Td>
              <Td>{fmtTsh(z.netProfit)}</Td>
              <Td className="text-emerald-700">{fmtTsh(z.zakat)}</Td>
              <Td className="text-emerald-700">{fmtTsh(z.sadaka)}</Td>
              <Td className="font-bold">{fmtTsh(z.total)}</Td>
              <Td><Badge color={z.paid ? 'green' : 'amber'}>{z.paid ? 'Imelipwa' : 'Inadaiwa'}</Badge></Td>
              <Td>
                {!z.paid ? (
                  <button onClick={() => markZakatPaid(z.id)} className="text-xs text-emerald-600 hover:underline">Nimelipa</button>
                ) : (
                  <span className="text-xs text-slate-400">{z.paidDate}</span>
                )}
              </Td>
            </tr>
          ))}
          {zakat.length === 0 && (
            <tr><td colSpan={8} className="text-center py-10 text-slate-500">Hakuna rekodi bado</td></tr>
          )}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Hesabu Zaka & Sadaka" size="md">
        <div className="space-y-4">
          <select value={period} onChange={e => setPeriod(e.target.value as any)}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="daily">Kipindi cha Siku</option>
            <option value="weekly">Kipindi cha Wiki</option>
            <option value="monthly">Kipindi cha Mwezi</option>
          </select>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Mauzo:</span><span>{fmtTsh(preview.revenue)}</span></div>
            <div className="flex justify-between"><span>Gharama ya Bidhaa (COGS):</span><span>{fmtTsh(preview.cogs)}</span></div>
            <div className="flex justify-between"><span>Gharama za Uendeshaji:</span><span>{fmtTsh(preview.opex)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Faida Halisi:</span><span className="text-brand-600">{fmtTsh(preview.netProfit)}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Zaka (10%):</span><span className="font-semibold text-emerald-700">{fmtTsh(preview.netProfit * 0.1)}</span></div>
            <div className="flex justify-between text-sm"><span>Sadaka ya Wiki (10%):</span><span className="font-semibold text-emerald-700">{fmtTsh(preview.netProfit * 0.1)}</span></div>
            <div className="flex justify-between font-bold border-t border-emerald-300 pt-2 text-lg">
              <span>Jumla ya Bwana:</span><span className="text-emerald-800">{fmtTsh(preview.netProfit * 0.2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Inayobaki kwako:</span><span>{fmtTsh(preview.netProfit * 0.8)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button variant="success" onClick={save}>Hifadhi Rekodi</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}