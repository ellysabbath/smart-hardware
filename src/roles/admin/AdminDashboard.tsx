import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { Card, StatCard } from '../../components/ui/Card'
import { fmtTsh, today, daysBetween } from '../../lib/utils'
import { Receipt, TrendingUp, Users, AlertTriangle, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { products, sales, customers, expenses, purchases, audit, branches } = useData()
  const [selectedBranch, setSelectedBranch] = useState<string>('all')

  const viewSales = selectedBranch === 'all' ? sales : sales.filter(s => s.branchId === selectedBranch)
  const viewExpenses = selectedBranch === 'all' ? expenses : expenses.filter(e => e.branchId === selectedBranch)
  const viewProducts = selectedBranch === 'all' ? products : products.filter(p => p.branchId === selectedBranch)

  const todaySales = viewSales.filter(s => s.createdAt.slice(0, 10) === today())
  const todayTotal = todaySales.reduce((s, x) => s + x.total, 0)
  const todayProfit = todaySales.reduce((s, x) => {
    const cogs = x.items.reduce((y, i) => y + i.buyPrice * i.qty, 0)
    return s + (x.total - cogs)
  }, 0)
  const totalDebts = customers.reduce((s, c) => s + c.balance, 0)
  const lowStock = viewProducts.filter(p => p.stock <= p.reorderLevel).length
  const expiring = viewProducts.filter(p => p.expiryDate && daysBetween(today(), p.expiryDate) <= 30).length
  const pendingExpenses = viewExpenses.filter(e => e.status === 'pending').length
  const pendingPO = purchases.filter(p => p.status === 'pending').length

  return (
    <Layout title="Dashboard - Admin">
      <div className="mb-5 flex justify-end">
        <select 
          value={selectedBranch} 
          onChange={e => setSelectedBranch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Maduka Yote</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Mauzo ya Leo" value={fmtTsh(todayTotal)} sub={`${todaySales.length} risiti`} icon={<Receipt />} />
        <StatCard label="Faida Ghafi (Leo)" value={fmtTsh(todayProfit)} icon={<TrendingUp />} color="green" />
        <StatCard label="Madeni ya Wateja" value={fmtTsh(totalDebts)} icon={<Users />} color="red" />
        <StatCard label="Bidhaa Chini ya Kiwango" value={String(lowStock)} icon={<AlertTriangle />} color="amber" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Zinaisha (Expiry)</div>
          <div className="text-2xl font-bold text-red-600 mb-2">{expiring}</div>
          <Link to="/products" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Angalia bidhaa <ArrowRight size={12} /></Link>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">Gharama Zinasubiri Idhini</div>
          <div className="text-2xl font-bold text-amber-600 mb-2">{pendingExpenses}</div>
          <Link to="/expenses" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Pitia gharama <ArrowRight size={12} /></Link>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 mb-1">LPO Zinasubiri Kupokelewa</div>
          <div className="text-2xl font-bold text-blue-600 mb-2">{pendingPO}</div>
          <Link to="/grn" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Pokea mizigo <ArrowRight size={12} /></Link>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <div className="font-semibold">Mauzo ya Karibuni</div>
            <Link to="/sales" className="text-xs text-brand-600 hover:underline">Ona zote</Link>
          </div>
          <div className="divide-y">
            {viewSales.slice(0, 6).map(s => {
              const branchName = branches.find(b => b.id === s.branchId)?.name || 'Duka'
              return (
                <div key={s.id} className="px-4 py-2.5 flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{s.customerName}</div>
                    <div className="text-xs text-slate-500">{s.receiptNo} · {branchName}</div>
                  </div>
                  <div className="font-semibold text-emerald-600">{fmtTsh(s.total)}</div>
                </div>
              )
            })}
            {viewSales.length === 0 && <div className="px-4 py-8 text-center text-slate-500 text-sm">Hakuna mauzo bado</div>}
          </div>
        </Card>

        <Card>
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <div className="font-semibold">Shughuli za Karibuni (Audit)</div>
            <Link to="/audit" className="text-xs text-brand-600 hover:underline">Ona zote</Link>
          </div>
          <div className="divide-y max-h-80 overflow-y-auto scrollbar-thin">
            {audit.slice(0, 8).map(a => (
              <div key={a.id} className="px-4 py-2 text-xs">
                <div className="flex justify-between"><span className="font-medium text-slate-700">{a.userName}</span><span className="text-slate-400">{a.timestamp.slice(11, 16)}</span></div>
                <div className="text-slate-600">{a.action}: {a.details}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  )
}