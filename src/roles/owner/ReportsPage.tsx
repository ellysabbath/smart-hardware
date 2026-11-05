import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { fmtTsh, today, daysBetween } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import { BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react'

export default function ReportsPage() {
  const { sales, customers, products, purchases } = useData()
  const [tab, setTab] = useState<'sales' | 'stock' | 'debts'>('sales')

  // Fast / slow moving
  const productMoves: Record<string, { name: string; qty30: number; revenue: number }> = {}
  products.forEach(p => { productMoves[p.id] = { name: p.name, qty30: 0, revenue: 0 } })
  sales.filter(s => daysBetween(s.createdAt.slice(0, 10), today()) <= 30)
    .forEach(s => s.items.forEach(i => {
      if (productMoves[i.productId]) {
        productMoves[i.productId].qty30 += i.qty
        productMoves[i.productId].revenue += i.price * i.qty
      }
    }))
  const sorted = Object.entries(productMoves).sort((a, b) => b[1].qty30 - a[1].qty30)
  const fast = sorted.slice(0, 5).filter(([, v]) => v.qty30 > 0)
  const slow = products.filter(p => productMoves[p.id]?.qty30 === 0 && p.stock > 0)

  // debts
  const debtors = customers.filter(c => c.balance > 0).sort((a, b) => b.balance - a.balance)

  return (
    <Layout title="Ripoti (Reports)">
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('sales')}
          className={`px-4 py-2 text-sm rounded-lg ${tab === 'sales' ? 'bg-brand-600 text-white' : 'bg-white border'}`}>
          <span className="flex items-center gap-2"><BarChart3 size={16} /> Mauzo</span>
        </button>
        <button onClick={() => setTab('stock')}
          className={`px-4 py-2 text-sm rounded-lg ${tab === 'stock' ? 'bg-brand-600 text-white' : 'bg-white border'}`}>
          <span className="flex items-center gap-2"><TrendingUp size={16} /> Stoo</span>
        </button>
        <button onClick={() => setTab('debts')}
          className={`px-4 py-2 text-sm rounded-lg ${tab === 'debts' ? 'bg-brand-600 text-white' : 'bg-white border'}`}>
          <span className="flex items-center gap-2"><Clock size={16} /> Madeni</span>
        </button>
      </div>

      {tab === 'sales' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <div className="px-4 py-3 border-b font-semibold">Mauzo ya Siku 30</div>
            <div className="p-4 space-y-1 text-sm">
              {Array.from({ length: 30 }).map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() - i)
                const dayStr = d.toISOString().slice(0, 10)
                const ds = sales.filter(s => s.createdAt.slice(0, 10) === dayStr)
                const tot = ds.reduce((s, x) => s + x.total, 0)
                if (tot === 0) return null
                return (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-600">{dayStr}</span>
                    <span className="font-medium">{fmtTsh(tot)}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="px-4 py-3 border-b font-semibold">Mauzo kwa Muuzaji</div>
            <div className="p-4 space-y-2 text-sm">
              {Object.entries(sales.reduce((acc, s) => {
                acc[s.createdBy] = (acc[s.createdBy] || 0) + s.total
                return acc
              }, {} as Record<string, number>)).map(([user, total]) => (
                <div key={user} className="flex justify-between">
                  <span>{user}</span>
                  <span className="font-medium">{fmtTsh(total)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'stock' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <div className="px-4 py-3 border-b font-semibold flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={16} /> Fast Moving (Siku 30)
            </div>
            <div className="divide-y">
              {fast.map(([id, v]) => (
                <div key={id} className="px-4 py-2.5 flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.qty30} zimeuzwa</div>
                  </div>
                  <div className="font-semibold text-emerald-600">{fmtTsh(v.revenue)}</div>
                </div>
              ))}
              {fast.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">Hakuna data</div>}
            </div>
          </Card>

          <Card>
            <div className="px-4 py-3 border-b font-semibold flex items-center gap-2">
              <Clock className="text-amber-600" size={16} /> Slow Moving (Hakuna mauzo, siku 30)
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {slow.map(p => (
                <div key={p.id} className="px-4 py-2.5 flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">Stoo: {p.stock} {p.unit}</div>
                  </div>
                  <Badge color="amber">Imelala</Badge>
                </div>
              ))}
              {slow.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">Hakuna bidhaa iliyolala</div>}
            </div>
          </Card>
        </div>
      )}

      {tab === 'debts' && (
        <Card>
          <div className="px-4 py-3 border-b font-semibold flex items-center gap-2">
            <AlertCircle className="text-red-600" size={16} /> Orodha ya Wadeni
          </div>
          <div className="divide-y">
            {debtors.map(c => (
              <div key={c.id} className="px-4 py-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.phone} · {c.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{fmtTsh(c.balance)}</div>
                  <Badge color={c.balance > 1000000 ? 'red' : 'amber'}>
                    {c.balance > 1000000 ? 'Sugu' : 'Kawaida'}
                  </Badge>
                </div>
              </div>
            ))}
            {debtors.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">Hakuna madeni</div>}
          </div>
        </Card>
      )}
    </Layout>
  )
}