import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { fmtTsh, today, addDays } from '../../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function ProfitLossPage() {
  const { sales, expenses, products } = useData()
  const [from, setFrom] = useState(addDays(today(), -30))
  const [to, setTo] = useState(today())

  const salesRange = sales.filter(s => s.createdAt.slice(0, 10) >= from && s.createdAt.slice(0, 10) <= to)
  const revenue = salesRange.reduce((s, x) => s + x.total, 0)
  const cogs = salesRange.reduce((s, x) => s + x.items.reduce((y, i) => y + i.buyPrice * i.qty, 0), 0)
  const grossProfit = revenue - cogs
  const opex = expenses.filter(e => e.status === 'approved' && e.date >= from && e.date <= to)
    .reduce((s, e) => s + e.amount, 0)
  const netProfit = grossProfit - opex
  const zakat = netProfit * 0.1
  const sadaka = netProfit * 0.1
  const yourShare = netProfit - zakat - sadaka

  // product breakdown
  const productSales: Record<string, { name: string; qty: number; revenue: number; profit: number }> = {}
  salesRange.forEach(s => s.items.forEach(i => {
    if (!productSales[i.productId]) productSales[i.productId] = { name: i.productName, qty: 0, revenue: 0, profit: 0 }
    productSales[i.productId].qty += i.qty
    productSales[i.productId].revenue += i.price * i.qty
    productSales[i.productId].profit += (i.price - i.buyPrice) * i.qty
  }))

  return (
    <Layout title="Faida au Hasara (Profit & Loss)">
      <div className="flex gap-3 mb-5">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Kuanzia</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Hadi</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="border rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">Mchanganuo</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Mauzo:</span><span className="font-medium">{fmtTsh(revenue)}</span></div>
            <div className="flex justify-between"><span>Gharama ya Bidhaa (COGS):</span><span className="text-slate-600">−{fmtTsh(cogs)}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Faida Ghafi:</span><span>{fmtTsh(grossProfit)}</span></div>
            <div className="flex justify-between"><span>Gharama za Uendeshaji:</span><span className="text-red-600">−{fmtTsh(opex)}</span></div>
            <div className={`flex justify-between border-t pt-2 text-lg font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <span>Faida Halisi:</span><span>{fmtTsh(netProfit)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-white">
          <div className="text-xs text-emerald-700 uppercase tracking-wide mb-3">Mgawanyo wa Kiroho</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Zaka 10%:</span><span className="font-medium">{fmtTsh(zakat)}</span></div>
            <div className="flex justify-between"><span>Sadaka 10%:</span><span className="font-medium">{fmtTsh(sadaka)}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold text-emerald-700">
              <span>Jumla ya Bwana:</span><span>{fmtTsh(zakat + sadaka)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Inayobaki kwako:</span><span className="font-bold">{fmtTsh(yourShare)}</span>
            </div>
          </div>
          {netProfit < 0 && (
            <div className="mt-3 text-xs text-red-600 bg-red-50 rounded p-2 flex items-center gap-1">
              <TrendingDown size={12} /> Biashara inapata hasara kipindi hiki
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b font-semibold">Faida kwa Kila Bidhaa</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2">Bidhaa</th>
                <th className="text-right px-4 py-2">Idadi</th>
                <th className="text-right px-4 py-2">Mauzo</th>
                <th className="text-right px-4 py-2">Faida</th>
                <th className="text-right px-4 py-2">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(productSales).sort((a, b) => b[1].profit - a[1].profit).map(([id, p]) => (
                <tr key={id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="text-right px-4 py-2">{p.qty}</td>
                  <td className="text-right px-4 py-2">{fmtTsh(p.revenue)}</td>
                  <td className="text-right px-4 py-2 font-medium text-emerald-600">{fmtTsh(p.profit)}</td>
                  <td className="text-right px-4 py-2">{p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) + '%' : '—'}</td>
                </tr>
              ))}
              {Object.keys(productSales).length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Hakuna mauzo kipindi hiki</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  )
}